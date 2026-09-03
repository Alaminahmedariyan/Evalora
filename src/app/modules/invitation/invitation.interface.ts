export type InviteCandidatesInput = {
	emails: string[];
	/** Defaults to 7 days if omitted — see invitation.service.ts. */
	expiresInDays?: number;
};