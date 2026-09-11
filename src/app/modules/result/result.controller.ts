import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { getCompanyIdForUser } from "../../../lib/getCompanyIdForUser";
import type { AuthenticatedUser } from "../../middlewares/requireAuth";
import { catchAsync } from "../../utils/catchAsync";

import { resultService } from "./result.service";

const getResultByAttemptId = catchAsync(async (req: Request, res: Response) => {
	const currentUser = req.user as AuthenticatedUser;
	const companyId = (await getCompanyIdForUser(currentUser, req)) ?? undefined;

	const result = await resultService.getResultByAttemptId(
		req.params.attemptId as string,
		{
			id: currentUser.id,
			role: currentUser.role,
			...(companyId !== undefined && { companyId }),
		},
	);

	res.status(StatusCodes.OK).json({
		success: true,
		message: "Result retrieved successfully.",
		data: result,
	});
});

const getResultsForAssessment = catchAsync(
	async (req: Request, res: Response) => {
		const currentUser = req.user as AuthenticatedUser;
		const companyId = (await getCompanyIdForUser(currentUser, req)) ?? undefined;

		const results = await resultService.getResultsForAssessment(
			req.params.assessmentId as string,
			companyId,
		);

		res.status(StatusCodes.OK).json({
			success: true,
			message: "Results retrieved successfully.",
			data: results,
		});
	},
);

const computeRanks = catchAsync(async (req: Request, res: Response) => {
	const currentUser = req.user as AuthenticatedUser;
	const companyId = (await getCompanyIdForUser(currentUser, req))!;

	const result = await resultService.computeRanks(
		req.params.assessmentId as string,
		companyId,
	);

	res.status(StatusCodes.OK).json({
		success: true,
		message: `Ranked ${result.ranked} result(s).`,
		data: result,
	});
});

export const resultController = {
	getResultByAttemptId,
	getResultsForAssessment,
	computeRanks,
};
