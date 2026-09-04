import { StatusCodes } from "http-status-codes";
import type Stripe from "stripe";

import type { Prisma } from "../../../generated/prisma/client";
import type { UserRole } from "../../../generated/prisma/enums";
import type { PaymentWhereInput } from "../../../generated/prisma/models/Payment";

import config from "../../config";
import { prisma } from "../../../lib/prisma";
import { getStripe } from "../../../lib/stripe";
import AppError from "../../errors/appError";
import { QueryBuilder } from "../../queryBuilder";

import { PAYMENT_SELECT, PLAN_PRICING } from "./payment.const";
import type { CreateCheckoutInput } from "./payment.interface";

const paymentQueryBuilder = new QueryBuilder<
	Prisma.PaymentGetPayload<{ select: typeof PAYMENT_SELECT }>,
	PaymentWhereInput
>(prisma.payment, {
	searchableFields: [],
	filterableFields: {
		status: {
			type: "enum",
			enum: { PENDING: "PENDING", PROCESSING: "PROCESSING", PAID: "PAID", FAILED: "FAILED", CANCELLED: "CANCELLED", REFUNDED: "REFUNDED" },
		},
		provider: { type: "enum", enum: { STRIPE: "STRIPE", BKASH: "BKASH", SSLCOMMERZ: "SSLCOMMERZ" } },
		createdAt: "date",
	},
	sortableFields: ["createdAt", "amountMinor"],
	selectableFields: Object.keys(PAYMENT_SELECT),
	defaultSortField: "createdAt",
});

/**
 * Creates a `Payment` row (status PENDING) and a matching Stripe Checkout
 * Session in the same call. `paymentId`/`companyId`/`plan` are stashed in
 * the session's metadata so the webhook handler — which only ever sees
 * the Stripe event, never the original request — knows what to update.
 */
const createCheckoutSession = async (userId: string, companyId: string, payload: CreateCheckoutInput) => {
	const pricing = PLAN_PRICING[payload.plan];
	const stripe = getStripe();
	const clientUrl = config.app.clientUrl.split(",")[0]?.trim() ?? "http://localhost:3000";

	const payment = await prisma.payment.create({
		data: {
			userId,
			companyId,
			provider: "STRIPE",
			status: "PENDING",
			amountMinor: pricing.amountMinor,
			currency: pricing.currency.toUpperCase(),
			metadata: { plan: payload.plan },
		},
	});

	const session = await stripe.checkout.sessions.create({
		mode: "payment",
		payment_method_types: ["card"],
		line_items: [
			{
				price_data: {
					currency: pricing.currency,
					product_data: { name: `${payload.plan} plan subscription` },
					unit_amount: pricing.amountMinor,
				},
				quantity: 1,
			},
		],
		success_url: `${clientUrl}/billing/success?paymentId=${payment.id}`,
		cancel_url: `${clientUrl}/billing/cancel?paymentId=${payment.id}`,
		metadata: { paymentId: payment.id, companyId, plan: payload.plan },
	});

	await prisma.payment.update({
		where: { id: payment.id },
		data: { providerPaymentId: session.id },
	});

	return { paymentId: payment.id, checkoutUrl: session.url };
};

/**
 * Verifies the Stripe signature, then processes the event idempotently —
 * `PaymentWebhookEvent` is keyed on (provider, eventId), so a duplicate
 * delivery (Stripe retries on anything but a fast 2xx) is a no-op instead
 * of double-crediting a subscription.
 */
