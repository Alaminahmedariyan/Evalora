import { StatusCodes } from "http-status-codes";

import type { Prisma } from "../../../generated/prisma/client";
import type { ProblemWhereInput } from "../../../generated/prisma/models/Problem";

import { prisma } from "../../../lib/prisma";
import AppError from "../../errors/appError";
import { QueryBuilder } from "../../queryBuilder";
import { generateUniqueSlug } from "../../utils/generateUniqueSlug";

import { PROBLEM_DETAIL_SELECT, PROBLEM_LIST_SELECT } from "./problem.const";
import type { CreateProblemInput, UpdateProblemInput } from "./problem.interface";

const problemQueryBuilder = new QueryBuilder<
	Prisma.ProblemGetPayload<{ select: typeof PROBLEM_LIST_SELECT }>,
	ProblemWhereInput
>(prisma.problem, {
	searchableFields: ["title", "description"],
	filterableFields: {
		type: { type: "enum", enum: { MCQ: "MCQ", CODING: "CODING", WRITTEN: "WRITTEN" } },
		difficulty: { type: "enum", enum: { EASY: "EASY", MEDIUM: "MEDIUM", HARD: "HARD" } },
		isPublic: "boolean",
		createdAt: "date",
	},
	sortableFields: ["createdAt", "title", "defaultMarks"],
	selectableFields: Object.keys(PROBLEM_LIST_SELECT),
	softDelete: true,
	defaultSortField: "createdAt",
});

const createProblem = async (companyId: string, createdById: string, payload: CreateProblemInput) => {
	const slug = await generateUniqueSlug(payload.title, (candidate) =>
		prisma.problem
			.findUnique({ where: { companyId_slug: { companyId, slug: candidate } } })
			.then(Boolean),
	);

	const baseData = {
		title: payload.title,
		slug,
		description: payload.description,
		difficulty: payload.difficulty ?? "MEDIUM",
		defaultMarks: payload.defaultMarks ?? 10,
		isPublic: payload.isPublic ?? false,
		companyId,
		createdById,
	};

	if (payload.type === "MCQ") {
		return prisma.problem.create({
			data: {
				...baseData,
				type: "MCQ",
				mcqProblem: {
					create: {
						type: payload.mcqType ?? "SINGLE_CHOICE",
						...(payload.explanation !== undefined && { explanation: payload.explanation }),
						options: {
							create: payload.options.map((option) => ({
								optionText: option.optionText,
								isCorrect: option.isCorrect,
								order: option.order,
							})),
						},
					},
				},
			},
			select: PROBLEM_DETAIL_SELECT,
		});
	}

	if (payload.type === "CODING") {
		return prisma.problem.create({
			data: {
				...baseData,
				type: "CODING",
				...(payload.timeLimitSeconds !== undefined && { timeLimitSeconds: payload.timeLimitSeconds }),
				testCases: { create: payload.testCases },
			},
			select: PROBLEM_DETAIL_SELECT,
		});
	}

	return prisma.problem.create({
		data: { ...baseData, type: "WRITTEN" },
		select: PROBLEM_DETAIL_SELECT,
	});
};

/**
 * `companyId` undefined means "don't scope" — used for ADMIN, who can
 * browse every company's problem bank. RECRUITER always passes their own
 * companyId.
 */
const getAllProblems = async (query: Record<string, unknown>, companyId?: string) => {
	const tenantScope = companyId ? { companyId } : undefined;
	return problemQueryBuilder.execute(query, tenantScope);
};

const getProblemById = async (id: string, companyId?: string) => {
	const problem = await prisma.problem.findFirst({
		where: { id, deletedAt: null, ...(companyId && { companyId }) },
		select: PROBLEM_DETAIL_SELECT,
	});

	if (!problem) {
		throw new AppError(StatusCodes.NOT_FOUND, "Problem not found.");
	}

	return problem;
};

