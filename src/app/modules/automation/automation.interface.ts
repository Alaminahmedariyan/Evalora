import type { Prisma } from "../../../generated/prisma/client";

export type EmitEventInput = {
	eventType: string;
	aggregateType: string;
	aggregateId: string;
	payload: Prisma.InputJsonValue;
	dedupeKey?: string;
};

export type AutomationEventRecord = {
	id: string;
	eventType: string;
	aggregateType: string;
	aggregateId: string;
	payload: Prisma.JsonValue;
	retryCount: number;
	maxRetries: number;
	createdAt: Date;
};

export type DispatchResult = {
	claimed: number;
	delivered: number;
	failed: number;
};