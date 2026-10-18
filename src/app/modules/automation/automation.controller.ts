import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

import { automationAi } from "./automation.ai";
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

const getAiInput = catchAsync(async (req: Request, res: Response) => {
	const result = await automationAi.getAiInput(req.params.id as string);

	sendResponse(res, {
		success: true,
		statusCode: StatusCodes.OK,
		message: "AI input retrieved.",
		data: result,
	});
});

const saveAiResult = catchAsync(async (req: Request, res: Response) => {
	const result = await automationAi.saveAiResult(
		req.params.id as string,
		req.body,
	);

	sendResponse(res, {
		success: true,
		statusCode: StatusCodes.OK,
		message: "AI result saved.",
		data: result,
	});
});

export const automationController = {
	dispatch,
	runMaintenance,
	getAiInput,
	saveAiResult,
};