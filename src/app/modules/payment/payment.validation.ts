import { z } from "zod";

const createCheckoutSchema = z.object({
	plan: z.enum(["PRO", "ENTERPRISE"], { message: "Plan must be PRO or ENTERPRISE." }),
});

export const paymentValidation = {
	createCheckoutSchema,
};