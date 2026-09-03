export const ASSESSMENT_DETAIL_SELECT = {
	id: true,
	title: true,
	slug: true,
	description: true,
	instructions: true,
	durationMinutes: true,
	totalMarks: true,
	passingMarks: true,
	maxAttempts: true,
	status: true,
	startAt: true,
	endAt: true,
	publishedAt: true,
	shuffleQuestions: true,
	showResultImmediately: true,
	allowReview: true,
	version: true,
	isLatestVersion: true,
	companyId: true,
	createdById: true,
	createdAt: true,
	updatedAt: true,
	assessmentProblems: {
		select: {
			id: true,
			order: true,
			marks: true,
			problem: {
				select: { id: true, title: true, type: true, difficulty: true, defaultMarks: true },
			},
		},
		orderBy: { order: "asc" },
	},
} as const;

/**
 * Lean shape for browse/search — no nested problem list, so listing many
 * assessments doesn't ship every attached problem's details.
 */
export const ASSESSMENT_LIST_SELECT = {
	id: true,
	title: true,
	slug: true,
	status: true,
	durationMinutes: true,
	totalMarks: true,
	passingMarks: true,
	maxAttempts: true,
	startAt: true,
	endAt: true,
	publishedAt: true,
	createdAt: true,
} as const;