import { StatusCodes } from "http-status-codes";

import type { Prisma } from "../../../generated/prisma/client";
import type { ProblemWhereInput } from "../../../generated/prisma/models/Problem";

import { prisma } from "../../../lib/prisma";
import { withTenantScope } from "../../../lib/prismaTenantScope";
import AppError from "../../errors/appError";
import { QueryBuilder } from "../../queryBuilder";
import { generateUniqueSlug } from "../../utils/generateUniqueSlug";

import { PROBLEM_DETAIL_SELECT, PROBLEM_LIST_SELECT } from "./problem.const";
import type {
    CreateProblemInput,
    UpdateProblemInput,
} from "./problem.interface";

const problemQueryBuilder = new QueryBuilder<
    Prisma.ProblemGetPayload<{ select: typeof PROBLEM_LIST_SELECT }>,
    ProblemWhereInput
>(prisma.problem, {
    searchableFields: ["title", "description"],
    filterableFields: {
        type: {
            type: "enum",
            enum: { MCQ: "MCQ", CODING: "CODING", WRITTEN: "WRITTEN" },
        },
        difficulty: {
            type: "enum",
            enum: { EASY: "EASY", MEDIUM: "MEDIUM", HARD: "HARD" },
        },
        isPublic: "boolean",
        createdAt: "date",
    },
    sortableFields: ["createdAt", "title", "defaultMarks"],
    selectableFields: Object.keys(PROBLEM_LIST_SELECT),
    softDelete: true,
    defaultSortField: "createdAt",
});

const createProblem = async (
    companyId: string,
    createdById: string,
    payload: CreateProblemInput,
) => {
    const slug = await generateUniqueSlug(payload.title, (candidate) =>
        prisma.problem
            .findUnique({
                where: { companyId_slug: { companyId, slug: candidate } },
            })
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
                        ...(payload.explanation !== undefined && {
                            explanation: payload.explanation,
                        }),
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
                ...(payload.timeLimitSeconds !== undefined && {
                    timeLimitSeconds: payload.timeLimitSeconds,
                }),
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
const getAllProblems = async (
    query: Record<string, unknown>,
    companyId?: string,
) => {
    // Pass empty object {} instead of undefined to satisfy exactOptionalPropertyTypes
    const tenantScope = withTenantScope({}, companyId) as ProblemWhereInput;
    return problemQueryBuilder.execute(query, tenantScope);
};

const getProblemById = async (id: string, companyId?: string) => {
    // tenant-scoped via withTenantScope
    const whereClause = withTenantScope({ id, deletedAt: null }, companyId) as ProblemWhereInput;

    const problem = await prisma.problem.findFirst({
        where: whereClause,
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
 */
const updateProblem = async (
    id: string,
    companyId: string,
    payload: UpdateProblemInput,
) => {
    // tenant-scoped via withTenantScope
    const whereClause = withTenantScope({ id, deletedAt: null }, companyId) as ProblemWhereInput;

    const existing = await prisma.problem.findFirst({
        where: whereClause,
    });

    if (!existing) {
        throw new AppError(StatusCodes.NOT_FOUND, "Problem not found.");
    }

    const { options, testCases, mcqType, explanation, ...topLevel } = payload;

    if (Object.keys(topLevel).length > 0) {
        await prisma.problem.update({ where: { id }, data: topLevel });
    }

    if (
        existing.type === "MCQ" &&
        (options || mcqType !== undefined || explanation !== undefined)
    ) {
        const mcqProblem = await prisma.mcqProblem.findUniqueOrThrow({
            where: { problemId: id },
        });

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
                        where: {
                            mcqProblemId_order: {
                                mcqProblemId: mcqProblem.id,
                                order: option.order,
                            },
                        },
                        update: {
                            optionText: option.optionText,
                            isCorrect: option.isCorrect,
                        },
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
        await prisma.testCase.createMany({
            data: testCases.map((testCase) => ({ problemId: id, ...testCase })),
        });
    }

    return getProblemById(id, companyId);
};

/**
 * Soft delete.
 */
const softDeleteProblem = async (id: string, companyId: string) => {
    // tenant-scoped via withTenantScope
    const whereClause = withTenantScope({ id, deletedAt: null }, companyId) as ProblemWhereInput;

    const existing = await prisma.problem.findFirst({
        where: whereClause,
    });

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

    await prisma.problem.update({
        where: { id },
        data: { deletedAt: new Date() },
    });

    return { message: "Problem deleted successfully." };
};

export const problemService = {
    createProblem,
    getAllProblems,
    getProblemById,
    updateProblem,
    softDeleteProblem,
};