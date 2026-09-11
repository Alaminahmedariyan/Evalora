import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { getCompanyIdForUser } from "../../../lib/getCompanyIdForUser";
import type { AuthenticatedUser } from "../../middlewares/requireAuth";
import { catchAsync } from "../../utils/catchAsync";

import { evaluationService } from "./evaluation.service";

const getSubmissionsForAttempt = catchAsync(
	async (req: Request, res: Response) => {
		const currentUser = req.user as AuthenticatedUser;
		const companyId =
			currentUser.role === "RECRUITER"
				? (await getCompanyIdForUser(currentUser, req)) ?? undefined
				: undefined;

		const submissions = await evaluationService.getSubmissionsForAttempt(
			req.params.attemptId as string,
			{
				id: currentUser.id,
				role: currentUser.role,
				...(companyId !== undefined && { companyId }),
			},
		);

		res.status(StatusCodes.OK).json({
			success: true,
			message: "Submissions retrieved successfully.",
			data: submissions,
		});
	},
);

const getSubmissionById = catchAsync(async (req: Request, res: Response) => {
	const currentUser = req.user as AuthenticatedUser;
	const companyId =
		currentUser.role === "RECRUITER"
			? (await getCompanyIdForUser(currentUser, req)) ?? undefined
			: undefined;

	const submission = await evaluationService.getSubmissionById(
		req.params.id as string,
		{
			id: currentUser.id,
			role: currentUser.role,
			...(companyId !== undefined && { companyId }),
		},
	);

	res.status(StatusCodes.OK).json({
		success: true,
		message: "Submission retrieved successfully.",
		data: submission,
	});
});

const getPendingEvaluations = catchAsync(
	async (req: Request, res: Response) => {
		const currentUser = req.user as AuthenticatedUser;
		const companyId = (await getCompanyIdForUser(currentUser, req))!;

		const submissions = await evaluationService.getPendingEvaluations(
			req.params.assessmentId as string,
			companyId,
		);

		res.status(StatusCodes.OK).json({
			success: true,
			message: "Pending evaluations retrieved successfully.",
			data: submissions,
		});
	},
);

const evaluateSubmission = catchAsync(async (req: Request, res: Response) => {
	const currentUser = req.user as AuthenticatedUser;
	const companyId = (await getCompanyIdForUser(currentUser, req))!;

	const submission = await evaluationService.evaluateSubmission(
		req.params.id as string,
		currentUser.id,
		companyId,
		req.body,
	);

	res.status(StatusCodes.OK).json({
		success: true,
		message: "Submission evaluated successfully.",
		data: submission,
	});
});

export const evaluationController = {
	getSubmissionsForAttempt,
	getSubmissionById,
	getPendingEvaluations,
	evaluateSubmission,
};
