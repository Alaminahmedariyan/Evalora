import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

import { AUTOMATION_EVENT_TYPES } from "./automation.const";
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

const emitTestEvent = catchAsync(async (_req: Request, res: Response) => {
	await automationService.emitEvent({
		eventType: AUTOMATION_EVENT_TYPES.SYSTEM_TEST,
		aggregateType: "System",
		aggregateId: "test",
		payload: {
			message: "Hello from Evalora",
			sentAt: new Date().toISOString(),
		},
	});

	sendResponse(res, {
		success: true,
		statusCode: StatusCodes.CREATED,
		message: "Test event queued.",
		data: null,
	});
});

export const automationController = {
	dispatch,
	emitTestEvent,
};