const handleStripeWebhook = async (rawBody: Buffer, signature: string | undefined) => {
	const stripe = getStripe();

	if (!config.stripe.webhookSecret) {
		throw new AppError(StatusCodes.SERVICE_UNAVAILABLE, "Stripe webhook secret is not configured.");
	}

	if (!signature) {
		throw new AppError(StatusCodes.BAD_REQUEST, "Missing Stripe signature header.");
	}

	let event: Stripe.Event;
	try {
		event = stripe.webhooks.constructEvent(rawBody, signature, config.stripe.webhookSecret);
	} catch {
		throw new AppError(StatusCodes.BAD_REQUEST, "Invalid Stripe webhook signature.");
	}

	const existingEvent = await prisma.paymentWebhookEvent.findUnique({
		where: { provider_eventId: { provider: "STRIPE", eventId: event.id } },
	});

	if (existingEvent?.processed) {
		return { received: true, alreadyProcessed: true };
	}

	await prisma.paymentWebhookEvent.upsert({
		where: { provider_eventId: { provider: "STRIPE", eventId: event.id } },
		update: {},
		create: {
			provider: "STRIPE",
			eventId: event.id,
			eventType: event.type,
			payload: JSON.parse(JSON.stringify(event)) as Prisma.InputJsonValue,
		},
	});

	if (event.type === "checkout.session.completed") {
		const session = event.data.object as Stripe.Checkout.Session;
		const paymentId = session.metadata?.paymentId;
		const plan = session.metadata?.plan as "PRO" | "ENTERPRISE" | undefined;
		const companyId = session.metadata?.companyId;

		if (paymentId) {
			await prisma.$transaction(async (tx) => {
				const payment = await tx.payment.update({
					where: { id: paymentId },
					data: {
						status: "PAID",
						paidAt: new Date(),
						transactionId:
							typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id,
					},
				});

				if (companyId && plan) {
					const periodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

					const subscription = await tx.subscription.upsert({
						where: { companyId },
						update: { plan, status: "ACTIVE", currentPeriodStart: new Date(), currentPeriodEnd: periodEnd, cancelAtPeriodEnd: false },
						create: { companyId, plan, status: "ACTIVE", currentPeriodStart: new Date(), currentPeriodEnd: periodEnd },
					});

					await tx.payment.update({ where: { id: paymentId }, data: { subscriptionId: subscription.id } });
				}

				await tx.notification.create({
					data: {
						userId: payment.userId,
						title: "Payment Successful",
						message: `Your payment of ${(payment.amountMinor / 100).toFixed(2)} ${payment.currency} was successful.`,
						type: "PAYMENT_SUCCESS",
					},
				});
			});
		}
	} else if (event.type === "checkout.session.expired" || event.type === "payment_intent.payment_failed") {
		const session = event.data.object as { metadata?: { paymentId?: string } };
		const paymentId = session.metadata?.paymentId;

		if (paymentId) {
			const payment = await prisma.payment.update({
				where: { id: paymentId },
				data: { status: "FAILED", failedAt: new Date() },
			});

			await prisma.notification.create({
				data: {
					userId: payment.userId,
					title: "Payment Failed",
					message: "Your payment could not be completed. Please try again.",
					type: "PAYMENT_FAILED",
				},
			});
		}
	}

	await prisma.paymentWebhookEvent.update({
		where: { provider_eventId: { provider: "STRIPE", eventId: event.id } },
		data: { processed: true, processedAt: new Date() },
	});

	return { received: true };
};

const getMyPayments = async (userId: string, query: Record<string, unknown>) => {
	return paymentQueryBuilder.execute(query, { userId });
};

const getAllPayments = async (query: Record<string, unknown>) => {
	return paymentQueryBuilder.execute(query);
};

const getPaymentById = async (id: string, requester: { id: string; role: UserRole }) => {
	const payment = await prisma.payment.findUnique({ where: { id }, select: PAYMENT_SELECT });

	if (!payment) {
		throw new AppError(StatusCodes.NOT_FOUND, "Payment not found.");
	}

	if (requester.role !== "ADMIN" && payment.userId !== requester.id) {
		throw new AppError(StatusCodes.FORBIDDEN, "You don't have permission to view this payment.");
	}

	return payment;
};

export const paymentService = {
	createCheckoutSession,
	handleStripeWebhook,
	getMyPayments,
	getAllPayments,
	getPaymentById,
};