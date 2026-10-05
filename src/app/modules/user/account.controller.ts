import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import type { AuthenticatedUser } from "../../middlewares/requireAuth";
import { catchAsync } from "../../utils/catchAsync";

import { accountService } from "./account.service";

const exportMyData = catchAsync(async (req: Request, res: Response) => {
	const currentUser = req.user as AuthenticatedUser;
	const data = await accountService.exportMyData(currentUser.id);

	// Personal data: never let a browser or proxy keep a copy.
	res.setHeader("Cache-Control", "no-store");

	res.status(StatusCodes.OK).json({
		success: true,
		message: "Your data export is ready.",
		data,
	});
});

const deleteMyAccount = catchAsync(async (req: Request, res: Response) => {
	const currentUser = req.user as AuthenticatedUser;
	const result = await accountService.deleteMyAccount(
		currentUser.id,
		req.body.confirmEmail,
	);

	res.status(StatusCodes.OK).json({
		success: true,
		message: result.message,
		data: null,
	});
});

export const accountController = { exportMyData, deleteMyAccount };