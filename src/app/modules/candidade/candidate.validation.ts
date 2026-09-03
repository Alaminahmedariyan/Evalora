import { z } from "zod";

import { phoneSchema } from "../user/user.validation";

const urlField = (label: string) =>
	z.string().trim().url(`Enter a valid ${label} URL, e.g. https://example.com/you.`).optional();

const upsertProfileSchema = z.object({
	headline: z
		.string()
		.trim()
		.min(2, "Headline must be at least 2 characters.")
		.max(150, "Headline must be at most 150 characters.")
		.optional(),
	bio: z.string().trim().max(2000, "Bio must be at most 2000 characters.").optional(),
	phone: phoneSchema,
	location: z.string().trim().max(150, "Location must be at most 150 characters.").optional(),
	linkedinUrl: urlField("LinkedIn"),
	githubUrl: urlField("GitHub"),
	portfolioUrl: urlField("portfolio"),
	skills: z
		.array(z.string().trim().min(1).max(40, "Each skill must be at most 40 characters."))
		.max(30, "You can list at most 30 skills.")
		.optional(),
	experienceYears: z.coerce
		.number()
		.int("Experience years must be a whole number.")
		.min(0, "Experience years cannot be negative.")
		.max(60, "Enter a realistic number of years.")
		.optional(),
});

export const candidateValidation = {
	upsertProfileSchema,
};