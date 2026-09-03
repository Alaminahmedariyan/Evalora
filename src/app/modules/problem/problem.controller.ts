import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import type { AuthenticatedUser } from "../../middlewares/requireAuth";
import { catchAsync } from "../../utils/catchAsync";
import { companyService } from "../company/company.service";

import { problemService } from "./problem.service";

/**
 * ADMIN browses across every company (no scoping); RECRUITER is always
 * scoped to their own company. Resolving "my company" here (rather than
 * baking it into problemService) keeps company-lookup logic in one place
 * (company.service.ts) instead of duplicating it per module.
 */
const resolveScopeCompanyId = async (user: AuthenticatedUser): Promise<string | undefined> => {
	if (user.role === "ADMIN") return undefined;
	const company = await companyService.getMyCompany(user.id);
	return company.id;
};

const createProblem = catchAsync(async (req: Request, res: Response) => {
	const currentUser = req.user as AuthenticatedUser;
	const company = await companyService.getMyCompany(currentUser.id);

	const problem = await problemService.createProblem(company.id, currentUser.id, req.body);

	res.status(StatusCodes.CREATED).json({
		success: true,
		message: "Problem created successfully.",
		data: problem,
	});
});

const getAllProblems = catchAsync(async (req: Request, res: Response) => {
	const currentUser = req.user as AuthenticatedUser;
	const companyId = await resolveScopeCompanyId(currentUser);

	const result = await problemService.getAllProblems(req.query as Record<string, unknown>, companyId);

	res.status(StatusCodes.OK).json({
		success: true,
		message: "Problems retrieved successfully.",
		meta: result.meta,
		data: result.data,
	});
});

const getProblemById = catchAsync(async (req: Request, res: Response) => {
	const currentUser = req.user as AuthenticatedUser;
	const companyId = await resolveScopeCompanyId(currentUser);

	const problem = await problemService.getProblemById(req.params.id as string, companyId);

	res.status(StatusCodes.OK).json({
		success: true,
		message: "Problem retrieved successfully.",
		data: problem,
	});
});

const updateProblem = catchAsync(async (req: Request, res: Response) => {
	const currentUser = req.user as AuthenticatedUser;
	const company = await companyService.getMyCompany(currentUser.id);

	const problem = await problemService.updateProblem(req.params.id as string, company.id, req.body);

	res.status(StatusCodes.OK).json({
		success: true,
		message: "Problem updated successfully.",
		data: problem,
	});
});

const deleteProblem = catchAsync(async (req: Request, res: Response) => {
	const currentUser = req.user as AuthenticatedUser;
	const company = await companyService.getMyCompany(currentUser.id);

	const result = await problemService.softDeleteProblem(req.params.id as string, company.id);

	res.status(StatusCodes.OK).json({
		success: true,
		message: result.message,
		data: null,
	});
});

export const problemController = {
	createProblem,
	getAllProblems,
	getProblemById,
	updateProblem,
	deleteProblem,
};