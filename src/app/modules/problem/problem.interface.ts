import type { Difficulty, McqType } from "../../../generated/prisma/enums";

export type McqOptionInput = {
	optionText: string;
	isCorrect: boolean;
	order: number;
};

export type TestCaseInput = {
	input?: string;
	expectedOutput: string;
	isSample?: boolean;
	points?: number;
	timeLimitMs?: number;
	memoryLimitMb?: number;
};

type BaseProblemFields = {
	title: string;
	description: string;
	difficulty?: Difficulty;
	defaultMarks?: number;
	isPublic?: boolean;
};

export type CreateProblemInput =
	| (BaseProblemFields & {
			type: "MCQ";
			mcqType?: McqType;
			explanation?: string;
			options: McqOptionInput[];
	  })
	| (BaseProblemFields & {
			type: "CODING";
			timeLimitSeconds?: number;
			testCases: TestCaseInput[];
	  })
	| (BaseProblemFields & { type: "WRITTEN" });

/**
 * `type` is intentionally excluded — switching a problem from MCQ to
 * CODING (or similar) after creation would orphan its nested data, so it's
 * treated as immutable. Create a new problem instead.
 */
export type UpdateProblemInput = Partial<{
	title: string;
	description: string;
	difficulty: Difficulty;
	defaultMarks: number;
	isPublic: boolean;
	timeLimitSeconds: number;
	mcqType: McqType;
	explanation: string;
	options: McqOptionInput[];
	testCases: TestCaseInput[];
}>;