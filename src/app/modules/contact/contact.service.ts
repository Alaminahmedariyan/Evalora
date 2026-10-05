import { StatusCodes } from "http-status-codes";

import type { ContactMessageWhereInput } from "../../../generated/prisma/models/ContactMessage";

import { prisma } from "../../../lib/prisma";
import config from "../../config";
import AppError from "../../errors/appError";
import { escapeHtml } from "../../utils/escapeHtml";
import { sendEmail } from "../../utils/sendEmail";

import { CONTACT_MESSAGE_SELECT } from "./contact.const";
import type {
	CreateContactMessageInput,
	UpdateContactMessageStatusInput,
} from "./contact.interface";

type StoredMessage = {
	id: string;
	name: string;
	email: string;
	subject: string;
	message: string;
};

const adminEmailHtml = (m: StoredMessage) => `
	<div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color: #111;">
		<h2>New contact message</h2>
		<p><strong>From:</strong> ${escapeHtml(m.name)} &lt;${escapeHtml(m.email)}&gt;</p>
		<p><strong>Subject:</strong> ${escapeHtml(m.subject)}</p>
		<p style="white-space: pre-wrap;">${escapeHtml(m.message)}</p>
		<p style="font-size: 13px; color: #666;">
			Reply to ${escapeHtml(m.email)} directly, or manage messages in the admin dashboard.
		</p>
	</div>
`;

/**
 * Best-effort: the message is already saved, so a notification or email
 * problem must never turn the visitor's request into an error.
 */
const notifyAdmins = async (stored: StoredMessage) => {
	try {
		const admins = await prisma.user.findMany({
			where: { role: "ADMIN", status: "ACTIVE", deletedAt: null },
			select: { id: true },
		});

		if (admins.length > 0) {
			await prisma.notification.createMany({
				data: admins.map((admin) => ({
					userId: admin.id,
					title: "New contact message",
					message: `${stored.name}: ${stored.subject}`,
					type: "SYSTEM" as const,
					metadata: { contactMessageId: stored.id },
				})),
			});
		}
	} catch (error) {
		console.error("[Contact] Failed to create admin notifications:", error);
	}

	try {
		await sendEmail({
			to: config.superAdmin.email,
			subject: `New contact message: ${stored.subject}`,
			html: adminEmailHtml(stored),
		});
	} catch (error) {
		console.error("[Contact] Failed to email the admin:", error);
	}
};

const createMessage = async (payload: CreateContactMessageInput) => {
	// Honeypot: real visitors never see or fill this field. Bots get the
	// same success response, so they can't tell they were dropped.
	if (payload.website && payload.website.trim() !== "") {
		return { received: true };
	}

	const stored = await prisma.contactMessage.create({
		data: {
			name: payload.name,
			email: payload.email,
			subject: payload.subject,
			message: payload.message,
		},
		select: CONTACT_MESSAGE_SELECT,
	});

	await notifyAdmins(stored);

	return { received: true };
};

// ---------------------------------------------------------------------------
// admin
// ---------------------------------------------------------------------------

const str = (value: unknown): string | undefined =>
	typeof value === "string" && value.trim() ? value.trim() : undefined;

const getMessages = async (query: Record<string, unknown>) => {
	const page = Math.max(1, Number.parseInt(String(query.page ?? "1"), 10) || 1);
	const limit = Math.min(
		50,
		Math.max(1, Number.parseInt(String(query.limit ?? "10"), 10) || 10),
	);
	const status = str(query.status);
	const search = str(query.search)?.slice(0, 100);

	const where: ContactMessageWhereInput = {
		...(status === "NEW" || status === "READ" ? { status } : {}),
		...(search && {
			OR: [
				{ name: { contains: search, mode: "insensitive" } },
				{ email: { contains: search, mode: "insensitive" } },
				{ subject: { contains: search, mode: "insensitive" } },
			],
		}),
	};

	const [total, messages] = await Promise.all([
		prisma.contactMessage.count({ where }),
		prisma.contactMessage.findMany({
			where,
			select: CONTACT_MESSAGE_SELECT,
			orderBy: [{ createdAt: "desc" }, { id: "desc" }],
			skip: (page - 1) * limit,
			take: limit,
		}),
	]);

	return {
		data: messages,
		meta: { page, limit, total, totalPage: Math.max(1, Math.ceil(total / limit)) },
	};
};

const updateStatus = async (
	id: string,
	payload: UpdateContactMessageStatusInput,
) => {
	const existing = await prisma.contactMessage.findUnique({
		where: { id },
		select: { id: true },
	});

	if (!existing) {
		throw new AppError(StatusCodes.NOT_FOUND, "Message not found.");
	}

	return prisma.contactMessage.update({
		where: { id },
		data: {
			status: payload.status,
			readAt: payload.status === "READ" ? new Date() : null,
		},
		select: CONTACT_MESSAGE_SELECT,
	});
};

const deleteMessage = async (id: string) => {
	const existing = await prisma.contactMessage.findUnique({
		where: { id },
		select: { id: true },
	});

	if (!existing) {
		throw new AppError(StatusCodes.NOT_FOUND, "Message not found.");
	}

	await prisma.contactMessage.delete({ where: { id } });

	return { message: "Message deleted successfully." };
};

export const contactService = {
	createMessage,
	getMessages,
	updateStatus,
	deleteMessage,
};