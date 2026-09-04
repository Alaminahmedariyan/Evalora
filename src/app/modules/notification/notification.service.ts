import { StatusCodes } from "http-status-codes";

import type { Prisma } from "../../../generated/prisma/client";
import type { NotificationWhereInput } from "../../../generated/prisma/models/Notification";

import { prisma } from "../../../lib/prisma";
import AppError from "../../errors/appError";
import { QueryBuilder } from "../../queryBuilder";

import { NOTIFICATION_SELECT } from "./notification.const";

const notificationQueryBuilder = new QueryBuilder<
	Prisma.NotificationGetPayload<{ select: typeof NOTIFICATION_SELECT }>,
	NotificationWhereInput
>(prisma.notification, {
	searchableFields: ["title", "message"],
	filterableFields: {
		isRead: "boolean",
		type: {
			type: "enum",
			enum: {
				ASSESSMENT_INVITATION: "ASSESSMENT_INVITATION",
				ASSESSMENT_REMINDER: "ASSESSMENT_REMINDER",
				ASSESSMENT_RESULT: "ASSESSMENT_RESULT",
				ATTEMPT_SUBMITTED: "ATTEMPT_SUBMITTED",
				ATTEMPT_EVALUATED: "ATTEMPT_EVALUATED",
				PAYMENT_SUCCESS: "PAYMENT_SUCCESS",
				PAYMENT_FAILED: "PAYMENT_FAILED",
				SYSTEM: "SYSTEM",
			},
		},
		createdAt: "date",
	},
	sortableFields: ["createdAt"],
	selectableFields: Object.keys(NOTIFICATION_SELECT),
	defaultSortField: "createdAt",
});

const getMyNotifications = async (userId: string, query: Record<string, unknown>) => {
	return notificationQueryBuilder.execute(query, { userId });
};

const getUnreadCount = async (userId: string) => {
	const unreadCount = await prisma.notification.count({ where: { userId, isRead: false } });
	return { unreadCount };
};

const markAsRead = async (id: string, userId: string) => {
	const notification = await prisma.notification.findFirst({ where: { id, userId } });

	if (!notification) {
		throw new AppError(StatusCodes.NOT_FOUND, "Notification not found.");
	}

	return prisma.notification.update({ where: { id }, data: { isRead: true }, select: NOTIFICATION_SELECT });
};

const markAllAsRead = async (userId: string) => {
	const result = await prisma.notification.updateMany({ where: { userId, isRead: false }, data: { isRead: true } });
	return { updated: result.count };
};

const deleteNotification = async (id: string, userId: string) => {
	const notification = await prisma.notification.findFirst({ where: { id, userId } });

	if (!notification) {
		throw new AppError(StatusCodes.NOT_FOUND, "Notification not found.");
	}

	await prisma.notification.delete({ where: { id } });

	return { message: "Notification deleted successfully." };
};

export const notificationService = {
	getMyNotifications,
	getUnreadCount,
	markAsRead,
	markAllAsRead,
	deleteNotification,
};