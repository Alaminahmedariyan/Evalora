import { z } from "zod";

const deleteAccountSchema = z.object({
	confirmEmail: z
		.string()
		.trim()
		.min(1, "Type your email address to confirm.")
		.max(320),
});

export const accountValidation = { deleteAccountSchema };