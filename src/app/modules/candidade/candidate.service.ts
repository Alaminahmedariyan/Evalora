import { StatusCodes } from "http-status-codes";

import type { CandidateProfileWhereInput } from "../../../generated/prisma/models/CandidateProfile";

import { prisma } from "../../../lib/prisma";
import AppError from "../../errors/appError";
import { QueryBuilder } from "../../queryBuilder";
import type { PrismaDelegate } from "../../queryBuilder/types";
import { uploadFileToCloudinary } from "../../utils/fileUploader";

import type { UpsertCandidateProfileInput } from "./candidate.interface";
import { CANDIDATE_DETAIL_SELECT } from "./candidate.const";

/**
 * Prisma 7's `prisma-client` generator doesn't expose a `XGetPayload`
 * helper, so the result shape is derived manually from CANDIDATE_DETAIL_SELECT.
 * The delegate is also cast to PrismaDelegate<T> because Prisma 7's
 * generated delegate types don't structurally satisfy QueryBuilder's
 * simplified PrismaDelegate interface once the select shape includes a
 * nested relation.
 */
type CandidateDetailResult = {
    id: string;
    headline: string | null;
    bio: string | null;
    phone: string | null;
    location: string | null;
    resumeUrl: string | null;
    linkedinUrl: string | null;
    githubUrl: string | null;
    portfolioUrl: string | null;
    skills: unknown;
    experienceYears: number | null;
    createdAt: Date;
    updatedAt: Date;
    user: {
        id: string;
        name: string;
        email: string;
        image: string | null;
    };
};

const candidateQueryBuilder = new QueryBuilder<CandidateDetailResult, CandidateProfileWhereInput>(
    prisma.candidateProfile as unknown as PrismaDelegate<CandidateDetailResult, CandidateProfileWhereInput>,
    {
        searchableFields: ["headline", "location", "phone"],
        filterableFields: {
            experienceYears: "number",
            createdAt: "date",
        },
        sortableFields: ["createdAt", "updatedAt", "experienceYears"],
        selectableFields: Object.keys(CANDIDATE_DETAIL_SELECT),
        softDelete: true,
        defaultSortField: "createdAt",
    },
);

const upsertMyProfile = async (
    userId: string,
    payload: UpsertCandidateProfileInput,
    file?: Express.Multer.File,
) => {
    const user = await prisma.user.findFirst({
        where: { id: userId, deletedAt: null },
    });

    if (!user) {
        throw new AppError(StatusCodes.NOT_FOUND, "User not found.");
    }

    let resumeUrl: string | undefined;
    if (file) {
        const uploaded = await uploadFileToCloudinary(
            file.buffer,
            file.originalname,
            "resumes",
        );
        resumeUrl = uploaded.secure_url;
    }

    return prisma.candidateProfile.upsert({
        where: { userId },
        create: {
            userId,
            ...payload,
            ...(resumeUrl ? { resumeUrl } : {}),
        },
        update: {
            ...payload,
            ...(resumeUrl ? { resumeUrl } : {}),
        },
        select: CANDIDATE_DETAIL_SELECT,
    });
};

const getMyProfile = async (userId: string) => {
    const profile = await prisma.candidateProfile.findFirst({
        where: { userId, deletedAt: null },
        select: CANDIDATE_DETAIL_SELECT,
    });

    if (!profile) {
        throw new AppError(StatusCodes.NOT_FOUND, "Candidate profile not found.");
    }

    return profile;
};

const getCandidateProfileById = async (id: string) => {
    const profile = await prisma.candidateProfile.findFirst({
        where: { id, deletedAt: null },
        select: CANDIDATE_DETAIL_SELECT,
    });

    if (!profile) {
        throw new AppError(StatusCodes.NOT_FOUND, "Candidate profile not found.");
    }

    return profile;
};

const getAllCandidates = async (query: Record<string, unknown>) => {
    return candidateQueryBuilder.execute(query);
};

export const candidateService = {
    upsertMyProfile,
    getMyProfile,
    getCandidateProfileById,
    getAllCandidates,
};