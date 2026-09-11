import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { getCompanyIdForUser } from "../../../lib/getCompanyIdForUser";
import type { AuthenticatedUser } from "../../middlewares/requireAuth";
import { catchAsync } from "../../utils/catchAsync";

import { problemService } from "./problem.service";

const createProblem = catchAsync(async (req: Request, res: Response) => {
	const currentUser = req.user as AuthenticatedUser;
	const companyId = (await getCompanyIdForUser(currentUser, req))!;

	const problem = await problemService.createProblem(
		companyId,
		currentUser.id,
		req.body,
	);

	res.status(StatusCodes.CREATED).json({
		success: true,
		message: "Problem created successfully.",
		data: problem,
	});
});

const getAllProblems = catchAsync(async (req: Request, res: Response) => {
	const currentUser = req.user as AuthenticatedUser;
	const companyId = (await getCompanyIdForUser(currentUser, req)) ?? undefined;

	const result = await problemService.getAllProblems(
		req.query as Record<string, unknown>,
		companyId,
	);

	res.status(StatusCodes.OK).json({
		success: true,
		message: "Problems retrieved successfully.",
		meta: result.meta,
		data: result.data,
	});
});

const getProblemById = catchAsync(async (req: Request, res: Response) => {
	const currentUser = req.user as AuthenticatedUser;
	const companyId = (await getCompanyIdForUser(currentUser, req)) ?? undefined;

	const problem = await problemService.getProblemById(
		req.params.id as string,
		companyId,
	);

	res.status(StatusCodes.OK).json({
		success: true,
		message: "Problem retrieved successfully.",
		data: problem,
	});
});

const updateProblem = catchAsync(async (req: Request, res: Response) => {
	const currentUser = req.user as AuthenticatedUser;
	const companyId = (await getCompanyIdForUser(currentUser, req))!;

	const problem = await problemService.updateProblem(
		req.params.id as string,
		companyId,
		req.body,
	);

	res.status(StatusCodes.OK).json({
		success: true,
		message: "Problem updated successfully.",
		data: problem,
	});
});

const deleteProblem = catchAsync(async (req: Request, res: Response) => {
	const currentUser = req.user as AuthenticatedUser;
	const companyId = (await getCompanyIdForUser(currentUser, req))!;

	const result = await problemService.softDeleteProblem(
		req.params.id as string,
		companyId,
	);

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
