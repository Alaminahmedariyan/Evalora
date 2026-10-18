import { StatusCodes } from "http-status-codes";

import type { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../../lib/prisma";
import AppError from "../../errors/appError";
import { automationService } from "./automation.service";
import type { ReportResultInput } from "./automation.report.validation";

export const PROCTORING_HIGH_RISK_EVENT = "proctoring.high_risk";
export const HEURISTIC_MODEL_NAME = "heuristic";

type RiskLevelValue = "LOW" | "MEDIUM" | "HIGH";

// Weight per proctoring signal. Tuned so a few tab switches stay LOW and a
// devtools or camera event pushes an attempt towards HIGH quickly.
const RISK_WEIGHTS: Record<string, number> = {
	TAB_SWITCH: 2,
	FULLSCREEN_EXIT: 3,
	COPY: 2,
	PASTE: 3,
	DEVTOOLS_DETECTED: 10,
	CAMERA_BLOCKED: 5,
	MICROPHONE_BLOCKED: 3,
	WINDOW_BLUR: 1,
};

const MEDIUM_THRESHOLD = 15;
const HIGH_THRESHOLD = 40;

const computeHeuristicRisk = (counts: Record<string, number>) => {
	let score = 0;
	for (const [type, count] of Object.entries(counts)) {
		score += (RISK_WEIGHTS[type] ?? 0) * count;
	}
	const level: RiskLevelValue =
		score >= HIGH_THRESHOLD
			? "HIGH"
			: score >= MEDIUM_THRESHOLD
				? "MEDIUM"
				: "LOW";
	return { score, level };
};

const hasAiConsent = async (userId: string): Promise<boolean> => {
	const consent = await prisma.userConsent.findUnique({
		where: { userId_consentType: { userId, consentType: "AI_PROCESSING" } },
		select: { granted: true },
	});
	return consent?.granted === true;
};

const findAttemptOrThrow = async (attemptId: string) => {
	const attempt = await prisma.assessmentAttempt.findUnique({
		where: { id: attemptId },
		select: {
			id: true,
			status: true,
			candidateId: true,
			startedAt: true,
			submittedAt: true,
			autoSubmittedAt: true,
			tabSwitchCount: true,
			assessment: {
				select: {
					id: true,
					title: true,
					durationMinutes: true,
					totalMarks: true,
					passingMarks: true,
					company: { select: { ownerId: true } },
				},
			},
			result: {
				select: { totalScore: true, totalMarks: true, percentage: true },
			},
			submissions: {
				select: {
					problem: { select: { type: true } },
					evaluation: { select: { score: true, maxScore: true } },
				},
			},
		},
	});

	if (!attempt) {
		throw new AppError(StatusCodes.NOT_FOUND, "Attempt not found.");
	}
	return attempt;
};

/**
 * Input for the AI report step. Contains behaviour counts and scores only:
 * no name, email, answer text or code. When the candidate has not granted
 * AI_PROCESSING consent the response says `eligible: false`, and the caller
 * should save the `heuristic` risk instead of calling an AI model.
 */
const getReportInput = async (attemptId: string) => {
	const attempt = await findAttemptOrThrow(attemptId);

	if (attempt.status === "IN_PROGRESS" || attempt.status === "NOT_STARTED") {
		throw new AppError(
			StatusCodes.CONFLICT,
			"Attempt is not finished yet.",
			"ATTEMPT_NOT_FINISHED",
		);
	}

	const grouped = await prisma.proctoringEvent.groupBy({
		by: ["eventType"],
		where: { attemptId },
		_count: { _all: true },
	});

	const counts: Record<string, number> = {};
	for (const row of grouped) {
		counts[row.eventType] = row._count._all;
	}

	const heuristic = computeHeuristicRisk(counts);
	const eligible = await hasAiConsent(attempt.candidateId);

	const finishedAt = attempt.submittedAt ?? attempt.autoSubmittedAt;
	const minutesUsed =
		attempt.startedAt && finishedAt
			? Math.max(
					0,
					Math.round(
						(finishedAt.getTime() - attempt.startedAt.getTime()) / 60000,
					),
				)
			: null;

	const byType: Record<string, { score: number; maxScore: number }> = {};
	for (const submission of attempt.submissions) {
		const type = submission.problem.type;
		const bucket = byType[type] ?? { score: 0, maxScore: 0 };
		bucket.score += submission.evaluation?.score ?? 0;
		bucket.maxScore += submission.evaluation?.maxScore ?? 0;
		byType[type] = bucket;
	}

	return {
		eligible,
		attemptId: attempt.id,
		assessmentTitle: attempt.assessment.title,
		autoSubmitted: attempt.autoSubmittedAt !== null,
		durationMinutes: attempt.assessment.durationMinutes,
		minutesUsed,
		result: attempt.result,
		passingMarks: attempt.assessment.passingMarks,
		scoreByProblemType: byType,
		proctoring: {
			tabSwitchCount: attempt.tabSwitchCount,
			eventCounts: counts,
			heuristicRiskScore: heuristic.score,
			heuristicRiskLevel: heuristic.level,
		},
	};
};

/**
 * Stores the report and raises a PROCTORING_ALERT only when an attempt moves
 * to HIGH risk for the first time, so repeated n8n retries stay quiet.
 */
const saveReportResult = async (
	attemptId: string,
	input: ReportResultInput,
) => {
	const attempt = await findAttemptOrThrow(attemptId);

	const isHeuristic = input.aiModel === HEURISTIC_MODEL_NAME;
	if (!isHeuristic && !(await hasAiConsent(attempt.candidateId))) {
		throw new AppError(
			StatusCodes.FORBIDDEN,
			"Candidate has not granted AI processing consent.",
			"AI_CONSENT_REQUIRED",
		);
	}

	const previous = await prisma.attemptReport.findUnique({
		where: { attemptId },
		select: { riskLevel: true },
	});

	const now = new Date();
	const hasNarrative = input.summary !== undefined;

	const data = {
		riskLevel: input.riskLevel,
		riskSummary: input.riskSummary,
		summary: input.summary ?? null,
		strengths: (input.strengths ?? []) as Prisma.InputJsonValue,
		weaknesses: (input.weaknesses ?? []) as Prisma.InputJsonValue,
		recommendation: input.recommendation ?? null,
		aiModel: input.aiModel,
		riskAnalyzedAt: now,
		generatedAt: hasNarrative ? now : null,
	};

	const report = await prisma.attemptReport.upsert({
		where: { attemptId },
		create: { attemptId, ...data },
		update: data,
		select: {
			id: true,
			attemptId: true,
			riskLevel: true,
			riskSummary: true,
			summary: true,
			recommendation: true,
			generatedAt: true,
		},
	});

	const becameHigh = input.riskLevel === "HIGH" && previous?.riskLevel !== "HIGH";

	if (becameHigh) {
		try {
			await prisma.notification.create({
				data: {
					userId: attempt.assessment.company.ownerId,
					title: "High proctoring risk",
					message: `An attempt on "${attempt.assessment.title}" was flagged as high risk. Review it before deciding.`,
					type: "PROCTORING_ALERT",
					metadata: {
						attemptId,
						assessmentId: attempt.assessment.id,
					},
				},
			});
		} catch {
			// Best effort: the report is saved, so a failed alert must not fail the call.
		}

		try {
			await automationService.emitEvent({
				eventType: PROCTORING_HIGH_RISK_EVENT,
				aggregateType: "AssessmentAttempt",
				aggregateId: attemptId,
				payload: { attemptId, assessmentId: attempt.assessment.id },
				dedupeKey: `${PROCTORING_HIGH_RISK_EVENT}:${attemptId}`,
			});
		} catch {
			// Best effort, same reason as above.
		}
	}

	return report;
};

export const automationReport = { getReportInput, saveReportResult };