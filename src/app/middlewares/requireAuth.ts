import { fromNodeHeaders } from "better-auth/node";
import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import type { UserRole } from "../../generated/prisma/enums";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import AppError from "../errors/appError";
import { catchAsync } from "../utils/catchAsync";

export type AuthenticatedUser = {
	id: string;
	name: string;
	email: string;
	emailVerified: boolean;
	image: string | null;
	role: UserRole;
	twoFactorEnabled?: boolean | null;
	createdAt: Date;
	updatedAt: Date;
};

export const requireAuth = catchAsync(
	async (req: Request, _res: Response, next: NextFunction) => {
		const session = await auth.api.getSession({
			headers: fromNodeHeaders(req.headers),
		});

		if (!session?.user) {
			throw new AppError(
				StatusCodes.UNAUTHORIZED,
				"You are not logged in. Please log in to access this resource.",
			);
		}

		// A valid session is not enough: a suspended or deleted account must be
		// locked out immediately, not whenever its session happens to expire.
		const account = await prisma.user.findUnique({
			where: { id: session.user.id },
			select: { status: true, deletedAt: true },
		});

		if (!account || account.deletedAt || account.status === "SUSPENDED") {
			throw new AppError(
				StatusCodes.FORBIDDEN,
				"This account is suspended or has been deleted.",
			);
		}

		req.user = session.user as unknown as AuthenticatedUser;
		next();
	},
);

/**
 * Like requireAuth, but never rejects. Public routes that behave differently
 * for signed-in users (for example an admin seeing unverified companies) use
 * this so that req.user is filled in when a valid session exists.
 * A missing, invalid, suspended or deleted account simply stays anonymous.
 */
export const optionalAuth = catchAsync(
	async (req: Request, _res: Response, next: NextFunction) => {
		try {
			const session = await auth.api.getSession({
				headers: fromNodeHeaders(req.headers),
			});

			if (session?.user) {
				const account = await prisma.user.findUnique({
					where: { id: session.user.id },
					select: { status: true, deletedAt: true },
				});

				if (account && !account.deletedAt && account.status !== "SUSPENDED") {
					req.user = session.user as unknown as AuthenticatedUser;
				}
			}
		} catch {
			// A session lookup problem must not break a public endpoint.
		}

		next();
	},
);

export const requireRole = (...roles: UserRole[]) => {
	return catchAsync(
		async (req: Request, _res: Response, next: NextFunction) => {
			if (!req.user) {
				throw new AppError(StatusCodes.UNAUTHORIZED, "You are not logged in.");
			}
			if (roles.length && !roles.includes(req.user.role)) {
				throw new AppError(
					StatusCodes.FORBIDDEN,
					"You don't have permission to access this resource.",
				);
			}
			next();
		},
	);
};