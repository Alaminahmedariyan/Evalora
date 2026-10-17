import { prisma } from "../../../lib/prisma";
import { escapeHtml } from "../../utils/escapeHtml";
import { sendEmail } from "../../utils/sendEmail";
import { attemptService } from "../attempt/attempt.service";

const HOUR_MS = 60 * 60 * 1000;
const REMINDER_WINDOW_MS = 24 * HOUR_MS;
const BATCH_SIZE = 50;

const reminderEmailTemplate = (assessmentTitle: string, expiresAt: Date) => `
	<div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; color: #111;">
		<h2>Your invitation expires soon</h2>
		<p>Your invitation to <strong>${escapeHtml(assessmentTitle)}</strong> expires within 24 hours.</p>
		<p>Log in to your account and accept the invitation to start the assessment.</p>
		<p style="font-size: 13px; color: #666;">Expires at: ${expiresAt.toUTCString()}</p>
	</div>
`;

/**
 * Finalizes attempts whose time ran out but nobody submitted or opened.
 * getAttemptById already auto-submits an expired IN_PROGRESS attempt, so
 * this reuses that single code path instead of grading separately.
 */
const expireStaleAttempts = async () => {
	const stale = await prisma.assessmentAttempt.findMany({
		where: { status: "IN_PROGRESS", expiresAt: { lt: new Date() } },
		select: { id: true, candidateId: true },
		orderBy: { expiresAt: "asc" },
		take: BATCH_SIZE,
	});

	let finalized = 0;
	let failed = 0;

	for (const attempt of stale) {
		try {
			await attemptService.getAttemptById(attempt.id, {
				id: attempt.candidateId,
				role: "CANDIDATE",
			});
			finalized += 1;
		} catch (error) {
			failed += 1;
			console.error("[Maintenance] Failed to finalize attempt", attempt.id, error);
		}
	}

	return { found: stale.length, finalized, failed };
};

/** PENDING invitations past their expiry become EXPIRED. */
const expireInvitations = async () => {
	const result = await prisma.assessmentInvitation.updateMany({
		where: { status: "PENDING", expiresAt: { lt: new Date() } },
		data: { status: "EXPIRED" },
	});

	return { expired: result.count };
};

/**
 * Sends one reminder per invitation, 24 hours before it expires.
 * reminderSentAt is claimed BEFORE sending, so two overlapping runs can
 * never email the same candidate twice. If sending fails, the claim is
 * released so the next run retries.
 */
const sendInvitationReminders = async () => {
	const now = new Date();

	const due = await prisma.assessmentInvitation.findMany({
		where: {
			status: "PENDING",
			reminderSentAt: null,
			expiresAt: {
				gt: now,
				lte: new Date(now.getTime() + REMINDER_WINDOW_MS),
			},
			assessment: { deletedAt: null, status: { in: ["PUBLISHED", "ACTIVE"] } },
		},
		select: {
			id: true,
			email: true,
			candidateId: true,
			assessmentId: true,
			expiresAt: true,
			assessment: { select: { title: true } },
		},
		orderBy: { expiresAt: "asc" },
		take: BATCH_SIZE,
	});

	let sent = 0;
	let failed = 0;

	for (const invitation of due) {
		if (!invitation.expiresAt) continue;

		const claimed = await prisma.assessmentInvitation.updateMany({
			where: { id: invitation.id, reminderSentAt: null },
			data: { reminderSentAt: now },
		});

		if (claimed.count === 0) continue; // another run already took it

		try {
			await sendEmail({
				to: invitation.email,
				subject: `Reminder: ${invitation.assessment.title} expires soon`,
				html: reminderEmailTemplate(
					invitation.assessment.title,
					invitation.expiresAt,
				),
			});

			if (invitation.candidateId) {
				try {
					await prisma.notification.create({
						data: {
							userId: invitation.candidateId,
							title: "Invitation expires soon",
							message: `Your invitation to "${invitation.assessment.title}" expires within 24 hours.`,
							type: "ASSESSMENT_REMINDER" as const,
							metadata: {
								assessmentId: invitation.assessmentId,
								invitationId: invitation.id,
							},
						},
					});
				} catch (error) {
					console.error("[Maintenance] Failed to create reminder notification", error);
				}
			}

			sent += 1;
		} catch (error) {
			failed += 1;
			console.error("[Maintenance] Reminder failed", invitation.id, error);

			await prisma.assessmentInvitation.updateMany({
				where: { id: invitation.id },
				data: { reminderSentAt: null },
			});
		}
	}

	return { found: due.length, sent, failed };
};

const runMaintenance = async () => {
	// Order matters: expire first, so an expired invitation never gets a reminder.
	const attempts = await expireStaleAttempts();
	const invitations = await expireInvitations();
	const reminders = await sendInvitationReminders();

	return { attempts, invitations, reminders };
};

export const automationMaintenance = {
	expireStaleAttempts,
	expireInvitations,
	sendInvitationReminders,
	runMaintenance,
};