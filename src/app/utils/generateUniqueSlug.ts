/**
 * Turns "Brainstation Labs!!" into "brainstation-labs".
 */
export const slugify = (input: string): string =>
	input
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "")
		.slice(0, 80) || "item";

/**
 * Generates a unique slug by appending -2, -3, ... until `isTaken` returns
 * false. Generic over the "is this slug already taken" check so it works
 * for globally-unique slugs (Company) and scoped-unique slugs
 * (Problem: companyId+slug, Assessment: companyId+slug+version) alike —
 * the caller decides what "taken" means.
 *
 * Usage:
 *   const slug = await generateUniqueSlug(name, (candidate) =>
 *     prisma.company.findUnique({ where: { slug: candidate } }).then(Boolean),
 *   );
 */
export const generateUniqueSlug = async (
	source: string,
	isTaken: (candidate: string) => Promise<boolean>,
): Promise<string> => {
	const base = slugify(source);
	let candidate = base;
	let suffix = 2;

	// Bounded loop — a real collision chain this long would indicate a bug
	// elsewhere, not a legitimate naming coincidence.
	while (await isTaken(candidate)) {
		candidate = `${base}-${suffix}`;
		suffix += 1;

		if (suffix > 1000) {
			throw new Error(`Could not generate a unique slug for "${source}" after 1000 attempts.`);
		}
	}

	return candidate;
};