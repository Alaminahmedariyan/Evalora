import { fromNodeHeaders } from "better-auth/node";
import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { auth } from "../../lib/auth";
import config from "../config";
import { DEMO_EMAIL_DOMAIN } from "../modules/demo/demo.const";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

// Always allowed so a demo visitor can leave or switch role.
const ALWAYS_ALLOWED = [
	/\/api\/auth\/sign-out/,
	/\/api\/auth\/sign-in/,
	/\/api\/v1\/auth\/logout/,
	/\/api\/v1\/demo\/login/,
];

// Demo users must never change credentials, 2FA or the account itself.
const SENSITIVE = [
	/\/api\/auth\//,
	/\/api\/v1\/auth\/change-password/,
	/\/api\/v1\/auth\/reset-password/,
];

/**
 * Protects the shared demo accounts. Demo users get their full role UI, but
 * cannot change credentials, and the demo ADMIN is read-only because admin
 * actions touch real platform data.
 * Mount once on "/api", BEFORE the Better Auth handler and the v1 router.
 */
export const demoGuard = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	if (
		!config.demo.enabled ||
		SAFE_METHODS.has(req.method)
	) {
		return next();
	}

	const url = req.originalUrl.split("?")[0] ?? "";

	if (ALWAYS_ALLOWED.some((p) => p.test(url))) return next();

	try {
		const session = await auth.api.getSession({
			headers: fromNodeHeaders(req.headers),
		});
		const user = session?.user;

		if (!user?.email.endsWith(`@${DEMO_EMAIL_DOMAIN}`)) return next();

		const blocked =
			SENSITIVE.some((p) => p.test(url)) ||
			(user as { role?: string }).role === "ADMIN";

		if (blocked) {
			return res.status(StatusCodes.FORBIDDEN).json({
				success: false,
				message: "This action is disabled in the demo account.",
			});
		}
	} catch {
		// Fall through: the normal auth middleware handles a bad session.
	}

	next();
};