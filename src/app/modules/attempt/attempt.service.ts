import { StatusCodes } from "http-status-codes";

import type { Prisma } from "../../../generated/prisma/client";
import type { UserRole } from "../../../generated/prisma/enums";

import { prisma } from "../../../lib/prisma";
import AppError from "../../errors/appError";

import { ATTEMPT_DETAIL_SELECT } from "./attempt.const";
import type { ProctoringEventInput, SaveSubmissionInput } from "./attempt.interface";
import { gradeSubmissionForProblem, recomputeResult } from "./grading.util";

/**
 * Finalizes an attempt: flips its status (SUBMITTED if within time,
 * AUTO_SUBMITTED if called because time already ran out), grades every
 * problem in the assessment, recomputes the Result, and marks the backing
 * invitation COMPLETED. Shared by an explicit submit and every lazy
 * expiry check throughout this file — there is exactly one code path that
 * closes out an attempt, so grading can never accidentally run twice with
 * different outcomes.
 */
const finalizeAttempt = async (attemptId: string) => {
	const attempt = await prisma.assessmentAttempt.findUniqueOrThrow({
		where: { id: attemptId },
		include: {
			assessment: {
				include: { assessmentProblems: { include: { problem: { select: { id: true, type: true } } } } },
			},
		},
	});

	if (attempt.status !== "IN_PROGRESS") return; // already finalized — nothing to do.

	const isLate = attempt.expiresAt < new Date();

	await prisma.assessmentAttempt.update({
		where: { id: attemptId },
		data: {
			status: isLate ? "AUTO_SUBMITTED" : "SUBMITTED",
			submittedAt: new Date(),
			...(isLate && { autoSubmittedAt: new Date() }),
		},
	});

	for (const assessmentProblem of attempt.assessment.assessmentProblems) {
		await gradeSubmissionForProblem({
			attemptId,
			problemId: assessmentProblem.problemId,
			problemType: assessmentProblem.problem.type,
			marks: assessmentProblem.marks,
		});
	}

	await recomputeResult(attemptId);

	if (attempt.invitationId) {
		await prisma.assessmentInvitation.updateMany({
			where: { id: attempt.invitationId, status: { not: "COMPLETED" } },
			data: { status: "COMPLETED", completedAt: new Date() },
		});
	}
};

const getAttemptById = async (
	id: string,
	requester: { id: string; role: UserRole; companyId?: string },
) => {
	let attempt = await prisma.assessmentAttempt.findUnique({ where: { id }, select: ATTEMPT_DETAIL_SELECT });

	if (!attempt) {
		throw new AppError(StatusCodes.NOT_FOUND, "Attempt not found.");
	}

	const isOwner = attempt.candidateId === requester.id;
	const isOwningRecruiter =
		requester.companyId !== undefined && attempt.assessment.companyId === requester.companyId;

	if (requester.role !== "ADMIN" && !isOwner && !isOwningRecruiter) {
		throw new AppError(StatusCodes.FORBIDDEN, "You don't have permission to view this attempt.");
	}

	// Lazy auto-expire — catches attempts nobody explicitly submitted in time.
	if (attempt.status === "IN_PROGRESS" && attempt.expiresAt < new Date()) {
		await finalizeAttempt(id);
		attempt = await prisma.assessmentAttempt.findUniqueOrThrow({ where: { id }, select: ATTEMPT_DETAIL_SELECT });
	}

	return attempt;
};

const getMyAttempts = async (candidateId: string) => {
	return prisma.assessmentAttempt.findMany({
		where: { candidateId },
		select: ATTEMPT_DETAIL_SELECT,
		orderBy: { createdAt: "desc" },
	});
};

