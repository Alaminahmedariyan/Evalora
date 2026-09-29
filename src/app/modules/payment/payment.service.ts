import { StatusCodes } from "http-status-codes";
import type Stripe from "stripe";

import type { Prisma } from "../../../generated/prisma/client";
import type { SubscriptionPlan, UserRole } from "../../../generated/prisma/enums";
import type { PaymentWhereInput } from "../../../generated/prisma/models/Payment";

import { prisma } from "../../../lib/prisma";
import { getStripe } from "../../../lib/stripe";
import config from "../../config";
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
      enum: {
        PENDING: "PENDING",
        PROCESSING: "PROCESSING",
        PAID: "PAID",
        FAILED: "FAILED",
        CANCELLED: "CANCELLED",
        REFUNDED: "REFUNDED",
      },
    },
    provider: {
      type: "enum",
      enum: {
        STRIPE: "STRIPE",
        BKASH: "BKASH",
        SSLCOMMERZ: "SSLCOMMERZ",
      },
    },
    createdAt: "date",
  },
  sortableFields: ["createdAt", "amountMinor"],
  selectableFields: Object.keys(PAYMENT_SELECT),
  defaultSelect: PAYMENT_SELECT,
  defaultSortField: "createdAt",
});

const PLAN_RANK: Record<SubscriptionPlan, number> = {
  FREE: 0,
  PRO: 1,
  ENTERPRISE: 2,
};

const createCheckoutSession = async (
  userId: string,
  companyId: string,
  payload: CreateCheckoutInput,
) => {
  const pricing = PLAN_PRICING[payload.plan];

  if (!pricing) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      `Invalid subscription plan: ${payload.plan}`,
    );
  }

  const stripe = getStripe();

  const clientUrl =
    config.app.clientUrl.split(",")[0]?.trim() ||
    "http://localhost:3000";

  const existingSubscription = await prisma.subscription.findUnique({
    where: { companyId },
  });

  const stillActive =
    existingSubscription?.status === "ACTIVE" &&
    (!existingSubscription.currentPeriodEnd ||
      existingSubscription.currentPeriodEnd > new Date());

  if (
    existingSubscription &&
    stillActive &&
    PLAN_RANK[existingSubscription.plan] >= PLAN_RANK[payload.plan]
  ) {
    throw new AppError(
      StatusCodes.CONFLICT,
      `Your company is already on the ${existingSubscription.plan} plan.`,
    );
  }

  if (payload.plan === "FREE") {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "The FREE plan does not require checkout.",
    );
  }

  const payment = await prisma.payment.create({
    data: {
      userId,
      companyId,
      provider: "STRIPE",
      status: "PENDING",
      amountMinor: pricing.amountMinor,
      currency: pricing.currency.toUpperCase(),
      metadata: {
        plan: payload.plan,
      },
    },
  });

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: pricing.currency,
            product_data: {
              name: `${payload.plan} plan subscription`,
            },
            unit_amount: pricing.amountMinor,
          },
          quantity: 1,
        },
      ],
      success_url: `${clientUrl}/billing/success?paymentId=${payment.id}`,
      cancel_url: `${clientUrl}/billing/cancel?paymentId=${payment.id}`,
      metadata: {
        paymentId: payment.id,
        companyId,
        plan: payload.plan,
      },
      payment_intent_data: {
        metadata: {
          paymentId: payment.id,
          companyId,
          plan: payload.plan,
        },
      },
    });

    if (!session.url) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "FAILED",
          failedAt: new Date(),
        },
      });

      throw new AppError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Stripe checkout URL was not generated.",
      );
    }

    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        providerPaymentId: session.id,
      },
    });

    return {
      paymentId: payment.id,
      checkoutUrl: session.url,
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: "FAILED",
        failedAt: new Date(),
      },
    });

    throw new AppError(
      StatusCodes.BAD_GATEWAY,
      "Unable to create Stripe checkout session.",
    );
  }
};

