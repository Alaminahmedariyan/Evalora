import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import type { AuthenticatedUser } from "../../middlewares/requireAuth";
import { catchAsync } from "../../utils/catchAsync";
import { companyService } from "../company/company.service";

import { assessmentService } from "./assessment.service";

/** ADMIN browses unscoped; RECRUITER is always scoped to their own company. */
const resolveScopeCompanyId = async (user: AuthenticatedUser): Promise<string | undefined> => {
	if (user.role === "ADMIN") return undefined;
	const company = await companyService.getMyCompany(user.id);
	return company.id;
};

const createAssessment = catchAsync(async (req: Request, res: Response) => {
	const currentUser = req.user as AuthenticatedUser;
	const company = await companyService.getMyCompany(currentUser.id);

	const assessment = await assessmentService.createAssessment(company.id, currentUser.id, req.body);

	res.status(StatusCodes.CREATED).json({
		success: true,
		message: "Assessment created successfully.",
		data: assessment,
	});
});

const getAllAssessments = catchAsync(async (req: Request, res: Response) => {
	const currentUser = req.user as AuthenticatedUser;
	const companyId = await resolveScopeCompanyId(currentUser);

	const result = await assessmentService.getAllAssessments(req.query as Record<string, unknown>, companyId);

	res.status(StatusCodes.OK).json({
		success: true,
		message: "Assessments retrieved successfully.",
		meta: result.meta,
		data: result.data,
	});
});

const getAssessmentById = catchAsync(async (req: Request, res: Response) => {
	const currentUser = req.user as AuthenticatedUser;
	const companyId = await resolveScopeCompanyId(currentUser);

	const assessment = await assessmentService.getAssessmentById(req.params.id as string, companyId);

	res.status(StatusCodes.OK).json({
		success: true,
		message: "Assessment retrieved successfully.",
		data: assessment,
	});
});

const updateAssessment = catchAsync(async (req: Request, res: Response) => {
	const currentUser = req.user as AuthenticatedUser;
	const company = await companyService.getMyCompany(currentUser.id);

	const assessment = await assessmentService.updateAssessment(req.params.id as string, company.id, req.body);

	res.status(StatusCodes.OK).json({
		success: true,
		message: "Assessment updated successfully.",
		data: assessment,
	});
});

const publishAssessment = catchAsync(async (req: Request, res: Response) => {
	const currentUser = req.user as AuthenticatedUser;
	const company = await companyService.getMyCompany(currentUser.id);

	const assessment = await assessmentService.publishAssessment(req.params.id as string, company.id);

	res.status(StatusCodes.OK).json({
		success: true,
		message: "Assessment published successfully.",
		data: assessment,
	});
});

const closeAssessment = catchAsync(async (req: Request, res: Response) => {
	const currentUser = req.user as AuthenticatedUser;
	const company = await companyService.getMyCompany(currentUser.id);

	const assessment = await assessmentService.closeAssessment(req.params.id as string, company.id);

	res.status(StatusCodes.OK).json({
		success: true,
		message: "Assessment closed successfully.",
		data: assessment,
	});
});

const deleteAssessment = catchAsync(async (req: Request, res: Response) => {
	const currentUser = req.user as AuthenticatedUser;
	const company = await companyService.getMyCompany(currentUser.id);

	const result = await assessmentService.softDeleteAssessment(req.params.id as string, company.id);

	res.status(StatusCodes.OK).json({
		success: true,
		message: result.message,
		data: null,
	});
});

export const assessmentController = {
	createAssessment,
	getAllAssessments,
	getAssessmentById,
	updateAssessment,
	publishAssessment,
	closeAssessment,
	deleteAssessment,
};