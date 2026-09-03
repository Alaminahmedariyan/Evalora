/**
 * Full detail shown to the owning recruiter, an Admin, or on a single
 * company's public detail page.
 */
export const COMPANY_DETAIL_SELECT = {
	id: true,
	name: true,
	slug: true,
	description: true,
	website: true,
	industry: true,
	logo: true,
	isVerified: true,
	ownerId: true,
	createdAt: true,
	updatedAt: true,
} as const;

/**
 * Trimmed shape for public list views (search/browse) — deliberately omits
 * ownerId so a candidate browsing companies can't enumerate user ids.
 */
export const COMPANY_LIST_SELECT = {
	id: true,
	name: true,
	slug: true,
	description: true,
	website: true,
	industry: true,
	logo: true,
	isVerified: true,
	createdAt: true,
} as const;