const handleStripeWebhook = async (
  rawBody: Buffer,
  signature: string | undefined,
) => {
  const stripe = getStripe();

  if (!config.stripe.webhookSecret) {
    throw new AppError(
      StatusCodes.SERVICE_UNAVAILABLE,
      "Stripe webhook secret is not configured.",
    );
  }

  if (!signature) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Missing Stripe signature header.",
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      config.stripe.webhookSecret,
    );
  } catch {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Invalid Stripe webhook signature.",
    );
  }

  const existingEvent = await prisma.paymentWebhookEvent.findUnique({
    where: {
      provider_eventId: {
        provider: "STRIPE",
        eventId: event.id,
      },
    },
  });

  if (existingEvent?.processed) {
    return {
      received: true,
      alreadyProcessed: true,
    };
  }

  await prisma.paymentWebhookEvent.upsert({
    where: {
      provider_eventId: {
        provider: "STRIPE",
        eventId: event.id,
      },
    },
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
    const companyId = session.metadata?.companyId;
    const plan = session.metadata?.plan as SubscriptionPlan | undefined;

    if (paymentId) {
      await prisma.$transaction(async (tx) => {
        const paymentIntent = session.payment_intent;

        const transactionId =
          typeof paymentIntent === "string"
            ? paymentIntent
            : paymentIntent?.id;

        const payment = await tx.payment.update({
          where: {
            id: paymentId,
          },
          data: {
            status: "PAID",
            paidAt: new Date(),
            ...(transactionId ? { transactionId } : {}),
          },
        });

        if (companyId && plan) {
          const currentPeriodStart = new Date();

          const currentPeriodEnd = new Date(
            currentPeriodStart.getTime() +
              30 * 24 * 60 * 60 * 1000,
          );

          const subscription = await tx.subscription.upsert({
            where: {
              companyId,
            },
            update: {
              plan,
              status: "ACTIVE",
              currentPeriodStart,
              currentPeriodEnd,
              cancelAtPeriodEnd: false,
            },
            create: {
              companyId,
              plan,
              status: "ACTIVE",
              currentPeriodStart,
              currentPeriodEnd,
              cancelAtPeriodEnd: false,
            },
          });

          await tx.payment.update({
            where: {
              id: paymentId,
            },
            data: {
              subscriptionId: subscription.id,
            },
          });
        }

        await tx.notification.create({
          data: {
            userId: payment.userId,
            title: "Payment Successful",
            message: `Your payment of ${(Number(payment.amountMinor) / 100).toFixed(2)} ${payment.currency} was successful.`,
            type: "PAYMENT_SUCCESS",
          },
        });
      });
    }
  } else if (
    event.type === "checkout.session.expired" ||
    event.type === "payment_intent.payment_failed"
  ) {
    const object = event.data.object as {
      metadata?: {
        paymentId?: string;
      };
    };

    const paymentId = object.metadata?.paymentId;

    if (paymentId) {
      const payment = await prisma.payment.update({
        where: {
          id: paymentId,
        },
        data: {
          status: "FAILED",
          failedAt: new Date(),
        },
      });

      await prisma.notification.create({
        data: {
          userId: payment.userId,
          title: "Payment Failed",
          message:
            "Your payment could not be completed. Please try again.",
          type: "PAYMENT_FAILED",
        },
      });
    }
  }

  await prisma.paymentWebhookEvent.update({
    where: {
      provider_eventId: {
        provider: "STRIPE",
        eventId: event.id,
      },
    },
    data: {
      processed: true,
      processedAt: new Date(),
    },
  });

  return {
    received: true,
  };
};

const getMyPayments = async (
  userId: string,
  query: Record<string, unknown>,
) => {
  return paymentQueryBuilder.execute(query, {
    userId,
  });
};

const getAllPayments = async (query: Record<string, unknown>) => {
  return paymentQueryBuilder.execute(query);
};

const getPaymentById = async (
  id: string,
  requester: {
    id: string;
    role: UserRole;
  },
) => {
  const payment = await prisma.payment.findUnique({
    where: {
      id,
    },
    select: PAYMENT_SELECT,
  });

  if (!payment) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      "Payment not found.",
    );
  }

  if (
    requester.role !== "ADMIN" &&
    payment.userId !== requester.id
  ) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "You don't have permission to view this payment.",
    );
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