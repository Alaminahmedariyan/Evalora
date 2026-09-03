import { StatusCodes } from "http-status-codes";

import type { Prisma } from "../../../generated/prisma/client";
import type { CandidateProfileWhereInput } from "../../../generated/prisma/models/CandidateProfile";

import { prisma } from "../../../lib/prisma";
import AppError from "../../errors/appError";
import { QueryBuilder } from "../../queryBuilder";
import { uploadFileToCloudinary } from "../../utils/fileUploader";

import { CANDIDATE_DETAIL_SELECT } from "./candidate.const";
import type { UpsertCandidateProfileInput } from "./candidate.interface";

/**
 * Always scoped to profiles whose owning User is still active — a
 * soft-deleted user's candidate profile should never surface in browse/
 * search results for recruiters, even though the CandidateProfile row
 * itself isn't the one marked deleted.
 */
const activeUserScope: Prisma.CandidateProfileWhereInput = { user: { deletedAt: null } };

const candidateQueryBuilder = new QueryBuilder<
	Prisma.CandidateProfileGetPayload<{ select: typeof CANDIDATE_DETAIL_SELECT }>,
	CandidateProfileWhereInput
>(prisma.candidateProfile, {
	searchableFields: ["headline", "bio", "location"],
	filterableFields: {
		location: "string",
		experienceYears: "number",
		createdAt: "date",
	},
	sortableFields: ["createdAt", "experienceYears"],
	selectableFields: Object.keys(CANDIDATE_DETAIL_SELECT),
	softDelete: true,
	defaultSortField: "createdAt",
});

/**
 * Create-or-update the caller's own profile. CandidateProfile is 1-1 with
 * User (userId is @unique), so this is a plain upsert — no separate
 * "does it already exist" branch needed, unlike Company where creation
 * also has to promote the user's role.
 */
const upsertMyProfile = async (
	userId: string,
	payload: UpsertCandidateProfileInput,
	resumeFile?: Express.Multer.File,
) => {
	let resumeUrl: string | undefined;

	if (resumeFile) {
		const uploaded = await uploadFileToCloudinary(resumeFile.buffer, resumeFile.originalname, "resumes");
		resumeUrl = uploaded.secure_url;
	}

	return prisma.candidateProfile.upsert({
		where: { userId },
		update: { ...payload, ...(resumeUrl && { resumeUrl }), deletedAt: null },
		create: { userId, ...payload, ...(resumeUrl && { resumeUrl }) },
		select: CANDIDATE_DETAIL_SELECT,
	});
};

const getMyProfile = async (userId: string) => {
	const profile = await prisma.candidateProfile.findFirst({
		where: { userId, deletedAt: null },
		select: CANDIDATE_DETAIL_SELECT,
	});

	if (!profile) {
		throw new AppError(
			StatusCodes.NOT_FOUND,
			"You haven't completed your candidate profile yet.",
		);
	}

	return profile;
};

/**
 * Used by recruiters/admins viewing a specific candidate — e.g. before
 * sending an invitation, or while reviewing a submitted attempt.
 */
const getCandidateProfileById = async (id: string) => {
	const profile = await prisma.candidateProfile.findFirst({
		where: { id, deletedAt: null, ...activeUserScope },
		select: CANDIDATE_DETAIL_SELECT,
	});

	if (!profile) {
		throw new AppError(StatusCodes.NOT_FOUND, "Candidate profile not found.");
	}

	return profile;
};

/**
 * Browse/search candidates. Route-gated to RECRUITER/ADMIN — there's no
 * public candidate directory in this platform.
 */
const getAllCandidates = async (query: Record<string, unknown>) => {
	return candidateQueryBuilder.execute(query, activeUserScope);
};

export const candidateService = {
	upsertMyProfile,
	getMyProfile,
	getCandidateProfileById,
	getAllCandidates,
};