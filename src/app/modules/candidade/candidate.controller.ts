import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import type { AuthenticatedUser } from "../../middlewares/requireAuth";
import { catchAsync } from "../../utils/catchAsync";

import { candidateService } from "./candidate.service";

const upsertMyProfile = catchAsync(async (req: Request, res: Response) => {
	const currentUser = req.user as AuthenticatedUser;

	const profile = await candidateService.upsertMyProfile(currentUser.id, req.body, req.file);

	res.status(StatusCodes.OK).json({
		success: true,
		message: "Profile saved successfully.",
		data: profile,
	});
});

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
	const currentUser = req.user as AuthenticatedUser;

	const profile = await candidateService.getMyProfile(currentUser.id);

	res.status(StatusCodes.OK).json({
		success: true,
		message: "Profile retrieved successfully.",
		data: profile,
	});
});

const getCandidateProfileById = catchAsync(async (req: Request, res: Response) => {
	const profile = await candidateService.getCandidateProfileById(req.params.id as string);

	res.status(StatusCodes.OK).json({
		success: true,
		message: "Candidate profile retrieved successfully.",
		data: profile,
	});
});

const getAllCandidates = catchAsync(async (req: Request, res: Response) => {
	const result = await candidateService.getAllCandidates(req.query as Record<string, unknown>);

	res.status(StatusCodes.OK).json({
		success: true,
		message: "Candidates retrieved successfully.",
		meta: result.meta,
		data: result.data,
	});
});

export const candidateController = {
	upsertMyProfile,
	getMyProfile,
	getCandidateProfileById,
	getAllCandidates,
};