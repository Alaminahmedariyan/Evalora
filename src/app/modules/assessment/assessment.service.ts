import { StatusCodes } from "http-status-codes";

import type { Prisma } from "../../../generated/prisma/client";
import type { AssessmentWhereInput } from "../../../generated/prisma/models/Assessment";

import { prisma } from "../../../lib/prisma";
import AppError from "../../errors/appError";
import { QueryBuilder } from "../../queryBuilder";
import { generateUniqueSlug } from "../../utils/generateUniqueSlug";

import {
	ASSESSMENT_DETAIL_SELECT,
	ASSESSMENT_LIST_SELECT,
} from "./assessment.const";
import type {
	CreateAssessmentInput,
	UpdateAssessmentInput,
} from "./assessment.interface";

const assessmentQueryBuilder = new QueryBuilder<
	Prisma.AssessmentGetPayload<{ select: typeof ASSESSMENT_LIST_SELECT }>,
	AssessmentWhereInput
>(prisma.assessment, {
	searchableFields: ["title", "description"],
	filterableFields: {
		status: {
			type: "enum",
			enum: {
				DRAFT: "DRAFT",
				PUBLISHED: "PUBLISHED",
				ACTIVE: "ACTIVE",
				CLOSED: "CLOSED",
				ARCHIVED: "ARCHIVED",
			},
		},
		createdAt: "date",
	},
	sortableFields: ["createdAt", "title", "startAt"],
	selectableFields: Object.keys(ASSESSMENT_LIST_SELECT),
	softDelete: true,
	defaultSortField: "createdAt",
});

const assertProblemsBelongToCompany = async (
	companyId: string,
	problemIds: string[],
) => {
	const found = await prisma.problem.findMany({
		where: { id: { in: problemIds }, companyId, deletedAt: null },
		select: { id: true },
	});

	if (found.length !== new Set(problemIds).size) {
		throw new AppError(
			StatusCodes.BAD_REQUEST,
			"One or more problems were not found in your company's problem bank.",
		);
	}
};

const createAssessment = async (
	companyId: string,
	createdById: string,
	payload: CreateAssessmentInput,
) => {
	await assertProblemsBelongToCompany(
		companyId,
		payload.problems.map((problem) => problem.problemId),
	);

	const slug = await generateUniqueSlug(payload.title, (candidate) =>
		prisma.assessment
			.findUnique({
				where: {
					companyId_slug_version: { companyId, slug: candidate, version: 1 },
				},
			})
			.then(Boolean),
	);

	return prisma.assessment.create({
		data: {
			title: payload.title,
			slug,
			...(payload.description !== undefined && {
				description: payload.description,
			}),
			...(payload.instructions !== undefined && {
				instructions: payload.instructions,
			}),
			durationMinutes: payload.durationMinutes,
			totalMarks: payload.totalMarks,
			passingMarks: payload.passingMarks,
			maxAttempts: payload.maxAttempts ?? 1,
			...(payload.startAt !== undefined && { startAt: payload.startAt }),
			...(payload.endAt !== undefined && { endAt: payload.endAt }),
			shuffleQuestions: payload.shuffleQuestions ?? false,
			showResultImmediately: payload.showResultImmediately ?? false,
			allowReview: payload.allowReview ?? true,
			companyId,
			createdById,
			assessmentProblems: {
				create: payload.problems.map((problem) => ({
					problemId: problem.problemId,
					order: problem.order,
					marks: problem.marks,
				})),
			},
		},
		select: ASSESSMENT_DETAIL_SELECT,
	});
};

const getAllAssessments = async (
	query: Record<string, unknown>,
	companyId?: string,
) => {
	const tenantScope = companyId ? { companyId } : undefined;
	return assessmentQueryBuilder.execute(query, tenantScope);
};

const getAssessmentById = async (id: string, companyId?: string) => {
	const assessment = await prisma.assessment.findFirst({
		where: { id, deletedAt: null, ...(companyId && { companyId }) },
		select: ASSESSMENT_DETAIL_SELECT,
	});

	if (!assessment) {
		throw new AppError(StatusCodes.NOT_FOUND, "Assessment not found.");
	}

	return assessment;
};

