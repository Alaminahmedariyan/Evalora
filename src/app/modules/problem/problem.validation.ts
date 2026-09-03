import { z } from "zod";

const mcqOptionSchema = z.object({
	optionText: z.string().trim().min(1, "Option text is required.").max(500),
	isCorrect: z.boolean(),
	order: z.number().int().min(1, "Option order must start at 1."),
});

const testCaseSchema = z.object({
	input: z.string().max(5000).optional(),
	expectedOutput: z.string().trim().min(1, "Expected output is required.").max(5000),
	isSample: z.boolean().optional(),
	points: z.coerce.number().int().min(0).max(1000).optional(),
	timeLimitMs: z.coerce.number().int().positive().optional(),
	memoryLimitMb: z.coerce.number().int().positive().optional(),
});

const baseFields = {
	title: z.string().trim().min(3, "Title must be at least 3 characters.").max(200),
	description: z.string().trim().min(10, "Description must be at least 10 characters.").max(10000),
	difficulty: z.enum(["EASY", "MEDIUM", "HARD"]).optional(),
	defaultMarks: z.coerce.number().int().min(1, "Marks must be at least 1.").max(1000).optional(),
	isPublic: z.boolean().optional(),
};

const mcqCreateSchema = z.object({
	...baseFields,
	type: z.literal("MCQ"),
	mcqType: z.enum(["SINGLE_CHOICE", "MULTIPLE_CHOICE"]).default("SINGLE_CHOICE"),
	explanation: z.string().trim().max(2000).optional(),
	options: z
		.array(mcqOptionSchema)
		.min(2, "Provide at least 2 options.")
		.max(10, "At most 10 options are allowed."),
});

const codingCreateSchema = z.object({
	...baseFields,
	type: z.literal("CODING"),
	timeLimitSeconds: z.coerce.number().int().min(1).max(7200).optional(),
	testCases: z.array(testCaseSchema).min(1, "Provide at least 1 test case."),
});

const writtenCreateSchema = z.object({
	...baseFields,
	type: z.literal("WRITTEN"),
});

/**
 * The per-type shape (options required for MCQ, testCases for CODING) is
 * enforced by the discriminated union itself. The cross-field rules that
 * a union alone can't express — unique option order, at least one correct
 * option, single-choice having exactly one — are enforced in superRefine
 * below, which runs after the union has already picked a branch.
 */
export const createProblemSchema = z
	.discriminatedUnion("type", [mcqCreateSchema, codingCreateSchema, writtenCreateSchema])
	.superRefine((data, ctx) => {
		if (data.type !== "MCQ") return;

		const orders = data.options.map((option) => option.order);
		if (new Set(orders).size !== orders.length) {
			ctx.addIssue({
				code: "custom",
				message: "Option order values must be unique.",
				path: ["options"],
			});
		}

		const correctCount = data.options.filter((option) => option.isCorrect).length;

		if (correctCount === 0) {
			ctx.addIssue({
				code: "custom",
				message: "At least one option must be marked correct.",
				path: ["options"],
			});
		}

		if (data.mcqType === "SINGLE_CHOICE" && correctCount > 1) {
			ctx.addIssue({
				code: "custom",
				message: "SINGLE_CHOICE questions must have exactly one correct option.",
				path: ["options"],
			});
		}
	});

/**
 * `type` can't change after creation (see problem.interface.ts). Nested
 * `options`/`testCases`, when provided, fully replace the existing set —
 * see problem.service.ts#updateProblem for how that's done safely against
 * the onDelete: Restrict foreign keys from SubmissionAnswer/TestCaseResult.
 */
export const updateProblemSchema = z
	.object({
		title: z.string().trim().min(3).max(200).optional(),
		description: z.string().trim().min(10).max(10000).optional(),
		difficulty: z.enum(["EASY", "MEDIUM", "HARD"]).optional(),
		defaultMarks: z.coerce.number().int().min(1).max(1000).optional(),
		isPublic: z.boolean().optional(),
		timeLimitSeconds: z.coerce.number().int().min(1).max(7200).optional(),
		mcqType: z.enum(["SINGLE_CHOICE", "MULTIPLE_CHOICE"]).optional(),
		explanation: z.string().trim().max(2000).optional(),
		options: z.array(mcqOptionSchema).min(2).max(10).optional(),
		testCases: z.array(testCaseSchema).min(1).optional(),
	})
	.superRefine((data, ctx) => {
		if (!data.options) return;

		const orders = data.options.map((option) => option.order);
		if (new Set(orders).size !== orders.length) {
			ctx.addIssue({ code: "custom", message: "Option order values must be unique.", path: ["options"] });
		}

		if (!data.options.some((option) => option.isCorrect)) {
			ctx.addIssue({
				code: "custom",
				message: "At least one option must be marked correct.",
				path: ["options"],
			});
		}
	});

export const problemValidation = {
	createProblemSchema,
	updateProblemSchema,
};