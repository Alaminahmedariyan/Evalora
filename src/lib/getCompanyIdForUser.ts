import type { Request } from "express";
import { StatusCodes } from "http-status-codes";

import AppError from "../app/errors/appError";
import type { AuthenticatedUser } from "../app/middlewares/requireAuth";
import { prisma } from "./prisma";

/**
 * Resolves the companyId for a given user.
 * - ADMIN users return `undefined` (explicit ADMIN bypass).
 * - RECRUITER users return their company's ID (or throw 403 if no company found).
 * - CANDIDATE users throw 403 FORBIDDEN explicitly.
 */
export async function getCompanyIdForUser(
	user: AuthenticatedUser,
	_req?: Request,
): Promise<string | undefined> {
	if (user.role === "ADMIN") {
		return undefined;
	}

	if (user.role === "CANDIDATE") {
		throw new AppError(
			StatusCodes.FORBIDDEN,
			"Candidates cannot access company-scoped resources",
		);
	}

	const company = await prisma.company.findFirst({
		where: { ownerId: user.id, deletedAt: null },
		select: { id: true },
	});

	if (!company) {
		throw new AppError(
			StatusCodes.FORBIDDEN,
			"No company associated with this user",
		);
	}

	return company.id;
}
