/**
 * Shown to a CANDIDATE while taking an attempt. Deliberately hides:
 * - McqOption.isCorrect (would let them see the answer)
 * - McqProblem.explanation (reveals reasoning behind the correct answer)
 * - Non-sample TestCases entirely, and never exposes hidden expectedOutput
 * Recruiters/admins use PROBLEM_DETAIL_SELECT (problem.const.ts) instead,
 * which has none of these restrictions.
 */
export const ATTEMPT_PROBLEM_SELECT = {
	id: true,
	title: true,
	description: true,
	type: true,
	difficulty: true,
	defaultMarks: true,
	timeLimitSeconds: true,
	mcqProblem: {
		select: {
			id: true,
			type: true,
			options: {
				select: { id: true, optionText: true, order: true },
				orderBy: { order: "asc" },
			},
		},
	},
	testCases: {
		where: { isSample: true },
		select: { id: true, input: true, expectedOutput: true, isSample: true },
		orderBy: { id: "asc" },
	},
} as const;

export const ATTEMPT_DETAIL_SELECT = {
	id: true,
	assessmentId: true,
	candidateId: true,
	attemptNumber: true,
	status: true,
	startedAt: true,
	submittedAt: true,
	expiresAt: true,
	autoSubmittedAt: true,
	tabSwitchCount: true,
	createdAt: true,
	assessment: {
		select: {
			id: true,
			title: true,
			companyId: true,
			durationMinutes: true,
			totalMarks: true,
			passingMarks: true,
			shuffleQuestions: true,
			allowReview: true,
			showResultImmediately: true,
			assessmentProblems: {
				select: { id: true, order: true, marks: true, problem: { select: ATTEMPT_PROBLEM_SELECT } },
				orderBy: { order: "asc" },
			},
		},
	},
	submissions: {
		select: {
			id: true,
			problemId: true,
			answerText: true,
			code: true,
			language: true,
			status: true,
			submittedAt: true,
			answers: { select: { optionId: true } },
		},
	},
} as const;

/**
 * Recruiter/Admin grading view of a single submission — includes the
 * candidate's raw answer, existing evaluation, and (for CODING) per-test-
 * case results to grade against.
 */
export const SUBMISSION_GRADING_SELECT = {
	id: true,
	attemptId: true,
	problemId: true,
	answerText: true,
	code: true,
	language: true,
	status: true,
	submittedAt: true,
	problem: {
		select: {
			id: true,
			title: true,
			type: true,
			defaultMarks: true,
			testCases: {
				select: { id: true, input: true, expectedOutput: true, isSample: true, points: true },
			},
		},
	},
	answers: {
		select: { optionId: true, option: { select: { id: true, optionText: true, isCorrect: true } } },
	},
	testCaseResults: {
		select: { id: true, testCaseId: true, passed: true, actualOutput: true, points: true },
	},
	evaluation: {
		select: {
			id: true,
			score: true,
			maxScore: true,
			status: true,
			isAutoEvaluated: true,
			feedback: true,
			evaluatedAt: true,
			evaluatorId: true,
		},
	},
} as const;

export const RESULT_SELECT = {
	id: true,
	attemptId: true,
	assessmentId: true,
	totalScore: true,
	totalMarks: true,
	percentage: true,
	status: true,
	rank: true,
	evaluatedAt: true,
	createdAt: true,
} as const;