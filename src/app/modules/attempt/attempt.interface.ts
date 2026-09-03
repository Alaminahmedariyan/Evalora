import type { ProctoringEventType } from "../../../generated/prisma/enums";

/**
 * One shape covers all three problem types — the caller doesn't send a
 * "type" discriminant because problemId already implies it; the service
 * looks up the problem's actual type and only reads the relevant fields.
 * Validation (attempt.validation.ts) enforces the right fields are present
 * for the problem's type before this ever reaches the service.
 */
export type SaveSubmissionInput = {
	selectedOptionIds?: string[];
	code?: string;
	language?: string;
	answerText?: string;
};

export type ManualEvaluationInput = {
	score: number;
	feedback?: string;
	/** Per-test-case pass/fail, only meaningful for CODING submissions. */
	testCaseResults?: { testCaseId: string; passed: boolean; actualOutput?: string; points?: number }[];
};

export type ProctoringEventInput = {
	eventType: ProctoringEventType;
	metadata?: Record<string, unknown>;
};