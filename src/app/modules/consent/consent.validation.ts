import { z } from "zod";

import { CONSENT_TYPE_LABELS } from "./consent.const";

const consentTypes = Object.keys(CONSENT_TYPE_LABELS) as [
	keyof typeof CONSENT_TYPE_LABELS,
	...(keyof typeof CONSENT_TYPE_LABELS)[],
];

export const consentTypeSchema = z.enum(consentTypes);

export const updateConsentSchema = z.object({
	consentType: consentTypeSchema,
	granted: z.boolean(),
});

export const consentValidation = {
	updateConsentSchema,
};