import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import type { AuthenticatedUser } from "../../middlewares/requireAuth";
import { catchAsync } from "../../utils/catchAsync";

import { notificationService } from "./notification.service";

const getMyNotifications = catchAsync(async (req: Request, res: Response) => {
	const currentUser = req.user as AuthenticatedUser;

	const result = await notificationService.getMyNotifications(currentUser.id, req.query as Record<string, unknown>);

	res.status(StatusCodes.OK).json({
		success: true,
		message: "Notifications retrieved successfully.",
		meta: result.meta,
		data: result.data,
	});
});

const getUnreadCount = catchAsync(async (req: Request, res: Response) => {
	const currentUser = req.user as AuthenticatedUser;

	const result = await notificationService.getUnreadCount(currentUser.id);

	res.status(StatusCodes.OK).json({
		success: true,
		message: "Unread count retrieved successfully.",
		data: result,
	});
});

const markAsRead = catchAsync(async (req: Request, res: Response) => {
	const currentUser = req.user as AuthenticatedUser;

	const notification = await notificationService.markAsRead(req.params.id as string, currentUser.id);

	res.status(StatusCodes.OK).json({
		success: true,
		message: "Notification marked as read.",
		data: notification,
	});
});

const markAllAsRead = catchAsync(async (req: Request, res: Response) => {
	const currentUser = req.user as AuthenticatedUser;

	const result = await notificationService.markAllAsRead(currentUser.id);

	res.status(StatusCodes.OK).json({
		success: true,
		message: `${result.updated} notification(s) marked as read.`,
		data: result,
	});
});

const deleteNotification = catchAsync(async (req: Request, res: Response) => {
	const currentUser = req.user as AuthenticatedUser;

	const result = await notificationService.deleteNotification(req.params.id as string, currentUser.id);

	res.status(StatusCodes.OK).json({
		success: true,
		message: result.message,
		data: null,
	});
});

export const notificationController = {
	getMyNotifications,
	getUnreadCount,
	markAsRead,
	markAllAsRead,
	deleteNotification,
};