/**
 * Pure helper for applying multi-tenant companyId query filtering.
 */

export function withTenantScope<T extends Record<string, unknown>>(
	where: T | undefined,
	companyId: string | undefined,
): T | undefined {
	// ADMIN bypass — intentional, documented.
	if (companyId === undefined) {
		return where;
	}

	if (where && "companyId" in where && where.companyId !== undefined) {
		throw new Error(
			"withTenantScope: where clause already contains companyId. Potential double-scoping bug.",
		);
	}

	if (!where) {
		return { companyId } as unknown as T;
	}

	return { ...where, companyId } as T;
}

/**
 * Relation helper for models scoped via assessment relation (e.g., AssessmentAttempt, Result).
 */
export function withTenantScopeViaAssessment<T extends Record<string, unknown>>(
	where: T | undefined,
	companyId: string | undefined,
): T | undefined {
	// ADMIN bypass — intentional, documented.
	if (companyId === undefined) {
		return where;
	}

	const existingAssessment = (where as Record<string, unknown> | undefined)
		?.assessment as Record<string, unknown> | undefined;

	return {
		...where,
		assessment: withTenantScope(existingAssessment, companyId),
	} as unknown as T;
}

/**
 * Relation helper for models scoped via submission -> attempt -> assessment relation.
 */
export function withTenantScopeViaSubmission<T extends Record<string, unknown>>(
	where: T | undefined,
	companyId: string | undefined,
): T | undefined {
	// ADMIN bypass — intentional, documented.
	if (companyId === undefined) {
		return where;
	}

	const existingSubmission = (where as Record<string, unknown> | undefined)
		?.submission as Record<string, unknown> | undefined;

	return {
		...where,
		submission: withTenantScopeViaAssessment(existingSubmission, companyId),
	} as unknown as T;
}
