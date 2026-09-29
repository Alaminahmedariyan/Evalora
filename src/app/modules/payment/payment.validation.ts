import { z } from "zod";
import { SubscriptionPlan } from "../../../generated/prisma/enums";

const createCheckoutSchema = z.object({
  plan: z.nativeEnum(SubscriptionPlan, {
    message: "Plan must be FREE, PRO, or ENTERPRISE.",
  }),
});

export const paymentValidation = {
  createCheckoutSchema,
};