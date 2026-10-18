import { StatusCodes } from "http-status-codes";

import { prisma } from "../../../lib/prisma";
import AppError from "../../errors/appError";

import { AUTOMATION_EVENT_TYPES } from "./automation.const";
import { automationService } from "./automation.service";

type AiResultInput = {
	aiScore: number;
	aiFeedback: string;
	aiModel: string;
};

const loadWrittenSubmission = async (submissionId: string) => {
	const submission = await prisma.submission.findUnique({
		where: { id: submissionId },
		select: {
			id: true,
			attemptId: true,
			problemId: true,
			answerText: true,
			evaluation: {
				select: { id: true, status: true, maxScore: true, reviewStatus: true },
			},
			problem: {
				select: { title: true, description: true, type: true, rubric: true },
			},
			attempt: {
				select: {
					candidateId: true,
					assessmentId: true,
					assessment: { select: { companyId: true } },
				},
			},
		},
	});

	if (!submission) {
		throw new AppError(StatusCodes.NOT_FOUND, "Submission not found.");
	}

	if (submission.problem.type !== "WRITTEN") {
		throw new AppError(
			StatusCodes.BAD_REQUEST,
			"AI evaluation is only available for WRITTEN problems.",
		);
	}

	return submission;
};

/**
 * What n8n needs to grade one written answer. No name, email or phone is
 * ever returned. If the candidate has not granted AI_PROCESSING consent
 * (or the submission is already graded), eligible is false and n8n must
 * stop: the submission simply stays PENDING for the recruiter.
 */
const getAiInput = async (submissionId: string) => {
	const submission = await loadWrittenSubmission(submissionId);

	if (!submission.evaluation || submission.evaluation.status !== "PENDING") {
		return { eligible: false as const, reason: "ALREADY_GRADED_OR_NOT_PENDING" };
	}

	if (
		submission.evaluation.reviewStatus === "APPROVED" ||
		submission.evaluation.reviewStatus === "OVERRIDDEN"
	) {
		return { eligible: false as const, reason: "ALREADY_REVIEWED" };
	}

	if (!submission.answerText || submission.answerText.trim() === "") {
		return { eligible: false as const, reason: "EMPTY_ANSWER" };
	}

	const consent = await prisma.userConsent.findUnique({
		where: {
			userId_consentType: {
				userId: submission.attempt.candidateId,
				consentType: "AI_PROCESSING",
			},
		},
		select: { granted: true },
	});

	if (!consent?.granted) {
		return { eligible: false as const, reason: "NO_AI_CONSENT" };
	}

	return {
		eligible: true as const,
		submissionId: submission.id,
		question: {
			title: submission.problem.title,
			description: submission.problem.description,
		},
		rubric: submission.problem.rubric ?? null,
		answer: submission.answerText,
		maxScore: submission.evaluation.maxScore,
	};
};

/**
 * Stores the AI suggestion. It never touches score or status, so the
 * submission stays PENDING and only a recruiter can finalize it.
 */
const saveAiResult = async (submissionId: string, input: AiResultInput) => {
	const submission = await loadWrittenSubmission(submissionId);

	if (!submission.evaluation) {
		throw new AppError(StatusCodes.CONFLICT, "Submission has no evaluation yet.");
	}

	if (
		submission.evaluation.status !== "PENDING" ||
		submission.evaluation.reviewStatus === "APPROVED" ||
		submission.evaluation.reviewStatus === "OVERRIDDEN"
	) {
		throw new AppError(
			StatusCodes.CONFLICT,
			"This submission was already graded by a recruiter.",
		);
	}

	if (input.aiScore > submission.evaluation.maxScore) {
		throw new AppError(
			StatusCodes.BAD_REQUEST,
			`aiScore cannot exceed the maximum marks (${submission.evaluation.maxScore}).`,
		);
	}

	await prisma.submissionEvaluation.update({
		where: { id: submission.evaluation.id },
		data: {
			aiScore: input.aiScore,
			aiFeedback: input.aiFeedback,
			aiModel: input.aiModel,
			aiEvaluatedAt: new Date(),
			reviewStatus: "PENDING_REVIEW",
		},
	});

	const companyId = submission.attempt.assessment.companyId;

	// Best-effort: the AI result is saved even if these two fail.
	try {
		const company = await prisma.company.findUnique({
			where: { id: companyId },
			select: { ownerId: true },
		});

		if (company) {
			await prisma.notification.create({
				data: {
					userId: company.ownerId,
					title: "AI suggestion ready for review",
					message: "A written answer has an AI-suggested score waiting for your review.",
					type: "EVALUATION_REVIEW_NEEDED",
					metadata: {
						submissionId,
						attemptId: submission.attemptId,
						assessmentId: submission.attempt.assessmentId,
					},
				},
			});
		}
	} catch (error) {
		console.error("[AI] Failed to create review notification", error);
	}

	try {
		await automationService.emitEvent({
			eventType: AUTOMATION_EVENT_TYPES.EVALUATION_REVIEW_NEEDED,
			aggregateType: "Submission",
			aggregateId: submissionId,
			dedupeKey: `${AUTOMATION_EVENT_TYPES.EVALUATION_REVIEW_NEEDED}:${submissionId}`,
			payload: {
				submissionId,
				attemptId: submission.attemptId,
				assessmentId: submission.attempt.assessmentId,
			},
		});
	} catch (error) {
		console.error("[AI] Failed to emit review event", error);
	}

	return { saved: true, reviewStatus: "PENDING_REVIEW" as const };
};

export const automationAi = {
	getAiInput,
	saveAiResult,
};