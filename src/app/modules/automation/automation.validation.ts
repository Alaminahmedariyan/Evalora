import { z } from "zod";

const aiResultSchema = z.object({
	aiScore: z.coerce.number().int().min(0, "Score cannot be negative."),
	aiFeedback: z.string().trim().min(1).max(2000),
	aiModel: z.string().trim().min(1).max(100),
});

export const automationValidation = {
	aiResultSchema,
};