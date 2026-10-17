import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import config from "../config";
import AppError from "../errors/appError";
import { safeEqual } from "../modules/automation/automation.signature";

export const requireAutomationApiKey = (
	req: Request,
	_res: Response,
	next: NextFunction,
) => {
	const expected = config.n8n.apiKey;
	const provided = req.header("x-api-key");

	if (!expected || !provided || !safeEqual(provided, expected)) {
		return next(
			new AppError(
				StatusCodes.UNAUTHORIZED,
				"Invalid or missing API key.",
				"INVALID_API_KEY",
			),
		);
	}

	next();
};