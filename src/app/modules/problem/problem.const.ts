/**
 * Full detail including nested MCQ options / test cases — used for single-
 * problem view and immediately after create/update.
 */
export const PROBLEM_DETAIL_SELECT = {
	id: true,
	title: true,
	slug: true,
	description: true,
	type: true,
	difficulty: true,
	defaultMarks: true,
	timeLimitSeconds: true,
	isPublic: true,
	companyId: true,
	createdById: true,
	createdAt: true,
	updatedAt: true,
	mcqProblem: {
		select: {
			id: true,
			type: true,
			explanation: true,
			options: {
				select: { id: true, optionText: true, isCorrect: true, order: true },
				orderBy: { order: "asc" },
			},
		},
	},
	testCases: {
		select: {
			id: true,
			input: true,
			expectedOutput: true,
			isSample: true,
			points: true,
			timeLimitMs: true,
			memoryLimitMb: true,
		},
		orderBy: { id: "asc" },
	},
} as const;

/**
 * Lean shape for browse/search — no nested options/test cases, so listing
 * a company's whole problem bank doesn't ship megabytes of test data.
 */
export const PROBLEM_LIST_SELECT = {
	id: true,
	title: true,
	slug: true,
	type: true,
	difficulty: true,
	defaultMarks: true,
	isPublic: true,
	createdAt: true,
} as const;