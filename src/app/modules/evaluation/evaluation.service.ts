import { StatusCodes } from "http-status-codes";

import type { UserRole } from "../../../generated/prisma/enums";

import { prisma } from "../../../lib/prisma";
import AppError from "../../errors/appError";
import { SUBMISSION_GRADING_SELECT } from "../attempt/attempt.const";
import type { ManualEvaluationInput } from "../attempt/attempt.interface";
import { recomputeResult } from "../attempt/grading.util";

type Requester = { id: string; role: UserRole; companyId?: string };

const assertCanGrade = (requesterCompanyId: string | undefined, submissionCompanyId: string, role: UserRole) => {
	if (role !== "ADMIN" && requesterCompanyId !== submissionCompanyId) {
		throw new AppError(StatusCodes.FORBIDDEN, "You don't have permission to access this submission.");
	}
};

const getSubmissionsForAttempt = async (attemptId: string, requester: Requester) => {
	const attempt = await prisma.assessmentAttempt.findUnique({
		where: { id: attemptId },
		select: { id: true, assessment: { select: { companyId: true } } },
	});

	if (!attempt) {
		throw new AppError(StatusCodes.NOT_FOUND, "Attempt not found.");
	}

	assertCanGrade(requester.companyId, attempt.assessment.companyId, requester.role);

	return prisma.submission.findMany({
		where: { attemptId },
		select: SUBMISSION_GRADING_SELECT,
		orderBy: { createdAt: "asc" },
	});
};

const getSubmissionById = async (id: string, requester: Requester) => {
	const submission = await prisma.submission.findUnique({ where: { id }, select: SUBMISSION_GRADING_SELECT });

	if (!submission) {
		throw new AppError(StatusCodes.NOT_FOUND, "Submission not found.");
	}

	const attempt = await prisma.assessmentAttempt.findUniqueOrThrow({
		where: { id: submission.attemptId },
		select: { assessment: { select: { companyId: true } } },
	});

	assertCanGrade(requester.companyId, attempt.assessment.companyId, requester.role);

	return submission;
};

/**
 * Grading queue for an assessment — every submission still waiting on a
 * human (CODING/WRITTEN with a real answer), across all candidates.
 */
const getPendingEvaluations = async (assessmentId: string, companyId: string) => {
	const assessment = await prisma.assessment.findFirst({ where: { id: assessmentId, companyId, deletedAt: null } });

	if (!assessment) {
		throw new AppError(StatusCodes.NOT_FOUND, "Assessment not found.");
	}

	return prisma.submission.findMany({
		where: { attempt: { assessmentId }, evaluation: { status: "PENDING" } },
		select: SUBMISSION_GRADING_SELECT,
		orderBy: { submittedAt: "asc" },
	});
};

/**
 * Manually grades a CODING or WRITTEN submission. MCQ submissions are
 * rejected outright — they're graded automatically the moment the attempt
 * is finalized (see grading.util.ts) and re-grading them manually would
 * let a recruiter silently override an objectively-checkable answer.
 *
 * Triggers recomputeResult() afterward, which is what actually moves the
 * attempt's Result out of PENDING once every submission is COMPLETED.
 */
const evaluateSubmission = async (
	id: string,
	evaluatorId: string,
	companyId: string,
	payload: ManualEvaluationInput,
) => {
	const submission = await prisma.submission.findUnique({
		where: { id },
		include: {
			problem: { select: { id: true, type: true, defaultMarks: true } },
			attempt: {
				select: {
					id: true,
					status: true,
					assessment: {
						select: { companyId: true, assessmentProblems: { select: { problemId: true, marks: true } } },
					},
				},
			},
		},
	});

	if (!submission) {
		throw new AppError(StatusCodes.NOT_FOUND, "Submission not found.");
	}

	assertCanGrade(companyId, submission.attempt.assessment.companyId, "RECRUITER");

	if (submission.attempt.status === "NOT_STARTED" || submission.attempt.status === "IN_PROGRESS") {
		throw new AppError(StatusCodes.CONFLICT, "This attempt hasn't been submitted yet.");
	}

	if (submission.problem.type === "MCQ") {
		throw new AppError(
			StatusCodes.BAD_REQUEST,
			"MCQ submissions are graded automatically and cannot be manually re-graded.",
		);
	}

	const assessmentProblem = submission.attempt.assessment.assessmentProblems.find(
		(ap) => ap.problemId === submission.problemId,
	);
	const maxScore = assessmentProblem?.marks ?? submission.problem.defaultMarks;

	if (payload.score > maxScore) {
		throw new AppError(StatusCodes.BAD_REQUEST, `Score cannot exceed the maximum marks for this problem (${maxScore}).`);
	}

	await prisma.$transaction(async (tx) => {
		if (submission.problem.type === "CODING" && payload.testCaseResults) {
			for (const testCaseResult of payload.testCaseResults) {
				await tx.testCaseResult.upsert({
					where: { submissionId_testCaseId: { submissionId: id, testCaseId: testCaseResult.testCaseId } },
					update: {
						passed: testCaseResult.passed,
						...(testCaseResult.actualOutput !== undefined && { actualOutput: testCaseResult.actualOutput }),
						points: testCaseResult.points ?? 0,
					},
					create: {
						submissionId: id,
						testCaseId: testCaseResult.testCaseId,
						passed: testCaseResult.passed,
						...(testCaseResult.actualOutput !== undefined && { actualOutput: testCaseResult.actualOutput }),
						points: testCaseResult.points ?? 0,
					},
				});
			}
		}

		await tx.submission.update({ where: { id }, data: { status: "EVALUATED" } });

		await tx.submissionEvaluation.upsert({
			where: { submissionId: id },
			update: {
				score: payload.score,
				maxScore,
				status: "COMPLETED",
				isAutoEvaluated: false,
				evaluatorId,
				...(payload.feedback !== undefined && { feedback: payload.feedback }),
				evaluatedAt: new Date(),
			},
			create: {
				submissionId: id,
				score: payload.score,
				maxScore,
				status: "COMPLETED",
				isAutoEvaluated: false,
				evaluatorId,
				...(payload.feedback !== undefined && { feedback: payload.feedback }),
				evaluatedAt: new Date(),
			},
		});
	});

	await recomputeResult(submission.attempt.id);

	return prisma.submission.findUniqueOrThrow({ where: { id }, select: SUBMISSION_GRADING_SELECT });
};

export const evaluationService = {
	getSubmissionsForAttempt,
	getSubmissionById,
	getPendingEvaluations,
	evaluateSubmission,
};