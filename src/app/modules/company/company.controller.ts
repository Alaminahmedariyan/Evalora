import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import type { UserRole } from "../../../generated/prisma/enums";
import type { AuthenticatedUser } from "../../middlewares/requireAuth";
import { catchAsync } from "../../utils/catchAsync";

import { companyService } from "./company.service";

const registerCompany = catchAsync(async (req: Request, res: Response) => {
	const currentUser = req.user as AuthenticatedUser;

	const company = await companyService.registerCompany(currentUser.id, req.body);

	res.status(StatusCodes.CREATED).json({
		success: true,
		message: "Company registered successfully. Awaiting admin verification.",
		data: company,
	});
});

/**
 * Public browse endpoint — `req.user` may be absent (no requireAuth on this
 * route). Anonymous visitors are treated as non-admin, so they only ever
 * see verified companies.
 */
const getAllCompanies = catchAsync(async (req: Request, res: Response) => {
	const requesterRole = (req.user as AuthenticatedUser | undefined)?.role ?? "CANDIDATE";

	const result = await companyService.getAllCompanies(req.query as Record<string, unknown>, requesterRole);

	res.status(StatusCodes.OK).json({
		success: true,
		message: "Companies retrieved successfully.",
		meta: result.meta,
		data: result.data,
	});
});

const getCompanyById = catchAsync(async (req: Request, res: Response) => {
	const requester = req.user as AuthenticatedUser | undefined;

	const company = await companyService.getCompanyById(
		req.params.id as string,
		requester?.id ?? "",
		(requester?.role ?? "CANDIDATE") as UserRole,
	);

	res.status(StatusCodes.OK).json({
		success: true,
		message: "Company retrieved successfully.",
		data: company,
	});
});

const getMyCompany = catchAsync(async (req: Request, res: Response) => {
	const currentUser = req.user as AuthenticatedUser;

	const company = await companyService.getMyCompany(currentUser.id);

	res.status(StatusCodes.OK).json({
		success: true,
		message: "Your company retrieved successfully.",
		data: company,
	});
});

const updateMyCompany = catchAsync(async (req: Request, res: Response) => {
	const currentUser = req.user as AuthenticatedUser;

	const company = await companyService.updateMyCompany(currentUser.id, req.body, req.file);

	res.status(StatusCodes.OK).json({
		success: true,
		message: "Company updated successfully.",
		data: company,
	});
});

const verifyCompany = catchAsync(async (req: Request, res: Response) => {
	const currentUser = req.user as AuthenticatedUser;

	const company = await companyService.verifyCompany(req.params.id as string, currentUser.id);

	res.status(StatusCodes.OK).json({
		success: true,
		message: "Company verified successfully.",
		data: company,
	});
});

const deleteCompany = catchAsync(async (req: Request, res: Response) => {
	const currentUser = req.user as AuthenticatedUser;

	const result = await companyService.softDeleteCompany(
		req.params.id as string,
		currentUser.id,
		currentUser.role,
	);

	res.status(StatusCodes.OK).json({
		success: true,
		message: result.message,
		data: null,
	});
});

export const companyController = {
	registerCompany,
	getAllCompanies,
	getCompanyById,
	getMyCompany,
	updateMyCompany,
	verifyCompany,
	deleteCompany,
};