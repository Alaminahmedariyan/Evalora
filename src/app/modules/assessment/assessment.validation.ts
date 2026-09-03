import { z } from "zod";

const assessmentProblemSchema = z.object({
	problemId: z.string().min(1, "problemId is required."),
	order: z.number().int().min(1, "Order must start at 1."),
	marks: z.coerce.number().int().min(1, "Marks must be at least 1.").max(1000),
});

const baseAssessmentFields = {
	title: z.string().trim().min(3, "Title must be at least 3 characters.").max(200),
	description: z.string().trim().max(5000).optional(),
	instructions: z.string().trim().max(5000).optional(),
	durationMinutes: z.coerce
		.number()
		.int()
		.min(5, "Duration must be at least 5 minutes.")
		.max(600, "Duration must be at most 10 hours."),
	totalMarks: z.coerce.number().int().min(1),
	passingMarks: z.coerce.number().int().min(0),
	maxAttempts: z.coerce.number().int().min(1).max(10).optional(),
	startAt: z.coerce.date().optional(),
	endAt: z.coerce.date().optional(),
	shuffleQuestions: z.boolean().optional(),
	showResultImmediately: z.boolean().optional(),
	allowReview: z.boolean().optional(),
};

const validateProblemsInvariants = (
	data: { problems?: { problemId: string; order: number; marks: number }[]; totalMarks?: number },
	ctx: z.RefinementCtx,
) => {
	if (!data.problems) return;

	const orders = data.problems.map((problem) => problem.order);
	if (new Set(orders).size !== orders.length) {
		ctx.addIssue({ code: "custom", message: "Problem order values must be unique.", path: ["problems"] });
	}

	const problemIds = data.problems.map((problem) => problem.problemId);
	if (new Set(problemIds).size !== problemIds.length) {
		ctx.addIssue({ code: "custom", message: "The same problem cannot be added twice.", path: ["problems"] });
	}

	if (data.totalMarks !== undefined) {
		const marksSum = data.problems.reduce((sum, problem) => sum + problem.marks, 0);
		if (marksSum !== data.totalMarks) {
			ctx.addIssue({
				code: "custom",
				message: `Sum of problem marks (${marksSum}) must equal totalMarks (${data.totalMarks}).`,
				path: ["totalMarks"],
			});
		}
	}
};

export const createAssessmentSchema = z
	.object({
		...baseAssessmentFields,
		problems: z.array(assessmentProblemSchema).min(1, "Add at least one problem."),
	})
	.superRefine((data, ctx) => {
		if (data.passingMarks > data.totalMarks) {
			ctx.addIssue({
				code: "custom",
				message: "Passing marks cannot exceed total marks.",
				path: ["passingMarks"],
			});
		}

		if (data.startAt && data.endAt && data.endAt <= data.startAt) {
			ctx.addIssue({ code: "custom", message: "endAt must be after startAt.", path: ["endAt"] });
		}

		validateProblemsInvariants(data, ctx);
	});

/**
 * If `problems` is sent without `totalMarks` in the same request, the
 * marks-sum-equals-totalMarks check can't be done here (we don't have the
 * assessment's existing totalMarks in scope) — assessment.service.ts
 * re-validates that against the DB value before writing.
 */
export const updateAssessmentSchema = z
	.object({
		title: z.string().trim().min(3).max(200).optional(),
		description: z.string().trim().max(5000).optional(),
		instructions: z.string().trim().max(5000).optional(),
		durationMinutes: z.coerce.number().int().min(5).max(600).optional(),
		totalMarks: z.coerce.number().int().min(1).optional(),
		passingMarks: z.coerce.number().int().min(0).optional(),
		maxAttempts: z.coerce.number().int().min(1).max(10).optional(),
		startAt: z.coerce.date().optional(),
		endAt: z.coerce.date().optional(),
		shuffleQuestions: z.boolean().optional(),
		showResultImmediately: z.boolean().optional(),
		allowReview: z.boolean().optional(),
		problems: z.array(assessmentProblemSchema).min(1, "Add at least one problem.").optional(),
	})
	.superRefine((data, ctx) => {
		if (data.passingMarks !== undefined && data.totalMarks !== undefined && data.passingMarks > data.totalMarks) {
			ctx.addIssue({
				code: "custom",
				message: "Passing marks cannot exceed total marks.",
				path: ["passingMarks"],
			});
		}

		if (data.startAt && data.endAt && data.endAt <= data.startAt) {
			ctx.addIssue({ code: "custom", message: "endAt must be after startAt.", path: ["endAt"] });
		}

		validateProblemsInvariants(data, ctx);
	});

export const assessmentValidation = {
	createAssessmentSchema,
	updateAssessmentSchema,
};