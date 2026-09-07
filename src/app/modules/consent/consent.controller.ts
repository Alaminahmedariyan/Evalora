import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import type { AuthenticatedUser } from "../../middlewares/requireAuth";
import { catchAsync } from "../../utils/catchAsync";

import { consentService } from "./consent.service";

const getMyConsents = catchAsync(async (req: Request, res: Response) => {
	const currentUser = req.user as AuthenticatedUser;

	const consents = await consentService.getMyConsents(currentUser.id);

	res.status(StatusCodes.OK).json({
		success: true,
		message: "Consents retrieved successfully.",
		data: consents,
	});
});

const updateConsent = catchAsync(async (req: Request, res: Response) => {
	const currentUser = req.user as AuthenticatedUser;

	const consent = await consentService.updateConsent(currentUser.id, req.body);

	res.status(StatusCodes.OK).json({
		success: true,
		message: "Consent updated successfully.",
		data: consent,
	});
});

const revokeConsent = catchAsync(async (req: Request, res: Response) => {
	const currentUser = req.user as AuthenticatedUser;

	const consent = await consentService.revokeConsent(
		currentUser.id,
		req.params.consentType as string,
	);

	res.status(StatusCodes.OK).json({
		success: true,
		message: "Consent revoked successfully.",
		data: consent,
	});
});

export const consentController = {
	getMyConsents,
	updateConsent,
	revokeConsent,
};
