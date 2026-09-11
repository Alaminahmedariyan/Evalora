import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { getCompanyIdForUser } from "../../../lib/getCompanyIdForUser";
import type { AuthenticatedUser } from "../../middlewares/requireAuth";
import { catchAsync } from "../../utils/catchAsync";

import { attemptService } from "./attempt.service";

const startAttempt = catchAsync(async (req: Request, res: Response) => {
	const currentUser = req.user as AuthenticatedUser;

	const attempt = await attemptService.startAttempt(
		currentUser.id,
		req.body.assessmentId,
	);

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
	const companyId =
		currentUser.role === "RECRUITER"
			? (await getCompanyIdForUser(currentUser, req)) ?? undefined
			: undefined;

	const attempt = await attemptService.getAttemptById(req.params.id as string, {
		id: currentUser.id,
		role: currentUser.role,
		...(companyId !== undefined && { companyId }),
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

	const attempt = await attemptService.submitAttempt(
		req.params.id as string,
		currentUser.id,
	);

	res.status(StatusCodes.OK).json({
		success: true,
		message: "Attempt submitted successfully.",
		data: attempt,
	});
});

const recordProctoringEvent = catchAsync(
	async (req: Request, res: Response) => {
		const currentUser = req.user as AuthenticatedUser;

		const result = await attemptService.recordProctoringEvent(
			req.params.id as string,
			currentUser.id,
			req.body,
		);

		res.status(StatusCodes.OK).json({
			success: true,
			message: result.recorded
				? "Event recorded."
				: "Attempt is no longer active; event ignored.",
			data: result,
		});
	},
);

const getProctoringEvents = catchAsync(async (req: Request, res: Response) => {
	const currentUser = req.user as AuthenticatedUser;
	const companyId =
		currentUser.role === "RECRUITER"
			? (await getCompanyIdForUser(currentUser, req)) ?? undefined
			: undefined;

	const events = await attemptService.getProctoringEvents(
		req.params.id as string,
		{
			id: currentUser.id,
			role: currentUser.role,
			...(companyId !== undefined && { companyId }),
		},
	);

	res.status(StatusCodes.OK).json({
		success: true,
		message: "Proctoring events retrieved successfully.",
		data: events,
	});
});

const getProctoringEventById = catchAsync(
	async (req: Request, res: Response) => {
		const currentUser = req.user as AuthenticatedUser;
		const companyId =
			currentUser.role === "RECRUITER"
				? (await getCompanyIdForUser(currentUser, req)) ?? undefined
				: undefined;

		const event = await attemptService.getProctoringEventById(
			req.params.id as string,
			req.params.eventId as string,
			{
				id: currentUser.id,
				role: currentUser.role,
				...(companyId !== undefined && { companyId }),
			},
		);

		res.status(StatusCodes.OK).json({
			success: true,
			message: "Proctoring event retrieved successfully.",
			data: event,
		});
	},
);

export const attemptController = {
	startAttempt,
	getMyAttempts,
	getAttemptById,
	saveSubmission,
	submitAttempt,
	recordProctoringEvent,
	getProctoringEvents,
	getProctoringEventById,
};
