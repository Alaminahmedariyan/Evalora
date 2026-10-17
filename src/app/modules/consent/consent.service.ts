import { StatusCodes } from "http-status-codes";

import type { ConsentType } from "../../../generated/prisma/enums";

import { prisma } from "../../../lib/prisma";
import AppError from "../../errors/appError";

import { CONSENT_SELECT, CONSENT_TYPE_LABELS } from "./consent.const";
import type { ConsentResponse, UpdateConsentInput } from "./consent.interface";

const ALL_CONSENT_TYPES = Object.keys(CONSENT_TYPE_LABELS) as ConsentType[];

const isConsentType = (value: string): value is ConsentType =>
	(ALL_CONSENT_TYPES as string[]).includes(value);

const getMyConsents = async (userId: string) => {
	const consents = await prisma.userConsent.findMany({
		where: { userId },
		select: CONSENT_SELECT,
		orderBy: { grantedAt: "desc" },
	});

	const result: ConsentResponse[] = ALL_CONSENT_TYPES.map((type) => {
		const existing = consents.find((c) => c.consentType === type);
		if (existing) {
			return existing as ConsentResponse;
		}
		return {
			id: "",
			userId,
			consentType: type,
			granted: false,
			grantedAt: new Date(),
			revokedAt: null,
		};
	});

	return result;
};

const updateConsent = async (userId: string, payload: UpdateConsentInput) => {
	const existing = await prisma.userConsent.findUnique({
		where: { userId_consentType: { userId, consentType: payload.consentType } },
	});

	if (existing) {
		if (existing.granted === payload.granted) {
			return await prisma.userConsent.findUniqueOrThrow({
				where: {
					userId_consentType: { userId, consentType: payload.consentType },
				},
				select: CONSENT_SELECT,
			});
		}

		return await prisma.userConsent.update({
			where: {
				userId_consentType: { userId, consentType: payload.consentType },
			},
			data: {
				granted: payload.granted,
				...(payload.granted ? { revokedAt: null } : { revokedAt: new Date() }),
			},
			select: CONSENT_SELECT,
		});
	}

	return await prisma.userConsent.create({
		data: {
			userId,
			consentType: payload.consentType,
			granted: payload.granted,
			...(payload.granted ? {} : { revokedAt: new Date() }),
		},
		select: CONSENT_SELECT,
	});
};

const revokeConsent = async (userId: string, consentType: string) => {
	if (!isConsentType(consentType)) {
		throw new AppError(StatusCodes.BAD_REQUEST, "Unknown consent type.");
	}

	const existing = await prisma.userConsent.findUnique({
		where: { userId_consentType: { userId, consentType } },
	});

	if (!existing) {
		throw new AppError(StatusCodes.NOT_FOUND, "Consent not found.");
	}

	if (!existing.granted) {
		throw new AppError(
			StatusCodes.CONFLICT,
			"This consent is already revoked.",
		);
	}

	return prisma.userConsent.update({
		where: { userId_consentType: { userId, consentType } },
		data: { granted: false, revokedAt: new Date() },
		select: CONSENT_SELECT,
	});
};

export const consentService = {
	getMyConsents,
	updateConsent,
	revokeConsent,
};