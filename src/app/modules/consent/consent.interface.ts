import type { ConsentType } from "../../../generated/prisma/enums";

export type UpdateConsentInput = {
	consentType: ConsentType;
	granted: boolean;
};

export type ConsentResponse = {
	id: string;
	userId: string;
	consentType: ConsentType;
	granted: boolean;
	grantedAt: Date;
	revokedAt: Date | null;
};