const updateAssessment = async (
	id: string,
	companyId: string,
	payload: UpdateAssessmentInput,
) => {
	const existing = await prisma.assessment.findFirst({
		where: { id, companyId, deletedAt: null },
	});

	if (!existing) {
		throw new AppError(StatusCodes.NOT_FOUND, "Assessment not found.");
	}

	if (existing.status !== "DRAFT") {
		throw new AppError(
			StatusCodes.CONFLICT,
			"Only DRAFT assessments can be edited. Close this one and create a new assessment instead.",
		);
	}

	const effectiveTotalMarks = payload.totalMarks ?? existing.totalMarks;

	if (payload.problems) {
		await assertProblemsBelongToCompany(
			companyId,
			payload.problems.map((problem) => problem.problemId),
		);

		const marksSum = payload.problems.reduce(
			(sum, problem) => sum + problem.marks,
			0,
		);
		if (marksSum !== effectiveTotalMarks) {
			throw new AppError(
				StatusCodes.BAD_REQUEST,
				`Sum of problem marks (${marksSum}) must equal totalMarks (${effectiveTotalMarks}).`,
			);
		}
	}

	const effectivePassingMarks = payload.passingMarks ?? existing.passingMarks;
	if (effectivePassingMarks > effectiveTotalMarks) {
		throw new AppError(
			StatusCodes.BAD_REQUEST,
			"Passing marks cannot exceed total marks.",
		);
	}

	const { problems, ...topLevel } = payload;

	await prisma.$transaction(async (tx) => {
		if (Object.keys(topLevel).length > 0) {
			await tx.assessment.update({ where: { id }, data: topLevel });
		}

		if (problems) {
			await tx.assessmentProblem.deleteMany({ where: { assessmentId: id } });
			await tx.assessmentProblem.createMany({
				data: problems.map((problem) => ({
					assessmentId: id,
					problemId: problem.problemId,
					order: problem.order,
					marks: problem.marks,
				})),
			});
		}
	});

	return getAssessmentById(id, companyId);
};

const publishAssessment = async (id: string, companyId: string) => {
	const assessment = await prisma.assessment.findFirst({
		where: { id, companyId, deletedAt: null },
		include: { assessmentProblems: true },
	});

	if (!assessment) {
		throw new AppError(StatusCodes.NOT_FOUND, "Assessment not found.");
	}

	if (assessment.status === "PUBLISHED" || assessment.status === "ACTIVE") {
		return assessment;
	}

	if (assessment.status !== "DRAFT") {
		throw new AppError(
			StatusCodes.CONFLICT,
			`Cannot publish an assessment with status ${assessment.status}.`,
		);
	}

	if (assessment.assessmentProblems.length === 0) {
		throw new AppError(
			StatusCodes.BAD_REQUEST,
			"Add at least one problem before publishing.",
		);
	}

	const marksSum = assessment.assessmentProblems.reduce(
		(sum, ap) => sum + ap.marks,
		0,
	);
	if (marksSum !== assessment.totalMarks) {
		throw new AppError(
			StatusCodes.BAD_REQUEST,
			`Sum of problem marks (${marksSum}) does not match totalMarks (${assessment.totalMarks}).`,
		);
	}

	return prisma.assessment.update({
		where: { id },
		data: { status: "PUBLISHED", publishedAt: new Date() },
		select: ASSESSMENT_DETAIL_SELECT,
	});
};

const closeAssessment = async (id: string, companyId: string) => {
	const assessment = await prisma.assessment.findFirst({
		where: { id, companyId, deletedAt: null },
	});

	if (!assessment) {
		throw new AppError(StatusCodes.NOT_FOUND, "Assessment not found.");
	}

	if (assessment.status !== "PUBLISHED" && assessment.status !== "ACTIVE") {
		throw new AppError(
			StatusCodes.CONFLICT,
			`Cannot close an assessment with status ${assessment.status}.`,
		);
	}

	return prisma.assessment.update({
		where: { id },
		data: { status: "CLOSED" },
		select: ASSESSMENT_DETAIL_SELECT,
	});
};

const softDeleteAssessment = async (id: string, companyId: string) => {
	const assessment = await prisma.assessment.findFirst({
		where: { id, companyId, deletedAt: null },
	});

	if (!assessment) {
		throw new AppError(StatusCodes.NOT_FOUND, "Assessment not found.");
	}

	if (assessment.status !== "DRAFT") {
		throw new AppError(
			StatusCodes.CONFLICT,
			"Only DRAFT assessments can be deleted. Close a published assessment instead.",
		);
	}

	await prisma.assessment.update({
		where: { id },
		data: { deletedAt: new Date() },
	});

	return { message: "Assessment deleted successfully." };
};

