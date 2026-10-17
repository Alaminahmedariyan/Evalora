import { StatusCodes } from "http-status-codes";

import type { Prisma } from "../../../generated/prisma/client";
import type { AutomationEventWhereInput } from "../../../generated/prisma/models/AutomationEvent";

import { prisma } from "../../../lib/prisma";
import config from "../../config";
import AppError from "../../errors/appError";

import { AUTOMATION_DISPATCH } from "./automation.const";
import type {
	AutomationEventRecord,
	DispatchResult,
	EmitEventInput,
} from "./automation.interface";
import { signAutomationPayload } from "./automation.signature";

type EventDb = Pick<Prisma.TransactionClient, "automationEvent">;

/**
 * Pass a transaction client as `db` to make the event part of the same
 * transaction as the business change. `skipDuplicates` turns a repeated
 * `dedupeKey` into a no-op instead of an error, so it is safe inside a
 * transaction.
 */
const emitEvent = async (
	input: EmitEventInput,
	db: EventDb = prisma,
): Promise<void> => {
	await db.automationEvent.createMany({
		data: [
			{
				eventType: input.eventType,
				aggregateType: input.aggregateType,
				aggregateId: input.aggregateId,
				payload: input.payload,
				dedupeKey: input.dedupeKey ?? null,
			},
		],
		skipDuplicates: true,
	});
};

const claimEvents = async (limit: number): Promise<AutomationEventRecord[]> => {
	const now = new Date();
	const staleBefore = new Date(
		now.getTime() - AUTOMATION_DISPATCH.LOCK_TIMEOUT_MS,
	);

	const claimable: AutomationEventWhereInput = {
		OR: [
			{
				status: "PENDING",
				OR: [{ nextRetryAt: null }, { nextRetryAt: { lte: now } }],
			},
			{ status: "PROCESSING", lockedAt: { lt: staleBefore } },
		],
	};

	const candidates = await prisma.automationEvent.findMany({
		where: claimable,
		orderBy: { createdAt: "asc" },
		take: limit,
		select: { id: true },
	});

	if (candidates.length === 0) return [];

	const ids = candidates.map((candidate) => candidate.id);

	await prisma.automationEvent.updateMany({
		where: { AND: [{ id: { in: ids } }, claimable] },
		data: { status: "PROCESSING", lockedAt: now },
	});

	return prisma.automationEvent.findMany({
		where: { id: { in: ids }, status: "PROCESSING", lockedAt: now },
		orderBy: { createdAt: "asc" },
	});
};

const markDelivered = async (id: string): Promise<void> => {
	await prisma.automationEvent.update({
		where: { id },
		data: {
			status: "DELIVERED",
			deliveredAt: new Date(),
			lockedAt: null,
			lastError: null,
		},
	});
};

const markFailedAttempt = async (
	event: AutomationEventRecord,
	message: string,
): Promise<void> => {
	const retryCount = event.retryCount + 1;
	const exhausted = retryCount >= event.maxRetries;
	const delaySeconds = Math.min(
		AUTOMATION_DISPATCH.BASE_RETRY_DELAY_SECONDS * 2 ** retryCount,
		AUTOMATION_DISPATCH.MAX_RETRY_DELAY_SECONDS,
	);

	await prisma.automationEvent.update({
		where: { id: event.id },
		data: {
			status: exhausted ? "FAILED" : "PENDING",
			retryCount,
			lockedAt: null,
			lastError: message.slice(0, 500),
			nextRetryAt: exhausted ? null : new Date(Date.now() + delaySeconds * 1000),
		},
	});
};

const deliverEvent = async (
	event: AutomationEventRecord,
	webhookUrl: string,
	webhookSecret: string,
): Promise<boolean> => {
	const body = JSON.stringify({
		id: event.id,
		type: event.eventType,
		aggregateType: event.aggregateType,
		aggregateId: event.aggregateId,
		occurredAt: event.createdAt.toISOString(),
		data: event.payload,
	});

	const timestamp = Date.now().toString();
	const signature = signAutomationPayload(body, webhookSecret, timestamp);

	try {
		const response = await fetch(webhookUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-Event-Type": event.eventType,
				"X-Idempotency-Key": event.id,
				"X-Timestamp": timestamp,
				"X-Signature": `sha256=${signature}`,
			},
			body,
			signal: AbortSignal.timeout(AUTOMATION_DISPATCH.REQUEST_TIMEOUT_MS),
		});

		if (!response.ok) {
			throw new Error(`n8n responded with status ${response.status}`);
		}

		await markDelivered(event.id);
		return true;
	} catch (error) {
		await markFailedAttempt(
			event,
			error instanceof Error ? error.message : "Unknown delivery error",
		);
		return false;
	}
};

const dispatchPendingEvents = async (): Promise<DispatchResult> => {
	const { webhookUrl, webhookSecret } = config.n8n;

	if (!webhookUrl || !webhookSecret) {
		throw new AppError(
			StatusCodes.SERVICE_UNAVAILABLE,
			"n8n webhook is not configured.",
			"AUTOMATION_NOT_CONFIGURED",
		);
	}

	const events = await claimEvents(AUTOMATION_DISPATCH.BATCH_SIZE);

	const results = await Promise.all(
		events.map((event) => deliverEvent(event, webhookUrl, webhookSecret)),
	);

	const delivered = results.filter(Boolean).length;

	return {
		claimed: events.length,
		delivered,
		failed: events.length - delivered,
	};
};

export const automationService = {
	emitEvent,
	dispatchPendingEvents,
};