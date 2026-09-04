import { StatusCodes } from "http-status-codes";
import type Stripe from "stripe";

import config from "../../config";
import AppError from "../../errors/appError";
import { getStripe } from "../../../lib/stripe";

type CreateCheckoutSessionInput = {
	amount: number;
	currency: string;
	productName: string;
	successUrl: string;
	cancelUrl: string;
	metadata?: Record<string, string>;
};

export const createStripeCheckoutSession = async (
	input: CreateCheckoutSessionInput,
) => {
	let stripe: Stripe;

	try {
		stripe = getStripe();
	} catch {
		throw new AppError(
			StatusCodes.SERVICE_UNAVAILABLE,
			"Stripe is not configured.",
		);
	}

	const checkoutSessionData: Stripe.Checkout.SessionCreateParams = {
		mode: "payment",

		payment_method_types: ["card"],

		line_items: [
			{
				price_data: {
					currency: input.currency,
					product_data: {
						name: input.productName,
					},
					unit_amount: input.amount,
				},
				quantity: 1,
			},
		],

		success_url: input.successUrl,
		cancel_url: input.cancelUrl,

		...(input.metadata !== undefined
			? {
					metadata: input.metadata,
				}
			: {}),
	};

	return stripe.checkout.sessions.create(checkoutSessionData);
};

export const constructStripeWebhookEvent = (
	rawBody: Buffer,
	signature: string,
): Stripe.Event => {
	if (!config.stripe.webhookSecret) {
		throw new AppError(
			StatusCodes.SERVICE_UNAVAILABLE,
			"Stripe webhook secret is not configured.",
		);
	}

	const stripe = getStripe();

	return stripe.webhooks.constructEvent(
		rawBody,
		signature,
		config.stripe.webhookSecret,
	);
};