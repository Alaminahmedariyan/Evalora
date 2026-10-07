import { StatusCodes } from "http-status-codes";

import { prisma } from "../../lib/prisma";
import AppError from "../errors/appError";

/**
 * Throws 403 unless the company exists, isn't deleted, and has been
 * verified by an admin. Used before actions that expose the company to
 * candidates (publishing an assessment, sending invitations).
 *
 * Place at: src/app/utils/assertCompanyVerified.ts
 */
export const assertCompanyVerified = async (companyId: string) => {
	const company = await prisma.company.findFirst({
		where: { id: companyId, deletedAt: null },
		select: { isVerified: true },
	});

	if (!company) {
		throw new AppError(StatusCodes.NOT_FOUND, "Company not found.");
	}

	if (!company.isVerified) {
		throw new AppError(
			StatusCodes.FORBIDDEN,
			"Your company must be verified by an admin before you can do this.",
		);
	}
};