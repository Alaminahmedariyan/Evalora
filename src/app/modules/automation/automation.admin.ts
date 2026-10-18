import { StatusCodes } from "http-status-codes";

import type { AutomationEventWhereInput } from "../../../generated/prisma/models/AutomationEvent";
import { prisma } from "../../../lib/prisma";
import AppError from "../../errors/appError";

const STATUSES = ["PENDING", "PROCESSING", "DELIVERED", "FAILED"] as const;
type EventStatus = (typeof STATUSES)[number];

const EVENT_LIST_SELECT = {
	id: true,
	eventType: true,
	aggregateType: true,
	aggregateId: true,
	status: true,
	retryCount: true,
	maxRetries: true,
	lastError: true,
	nextRetryAt: true,
	deliveredAt: true,
	createdAt: true,
} as const;

const toPositiveInt = (value: unknown, fallback: number, max: number) => {
	const parsed = Number.parseInt(String(value ?? ""), 10);
	if (!Number.isFinite(parsed) || parsed < 1) return fallback;
	return Math.min(parsed, max);
};

const listEvents = async (query: Record<string, unknown>) => {
	const page = toPositiveInt(query.page, 1, 100_000);
	const limit = toPositiveInt(query.limit, 20, 100);

	const where: AutomationEventWhereInput = {};
	if (
		typeof query.status === "string" &&
		(STATUSES as readonly string[]).includes(query.status)
	) {
		where.status = query.status as EventStatus;
	}
	if (typeof query.eventType === "string" && query.eventType.length > 0) {
		where.eventType = query.eventType;
	}

	const [rows, total] = await Promise.all([
		prisma.automationEvent.findMany({
			where,
			select: EVENT_LIST_SELECT,
			orderBy: { createdAt: "desc" },
			skip: (page - 1) * limit,
			take: limit,
		}),
		prisma.automationEvent.count({ where }),
	]);

	return {
		rows,
		meta: { page, limit, total, totalPage: Math.max(1, Math.ceil(total / limit)) },
	};
};

const getStats = async () => {
	const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

	const [byStatus, last24h, oldestPending] = await Promise.all([
		prisma.automationEvent.groupBy({
			by: ["status"],
			_count: { _all: true },
		}),
		prisma.automationEvent.groupBy({
			by: ["status"],
			where: { createdAt: { gte: since } },
			_count: { _all: true },
		}),
		prisma.automationEvent.findFirst({
			where: { status: "PENDING" },
			orderBy: { createdAt: "asc" },
			select: { createdAt: true },
		}),
	]);

	const toMap = (rows: { status: string; _count: { _all: number } }[]) => {
		const out: Record<string, number> = {
			PENDING: 0,
			PROCESSING: 0,
			DELIVERED: 0,
			FAILED: 0,
		};
		for (const row of rows) out[row.status] = row._count._all;
		return out;
	};

	return {
		total: toMap(byStatus),
		last24h: toMap(last24h),
		oldestPendingAt: oldestPending?.createdAt ?? null,
	};
};

// Only FAILED events can be retried, so an in-flight event is never reset.
const retryEvent = async (id: string) => {
	const result = await prisma.automationEvent.updateMany({
		where: { id, status: "FAILED" },
		data: {
			status: "PENDING",
			retryCount: 0,
			nextRetryAt: null,
			lockedAt: null,
			lastError: null,
		},
	});

	if (result.count === 0) {
		const exists = await prisma.automationEvent.findUnique({
			where: { id },
			select: { status: true },
		});
		if (!exists) {
			throw new AppError(StatusCodes.NOT_FOUND, "Automation event not found.");
		}
		throw new AppError(
			StatusCodes.CONFLICT,
			"Only FAILED events can be retried.",
			"EVENT_NOT_FAILED",
		);
	}

	return prisma.automationEvent.findUnique({
		where: { id },
		select: EVENT_LIST_SELECT,
	});
};

export const automationAdmin = { listEvents, getStats, retryEvent };