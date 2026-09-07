export type ResultResponse = {
	id: string;
	attemptId: string;
	assessmentId: string;
	totalScore: number;
	totalMarks: number;
	percentage: number;
	status: string;
	rank: number | null;
	evaluatedAt: Date | null;
	createdAt: Date;
	updatedAt: Date;
};
