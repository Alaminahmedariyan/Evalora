import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import type { AuthenticatedUser } from "../../middlewares/requireAuth";
import { catchAsync } from "../../utils/catchAsync";
import { companyService } from "../company/company.service";

import { attemptService } from "./attempt.service";

/** ADMIN is unscoped; RECRUITER is always scoped to their own company. */
const resolveScopeCompanyId = async (user: AuthenticatedUser): Promise<string | undefined> => {
	if (user.role === "ADMIN") return undefined;
	if (user.role !== "RECRUITER") return undefined;
	const company = await companyService.getMyCompany(user.id);
	return company.id;
};

const startAttempt = catchAsync(async (req: Request, res: Response) => {
	const currentUser = req.user as AuthenticatedUser;

	const attempt = await attemptService.startAttempt(currentUser.id, req.body.assessmentId);

	res.status(StatusCodes.CREATED).json({
		success: true,
		message: "Attempt started successfully.",
		data: attempt,
	});
});

const getMyAttempts = catchAsync(async (req: Request, res: Response) => {
	const currentUser = req.user as AuthenticatedUser;

	const attempts = await attemptService.getMyAttempts(currentUser.id);

	res.status(StatusCodes.OK).json({
		success: true,
		message: "Attempts retrieved successfully.",
		data: attempts,
	});
});

const getAttemptById = catchAsync(async (req: Request, res: Response) => {
	const currentUser = req.user as AuthenticatedUser;
	const companyId = await resolveScopeCompanyId(currentUser);

	const attempt = await attemptService.getAttemptById(req.params.id as string, {
		id: currentUser.id,
		role: currentUser.role,
		companyId,
	});

	res.status(StatusCodes.OK).json({
		success: true,
		message: "Attempt retrieved successfully.",
		data: attempt,
	});
});

const saveSubmission = catchAsync(async (req: Request, res: Response) => {
	const currentUser = req.user as AuthenticatedUser;

	const submission = await attemptService.saveSubmission(
		req.params.id as string,
		currentUser.id,
		req.params.problemId as string,
		req.body,
	);

	res.status(StatusCodes.OK).json({
		success: true,
		message: "Answer saved successfully.",
		data: submission,
	});
});

const submitAttempt = catchAsync(async (req: Request, res: Response) => {
	const currentUser = req.user as AuthenticatedUser;

	const attempt = await attemptService.submitAttempt(req.params.id as string, currentUser.id);

	res.status(StatusCodes.OK).json({
		success: true,
		message: "Attempt submitted successfully.",
		data: attempt,
	});
});

const recordProctoringEvent = catchAsync(async (req: Request, res: Response) => {
	const currentUser = req.user as AuthenticatedUser;

	const result = await attemptService.recordProctoringEvent(
		req.params.id as string,
		currentUser.id,
		req.body,
	);

	res.status(StatusCodes.OK).json({
		success: true,
		message: result.recorded ? "Event recorded." : "Attempt is no longer active; event ignored.",
		data: result,
	});
});

export const attemptController = {
	startAttempt,
	getMyAttempts,
	getAttemptById,
	saveSubmission,
	submitAttempt,
	recordProctoringEvent,
};