const startAttempt = async (candidateId: string, assessmentId: string) => {
	const assessment = await prisma.assessment.findFirst({
		where: { id: assessmentId, deletedAt: null },
	});

	if (!assessment) {
		throw new AppError(StatusCodes.NOT_FOUND, "Assessment not found.");
	}

	if (assessment.status !== "PUBLISHED" && assessment.status !== "ACTIVE") {
		throw new AppError(StatusCodes.CONFLICT, "This assessment is not currently open for attempts.");
	}

	const now = new Date();

	if (assessment.startAt && now < assessment.startAt) {
		throw new AppError(StatusCodes.CONFLICT, "This assessment has not started yet.");
	}

	if (assessment.endAt && now > assessment.endAt) {
		throw new AppError(StatusCodes.CONFLICT, "This assessment's window has closed.");
	}

	const invitation = await prisma.assessmentInvitation.findFirst({
		where: { assessmentId, candidateId, status: { in: ["ACCEPTED", "COMPLETED"] } },
	});

	if (!invitation) {
		throw new AppError(StatusCodes.FORBIDDEN, "You need an accepted invitation to start this assessment.");
	}

	// Resume an already-running, not-yet-expired attempt instead of starting
	// a second concurrent one.
	const inProgress = await prisma.assessmentAttempt.findFirst({
		where: { assessmentId, candidateId, status: "IN_PROGRESS" },
	});

	if (inProgress) {
		if (inProgress.expiresAt >= now) {
			return getAttemptById(inProgress.id, { id: candidateId, role: "CANDIDATE" });
		}
		// Stale — finalize it before allowing a fresh attempt.
		await finalizeAttempt(inProgress.id);
	}

	const attemptCount = await prisma.assessmentAttempt.count({ where: { assessmentId, candidateId } });

	if (attemptCount >= assessment.maxAttempts) {
		throw new AppError(
			StatusCodes.CONFLICT,
			`You have used all ${assessment.maxAttempts} allowed attempt(s) for this assessment.`,
		);
	}

	const rawExpiresAt = now.getTime() + assessment.durationMinutes * 60 * 1000;
	const expiresAt = assessment.endAt
		? new Date(Math.min(rawExpiresAt, assessment.endAt.getTime()))
		: new Date(rawExpiresAt);

	const attempt = await prisma.assessmentAttempt.create({
		data: {
			assessmentId,
			candidateId,
			invitationId: invitation.id,
			attemptNumber: attemptCount + 1,
			status: "IN_PROGRESS",
			startedAt: now,
			expiresAt,
		},
	});

	return getAttemptById(attempt.id, { id: candidateId, role: "CANDIDATE" });
};

/**
 * Saves (creates or overwrites) the candidate's answer for one problem.
 * Can be called repeatedly while the attempt is IN_PROGRESS — each call
 * fully replaces the previous answer for that problem, which is exactly
 * the "autosave as they work" behaviour a real exam UI needs.
 */
