import type { SubscriptionPlan } from "../../../generated/prisma/enums";

export type CreateCheckoutInput = {
  plan: SubscriptionPlan;
};