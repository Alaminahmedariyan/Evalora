import { z } from "zod";

import type { ConsentType } from "../../../generated/prisma/enums";

export const consentTypeSchema = z.enum([
	"MARKETING",
	"ANALYTICS",
	"THIRD_PARTY",
	"PRIVACY_POLICY",
	"TERMS_OF_SERVICE",
]);

export const updateConsentSchema = z.object({
	consentType: consentTypeSchema,
	granted: z.boolean(),
});

export const consentValidation = {
	updateConsentSchema,
};
