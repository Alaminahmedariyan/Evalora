import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import type { AuthenticatedUser } from "../../middlewares/requireAuth";
import { catchAsync } from "../../utils/catchAsync";
import { companyService } from "../company/company.service";

import { evaluationService } from "./evaluation.service";

/** ADMIN is unscoped; RECRUITER is always scoped to their own company. */
const resolveScopeCompanyId = async (user: AuthenticatedUser): Promise<string | undefined> => {
	if (user.role === "ADMIN") return undefined;
	const company = await companyService.getMyCompany(user.id);
	return company.id;
};

const getSubmissionsForAttempt = catchAsync(async (req: Request, res: Response) => {
	const currentUser = req.user as AuthenticatedUser;
	const companyId = await resolveScopeCompanyId(currentUser);

	const submissions = await evaluationService.getSubmissionsForAttempt(req.params.attemptId as string, {
		id: currentUser.id,
		role: currentUser.role,
		companyId,
	});

	res.status(StatusCodes.OK).json({
		success: true,
		message: "Submissions retrieved successfully.",
		data: submissions,
	});
});

const getSubmissionById = catchAsync(async (req: Request, res: Response) => {
	const currentUser = req.user as AuthenticatedUser;
	const companyId = await resolveScopeCompanyId(currentUser);

	const submission = await evaluationService.getSubmissionById(req.params.id as string, {
		id: currentUser.id,
		role: currentUser.role,
		companyId,
	});

	res.status(StatusCodes.OK).json({
		success: true,
		message: "Submission retrieved successfully.",
		data: submission,
	});
});

const getPendingEvaluations = catchAsync(async (req: Request, res: Response) => {
	const currentUser = req.user as AuthenticatedUser;
	const company = await companyService.getMyCompany(currentUser.id);

	const submissions = await evaluationService.getPendingEvaluations(
		req.params.assessmentId as string,
		company.id,
	);

	res.status(StatusCodes.OK).json({
		success: true,
		message: "Pending evaluations retrieved successfully.",
		data: submissions,
	});
});

const evaluateSubmission = catchAsync(async (req: Request, res: Response) => {
	const currentUser = req.user as AuthenticatedUser;
	const company = await companyService.getMyCompany(currentUser.id);

	const submission = await evaluationService.evaluateSubmission(
		req.params.id as string,
		currentUser.id,
		company.id,
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