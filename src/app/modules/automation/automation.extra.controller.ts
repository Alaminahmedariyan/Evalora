import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

import { automationAdmin } from "./automation.admin";
import { automationReport } from "./automation.report";

const idParam = (req: Request): string => String(req.params.id ?? "");

const getReportInput = catchAsync(async (req: Request, res: Response) => {
	const data = await automationReport.getReportInput(idParam(req));
	sendResponse(res, {
		success: true,
		statusCode: StatusCodes.OK,
		message: "Report input fetched.",
		data,
	});
});

const saveReportResult = catchAsync(async (req: Request, res: Response) => {
	const data = await automationReport.saveReportResult(idParam(req), req.body);
	sendResponse(res, {
		success: true,
		statusCode: StatusCodes.OK,
		message: "Report saved.",
		data,
	});
});

const listEvents = catchAsync(async (req: Request, res: Response) => {
	const { rows, meta } = await automationAdmin.listEvents(
		req.query as Record<string, unknown>,
	);
	sendResponse(res, {
		success: true,
		statusCode: StatusCodes.OK,
		message: "Automation events fetched.",
		data: rows,
		meta,
	});
});

const getStats = catchAsync(async (_req: Request, res: Response) => {
	const data = await automationAdmin.getStats();
	sendResponse(res, {
		success: true,
		statusCode: StatusCodes.OK,
		message: "Automation stats fetched.",
		data,
	});
});

const retryEvent = catchAsync(async (req: Request, res: Response) => {
	const data = await automationAdmin.retryEvent(idParam(req));
	sendResponse(res, {
		success: true,
		statusCode: StatusCodes.OK,
		message: "Event queued for retry.",
		data,
	});
});

export const automationExtraController = {
	getReportInput,
	saveReportResult,
	listEvents,
	getStats,
	retryEvent,
};