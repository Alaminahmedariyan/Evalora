import type { ContactMessageStatus } from "../../../generated/prisma/enums";

export type CreateContactMessageInput = {
	name: string;
	email: string;
	subject: string;
	message: string;
	/** Honeypot — always empty for real visitors. */
	website?: string;
};

export type UpdateContactMessageStatusInput = {
	status: ContactMessageStatus;
};