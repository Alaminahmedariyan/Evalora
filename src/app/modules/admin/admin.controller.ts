import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { catchAsync } from "../../utils/catchAsync";

import { adminService } from "./admin.service";

const getDashboardStats = catchAsync(async (_req: Request, res: Response) => {
	const stats = await adminService.getDashboardStats();

	res.status(StatusCodes.OK).json({
		success: true,
		message: "Dashboard stats retrieved successfully.",
		data: stats,
	});
});

const getAuditLogs = catchAsync(async (req: Request, res: Response) => {
	const result = await adminService.getAuditLogs(req.query as Record<string, unknown>);

	res.status(StatusCodes.OK).json({
		success: true,
		message: "Audit logs retrieved successfully.",
		meta: result.meta,
		data: result.data,
	});
});

export const adminController = {
	getDashboardStats,
	getAuditLogs,
};