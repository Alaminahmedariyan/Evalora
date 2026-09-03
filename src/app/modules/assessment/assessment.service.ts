import { StatusCodes } from "http-status-codes";

import type { Prisma } from "../../../generated/prisma/client";
import type { AssessmentWhereInput } from "../../../generated/prisma/models/Assessment";

import { prisma } from "../../../lib/prisma";
import AppError from "../../errors/appError";
import { QueryBuilder } from "../../queryBuilder";
import { generateUniqueSlug } from "../../utils/generateUniqueSlug";

import { ASSESSMENT_DETAIL_SELECT, ASSESSMENT_LIST_SELECT } from "./assessment.const";
import type { CreateAssessmentInput, UpdateAssessmentInput } from "./assessment.interface";

const assessmentQueryBuilder = new QueryBuilder<
	Prisma.AssessmentGetPayload<{ select: typeof ASSESSMENT_LIST_SELECT }>,
	AssessmentWhereInput
>(prisma.assessment, {
	searchableFields: ["title", "description"],
	filterableFields: {
		status: {
			type: "enum",
			enum: { DRAFT: "DRAFT", PUBLISHED: "PUBLISHED", ACTIVE: "ACTIVE", CLOSED: "CLOSED", ARCHIVED: "ARCHIVED" },
		},
		createdAt: "date",
	},
	sortableFields: ["createdAt", "title", "startAt"],
	selectableFields: Object.keys(ASSESSMENT_LIST_SELECT),
	softDelete: true,
	defaultSortField: "createdAt",
});

/**
 * Every referenced problemId must exist, belong to this company, and not
 * be soft-deleted. The schema comment on Problem explicitly calls this out
 * as an application-layer responsibility — this is that check.
 */
const assertProblemsBelongToCompany = async (companyId: string, problemIds: string[]) => {
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

const createAssessment = async (companyId: string, createdById: string, payload: CreateAssessmentInput) => {
	await assertProblemsBelongToCompany(
		companyId,
		payload.problems.map((problem) => problem.problemId),
	);

	const slug = await generateUniqueSlug(payload.title, (candidate) =>
		prisma.assessment
			.findUnique({ where: { companyId_slug_version: { companyId, slug: candidate, version: 1 } } })
			.then(Boolean),
	);

	return prisma.assessment.create({
		data: {
			title: payload.title,
			slug,
			description: payload.description,
			instructions: payload.instructions,
			durationMinutes: payload.durationMinutes,
			totalMarks: payload.totalMarks,
			passingMarks: payload.passingMarks,
			maxAttempts: payload.maxAttempts ?? 1,
			startAt: payload.startAt,
			endAt: payload.endAt,
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

/** `companyId` undefined means unscoped — ADMIN browsing across companies. */
const getAllAssessments = async (query: Record<string, unknown>, companyId?: string) => {
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

/**
 * Only DRAFT assessments can be edited. Once PUBLISHED, candidates may
 * already hold invitations or be mid-attempt against a specific
 * duration/marks/problem set — silently changing those under them would
 * corrupt already-issued invitations and in-progress attempts. The schema
 * already has `version`/`parentAssessmentId`/`isLatestVersion` fields for
 * "create a new version of a published assessment" — wiring that up is a
 * natural follow-on if edit-after-publish is ever needed; out of scope
 * here.
 */
const updateAssessment = async (id: string, companyId: string, payload: UpdateAssessmentInput) => {
	const existing = await prisma.assessment.findFirst({ where: { id, companyId, deletedAt: null } });

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

		const marksSum = payload.problems.reduce((sum, problem) => sum + problem.marks, 0);
		if (marksSum !== effectiveTotalMarks) {
			throw new AppError(
				StatusCodes.BAD_REQUEST,
				`Sum of problem marks (${marksSum}) must equal totalMarks (${effectiveTotalMarks}).`,
			);
		}
	}

	const effectivePassingMarks = payload.passingMarks ?? existing.passingMarks;
	if (effectivePassingMarks > effectiveTotalMarks) {
		throw new AppError(StatusCodes.BAD_REQUEST, "Passing marks cannot exceed total marks.");
	}

	const { problems, ...topLevel } = payload;

	await prisma.$transaction(async (tx) => {
		if (Object.keys(topLevel).length > 0) {
			await tx.assessment.update({ where: { id }, data: topLevel });
		}

		if (problems) {
			// Safe to fully resync — AssessmentProblem is a pure join table;
			// nothing references it via onDelete: Restrict (contrast with
			// McqOption/TestCase in problem.service.ts).
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

/**
 * DRAFT -> PUBLISHED. Once published, candidates can be invited and start
 * attempts against it.
 */
const publishAssessment = async (id: string, companyId: string) => {
	const assessment = await prisma.assessment.findFirst({
		where: { id, companyId, deletedAt: null },
		include: { assessmentProblems: true },
	});

	if (!assessment) {
		throw new AppError(StatusCodes.NOT_FOUND, "Assessment not found.");
	}

	if (assessment.status !== "DRAFT") {
		throw new AppError(StatusCodes.CONFLICT, `Cannot publish an assessment with status ${assessment.status}.`);
	}

	if (assessment.assessmentProblems.length === 0) {
		throw new AppError(StatusCodes.BAD_REQUEST, "Add at least one problem before publishing.");
	}

	const marksSum = assessment.assessmentProblems.reduce((sum, ap) => sum + ap.marks, 0);
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

/**
 * PUBLISHED/ACTIVE -> CLOSED. Stops new attempts from starting; existing
 * in-progress attempts are left alone (they're handled by their own
 * expiresAt, not by the assessment's status) — see the Attempt module.
 */
const closeAssessment = async (id: string, companyId: string) => {
	const assessment = await prisma.assessment.findFirst({ where: { id, companyId, deletedAt: null } });

	if (!assessment) {
		throw new AppError(StatusCodes.NOT_FOUND, "Assessment not found.");
	}

	if (assessment.status !== "PUBLISHED" && assessment.status !== "ACTIVE") {
		throw new AppError(StatusCodes.CONFLICT, `Cannot close an assessment with status ${assessment.status}.`);
	}

	return prisma.assessment.update({
		where: { id },
		data: { status: "CLOSED" },
		select: ASSESSMENT_DETAIL_SELECT,
	});
};

/** Only DRAFT assessments can be deleted — published ones must be closed instead. */
const softDeleteAssessment = async (id: string, companyId: string) => {
	const assessment = await prisma.assessment.findFirst({ where: { id, companyId, deletedAt: null } });

	if (!assessment) {
		throw new AppError(StatusCodes.NOT_FOUND, "Assessment not found.");
	}

	if (assessment.status !== "DRAFT") {
		throw new AppError(
			StatusCodes.CONFLICT,
			"Only DRAFT assessments can be deleted. Close a published assessment instead.",
		);
	}

	await prisma.assessment.update({ where: { id }, data: { deletedAt: new Date() } });

	return { message: "Assessment deleted successfully." };
};

export const assessmentService = {
	createAssessment,
	getAllAssessments,
	getAssessmentById,
	updateAssessment,
	publishAssessment,
	closeAssessment,
	softDeleteAssessment,
};