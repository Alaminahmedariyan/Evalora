import type { ConsentType } from "../../../generated/prisma/enums";

export const CONSENT_SELECT = {
	id: true,
	userId: true,
	consentType: true,
	granted: true,
	grantedAt: true,
	revokedAt: true,
} as const;

export const CONSENT_TYPE_LABELS: Record<ConsentType, string> = {
	MARKETING: "Marketing communications",
	ANALYTICS: "Analytics and performance tracking",
	THIRD_PARTY: "Third-party data sharing",
	PRIVACY_POLICY: "Privacy policy",
	TERMS_OF_SERVICE: "Terms of service",
};
