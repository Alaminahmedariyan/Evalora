import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import type { z } from "zod";

import AppError from "../errors/appError";
import { validateRequest } from "./validateRequest";

export const validateRequestWithFile = (schema: z.ZodTypeAny) => {
	return async (
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> => {
		// Multipart requests send a JSON-stringified body in req.body.data
		// (multer keeps the file in req.file; req.body holds only the data field).
		if (typeof req.body?.data === "string") {
			try {
				req.body = JSON.parse(req.body.data);
			} catch {
				return next(
					new AppError(
						StatusCodes.BAD_REQUEST,
						"Invalid JSON in 'data' field.",
					),
				);
			}
		}

		// Delegate the actual validation to the existing middleware.
		return validateRequest(schema)(req, res, next);
	};
};
