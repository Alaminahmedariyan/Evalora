import { z } from "zod";

const startAttemptSchema = z.object({
	assessmentId: z.string().min(1, "assessmentId is required."),
});

const saveSubmissionSchema = z
	.object({
		selectedOptionIds: z.array(z.string().min(1)).max(10).optional(),
		code: z.string().max(20000).optional(),
		language: z.string().trim().max(50).optional(),
		answerText: z.string().trim().max(20000).optional(),
	})
	.refine(
		(data) =>
			data.selectedOptionIds !== undefined ||
			data.code !== undefined ||
			data.answerText !== undefined,
		{
			message:
				"Provide an answer: selectedOptionIds (MCQ), code (CODING), or answerText (WRITTEN).",
		},
	);

const testCaseResultInputSchema = z.object({
	testCaseId: z.string().min(1),
	passed: z.boolean(),
	actualOutput: z.string().max(5000).optional(),
	points: z.coerce.number().int().min(0).max(1000).optional(),
});

/**
 * `score` is only bounded below (>= 0) here — the upper bound is the
 * problem's marks, which this schema doesn't know. attempt.service.ts
 * rejects a score greater than maxScore.
 */
const manualEvaluationSchema = z.object({
	score: z.coerce.number().min(0, "Score cannot be negative."),
	feedback: z.string().trim().max(2000).optional(),
	testCaseResults: z.array(testCaseResultInputSchema).max(50).optional(),
});

const proctoringEventSchema = z.object({
	eventType: z.enum([
		"TAB_SWITCH",
		"FULLSCREEN_EXIT",
		"COPY",
		"PASTE",
		"DEVTOOLS_DETECTED",
		"CAMERA_BLOCKED",
		"MICROPHONE_BLOCKED",
		"WINDOW_BLUR",
		"WINDOW_FOCUS",
		"OTHER",
	]),
	metadata: z
		.record(z.string(), z.unknown())
		.refine(
			(value) => JSON.stringify(value).length <= 2000,
			"Metadata is too large.",
		)
		.optional(),
});

export const attemptValidation = {
	startAttemptSchema,
	saveSubmissionSchema,
	manualEvaluationSchema,
	proctoringEventSchema,
};
