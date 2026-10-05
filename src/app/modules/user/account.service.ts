import { StatusCodes } from "http-status-codes";

import { prisma } from "../../../lib/prisma";
import AppError from "../../errors/appError";

const exportMyData = async (userId: string) => {
	const user = await prisma.user.findFirst({
		where: { id: userId, deletedAt: null },
		select: {
			id: true,
			name: true,
			email: true,
			image: true,
			phone: true,
			role: true,
			status: true,
			provider: true,
			emailVerified: true,
			twoFactorEnabled: true,
			lastLoginAt: true,
			createdAt: true,
			updatedAt: true,
		},
	});

	if (!user) {
		throw new AppError(StatusCodes.NOT_FOUND, "User not found.");
	}

	const [
		candidateProfile,
		consents,
		invitations,
		attempts,
		notifications,
		payments,
		company,
	] = await Promise.all([
		prisma.candidateProfile.findFirst({
			where: { userId, deletedAt: null },
			select: {
				headline: true,
				bio: true,
				phone: true,
				location: true,
				resumeUrl: true,
				linkedinUrl: true,
				githubUrl: true,
				portfolioUrl: true,
				skills: true,
				experienceYears: true,
				isVisibleToRecruiters: true,
				createdAt: true,
				updatedAt: true,
			},
		}),
		prisma.userConsent.findMany({
			where: { userId },
			select: {
				consentType: true,
				granted: true,
				grantedAt: true,
				revokedAt: true,
			},
		}),
		prisma.assessmentInvitation.findMany({
			where: {
				OR: [{ candidateId: userId }, { email: user.email.toLowerCase() }],
			},
			select: {
				email: true,
				status: true,
				invitedAt: true,
				acceptedAt: true,
				expiresAt: true,
				completedAt: true,
				assessment: { select: { title: true } },
			},
			orderBy: { invitedAt: "desc" },
		}),
		prisma.assessmentAttempt.findMany({
			where: { candidateId: userId },
			select: {
				attemptNumber: true,
				status: true,
				startedAt: true,
				submittedAt: true,
				expiresAt: true,
				tabSwitchCount: true,
				ipAddress: true,
				userAgent: true,
				assessment: { select: { title: true, showResultImmediately: true } },
				result: {
					select: {
						totalScore: true,
						totalMarks: true,
						percentage: true,
						status: true,
						rank: true,
						evaluatedAt: true,
					},
				},
				submissions: {
					select: {
						answerText: true,
						code: true,
						language: true,
						status: true,
						submittedAt: true,
						problem: { select: { title: true, type: true } },
						answers: { select: { option: { select: { optionText: true } } } },
						evaluation: {
							select: {
								score: true,
								maxScore: true,
								feedback: true,
								status: true,
								evaluatedAt: true,
							},
						},
					},
				},
				proctoringEvents: {
					select: { eventType: true, timestamp: true },
					orderBy: { timestamp: "asc" },
				},
			},
			orderBy: { createdAt: "desc" },
		}),
		prisma.notification.findMany({
			where: { userId },
			select: { title: true, message: true, type: true, isRead: true, createdAt: true },
			orderBy: { createdAt: "desc" },
			take: 500,
		}),
		prisma.payment.findMany({
			where: { userId },
			select: {
				provider: true,
				status: true,
				amountMinor: true,
				currency: true,
				paidAt: true,
				createdAt: true,
			},
			orderBy: { createdAt: "desc" },
		}),
		prisma.company.findFirst({
			where: { ownerId: userId, deletedAt: null },
			select: {
				name: true,
				slug: true,
				description: true,
				website: true,
				industry: true,
				logo: true,
				isVerified: true,
				createdAt: true,
				subscription: {
					select: {
						plan: true,
						status: true,
						currentPeriodStart: true,
						currentPeriodEnd: true,
					},
				},
			},
		}),
	]);

	// Scores and reviewer feedback follow the same rule as the rest of the app:
	// they are only shown once the company has chosen to release results.
	const attemptsOut = attempts.map(
		({ assessment, result, submissions, ...attempt }) => {
			const released = assessment.showResultImmediately;

			return {
				...attempt,
				assessment: { title: assessment.title },
				result: released ? result : null,
				submissions: submissions.map(({ evaluation, ...submission }) => ({
					...submission,
					evaluation: released ? evaluation : null,
				})),
			};
		},
	);

	return {
		exportedAt: new Date().toISOString(),
		account: user,
		candidateProfile,
		consents,
		invitations,
		attempts: attemptsOut,
		notifications,
		payments,
		company,
	};
};

/**
 * Self-service deletion is a deactivation, matching the Privacy Policy:
 * the account can no longer sign in, the profile leaves the recruiter
 * directory, and every session ends. Payment records, audit logs and results
 * already shared with a company are kept.
 */
const deleteMyAccount = async (userId: string, confirmEmail: string) => {
	const user = await prisma.user.findFirst({
		where: { id: userId, deletedAt: null },
		select: { id: true, email: true, role: true },
	});

	if (!user) {
		throw new AppError(StatusCodes.NOT_FOUND, "User not found.");
	}

	if (user.role === "ADMIN") {
		throw new AppError(
			StatusCodes.FORBIDDEN,
			"Admin accounts can't be deleted from here.",
		);
	}

	if (user.role === "RECRUITER") {
		throw new AppError(
			StatusCodes.CONFLICT,
			"Company accounts can't be deleted from here yet. Please contact us and we will help.",
		);
	}

	if (confirmEmail.trim().toLowerCase() !== user.email.toLowerCase()) {
		throw new AppError(
			StatusCodes.BAD_REQUEST,
			"The email you typed doesn't match your account email.",
		);
	}

	const inProgress = await prisma.assessmentAttempt.count({
		where: {
			candidateId: userId,
			status: "IN_PROGRESS",
			expiresAt: { gt: new Date() },
		},
	});

	if (inProgress > 0) {
		throw new AppError(
			StatusCodes.CONFLICT,
			"You have an assessment in progress. Submit it before deleting your account.",
		);
	}

	const now = new Date();

	await prisma.$transaction([
		prisma.user.update({
			where: { id: userId },
			data: { deletedAt: now, status: "SUSPENDED" },
		}),
		prisma.candidateProfile.updateMany({
			where: { userId },
			data: { isVisibleToRecruiters: false, deletedAt: now },
		}),
		prisma.session.deleteMany({ where: { userId } }),
		prisma.auditLog.create({
			data: {
				userId,
				action: "DELETE",
				entity: "User",
				entityId: userId,
				metadata: { selfService: true },
			},
		}),
	]);

	return { message: "Your account has been deleted." };
};

export const accountService = { exportMyData, deleteMyAccount };