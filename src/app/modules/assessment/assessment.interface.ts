export type AssessmentProblemInput = {
	problemId: string;
	order: number;
	marks: number;
};

export type CreateAssessmentInput = {
	title: string;
	description?: string;
	instructions?: string;
	durationMinutes: number;
	totalMarks: number;
	passingMarks: number;
	maxAttempts?: number;
	startAt?: Date;
	endAt?: Date;
	shuffleQuestions?: boolean;
	showResultImmediately?: boolean;
	allowReview?: boolean;
	problems: AssessmentProblemInput[];
};

/**
 * Only meaningful while the assessment is still DRAFT — see
 * assessment.service.ts#updateAssessment. `problems`, when provided, fully
 * replaces the existing AssessmentProblem set (safe to delete+recreate;
 * it's a pure join table with nothing pointing at it via onDelete: Restrict,
 * unlike McqOption/TestCase — see problem.service.ts for that contrast).
 */
export type UpdateAssessmentInput = Partial<Omit<CreateAssessmentInput, "problems">> & {
	problems?: AssessmentProblemInput[];
};