
/**
 * Pure helper for applying multi-tenant companyId query filtering.
 */
export function withTenantScope<T extends Record<string, unknown>>(
    where: T | undefined,
    companyId: string | undefined,
): T & { companyId?: string } {
    const baseWhere = (where ?? {}) as T;

    // ADMIN bypass — intentional, documented.
    if (companyId === undefined) {
        return baseWhere;
    }

    if ("companyId" in baseWhere && baseWhere.companyId !== undefined) {
        throw new Error(
            "withTenantScope: where clause already contains companyId. Potential double-scoping bug.",
        );
    }

    return { ...baseWhere, companyId };
}

/**
 * Relation helper for models scoped via assessment relation (e.g., AssessmentAttempt, Result).
 */
export function withTenantScopeViaAssessment<T extends Record<string, unknown>>(
    where: T | undefined,
    companyId: string | undefined,
): T & { assessment?: Record<string, unknown> } {
    const baseWhere = (where ?? {}) as T;

    // ADMIN bypass — intentional, documented.
    if (companyId === undefined) {
        return baseWhere;
    }

    const existingAssessment = baseWhere.assessment as Record<string, unknown> | undefined;

    return {
        ...baseWhere,
        assessment: withTenantScope(existingAssessment, companyId),
    };
}

/**
 * Relation helper for models scoped via submission -> attempt -> assessment relation.
 */
export function withTenantScopeViaSubmission<T extends Record<string, unknown>>(
    where: T | undefined,
    companyId: string | undefined,
): T & { submission?: Record<string, unknown> } {
    const baseWhere = (where ?? {}) as T;

    // ADMIN bypass — intentional, documented.
    if (companyId === undefined) {
        return baseWhere;
    }

    const existingSubmission = baseWhere.submission as Record<string, unknown> | undefined;

    return {
        ...baseWhere,
        submission: withTenantScopeViaAssessment(existingSubmission, companyId),
    };
}