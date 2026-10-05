import { z } from "zod";

import { phoneSchema } from "../user/user.validation";

// A blank value from the form means "clear this field".
const blankToNull = (value: unknown) =>
	typeof value === "string" && value.trim() === "" ? null : value;

const isHttpUrl = (value: string) => {
	try {
		const url = new URL(value);
		return url.protocol === "http:" || url.protocol === "https:";
	} catch {
		return false;
	}
};

// Only http(s) links: a "javascript:" URL is a valid URL to z.string().url(),
// but it must never end up in an href that a recruiter clicks.
const urlField = (label: string) =>
	z.preprocess(
		blankToNull,
		z
			.string()
			.trim()
			.max(2048, `${label} URL is too long.`)
			.refine(
				isHttpUrl,
				`Enter a valid ${label} URL starting with https://, e.g. https://example.com/you.`,
			)
			.nullable()
			.optional(),
	);

// The form sends skills as a JSON array string, so an empty list is
// distinguishable from "not sent". A plain string (one skill) and a repeated
// field (already an array) are still accepted.
const parseSkills = (value: unknown) => {
	if (value === undefined || Array.isArray(value)) return value;

	if (typeof value === "string") {
		try {
			const parsed: unknown = JSON.parse(value);
			if (Array.isArray(parsed)) return parsed;
		} catch {
			// not JSON: treat it as a single skill below
		}
		return [value];
	}

	return value;
};

const upsertProfileSchema = z.object({
	headline: z.preprocess(
		blankToNull,
		z
			.string()
			.trim()
			.min(2, "Headline must be at least 2 characters.")
			.max(150, "Headline must be at most 150 characters.")
			.nullable()
			.optional(),
	),
	bio: z.preprocess(
		blankToNull,
		z
			.string()
			.trim()
			.max(2000, "Bio must be at most 2000 characters.")
			.nullable()
			.optional(),
	),
	phone: z.preprocess(
		blankToNull,
		z.union([z.null(), phoneSchema]).optional(),
	),
	location: z.preprocess(
		blankToNull,
		z
			.string()
			.trim()
			.max(150, "Location must be at most 150 characters.")
			.nullable()
			.optional(),
	),
	linkedinUrl: urlField("LinkedIn"),
	githubUrl: urlField("GitHub"),
	portfolioUrl: urlField("portfolio"),
	skills: z.preprocess(
		parseSkills,
		z
			.array(
				z
					.string()
					.trim()
					.min(1)
					.max(40, "Each skill must be at most 40 characters."),
			)
			.max(30, "You can list at most 30 skills.")
			.optional(),
	),
	experienceYears: z.preprocess(
		blankToNull,
		z.coerce
			.number()
			.int("Experience years must be a whole number.")
			.min(0, "Experience years cannot be negative.")
			.max(60, "Enter a realistic number of years.")
			.nullable()
			.optional(),
	),
	// Multipart values are strings, and z.coerce.boolean() would turn the
	// string "false" into true, so the two literal strings are mapped by hand.
	isVisibleToRecruiters: z
		.union([
			z.boolean(),
			z.enum(["true", "false"]).transform((value) => value === "true"),
		])
		.optional(),
});

export const candidateValidation = {
	upsertProfileSchema,
};