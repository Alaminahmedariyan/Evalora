import { StatusCodes } from "http-status-codes";

import { prisma } from "../../../lib/prisma";
import AppError from "../../errors/appError";

import { CONSENT_SELECT } from "./consent.const";
import type { ConsentResponse, UpdateConsentInput } from "./consent.interface";

const getMyConsents = async (userId: string) => {
	const consents = await prisma.userConsent.findMany({
		where: { userId },
		select: CONSENT_SELECT,
		orderBy: { grantedAt: "desc" },
	});

	const allTypes = ["MARKETING", "ANALYTICS", "THIRD_PARTY", "PRIVACY_POLICY", "TERMS_OF_SERVICE"] as const;

	const result: ConsentResponse[] = allTypes.map((type) => {
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
				where: { userId_consentType: { userId, consentType: payload.consentType } },
				select: CONSENT_SELECT,
			});
		}

		return await prisma.userConsent.update({
			where: { userId_consentType: { userId, consentType: payload.consentType } },
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
	const existing = await prisma.userConsent.findUnique({
		where: { userId_consentType: { userId, consentType: consentType as any } },
	});

	if (!existing) {
		throw new AppError(StatusCodes.NOT_FOUND, "Consent not found.");
	}

	if (!existing.granted) {
		throw new AppError(StatusCodes.CONFLICT, "This consent is already revoked.");
	}

	return prisma.userConsent.update({
		where: { userId_consentType: { userId, consentType: consentType as any } },
		data: { granted: false, revokedAt: new Date() },
		select: CONSENT_SELECT,
	});
};

export const consentService = {
	getMyConsents,
	updateConsent,
	revokeConsent,
};
