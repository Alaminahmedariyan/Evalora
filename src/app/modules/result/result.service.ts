import { StatusCodes } from "http-status-codes";

import type { UserRole } from "../../../generated/prisma/enums";

import { prisma } from "../../../lib/prisma";
import AppError from "../../errors/appError";

import { RESULT_LEADERBOARD_SELECT } from "./result.const";

const getResultByAttemptId = async (
	attemptId: string,
	requester: { id: string; role: UserRole; companyId?: string },
) => {
	const attempt = await prisma.assessmentAttempt.findUnique({
		where: { id: attemptId },
		select: { id: true, candidateId: true, assessment: { select: { companyId: true } } },
	});

	if (!attempt) {
		throw new AppError(StatusCodes.NOT_FOUND, "Attempt not found.");
	}

	const isOwner = attempt.candidateId === requester.id;
	const isOwningRecruiter =
		requester.companyId !== undefined && attempt.assessment.companyId === requester.companyId;

	if (requester.role !== "ADMIN" && !isOwner && !isOwningRecruiter) {
		throw new AppError(StatusCodes.FORBIDDEN, "You don't have permission to view this result.");
	}

	const result = await prisma.result.findUnique({ where: { attemptId }, select: RESULT_LEADERBOARD_SELECT });

	if (!result) {
		throw new AppError(
			StatusCodes.NOT_FOUND,
			"Result not available yet — this attempt may not be finalized.",
		);
	}

	return result;
};

/** `companyId` undefined means unscoped — ADMIN browsing any assessment's leaderboard. */
const getResultsForAssessment = async (assessmentId: string, companyId: string | undefined) => {
	const assessment = await prisma.assessment.findFirst({
		where: { id: assessmentId, deletedAt: null, ...(companyId && { companyId }) },
	});

	if (!assessment) {
		throw new AppError(StatusCodes.NOT_FOUND, "Assessment not found.");
	}

	return prisma.result.findMany({
		where: { assessmentId },
		select: RESULT_LEADERBOARD_SELECT,
		orderBy: [{ totalScore: "desc" }, { evaluatedAt: "asc" }],
	});
};

/**
 * Assigns rank 1..N to every fully-graded (PASSED/FAILED) result for an
 * assessment, ordered by totalScore descending. Results still PENDING
 * (a recruiter hasn't finished grading their CODING/WRITTEN answers yet)
 * are left unranked — including them would produce a leaderboard that
 * silently changes as grading continues, which is more confusing than
 * useful. Re-run this after grading more submissions to refresh ranks.
 */
const computeRanks = async (assessmentId: string, companyId: string) => {
	const assessment = await prisma.assessment.findFirst({
		where: { id: assessmentId, companyId, deletedAt: null },
	});

	if (!assessment) {
		throw new AppError(StatusCodes.NOT_FOUND, "Assessment not found.");
	}

	const finalizedResults = await prisma.result.findMany({
		where: { assessmentId, status: { in: ["PASSED", "FAILED"] } },
		orderBy: { totalScore: "desc" },
		select: { id: true },
	});

	if (finalizedResults.length === 0) {
		throw new AppError(StatusCodes.BAD_REQUEST, "No fully-graded results to rank yet.");
	}

	await prisma.$transaction(
		finalizedResults.map((result, index) => prisma.result.update({ where: { id: result.id }, data: { rank: index + 1 } })),
	);

	return { ranked: finalizedResults.length };
};

export const resultService = {
	getResultByAttemptId,
	getResultsForAssessment,
	computeRanks,
};