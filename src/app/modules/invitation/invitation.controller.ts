import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { getCompanyIdForUser } from "../../../lib/getCompanyIdForUser";
import type { AuthenticatedUser } from "../../middlewares/requireAuth";
import { catchAsync } from "../../utils/catchAsync";

import { invitationService } from "./invitation.service";

const inviteCandidates = catchAsync(async (req: Request, res: Response) => {
	const currentUser = req.user as AuthenticatedUser;
	const companyId = (await getCompanyIdForUser(currentUser, req))!;

	const result = await invitationService.inviteCandidates(
		req.params.assessmentId as string,
		companyId,
		req.body,
	);

	res.status(StatusCodes.CREATED).json({
		success: true,
		message: `${result.invited} candidate(s) invited${result.skipped ? `, ${result.skipped} already invited` : ""}.`,
		data: result,
	});
});

const getInvitationsForAssessment = catchAsync(
	async (req: Request, res: Response) => {
		const currentUser = req.user as AuthenticatedUser;
		const companyId = (await getCompanyIdForUser(currentUser, req)) ?? undefined;

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
	},
);

const getMyInvitations = catchAsync(async (req: Request, res: Response) => {
	const currentUser = req.user as AuthenticatedUser;

	const invitations = await invitationService.getMyInvitations(
		currentUser.id,
		currentUser.email,
	);

	res.status(StatusCodes.OK).json({
		success: true,
		message: "Invitations retrieved successfully.",
		data: invitations,
	});
});

const getInvitationById = catchAsync(async (req: Request, res: Response) => {
	const currentUser = req.user as AuthenticatedUser;
	const companyId =
		currentUser.role === "RECRUITER"
			? (await getCompanyIdForUser(currentUser, req)) ?? undefined
			: undefined;

	const invitation = await invitationService.getInvitationById(
		req.params.id as string,
		{
			id: currentUser.id,
			email: currentUser.email,
			role: currentUser.role,
			...(companyId !== undefined && { companyId }),
		},
	);

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
	const companyId = (await getCompanyIdForUser(currentUser, req))!;

	const result = await invitationService.cancelInvitation(
		req.params.id as string,
		companyId,
	);

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