const createAssessmentVersion = async (id: string, companyId: string) => {
	const existing = await prisma.assessment.findFirst({
		where: { id, companyId, deletedAt: null },
		include: { assessmentProblems: { include: { problem: true } } },
	});

	if (!existing) {
		throw new AppError(StatusCodes.NOT_FOUND, "Assessment not found.");
	}

	if (existing.status === "DRAFT") {
		throw new AppError(
			StatusCodes.CONFLICT,
			"Only published or closed assessments can be versioned.",
		);
	}

	const result = await prisma.$transaction(async (tx) => {
		const maxVersionResult = await tx.assessment.aggregate({
			where: {
				companyId,
				slug: existing.slug,
				deletedAt: null,
			},
			_max: { version: true },
		});

		const nextVersion = (maxVersionResult._max.version || existing.version) + 1;

		await tx.assessment.updateMany({
			where: {
				companyId,
				slug: existing.slug,
				isLatestVersion: true,
				deletedAt: null,
			},
			data: { isLatestVersion: false },
		});

		const newAssessment = await tx.assessment.create({
			data: {
				title: existing.title,
				slug: existing.slug,
				description: existing.description,
				instructions: existing.instructions,
				durationMinutes: existing.durationMinutes,
				totalMarks: existing.totalMarks,
				passingMarks: existing.passingMarks,
				maxAttempts: existing.maxAttempts,
				startAt: existing.startAt,
				endAt: existing.endAt,
				shuffleQuestions: existing.shuffleQuestions,
				showResultImmediately: existing.showResultImmediately,
				allowReview: existing.allowReview,
				version: nextVersion,
				isLatestVersion: true,
				parentAssessmentId: existing.id,
				companyId,
				createdById: existing.createdById,
				status: "DRAFT",
				assessmentProblems: {
					create: existing.assessmentProblems.map((ap) => ({
						problemId: ap.problemId,
						order: ap.order,
						marks: ap.marks,
					})),
				},
			},
			select: ASSESSMENT_DETAIL_SELECT,
		});

		return newAssessment;
	});

	return result;
};

const getAssessmentVersions = async (id: string, companyId?: string) => {
	const existing = await prisma.assessment.findFirst({
		where: { id, deletedAt: null, ...(companyId && { companyId }) },
		select: { id: true, companyId: true, slug: true },
	});

	if (!existing) {
		throw new AppError(StatusCodes.NOT_FOUND, "Assessment not found.");
	}

	const versions = await prisma.assessment.findMany({
		where: {
			companyId: existing.companyId,
			slug: existing.slug,
			deletedAt: null,
		},
		select: {
			id: true,
			title: true,
			slug: true,
			status: true,
			version: true,
			isLatestVersion: true,
			createdAt: true,
			updatedAt: true,
		},
		orderBy: { version: "desc" },
	});

	return versions;
};

const restoreAssessmentVersion = async (id: string, companyId: string) => {
	const target = await prisma.assessment.findFirst({
		where: { id, companyId, deletedAt: null },
		include: { assessmentProblems: { include: { problem: true } } },
	});

	if (!target) {
		throw new AppError(StatusCodes.NOT_FOUND, "Assessment version not found.");
	}

	if (target.isLatestVersion && target.status !== "DRAFT") {
		throw new AppError(
			StatusCodes.CONFLICT,
			"This is already the latest published version.",
		);
	}

	const restored = await prisma.$transaction(async (tx) => {
		const latest = await tx.assessment.findFirst({
			where: {
				companyId,
				slug: target.slug,
				isLatestVersion: true,
				deletedAt: null,
			},
			orderBy: { version: "desc" },
			include: { assessmentProblems: true },
		});

		if (!latest) {
			throw new AppError(
				StatusCodes.NOT_FOUND,
				"Latest assessment version not found.",
			);
		}

		const nextVersion = latest.version + 1;

		await tx.assessment.updateMany({
			where: { companyId, slug: target.slug, isLatestVersion: true },
			data: { isLatestVersion: false },
		});

		return tx.assessment.create({
			data: {
				title: target.title,
				slug: target.slug,
				description: target.description,
				instructions: target.instructions,
				durationMinutes: target.durationMinutes,
				totalMarks: target.totalMarks,
				passingMarks: target.passingMarks,
				maxAttempts: target.maxAttempts,
				startAt: target.startAt,
				endAt: target.endAt,
				shuffleQuestions: target.shuffleQuestions,
				showResultImmediately: target.showResultImmediately,
				allowReview: target.allowReview,
				version: nextVersion,
				isLatestVersion: true,
				parentAssessmentId: target.id,
				companyId,
				createdById: target.createdById,
				status: "DRAFT",
				assessmentProblems: {
					create: target.assessmentProblems.map((ap) => ({
						problemId: ap.problemId,
						order: ap.order,
						marks: ap.marks,
					})),
				},
			},
			select: ASSESSMENT_DETAIL_SELECT,
		});
	});

	return restored;
};

export const assessmentService = {
	createAssessment,
	getAllAssessments,
	getAssessmentById,
	updateAssessment,
	publishAssessment,
	closeAssessment,
	softDeleteAssessment,
	createAssessmentVersion,
	getAssessmentVersions,
	restoreAssessmentVersion,
};