/**
 * Updates top-level fields, and optionally fully replaces the nested
 * options/testCases set.
 *
 * IMPORTANT — this mirrors a real bug found (and fixed) in this project's
 * seed script: `SubmissionAnswer.optionId` and `TestCaseResult.testCaseId`
 * both reference their parent with `onDelete: Restrict`. A naive
 * delete-then-recreate here would throw a foreign key violation the moment
 * any candidate has actually answered/been graded against this problem.
 *
 * - MCQ options: upserted per-item on the natural (mcqProblemId, order)
 *   key, so each option's id — and therefore any existing SubmissionAnswer
 *   pointing at it — stays valid across edits.
 * - Coding test cases: there's no natural per-item key to upsert against,
 *   so once any TestCaseResult exists for this problem, test cases become
 *   immutable and this throws a clear 409 instead of crashing on delete.
 */
const updateProblem = async (id: string, companyId: string, payload: UpdateProblemInput) => {
	const existing = await prisma.problem.findFirst({ where: { id, companyId, deletedAt: null } });

	if (!existing) {
		throw new AppError(StatusCodes.NOT_FOUND, "Problem not found.");
	}

	const { options, testCases, mcqType, explanation, ...topLevel } = payload;

	if (Object.keys(topLevel).length > 0) {
		await prisma.problem.update({ where: { id }, data: topLevel });
	}

	if (existing.type === "MCQ" && (options || mcqType !== undefined || explanation !== undefined)) {
		const mcqProblem = await prisma.mcqProblem.findUniqueOrThrow({ where: { problemId: id } });

		if (mcqType !== undefined || explanation !== undefined) {
			await prisma.mcqProblem.update({
				where: { id: mcqProblem.id },
				data: {
					...(mcqType !== undefined && { type: mcqType }),
					...(explanation !== undefined && { explanation }),
				},
			});
		}

		if (options) {
			await prisma.$transaction(
				options.map((option) =>
					prisma.mcqOption.upsert({
						where: { mcqProblemId_order: { mcqProblemId: mcqProblem.id, order: option.order } },
						update: { optionText: option.optionText, isCorrect: option.isCorrect },
						create: { mcqProblemId: mcqProblem.id, ...option },
					}),
				),
			);
		}
	}

	if (existing.type === "CODING" && testCases) {
		const hasGradedResult = await prisma.testCaseResult.findFirst({
			where: { testCase: { problemId: id } },
		});

		if (hasGradedResult) {
			throw new AppError(
				StatusCodes.CONFLICT,
				"This problem's test cases can't be changed after candidates have been graded against them. Create a new problem instead.",
			);
		}

		await prisma.testCase.deleteMany({ where: { problemId: id } });
		await prisma.testCase.createMany({ data: testCases.map((testCase) => ({ problemId: id, ...testCase })) });
	}

	return getProblemById(id, companyId);
};

/**
 * Soft delete. Blocked while the problem is still attached to a
 * PUBLISHED/ACTIVE assessment — pulling a problem out from under a live
 * assessment would silently change candidates' total marks mid-flight.
 */
const softDeleteProblem = async (id: string, companyId: string) => {
	const existing = await prisma.problem.findFirst({ where: { id, companyId, deletedAt: null } });

	if (!existing) {
		throw new AppError(StatusCodes.NOT_FOUND, "Problem not found.");
	}

	const usedInLiveAssessment = await prisma.assessmentProblem.findFirst({
		where: {
			problemId: id,
			assessment: { status: { in: ["PUBLISHED", "ACTIVE"] }, deletedAt: null },
		},
	});

	if (usedInLiveAssessment) {
		throw new AppError(
			StatusCodes.CONFLICT,
			"This problem is part of a published assessment and can't be deleted. Remove it from the assessment first.",
		);
	}

	await prisma.problem.update({ where: { id }, data: { deletedAt: new Date() } });

	return { message: "Problem deleted successfully." };
};

export const problemService = {
	createProblem,
	getAllProblems,
	getProblemById,
	updateProblem,
	softDeleteProblem,
};