const saveSubmission = async (
	attemptId: string,
	candidateId: string,
	problemId: string,
	payload: SaveSubmissionInput,
) => {
	const attempt = await prisma.assessmentAttempt.findFirst({
		where: { id: attemptId, candidateId },
		include: {
			assessment: {
				include: { assessmentProblems: { where: { problemId }, include: { problem: true } } },
			},
		},
	});

	if (!attempt) {
		throw new AppError(StatusCodes.NOT_FOUND, "Attempt not found.");
	}

	if (attempt.status === "IN_PROGRESS" && attempt.expiresAt < new Date()) {
		await finalizeAttempt(attemptId);
		throw new AppError(StatusCodes.GONE, "Time is up — this attempt has been auto-submitted.");
	}

	if (attempt.status !== "IN_PROGRESS") {
		throw new AppError(
			StatusCodes.CONFLICT,
			`Cannot modify answers — this attempt is already ${attempt.status.toLowerCase()}.`,
		);
	}

	const assessmentProblem = attempt.assessment.assessmentProblems[0];

	if (!assessmentProblem) {
		throw new AppError(StatusCodes.BAD_REQUEST, "This problem is not part of this assessment.");
	}

	const { problem } = assessmentProblem;
	let selectedOptionIds: string[] = [];

	if (problem.type === "MCQ") {
		if (!payload.selectedOptionIds || payload.selectedOptionIds.length === 0) {
			throw new AppError(StatusCodes.BAD_REQUEST, "selectedOptionIds is required for an MCQ problem.");
		}

		const mcqProblem = await prisma.mcqProblem.findUniqueOrThrow({
			where: { problemId },
			include: { options: { select: { id: true } } },
		});

		const validOptionIds = new Set(mcqProblem.options.map((option) => option.id));
		const hasInvalidOption = payload.selectedOptionIds.some((id) => !validOptionIds.has(id));

		if (hasInvalidOption) {
			throw new AppError(StatusCodes.BAD_REQUEST, "One or more selected options do not belong to this problem.");
		}

		if (mcqProblem.type === "SINGLE_CHOICE" && payload.selectedOptionIds.length > 1) {
			throw new AppError(StatusCodes.BAD_REQUEST, "This is a single-choice question — select only one option.");
		}

		selectedOptionIds = payload.selectedOptionIds;
	} else if (problem.type === "CODING") {
		if (!payload.code) {
			throw new AppError(StatusCodes.BAD_REQUEST, "code is required for a CODING problem.");
		}
	} else if (!payload.answerText) {
		throw new AppError(StatusCodes.BAD_REQUEST, "answerText is required for a WRITTEN problem.");
	}

	const submission = await prisma.submission.upsert({
		where: { attemptId_problemId: { attemptId, problemId } },
		update: {
			status: "SUBMITTED",
			submittedAt: new Date(),
			...(problem.type === "CODING" && payload.code !== undefined && { code: payload.code }),
			...(problem.type === "CODING" && payload.language !== undefined && { language: payload.language }),
			...(problem.type === "WRITTEN" && payload.answerText !== undefined && { answerText: payload.answerText }),
		},
		create: {
			attemptId,
			problemId,
			status: "SUBMITTED",
			submittedAt: new Date(),
			...(problem.type === "CODING" && payload.code !== undefined && { code: payload.code }),
			...(problem.type === "CODING" && payload.language !== undefined && { language: payload.language }),
			...(problem.type === "WRITTEN" && payload.answerText !== undefined && { answerText: payload.answerText }),
		},
	});

	if (problem.type === "MCQ") {
		await prisma.$transaction([
			prisma.submissionAnswer.deleteMany({ where: { submissionId: submission.id } }),
			prisma.submissionAnswer.createMany({
				data: selectedOptionIds.map((optionId) => ({ submissionId: submission.id, optionId })),
			}),
		]);
	}

	return prisma.submission.findUniqueOrThrow({
		where: { id: submission.id },
		include: { answers: true },
	});
};

const submitAttempt = async (attemptId: string, candidateId: string) => {
	const attempt = await prisma.assessmentAttempt.findFirst({ where: { id: attemptId, candidateId } });

	if (!attempt) {
		throw new AppError(StatusCodes.NOT_FOUND, "Attempt not found.");
	}

	if (attempt.status !== "IN_PROGRESS") {
		throw new AppError(StatusCodes.CONFLICT, `This attempt is already ${attempt.status.toLowerCase()}.`);
	}

	await finalizeAttempt(attemptId);

	return getAttemptById(attemptId, { id: candidateId, role: "CANDIDATE" });
};

/**
 * A stale beacon from a tab that's already closed (e.g. a tab-switch event
 * firing right as time runs out) is not an error — it's just a no-op once
 * the attempt is no longer IN_PROGRESS.
 */
const recordProctoringEvent = async (attemptId: string, candidateId: string, payload: ProctoringEventInput) => {
	const attempt = await prisma.assessmentAttempt.findFirst({ where: { id: attemptId, candidateId } });

	if (!attempt) {
		throw new AppError(StatusCodes.NOT_FOUND, "Attempt not found.");
	}

	if (attempt.status !== "IN_PROGRESS") {
		return { recorded: false };
	}

	if (payload.eventType === "TAB_SWITCH") {
		await prisma.$transaction([
			prisma.proctoringEvent.create({
				data: { attemptId, eventType: payload.eventType, ...(payload.metadata && { metadata: payload.metadata as Prisma.InputJsonValue }) },
			}),
			prisma.assessmentAttempt.update({
				where: { id: attemptId },
				data: { tabSwitchCount: { increment: 1 } },
			}),
		]);
	} else {
		await prisma.proctoringEvent.create({
			data: { attemptId, eventType: payload.eventType, ...(payload.metadata && { metadata: payload.metadata as Prisma.InputJsonValue }) },
		});
	}

	return { recorded: true };
};

export const attemptService = {
	startAttempt,
	getMyAttempts,
	getAttemptById,
	saveSubmission,
	submitAttempt,
	recordProctoringEvent,
};