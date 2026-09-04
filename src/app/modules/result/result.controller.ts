import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import type { AuthenticatedUser } from "../../middlewares/requireAuth";
import { catchAsync } from "../../utils/catchAsync";
import { companyService } from "../company/company.service";

import { resultService } from "./result.service";

/** ADMIN unscoped; RECRUITER scoped to own company; CANDIDATE resolves neither (owns their own attempt instead). */
const resolveScopeCompanyId = async (user: AuthenticatedUser): Promise<string | undefined> => {
	if (user.role !== "RECRUITER") return undefined;
	const company = await companyService.getMyCompany(user.id);
	return company.id;
};

const getResultByAttemptId = catchAsync(async (req: Request, res: Response) => {
	const currentUser = req.user as AuthenticatedUser;
	const companyId = await resolveScopeCompanyId(currentUser);

	const result = await resultService.getResultByAttemptId(req.params.attemptId as string, {
		id: currentUser.id,
		role: currentUser.role,
		companyId,
	});

	res.status(StatusCodes.OK).json({
		success: true,
		message: "Result retrieved successfully.",
		data: result,
	});
});

const getResultsForAssessment = catchAsync(async (req: Request, res: Response) => {
	const currentUser = req.user as AuthenticatedUser;
	const companyId = currentUser.role === "ADMIN" ? undefined : (await companyService.getMyCompany(currentUser.id)).id;

	const results = await resultService.getResultsForAssessment(req.params.assessmentId as string, companyId);

	res.status(StatusCodes.OK).json({
		success: true,
		message: "Results retrieved successfully.",
		data: results,
	});
});

const computeRanks = catchAsync(async (req: Request, res: Response) => {
	const currentUser = req.user as AuthenticatedUser;
	const company = await companyService.getMyCompany(currentUser.id);

	const result = await resultService.computeRanks(req.params.assessmentId as string, company.id);

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