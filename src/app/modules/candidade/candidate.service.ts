
import { StatusCodes } from "http-status-codes";

import type { CandidateProfileWhereInput } from "../../../generated/prisma/models/CandidateProfile";

import { prisma } from "../../../lib/prisma";
import AppError from "../../errors/appError";
import { QueryBuilder } from "../../queryBuilder";
import { uploadFileToCloudinary } from "../../utils/fileUploader";

import { CANDIDATE_DETAIL_SELECT } from "./candidate.const";
import type { UpsertCandidateProfileInput } from "./candidate.interface";

/**
 * Candidate profiles are only visible when their related user
 * has not been soft-deleted.
 */
const activeUserScope: CandidateProfileWhereInput = {
    user: {
        deletedAt: null,
    },
};

/**
 * Result type for candidate list/details.
 *
 * Prisma 7's new `prisma-client` generator does not expose
 * `CandidateProfileGetPayload` through the `Prisma` namespace
 * the way older Prisma versions did.
 *
 * Therefore, we derive the result shape directly from the
 * CANDIDATE_DETAIL_SELECT object.
 */
type CandidateProfileResult = {
    id: string;
    headline: string | null;
    bio: string | null;
    phone: string | null;
    location: string | null;
    resumeUrl: string | null;
    linkedinUrl: string | null;
    githubUrl: string | null;
    portfolioUrl: string | null;
    skills: string[];
    experienceYears: number;
    createdAt: Date;
    updatedAt: Date;
    user: {
        id: string;
        name: string;
        email: string;
        image: string | null;
    } | null;
};

/**
 * Query builder for candidate profiles.
 *
 * `defaultSelect` keeps the response shape consistent with
 * CANDIDATE_DETAIL_SELECT, including the nested user selection.
 */
const candidateQueryBuilder = new QueryBuilder<
    CandidateProfileResult,
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

    defaultSelect: CANDIDATE_DETAIL_SELECT,

    softDelete: true,

    defaultSortField: "createdAt",
});

/**
 * Build candidate profile data from request payload.
 */
const buildProfileData = (payload: UpsertCandidateProfileInput) => ({
    ...(payload.headline !== undefined && {
        headline: payload.headline,
    }),

    ...(payload.bio !== undefined && {
        bio: payload.bio,
    }),

    ...(payload.phone !== undefined && {
        phone: payload.phone,
    }),

    ...(payload.location !== undefined && {
        location: payload.location,
    }),

    ...(payload.linkedinUrl !== undefined && {
        linkedinUrl: payload.linkedinUrl,
    }),

    ...(payload.githubUrl !== undefined && {
        githubUrl: payload.githubUrl,
    }),

    ...(payload.portfolioUrl !== undefined && {
        portfolioUrl: payload.portfolioUrl,
    }),

    ...(payload.skills !== undefined && {
        skills: payload.skills,
    }),

    ...(payload.experienceYears !== undefined && {
        experienceYears: payload.experienceYears,
    }),
});

/**
 * Create or update the currently authenticated candidate profile.
 */
const upsertMyProfile = async (
    userId: string,
    payload: UpsertCandidateProfileInput,
    resumeFile?: Express.Multer.File,
) => {
    let resumeUrl: string | undefined;

    if (resumeFile) {
        const uploaded = await uploadFileToCloudinary(
            resumeFile.buffer,
            resumeFile.originalname,
            "resumes",
        );

        resumeUrl = uploaded.secure_url;
    }

    const profileData = buildProfileData(payload);

    return prisma.candidateProfile.upsert({
        where: {
            userId,
        },

        update: {
            ...profileData,
            ...(resumeUrl && {
                resumeUrl,
            }),
            deletedAt: null,
        },

        create: {
            userId,
            ...profileData,
            ...(resumeUrl && {
                resumeUrl,
            }),
        },

        select: CANDIDATE_DETAIL_SELECT,
    });
};

/**
 * Get the currently authenticated candidate's profile.
 */
const getMyProfile = async (userId: string) => {
    const profile = await prisma.candidateProfile.findFirst({
        where: {
            userId,
            deletedAt: null,
        },

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
 * Get a candidate profile by ID.
 *
 * Only profiles whose related user is active are returned.
 */
const getCandidateProfileById = async (id: string) => {
    const profile = await prisma.candidateProfile.findFirst({
        where: {
            id,
            deletedAt: null,
            ...activeUserScope,
        },

        select: CANDIDATE_DETAIL_SELECT,
    });

    if (!profile) {
        throw new AppError(
            StatusCodes.NOT_FOUND,
            "Candidate profile not found.",
        );
    }

    return profile;
};

/**
 * Get all candidate profiles with:
 *
 * - pagination
 * - search
 * - filtering
 * - sorting
 * - field selection
 * - default nested user selection
 * - soft-delete protection
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
