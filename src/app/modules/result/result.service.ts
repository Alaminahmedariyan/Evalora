import { StatusCodes } from "http-status-codes";

import type { UserRole } from "../../../generated/prisma/enums";

import { prisma } from "../../../lib/prisma";
import { withTenantScope } from "../../../lib/prismaTenantScope";
import AppError from "../../errors/appError";

import { isResultReleasedToCandidate } from "./result.access";
import { RESULT_LEADERBOARD_SELECT } from "./result.const";
// The file name here must match the real file in this folder.
import { notifyResultsReleased } from "./result.notification";

const getResultByAttemptId = async (
	attemptId: string,
	requester: { id: string; role: UserRole; companyId?: string },
) => {
	const whereClause: Record<string, unknown> = { id: attemptId };

	if (requester.role === "CANDIDATE") {
		whereClause.candidateId = requester.id;
	} else if (requester.role !== "ADMIN") {
		if (!requester.companyId) {
			throw new AppError(
				StatusCodes.FORBIDDEN,
				"Access denied. Missing company scope.",
			);
		}
		whereClause.assessment = { companyId: requester.companyId };
	}

	const attempt = await prisma.assessmentAttempt.findFirst({
		where: whereClause,
		select: {
			id: true,
			assessment: { select: { showResultImmediately: true, status: true } },
		},
	});

	if (!attempt) {
		// IDOR protection: return 404 instead of 403
		throw new AppError(StatusCodes.NOT_FOUND, "Attempt result not found.");
	}

	// A candidate only sees the result once it is released: either the
	// recruiter released it (showResultImmediately) or the assessment is
	// closed. Recruiters and admins are never subject to this gate.
	if (
		requester.role === "CANDIDATE" &&
		!isResultReleasedToCandidate(attempt.assessment)
	) {
		throw new AppError(
			StatusCodes.FORBIDDEN,
			"Results for this assessment haven't been released yet.",
		);
	}

	const result = await prisma.result.findUnique({
		where: { attemptId },
		select: RESULT_LEADERBOARD_SELECT,
	});

	if (!result) {
		throw new AppError(
			StatusCodes.NOT_FOUND,
			"Result not available yet — this attempt may not be finalized.",
		);
	}

	return result;
};

/** `companyId` undefined means unscoped — ADMIN browsing any assessment's leaderboard. */
const getResultsForAssessment = async (
	assessmentId: string,
	companyId: string | undefined,
) => {
	// tenant-scoped via withTenantScope
	const assessment = await prisma.assessment.findFirst({
		where: withTenantScope({ id: assessmentId, deletedAt: null }, companyId),
	});

	if (!assessment) {
		throw new AppError(StatusCodes.NOT_FOUND, "Assessment not found.");
	}

	return prisma.result.findMany({
		where: { assessmentId },
		select: RESULT_LEADERBOARD_SELECT,
		orderBy: [{ totalScore: "desc" }, { rank: "asc" }, { evaluatedAt: "asc" }],
	});
};

/**
 * Releases an assessment's results to candidates without closing it.
 * It turns showResultImmediately on, which isResultReleasedToCandidate()
 * already treats as "released", and notifies every candidate whose result
 * is fully graded. Candidates still waiting for grading are notified by
 * recomputeResult() when their grading finishes.
 */
const releaseResults = async (
	assessmentId: string,
	companyId: string,
	actorId: string,
) => {
	// tenant-scoped via withTenantScope
	const assessment = await prisma.assessment.findFirst({
		where: withTenantScope({ id: assessmentId, deletedAt: null }, companyId),
		select: {
			id: true,
			title: true,
			status: true,
			showResultImmediately: true,
		},
	});

	if (!assessment) {
		throw new AppError(StatusCodes.NOT_FOUND, "Assessment not found.");
	}

	if (assessment.status === "DRAFT") {
		throw new AppError(
			StatusCodes.CONFLICT,
			"Publish this assessment before releasing results.",
		);
	}

	if (isResultReleasedToCandidate(assessment)) {
		throw new AppError(
			StatusCodes.CONFLICT,
			"Results are already released to candidates.",
		);
	}

	await prisma.$transaction([
		prisma.assessment.update({
			where: { id: assessmentId },
			data: { showResultImmediately: true },
		}),
		prisma.auditLog.create({
			data: {
				userId: actorId,
				action: "STATUS_CHANGE",
				entity: "Assessment",
				entityId: assessmentId,
				oldValue: { showResultImmediately: false },
				newValue: { showResultImmediately: true },
				metadata: { reason: "results_released" },
			},
		}),
	]);

	const [notified, waitingForGrading] = await Promise.all([
		prisma.result.count({
			where: { assessmentId, status: { in: ["PASSED", "FAILED"] } },
		}),
		prisma.result.count({ where: { assessmentId, status: "PENDING" } }),
	]);

	// A failed notification must never undo a release that already happened.
	try {
		await notifyResultsReleased(assessment.id, assessment.title);
	} catch (error) {
		console.error("Failed to send result-release notifications", error);
	}

	return { released: true, notified, waitingForGrading };
};

/**
 * Assigns rank 1..N to every fully-graded (PASSED/FAILED) result for an assessment.
 * Uses a bulk transaction with chunking to prevent N+1 queries.
 */
const computeRanks = async (assessmentId: string, companyId: string) => {
	// 1. Verify tenant access
	const assessment = await prisma.assessment.findFirst({
		where: withTenantScope({ id: assessmentId, deletedAt: null }, companyId),
	});

	if (!assessment) {
		throw new AppError(StatusCodes.NOT_FOUND, "Assessment not found.");
	}

	// 2. Fetch all finalized results with multi-column sorting for deterministic tie-breaking
	// Order by totalScore DESC, evaluatedAt ASC (first to finish gets better rank)
	const finalizedResults = await prisma.result.findMany({
		where: {
			assessmentId,
			status: { in: ["PASSED", "FAILED"] },
		},
		orderBy: [
			{ totalScore: "desc" },
			{ evaluatedAt: "asc" },
			{ createdAt: "asc" },
		],
		select: { id: true },
	});

	if (finalizedResults.length === 0) {
		throw new AppError(
			StatusCodes.BAD_REQUEST,
			"No fully-graded results to rank yet.",
		);
	}

	// 3. Perform batch updates inside a transaction with chunking
	const CHUNK_SIZE = 100;

	await prisma.$transaction(async (tx) => {
		// Clear old ranks for PENDING results in case a status changed back
		await tx.result.updateMany({
			where: {
				assessmentId,
				status: "PENDING",
			},
			data: { rank: null },
		});

		for (let i = 0; i < finalizedResults.length; i += CHUNK_SIZE) {
			const chunk = finalizedResults.slice(i, i + CHUNK_SIZE);
			await Promise.all(
				chunk.map((result, index) =>
					tx.result.update({
						where: { id: result.id },
						data: { rank: i + index + 1 },
					}),
				),
			);
		}
	});

	return { ranked: finalizedResults.length };
};

export const resultService = {
	getResultByAttemptId,
	getResultsForAssessment,
	releaseResults,
	computeRanks,
};