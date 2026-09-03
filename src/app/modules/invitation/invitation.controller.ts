import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import type { AuthenticatedUser } from "../../middlewares/requireAuth";
import { catchAsync } from "../../utils/catchAsync";
import { companyService } from "../company/company.service";

import { invitationService } from "./invitation.service";

/** ADMIN is unscoped; RECRUITER is always scoped to their own company. */
const resolveScopeCompanyId = async (user: AuthenticatedUser): Promise<string | undefined> => {
	if (user.role === "ADMIN") return undefined;
	const company = await companyService.getMyCompany(user.id);
	return company.id;
};

const inviteCandidates = catchAsync(async (req: Request, res: Response) => {
	const currentUser = req.user as AuthenticatedUser;
	const company = await companyService.getMyCompany(currentUser.id);

	const result = await invitationService.inviteCandidates(
		req.params.assessmentId as string,
		company.id,
		req.body,
	);

	res.status(StatusCodes.CREATED).json({
		success: true,
		message: `${result.invited} candidate(s) invited${result.skipped ? `, ${result.skipped} already invited` : ""}.`,
		data: result,
	});
});

const getInvitationsForAssessment = catchAsync(async (req: Request, res: Response) => {
	const currentUser = req.user as AuthenticatedUser;
	const companyId = await resolveScopeCompanyId(currentUser);

	const result = await invitationService.getInvitationsForAssessment(
		req.params.assessmentId as string,
		companyId,
		req.query as Record<string, unknown>,
	);

	res.status(StatusCodes.OK).json({
		success: true,
		message: "Invitations retrieved successfully.",
		meta: result.meta,
		data: result.data,
	});
});

const getMyInvitations = catchAsync(async (req: Request, res: Response) => {
	const currentUser = req.user as AuthenticatedUser;

	const invitations = await invitationService.getMyInvitations(currentUser.id, currentUser.email);

	res.status(StatusCodes.OK).json({
		success: true,
		message: "Invitations retrieved successfully.",
		data: invitations,
	});
});

const getInvitationById = catchAsync(async (req: Request, res: Response) => {
	const currentUser = req.user as AuthenticatedUser;
	const companyId = await resolveScopeCompanyId(currentUser);

	const invitation = await invitationService.getInvitationById(req.params.id as string, {
		id: currentUser.id,
		email: currentUser.email,
		role: currentUser.role,
		companyId,
	});

	res.status(StatusCodes.OK).json({
		success: true,
		message: "Invitation retrieved successfully.",
		data: invitation,
	});
});

const acceptInvitation = catchAsync(async (req: Request, res: Response) => {
	const currentUser = req.user as AuthenticatedUser;

	const invitation = await invitationService.acceptInvitation(
		req.params.id as string,
		currentUser.id,
		currentUser.email,
	);

	res.status(StatusCodes.OK).json({
		success: true,
		message: "Invitation accepted successfully.",
		data: invitation,
	});
});

const declineInvitation = catchAsync(async (req: Request, res: Response) => {
	const currentUser = req.user as AuthenticatedUser;

	const invitation = await invitationService.declineInvitation(
		req.params.id as string,
		currentUser.id,
		currentUser.email,
	);

	res.status(StatusCodes.OK).json({
		success: true,
		message: "Invitation declined.",
		data: invitation,
	});
});

const cancelInvitation = catchAsync(async (req: Request, res: Response) => {
	const currentUser = req.user as AuthenticatedUser;
	const company = await companyService.getMyCompany(currentUser.id);

	const result = await invitationService.cancelInvitation(req.params.id as string, company.id);

	res.status(StatusCodes.OK).json({
		success: true,
		message: result.message,
		data: null,
	});
});

export const invitationController = {
	inviteCandidates,
	getInvitationsForAssessment,
	getMyInvitations,
	getInvitationById,
	acceptInvitation,
	declineInvitation,
	cancelInvitation,
};