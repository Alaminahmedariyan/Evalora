import { createHash, randomUUID } from "node:crypto";

import { StatusCodes } from "http-status-codes";

import type { AssessmentStatus, InvitationStatus, UserRole } from "../../../generated/prisma/enums";
import type { AssessmentInvitationWhereInput } from "../../../generated/prisma/models/AssessmentInvitation";

import { prisma } from "../../../lib/prisma";
import AppError from "../../errors/appError";
import { QueryBuilder } from "../../queryBuilder";
import type { PrismaDelegate } from "../../queryBuilder/types";
import { sendEmail } from "../../utils/sendEmail";

import { INVITATION_SELECT } from "./invitation.const";
import type { InviteCandidatesInput } from "./invitation.interface";

const generateInvitationToken = () => createHash("sha256").update(randomUUID()).digest("hex");

const invitationEmailTemplate = (assessmentTitle: string, expiresAt: Date) => `
	<div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; color: #111;">
		<h2>You've been invited to an assessment</h2>
		<p>You've been invited to take the assessment: <strong>${assessmentTitle}</strong>.</p>
		<p>Log in to your account and check your invitations to accept and start.</p>
		<p style="font-size: 13px; color: #666;">This invitation expires on ${expiresAt.toDateString()}.</p>
	</div>
`;

/**
 * Prisma 7's `prisma-client` generator doesn't expose an `XGetPayload`
 * helper, so the result shape is derived manually from INVITATION_SELECT.
 * The delegate is also cast to PrismaDelegate<T> because Prisma 7's
 * generated delegate types don't structurally satisfy QueryBuilder's
 * simplified PrismaDelegate interface once the select shape includes a
 * nested relation.
 */
type InvitationResult = {
	id: string;
	assessmentId: string;
	candidateId: string | null;
	email: string;
	status: InvitationStatus;
	invitedAt: Date;
	acceptedAt: Date | null;
	expiresAt: Date | null;
	completedAt: Date | null;
	assessment: {
		id: string;
		title: string;
		slug: string;
		status: AssessmentStatus;
		durationMinutes: number;
		totalMarks: number;
		passingMarks: number;
		companyId: string;
	};
};

const invitationQueryBuilder = new QueryBuilder<InvitationResult, AssessmentInvitationWhereInput>(
	prisma.assessmentInvitation as unknown as PrismaDelegate<InvitationResult, AssessmentInvitationWhereInput>,
	{
	searchableFields: ["email"],
	filterableFields: {
		status: {
			type: "enum",
			enum: { PENDING: "PENDING", ACCEPTED: "ACCEPTED", DECLINED: "DECLINED", EXPIRED: "EXPIRED", COMPLETED: "COMPLETED" },
		},
		invitedAt: "date",
	},
	sortableFields: ["invitedAt", "expiresAt"],
	selectableFields: Object.keys(INVITATION_SELECT),
	defaultSelect: INVITATION_SELECT,
	defaultSortField: "invitedAt",
});

/**
 * Bulk-invite by email. Skips emails already invited to this assessment
 * (unique on [assessmentId, email]) rather than erroring the whole batch.
 * If an email matches an existing CANDIDATE account, the invitation is
 * linked to that user immediately; otherwise it stays email-only until
 * getMyInvitations() opportunistically links it after they register.
 */
const inviteCandidates = async (assessmentId: string, companyId: string, payload: InviteCandidatesInput) => {
	const assessment = await prisma.assessment.findFirst({
		where: { id: assessmentId, companyId, deletedAt: null },
	});

	if (!assessment) {
		throw new AppError(StatusCodes.NOT_FOUND, "Assessment not found.");
	}

	if (assessment.status !== "PUBLISHED" && assessment.status !== "ACTIVE") {
		throw new AppError(StatusCodes.CONFLICT, "Candidates can only be invited to a published assessment.");
	}

	const uniqueEmails = Array.from(new Set(payload.emails.map((email) => email.toLowerCase())));

	const alreadyInvited = await prisma.assessmentInvitation.findMany({
		where: { assessmentId, email: { in: uniqueEmails } },
		select: { email: true },
	});
	const alreadyInvitedSet = new Set(alreadyInvited.map((invitation) => invitation.email));
	const emailsToInvite = uniqueEmails.filter((email) => !alreadyInvitedSet.has(email));

	if (emailsToInvite.length === 0) {
		return { invited: 0, skipped: uniqueEmails.length, invitations: [] };
	}

	// Only auto-link to CANDIDATE accounts — an email that happens to match
	// a recruiter/admin shouldn't silently become "invited as a candidate".
	const matchingCandidates = await prisma.user.findMany({
		where: { email: { in: emailsToInvite }, role: "CANDIDATE", deletedAt: null },
		select: { id: true, email: true },
	});
	const candidateIdByEmail = new Map(matchingCandidates.map((user) => [user.email.toLowerCase(), user.id]));

	const expiresAt = new Date(Date.now() + (payload.expiresInDays ?? 7) * 24 * 60 * 60 * 1000);

	const created = await prisma.$transaction(
		emailsToInvite.map((email) =>
			prisma.assessmentInvitation.create({
				data: {
					assessmentId,
					email,
					candidateId: candidateIdByEmail.get(email) ?? null,
					status: "PENDING",
					tokenHash: generateInvitationToken(),
					expiresAt,
				},
				select: INVITATION_SELECT,
			}),
		),
	);

	// Best-effort — a failed email send shouldn't roll back invitations that
	// were already committed to the database.
	await Promise.all(
		created.map((invitation) =>
			sendEmail({
				to: invitation.email,
				subject: `You're invited: ${assessment.title}`,
				html: invitationEmailTemplate(assessment.title, expiresAt),
			}),
		),
	);

	return { invited: created.length, skipped: uniqueEmails.length - emailsToInvite.length, invitations: created };
};

