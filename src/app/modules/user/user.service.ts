import { StatusCodes } from "http-status-codes";

import type { Prisma } from "../../../generated/prisma/client";
import type { UserRole, UserStatus } from "../../../generated/prisma/enums";
import type { UserWhereInput } from "../../../generated/prisma/models/User";

import { prisma } from "../../../lib/prisma";
import AppError from "../../errors/appError";
import { QueryBuilder } from "../../queryBuilder";
import { uploadFileToCloudinary } from "../../utils/fileUploader";

import type { UpdateProfileInput } from "./user.interface";
import { USER_PUBLIC_SELECT } from "./user.const";

/**
 * User Query Builder
 */
const userQueryBuilder = new QueryBuilder<
    Prisma.UserGetPayload<{
        select: typeof USER_PUBLIC_SELECT;
    }>,
    UserWhereInput
>(prisma.user, {
    searchableFields: ["name", "email", "phone"],

    filterableFields: {
        role: {
            type: "enum",
            enum: {
                ADMIN: "ADMIN",
                RECRUITER: "RECRUITER",
                CANDIDATE: "CANDIDATE",
            },
        },

        status: {
            type: "enum",
            enum: {
                ACTIVE: "ACTIVE",
                SUSPENDED: "SUSPENDED",
                PENDING: "PENDING",
            },
        },

        createdAt: "date",
    },

    sortableFields: ["createdAt", "name", "email"],

    selectableFields: Object.keys(USER_PUBLIC_SELECT),

    softDelete: true,

    defaultSortField: "createdAt",
});

/**
 * Blocks an actor from performing a destructive/self-privilege-changing
 * action on their own account (role change, status change, delete).
 * Without this, an Admin could accidentally demote, suspend, or delete
 * themselves with no other Admin left to undo it.
 */
const assertNotActingOnSelf = (
    actorId: string,
    targetId: string,
    action: string,
) => {
    if (actorId === targetId) {
        throw new AppError(
            StatusCodes.FORBIDDEN,
            `You cannot ${action} your own account.`,
        );
    }
};

/**
 * Get all users
 */
const getAllUsers = async (query: Record<string, unknown>) => {
    return userQueryBuilder.execute(query);
};

/**
 * Get single user by ID
 */
const getUserById = async (id: string) => {
    const user = await prisma.user.findFirst({
        where: {
            id,
            deletedAt: null,
        },
        select: USER_PUBLIC_SELECT,
    });

    if (!user) {
        throw new AppError(
            StatusCodes.NOT_FOUND,
            "User not found.",
        );
    }

    return user;
};

/**
 * Update user profile
 */
const updateProfile = async (
    id: string,
    payload: UpdateProfileInput,
    file?: Express.Multer.File,
) => {
    const existing = await prisma.user.findFirst({
        where: {
            id,
            deletedAt: null,
        },
    });

    if (!existing) {
        throw new AppError(
            StatusCodes.NOT_FOUND,
            "User not found.",
        );
    }

    const updateData: Prisma.UserUpdateInput = {
        ...payload,
    };

    /**
     * Upload new profile image if file exists
     */
    if (file) {
        const uploaded = await uploadFileToCloudinary(
            file.buffer,
            file.originalname,
            "avatars",
        );

        updateData.image = uploaded.secure_url;
    }

    const updatedUser = await prisma.user.update({
        where: {
            id,
        },
        data: updateData,
        select: USER_PUBLIC_SELECT,
    });

    return updatedUser;
};

/**
 * Update user role
 */
const updateRole = async (
    id: string,
    role: UserRole,
    actorId: string,
    actorRole: UserRole,
) => {
    assertNotActingOnSelf(actorId, id, "change the role of");

    const existing = await prisma.user.findFirst({
        where: {
            id,
            deletedAt: null,
        },
    });

    if (!existing) {
        throw new AppError(
            StatusCodes.NOT_FOUND,
            "User not found.",
        );
    }

    /**
     * Only ADMIN can assign ADMIN role and modify an existing ADMIN.
     * The route is already gated with requireRole("ADMIN"), so actorRole
     * is always "ADMIN" today — this check stays as defense-in-depth in
     * case updateRole is ever called from a route without that middleware.
     */
    if (
        (role === "ADMIN" || existing.role === "ADMIN") &&
        actorRole !== "ADMIN"
    ) {
        throw new AppError(
            StatusCodes.FORBIDDEN,
            "Only an Admin can assign or modify Admin privileges.",
        );
    }

    const updatedUser = await prisma.user.update({
        where: {
            id,
        },
        data: {
            role,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
        },
    });

    return updatedUser;
};

/**
 * Update user status
 */
const updateStatus = async (
    id: string,
    status: UserStatus,
    actorId: string,
) => {
    assertNotActingOnSelf(actorId, id, "change the status of");

    const existing = await prisma.user.findFirst({
        where: {
            id,
            deletedAt: null,
        },
    });

    if (!existing) {
        throw new AppError(
            StatusCodes.NOT_FOUND,
            "User not found.",
        );
    }

    const updatedUser = await prisma.user.update({
        where: {
            id,
        },
        data: {
            status,
        },
        select: {
            id: true,
            name: true,
            email: true,
            status: true,
        },
    });

    return updatedUser;
};

/**
 * Soft delete user
 */
const softDeleteUser = async (id: string, actorId: string) => {
    assertNotActingOnSelf(actorId, id, "delete");

    const existing = await prisma.user.findFirst({
        where: {
            id,
            deletedAt: null,
        },
    });

    if (!existing) {
        throw new AppError(
            StatusCodes.NOT_FOUND,
            "User not found.",
        );
    }

    await prisma.user.update({
        where: {
            id,
        },
        data: {
            deletedAt: new Date(),
            status: "SUSPENDED",
        },
    });

    return {
        message: "User deleted successfully.",
    };
};

export const userService = {
    getAllUsers,
    getUserById,
    updateProfile,
    updateRole,
    updateStatus,
    softDeleteUser,
};