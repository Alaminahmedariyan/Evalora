export const RESULT_LEADERBOARD_SELECT = {
	id: true,
	totalScore: true,
	totalMarks: true,
	percentage: true,
	status: true,
	rank: true,
	evaluatedAt: true,
	assessment: {
		select: { id: true, title: true, passingMarks: true },
	},
	attempt: {
		select: {
			id: true,
			attemptNumber: true,
			submittedAt: true,
			candidate: { select: { id: true, name: true, email: true } },
		},
	},
} as const;