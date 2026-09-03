import { z } from "zod";

const registerCompanySchema = z.object({
	name: z
		.string()
		.trim()
		.min(2, "Company name must be at least 2 characters.")
		.max(150, "Company name must be at most 150 characters."),
	description: z
		.string()
		.trim()
		.max(2000, "Description must be at most 2000 characters.")
		.optional(),
	website: z
		.string()
		.trim()
		.url("Enter a valid website URL, e.g. https://example.com.")
		.optional(),
	industry: z
		.string()
		.trim()
		.max(100, "Industry must be at most 100 characters.")
		.optional(),
});

/**
 * `name` (and therefore `slug`) is intentionally not editable here — the
 * slug is used in Assessment/Problem uniqueness scoping and in public
 * URLs, so letting it drift silently on every rename would be confusing.
 * A dedicated "rename company" flow (that explicitly regenerates the slug)
 * can be added later if this is ever needed.
 */
const updateCompanySchema = z.object({
	description: z
		.string()
		.trim()
		.max(2000, "Description must be at most 2000 characters.")
		.optional(),
	website: z
		.string()
		.trim()
		.url("Enter a valid website URL, e.g. https://example.com.")
		.optional(),
	industry: z
		.string()
		.trim()
		.max(100, "Industry must be at most 100 characters.")
		.optional(),
});

export const companyValidation = {
	registerCompanySchema,
	updateCompanySchema,
};