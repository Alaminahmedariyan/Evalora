import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

import { automationMaintenance } from "./automation.maintenance";
import { automationService } from "./automation.service";

const dispatch = catchAsync(async (_req: Request, res: Response) => {
	const result = await automationService.dispatchPendingEvents();

	sendResponse(res, {
		success: true,
		statusCode: StatusCodes.OK,
		message: "Automation events dispatched.",
		data: result,
	});
});

const runMaintenance = catchAsync(async (_req: Request, res: Response) => {
	const result = await automationMaintenance.runMaintenance();

	sendResponse(res, {
		success: true,
		statusCode: StatusCodes.OK,
		message: "Maintenance run completed.",
		data: result,
	});
});

export const automationController = {
	dispatch,
	runMaintenance,
};