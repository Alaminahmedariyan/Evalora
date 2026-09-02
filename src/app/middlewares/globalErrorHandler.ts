import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ZodError } from "zod";

import config from "../config";
import { handleZodError } from "../errors/handleZodError";
import { handlePrismaError } from "../errors/handlePrismaError";
import AppError from "../errors/appError";

export const globalErrorHandler = (
	error: unknown,
	_req: Request,
	res: Response,
	_next: NextFunction,
) => {
	let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
	let message = "Something went wrong";
	let errorCode: string | undefined;
	let errors: unknown[] = [];

	if (error instanceof AppError) {
		statusCode = error.statusCode;
		message = error.message;
		errorCode = error.errorCode;
		errors = Array.isArray(error.details)
			? error.details
			: error.details !== undefined
				? [error.details]
				: [];
	} else if (error instanceof ZodError) {
		const zodError = handleZodError(error);
		statusCode = zodError.statusCode;
		message = zodError.message;
		errors = zodError.details;
	} else {
		const prismaError = handlePrismaError(error);
		if (prismaError) {
			statusCode = prismaError.statusCode;
			message = prismaError.message;
			errorCode = prismaError.errorCode;
		} else if (error instanceof Error) {
			message = error.message;
		}
	}

	const response: Record<string, unknown> = { success: false, message, errors };
	if (errorCode) response.errorCode = errorCode;

	if (config.app.env === "development") {
		response.stack = error instanceof Error ? error.stack : undefined;
	}

	res.status(statusCode).json(response);
};