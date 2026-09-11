import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { getCompanyIdForUser } from "../../../lib/getCompanyIdForUser";
import type { AuthenticatedUser } from "../../middlewares/requireAuth";
import { catchAsync } from "../../utils/catchAsync";

import { assessmentService } from "./assessment.service";

const createAssessment = catchAsync(async (req: Request, res: Response) => {
	const currentUser = req.user as AuthenticatedUser;
	const companyId = (await getCompanyIdForUser(currentUser, req))!;

	const assessment = await assessmentService.createAssessment(
		companyId,
		currentUser.id,
		req.body,
	);

	res.status(StatusCodes.CREATED).json({
		success: true,
		message: "Assessment created successfully.",
		data: assessment,
	});
});

const getAllAssessments = catchAsync(async (req: Request, res: Response) => {
	const currentUser = req.user as AuthenticatedUser;
	const companyId = (await getCompanyIdForUser(currentUser, req)) ?? undefined;

	const result = await assessmentService.getAllAssessments(
		req.query as Record<string, unknown>,
		companyId,
	);

	res.status(StatusCodes.OK).json({
		success: true,
		message: "Assessments retrieved successfully.",
		meta: result.meta,
		data: result.data,
	});
});

const getAssessmentById = catchAsync(async (req: Request, res: Response) => {
	const currentUser = req.user as AuthenticatedUser;
	const companyId = (await getCompanyIdForUser(currentUser, req)) ?? undefined;

	const assessment = await assessmentService.getAssessmentById(
		req.params.id as string,
		companyId,
	);

	res.status(StatusCodes.OK).json({
		success: true,
		message: "Assessment retrieved successfully.",
		data: assessment,
	});
});

const updateAssessment = catchAsync(async (req: Request, res: Response) => {
	const currentUser = req.user as AuthenticatedUser;
	const companyId = (await getCompanyIdForUser(currentUser, req))!;

	const assessment = await assessmentService.updateAssessment(
		req.params.id as string,
		companyId,
		req.body,
	);

	res.status(StatusCodes.OK).json({
		success: true,
		message: "Assessment updated successfully.",
		data: assessment,
	});
});

const publishAssessment = catchAsync(async (req: Request, res: Response) => {
	const currentUser = req.user as AuthenticatedUser;
	const companyId = (await getCompanyIdForUser(currentUser, req))!;

	const assessment = await assessmentService.publishAssessment(
		req.params.id as string,
		companyId,
	);

	res.status(StatusCodes.OK).json({
		success: true,
		message: "Assessment published successfully.",
		data: assessment,
	});
});

const closeAssessment = catchAsync(async (req: Request, res: Response) => {
	const currentUser = req.user as AuthenticatedUser;
	const companyId = (await getCompanyIdForUser(currentUser, req))!;

	const assessment = await assessmentService.closeAssessment(
		req.params.id as string,
		companyId,
	);

	res.status(StatusCodes.OK).json({
		success: true,
		message: "Assessment closed successfully.",
		data: assessment,
	});
});

const deleteAssessment = catchAsync(async (req: Request, res: Response) => {
	const currentUser = req.user as AuthenticatedUser;
	const companyId = (await getCompanyIdForUser(currentUser, req))!;

	const result = await assessmentService.softDeleteAssessment(
		req.params.id as string,
		companyId,
	);

	res.status(StatusCodes.OK).json({
		success: true,
		message: result.message,
		data: null,
	});
});

const createAssessmentVersion = catchAsync(
	async (req: Request, res: Response) => {
		const currentUser = req.user as AuthenticatedUser;
		const companyId = (await getCompanyIdForUser(currentUser, req))!;

		const assessment = await assessmentService.createAssessmentVersion(
			req.params.id as string,
			companyId,
		);

		res.status(StatusCodes.CREATED).json({
			success: true,
			message: "New version created successfully.",
			data: assessment,
		});
	},
);

const getAssessmentVersions = catchAsync(
	async (req: Request, res: Response) => {
		const currentUser = req.user as AuthenticatedUser;
		const companyId = (await getCompanyIdForUser(currentUser, req)) ?? undefined;

		const versions = await assessmentService.getAssessmentVersions(
			req.params.id as string,
			companyId,
		);

		res.status(StatusCodes.OK).json({
			success: true,
			message: "Assessment versions retrieved successfully.",
			data: versions,
		});
	},
);

const restoreAssessmentVersion = catchAsync(
	async (req: Request, res: Response) => {
		const currentUser = req.user as AuthenticatedUser;
		const companyId = (await getCompanyIdForUser(currentUser, req))!;

		const assessment = await assessmentService.restoreAssessmentVersion(
			req.params.id as string,
			companyId,
		);

		res.status(StatusCodes.OK).json({
			success: true,
			message:
				"Assessment version restored successfully. A new draft version has been created.",
			data: assessment,
		});
	},
);

export const assessmentController = {
	createAssessment,
	getAllAssessments,
	getAssessmentById,
	updateAssessment,
	publishAssessment,
	closeAssessment,
	deleteAssessment,
	createAssessmentVersion,
	getAssessmentVersions,
	restoreAssessmentVersion,
};
