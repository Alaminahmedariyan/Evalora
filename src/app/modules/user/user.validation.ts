import { z } from "zod";

/**
 * Loose E.164-style international phone validation: optional leading "+",
 * 8–15 digits total, first digit non-zero. Exported so other modules
 * (e.g. auth registration, candidate/company profiles) can reuse the same
 * rule instead of re-inventing a regex.
 *
 * If you want to restrict this to Bangladeshi numbers only, swap the
 * pattern for: /^(?:\+?880|0)1[3-9]\d{8}$/
 */
export const phoneSchema = z
	.string()
	.trim()
	.regex(
		/^\+?[1-9]\d{7,14}$/,
		"Enter a valid phone number (8–15 digits, digits only, optionally starting with +).",
	)
	.optional();

const updateProfileSchema = z.object({
	name: z
		.string()
		.trim()
		.min(2, "Name must be at least 2 characters.")
		.max(100, "Name must be at most 100 characters.")
		.optional(),
	phone: phoneSchema,
});

const updateRoleSchema = z.object({
	role: z.enum(["ADMIN", "RECRUITER", "CANDIDATE"], {
		message: "Role must be one of ADMIN, RECRUITER, or CANDIDATE.",
	}),
});

const updateStatusSchema = z.object({
	status: z.enum(["ACTIVE", "SUSPENDED", "PENDING"], {
		message: "Status must be one of ACTIVE, SUSPENDED, or PENDING.",
	}),
});

export const userValidation = {
	updateProfileSchema,
	updateRoleSchema,
	updateStatusSchema,
};