const getInvitationsForAssessment = async (
	assessmentId: string,
	companyId: string | undefined,
	query: Record<string, unknown>,
) => {
	if (!companyId) {
		throw new AppError(StatusCodes.FORBIDDEN, "Recruiter scope could not be resolved.");
	}

	const assessment = await prisma.assessment.findFirst({
		where: { id: assessmentId, companyId, deletedAt: null },
	});

	if (!assessment) {
		throw new AppError(StatusCodes.NOT_FOUND, "Assessment not found.");
	}

	return invitationQueryBuilder.execute(query, { assessmentId });
};

/**
 * Also opportunistically links any invitations sent to this email before
 * the candidate registered — so a candidate who was invited by email,
 * then signed up afterward, still sees the invitation under "my
 * invitations" without the recruiter needing to re-invite them.
 */
const getMyInvitations = async (userId: string, email: string) => {
	await prisma.assessmentInvitation.updateMany({
		where: { email: email.toLowerCase(), candidateId: null },
		data: { candidateId: userId },
	});

	return prisma.assessmentInvitation.findMany({
		where: { candidateId: userId },
		select: INVITATION_SELECT,
		orderBy: { invitedAt: "desc" },
	});
};

const getInvitationById = async (
	id: string,
	requester: { id: string; email: string; role: UserRole; companyId?: string },
) => {
	const invitation = await prisma.assessmentInvitation.findUnique({
		where: { id },
		select: INVITATION_SELECT,
	});

	if (!invitation) {
		throw new AppError(StatusCodes.NOT_FOUND, "Invitation not found.");
	}

	const isInvitedCandidate =
		invitation.candidateId === requester.id || invitation.email.toLowerCase() === requester.email.toLowerCase();
	const isOwningRecruiter =
		requester.companyId !== undefined && invitation.assessment.companyId === requester.companyId;

	if (requester.role !== "ADMIN" && !isInvitedCandidate && !isOwningRecruiter) {
		throw new AppError(StatusCodes.FORBIDDEN, "You don't have permission to view this invitation.");
	}

	return invitation;
};

const acceptInvitation = async (id: string, userId: string, email: string) => {
	const invitation = await prisma.assessmentInvitation.findUnique({
		where: { id },
		include: { assessment: true },
	});

	if (!invitation) {
		throw new AppError(StatusCodes.NOT_FOUND, "Invitation not found.");
	}

	const belongsToUser =
		invitation.candidateId === userId || invitation.email.toLowerCase() === email.toLowerCase();

	if (!belongsToUser) {
		throw new AppError(StatusCodes.FORBIDDEN, "This invitation does not belong to your account.");
	}

	if (invitation.status === "PENDING" && invitation.expiresAt && invitation.expiresAt < new Date()) {
		await prisma.assessmentInvitation.update({ where: { id }, data: { status: "EXPIRED" } });
		throw new AppError(StatusCodes.GONE, "This invitation has expired.");
	}

	if (invitation.status !== "PENDING") {
		throw new AppError(StatusCodes.CONFLICT, `This invitation is already ${invitation.status.toLowerCase()}.`);
	}

	if (invitation.assessment.status !== "PUBLISHED" && invitation.assessment.status !== "ACTIVE") {
		throw new AppError(StatusCodes.CONFLICT, "This assessment is no longer accepting candidates.");
	}

	return prisma.assessmentInvitation.update({
		where: { id },
		data: { status: "ACCEPTED", candidateId: userId, acceptedAt: new Date() },
		select: INVITATION_SELECT,
	});
};

const declineInvitation = async (id: string, userId: string, email: string) => {
	const invitation = await prisma.assessmentInvitation.findUnique({ where: { id } });

	if (!invitation) {
		throw new AppError(StatusCodes.NOT_FOUND, "Invitation not found.");
	}

	const belongsToUser =
		invitation.candidateId === userId || invitation.email.toLowerCase() === email.toLowerCase();

	if (!belongsToUser) {
		throw new AppError(StatusCodes.FORBIDDEN, "This invitation does not belong to your account.");
	}

	if (invitation.status !== "PENDING") {
		throw new AppError(StatusCodes.CONFLICT, `This invitation is already ${invitation.status.toLowerCase()}.`);
	}

	return prisma.assessmentInvitation.update({
		where: { id },
		data: { status: "DECLINED", candidateId: invitation.candidateId ?? userId },
		select: INVITATION_SELECT,
	});
};

/**
 * Hard-deletes a still-PENDING invitation. This is safe because
 * `AssessmentAttempt.invitationId` is `onDelete: SetNull` — and a PENDING
 * invitation (never accepted) can't have an attempt pointing at it anyway.
 * AssessmentInvitation has no `deletedAt` column, so "cancel" genuinely
 * means delete here, not a soft-delete.
 */
const cancelInvitation = async (id: string, companyId: string) => {
	const invitation = await prisma.assessmentInvitation.findUnique({
		where: { id },
		include: { assessment: true },
	});

	if (!invitation || invitation.assessment.companyId !== companyId) {
		throw new AppError(StatusCodes.NOT_FOUND, "Invitation not found.");
	}

	if (invitation.status !== "PENDING") {
		throw new AppError(StatusCodes.CONFLICT, "Only a pending invitation can be cancelled.");
	}

	await prisma.assessmentInvitation.delete({ where: { id } });

	return { message: "Invitation cancelled successfully." };
};

export const invitationService = {
	inviteCandidates,
	getInvitationsForAssessment,
	getMyInvitations,
	getInvitationById,
	acceptInvitation,
	declineInvitation,
	cancelInvitation,
};