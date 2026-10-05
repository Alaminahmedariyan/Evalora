import { StatusCodes } from "http-status-codes";

import type { SubscriptionPlan } from "../../generated/prisma/enums";

import { prisma } from "../../lib/prisma";
import AppError from "../errors/appError";

/** null means unlimited. */
export type PlanLimits = {
	maxAssessments: number | null;
	maxInvitationsPer30Days: number | null;
};

export const PLAN_LIMITS: Record<SubscriptionPlan, PlanLimits> = {
	FREE: { maxAssessments: 2, maxInvitationsPer30Days: 20 },
	PRO: { maxAssessments: 20, maxInvitationsPer30Days: 200 },
	ENTERPRISE: { maxAssessments: null, maxInvitationsPer30Days: null },
};

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

/**
 * The plan a company is actually entitled to right now. A paid plan lapses
 * to FREE once its 30-day period has passed (checkout is a one-time payment,
 * nothing auto-renews), even if nobody has called getMySubscription() yet to
 * trigger the stored lazy-expiry update. A CANCELLED plan keeps working until
 * its period ends, matching what the UI promises.
 */
export const getEffectivePlan = async (
	companyId: string,
): Promise<SubscriptionPlan> => {
	const subscription = await prisma.subscription.findUnique({
		where: { companyId },
		select: { plan: true, status: true, currentPeriodEnd: true },
	});

	if (!subscription || subscription.plan === "FREE") return "FREE";
	if (subscription.status === "EXPIRED") return "FREE";
	if (
		subscription.currentPeriodEnd &&
		subscription.currentPeriodEnd < new Date()
	) {
		return "FREE";
	}

	return subscription.plan;
};

// Versions of one assessment share a slug and only the latest version has
// isLatestVersion = true, so creating a new version never uses up quota.
const countAssessments = (companyId: string) =>
	// tenant-scoped via explicit companyId
	prisma.assessment.count({
		where: {
			companyId,
			deletedAt: null,
			isLatestVersion: true,
			status: { not: "ARCHIVED" },
		},
	});

const countRecentInvitations = (companyId: string) =>
	// tenant-scoped via relation filter
	prisma.assessmentInvitation.count({
		where: {
			invitedAt: { gte: new Date(Date.now() - THIRTY_DAYS_MS) },
			assessment: { companyId, deletedAt: null },
		},
	});

export const getPlanSnapshot = async (companyId: string) => {
	const [effectivePlan, assessments, invitationsLast30Days] =
		await Promise.all([
			getEffectivePlan(companyId),
			countAssessments(companyId),
			countRecentInvitations(companyId),
		]);

	return {
		effectivePlan,
		limits: PLAN_LIMITS[effectivePlan],
		usage: { assessments, invitationsLast30Days },
	};
};

export const assertCanCreateAssessment = async (companyId: string) => {
	const plan = await getEffectivePlan(companyId);
	const limit = PLAN_LIMITS[plan].maxAssessments;

	if (limit === null) return;

	const used = await countAssessments(companyId);

	if (used >= limit) {
		throw new AppError(
			StatusCodes.PAYMENT_REQUIRED,
			`Your ${plan} plan allows up to ${limit} assessments. Upgrade your plan to create more.`,
		);
	}
};

export const assertCanInvite = async (companyId: string, count: number) => {
	const plan = await getEffectivePlan(companyId);
	const limit = PLAN_LIMITS[plan].maxInvitationsPer30Days;

	if (limit === null) return;

	const used = await countRecentInvitations(companyId);
	const remaining = Math.max(limit - used, 0);

	if (count > remaining) {
		throw new AppError(
			StatusCodes.PAYMENT_REQUIRED,
			`Your ${plan} plan allows ${limit} invitations per 30 days, and you have ${remaining} left. Upgrade your plan to invite more candidates.`,
		);
	}
};