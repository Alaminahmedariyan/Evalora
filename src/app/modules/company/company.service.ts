/** biome-ignore-all lint/suspicious/noImplicitAnyLet: <explanation> */
import { StatusCodes } from "http-status-codes";

import type { Prisma } from "../../../generated/prisma/client";
import type { UserRole } from "../../../generated/prisma/enums";
import type { CompanyWhereInput } from "../../../generated/prisma/models/Company";

import { prisma } from "../../../lib/prisma";
import AppError from "../../errors/appError";
import { QueryBuilder } from "../../queryBuilder";
import { uploadFileToCloudinary } from "../../utils/fileUploader";
import { generateUniqueSlug } from "../../utils/generateUniqueSlug";
import { getPlanSnapshot } from "../../utils/planLimits";

import { COMPANY_DETAIL_SELECT, COMPANY_LIST_SELECT } from "./company.const";
import type {
	PendingCompany,
	RegisterCompanyInput,
	UpdateCompanyInput,
} from "./company.interface";

const companyQueryBuilder = new QueryBuilder<
	Prisma.CompanyGetPayload<{ select: typeof COMPANY_LIST_SELECT }>,
	CompanyWhereInput
>(prisma.company, {
	searchableFields: ["name", "industry", "description"],
	filterableFields: {
		industry: "string",
		isVerified: "boolean",
		createdAt: "date",
	},
	sortableFields: ["createdAt", "name"],
	selectableFields: Object.keys(COMPANY_LIST_SELECT),
	defaultSelect: COMPANY_LIST_SELECT,
	softDelete: true,
	defaultSortField: "createdAt",
});

const isUniqueConstraintError = (error: unknown) =>
	typeof error === "object" &&
	error !== null &&
	(error as { code?: string }).code === "P2002";

/**
 * Notifies every active admin that a company is waiting for verification.
 * Returns how many admins were notified.
 */
const notifyAdminsOfPendingCompany = async (
	company: PendingCompany,
	reminder = false,
): Promise<number> => {
	const admins = await prisma.user.findMany({
		where: { role: "ADMIN", status: "ACTIVE", deletedAt: null },
		select: { id: true },
	});

	if (admins.length === 0) return 0;

	await prisma.notification.createMany({
		data: admins.map((admin) => ({
			userId: admin.id,
			title: reminder
				? "Company verification reminder"
				: "New company awaiting verification",
			message: reminder
				? `${company.name} is still waiting for verification.`
				: `${company.name} has registered and is waiting for verification.`,
			type: "SYSTEM" as const,
			metadata: { companyId: company.id, kind: "company_pending" },
		})),
	});

	return admins.length;
};

/**
 * Best-effort wrapper used at registration: a notification failure must
 * never fail a registration that already committed.
 */
const notifyAdminsOfNewCompany = async (company: PendingCompany) => {
	try {
		await notifyAdminsOfPendingCompany(company);
	} catch {
		// best-effort, intentionally ignored
	}
};

/** Best-effort: tell the owner their company was verified. */
const notifyOwnerOfVerification = async (company: {
	id: string;
	name: string;
	ownerId: string;
}) => {
	try {
		await prisma.notification.create({
			data: {
				userId: company.ownerId,
				title: "Your company is verified",
				message: `${company.name} has been verified. You can now publish assessments and invite candidates.`,
				type: "SYSTEM",
				metadata: { companyId: company.id, kind: "company_verified" },
			},
		});
	} catch {
		// best-effort, intentionally ignored
	}
};

/**
 * Register a company for the current user, and promote them to RECRUITER.
 *
 * Rules:
 * - ADMIN accounts can't register a company (it would silently demote them
 *   to RECRUITER).
 * - `Company.ownerId` is unique, including on soft-deleted rows, since
 *   Prisma has no partial-unique-index support here. So if this user
 *   previously registered and then deleted a company, we reactivate that
 *   same row instead of trying to create a second one.
 * - Reactivation is treated as a fresh submission: the old description /
 *   website / industry / logo are cleared (unless re-supplied), the slug is
 *   regenerated from the new name, and the company goes back to
 *   unverified. The existing subscription row is kept as-is (so unused paid
 *   time isn't lost); it is only created if missing.
 */
const registerCompany = async (
	userId: string,
	payload: RegisterCompanyInput,
) => {
	const user = await prisma.user.findFirst({
		where: { id: userId, deletedAt: null },
		select: { role: true },
	});

	if (!user) {
		throw new AppError(StatusCodes.NOT_FOUND, "User not found.");
	}

	if (user.role === "ADMIN") {
		throw new AppError(
			StatusCodes.FORBIDDEN,
			"Admin accounts can't register a company.",
		);
	}

	const existing = await prisma.company.findUnique({
		where: { ownerId: userId },
	});

	if (existing && !existing.deletedAt) {
		throw new AppError(
			StatusCodes.CONFLICT,
			"You already have a company registered.",
		);
	}

	let company;

	try {
		company = await prisma.$transaction(async (tx) => {
			let record;

			if (existing) {
				const slug = await generateUniqueSlug(payload.name, (candidate) =>
					tx.company
						.findUnique({ where: { slug: candidate } })
						.then((found) => found !== null && found.id !== existing.id),
				);

				record = await tx.company.update({
					where: { id: existing.id },
					data: {
						name: payload.name,
						slug,
						description: payload.description ?? null,
						website: payload.website ?? null,
						industry: payload.industry ?? null,
						logo: null,
						isVerified: false,
						deletedAt: null,
					},
					select: COMPANY_DETAIL_SELECT,
				});

				await tx.subscription.upsert({
					where: { companyId: record.id },
					update: {},
					create: { companyId: record.id, plan: "FREE", status: "ACTIVE" },
				});
			} else {
				const slug = await generateUniqueSlug(payload.name, (candidate) =>
					tx.company.findUnique({ where: { slug: candidate } }).then(Boolean),
				);

				record = await tx.company.create({
					data: {
						name: payload.name,
						slug,
						...(payload.description !== undefined && {
							description: payload.description,
						}),
						...(payload.website !== undefined && { website: payload.website }),
						...(payload.industry !== undefined && {
							industry: payload.industry,
						}),
						ownerId: userId,
					},
					select: COMPANY_DETAIL_SELECT,
				});

				await tx.subscription.create({
					data: { companyId: record.id, plan: "FREE", status: "ACTIVE" },
				});
			}

			await tx.auditLog.create({
				data: {
					userId,
					action: "CREATE",
					entity: "Company",
					entityId: record.id,
					newValue: { name: record.name, slug: record.slug },
					metadata: { reactivated: Boolean(existing) },
				},
			});

			if (user.role === "CANDIDATE") {
				await tx.user.update({
					where: { id: userId },
					data: { role: "RECRUITER" },
				});

				await tx.auditLog.create({
					data: {
						userId,
						action: "ROLE_CHANGE",
						entity: "User",
						entityId: userId,
						oldValue: { role: "CANDIDATE" },
						newValue: { role: "RECRUITER" },
						metadata: { reason: "company_registered" },
					},
				});
			}

			return record;
		});
	} catch (error) {
		// Two concurrent registrations for the same owner/slug.
		if (isUniqueConstraintError(error)) {
			throw new AppError(
				StatusCodes.CONFLICT,
				"A company with these details already exists. Please try again.",
			);
		}

		throw error;
	}

	await notifyAdminsOfNewCompany(company);

	return company;
};

/**
 * List companies. Non-admins only ever see verified, non-deleted companies
 * (softDelete: true in the query builder already excludes deleted rows);
 * an unverified company is only visible to its owner or an Admin.
 */
const getAllCompanies = async (
	query: Record<string, unknown>,
	requesterRole: UserRole,
) => {
	const tenantScope =
		requesterRole === "ADMIN" ? undefined : { isVerified: true };
	return companyQueryBuilder.execute(query, tenantScope);
};

const getCompanyById = async (
	id: string,
	requesterId: string,
	requesterRole: UserRole,
) => {
	const company = await prisma.company.findFirst({
		where: { id, deletedAt: null },
		select: COMPANY_DETAIL_SELECT,
	});

	if (!company) {
		throw new AppError(StatusCodes.NOT_FOUND, "Company not found.");
	}

	const canSeeUnverified =
		requesterRole === "ADMIN" || company.ownerId === requesterId;

	if (!company.isVerified && !canSeeUnverified) {
		throw new AppError(StatusCodes.NOT_FOUND, "Company not found.");
	}

	return company;
};

const getMyCompany = async (userId: string) => {
	const company = await prisma.company.findFirst({
		where: { ownerId: userId, deletedAt: null },
		select: COMPANY_DETAIL_SELECT,
	});

	if (!company) {
		throw new AppError(
			StatusCodes.NOT_FOUND,
			"You don't have a registered company yet.",
		);
	}

	return company;
};

const updateMyCompany = async (
	userId: string,
	payload: UpdateCompanyInput,
	file?: Express.Multer.File,
) => {
	const existing = await prisma.company.findFirst({
		where: { ownerId: userId, deletedAt: null },
	});

	if (!existing) {
		throw new AppError(
			StatusCodes.NOT_FOUND,
			"You don't have a registered company yet.",
		);
	}

	const updateData: Prisma.CompanyUpdateInput = {};
	const oldValue: Record<string, unknown> = {};
	const newValue: Record<string, unknown> = {};

	const editableFields = ["description", "website", "industry"] as const;

	for (const field of editableFields) {
		const next = payload[field];

		if (next !== undefined && next !== existing[field]) {
			updateData[field] = next;
			oldValue[field] = existing[field];
			newValue[field] = next;
		}
	}

	if (file) {
		const uploaded = await uploadFileToCloudinary(
			file.buffer,
			file.originalname,
			"company-logos",
		);
		updateData.logo = uploaded.secure_url;
		oldValue.logo = existing.logo;
		newValue.logo = uploaded.secure_url;
	}

	// Nothing actually changed: skip the write and the audit row.
	if (Object.keys(updateData).length === 0) {
		return prisma.company.findUniqueOrThrow({
			where: { id: existing.id },
			select: COMPANY_DETAIL_SELECT,
		});
	}

	const [updated] = await prisma.$transaction([
		prisma.company.update({
			where: { id: existing.id },
			data: updateData,
			select: COMPANY_DETAIL_SELECT,
		}),
		prisma.auditLog.create({
			data: {
				userId,
				action: "UPDATE",
				entity: "Company",
				entityId: existing.id,
				oldValue: oldValue as Prisma.InputJsonObject,
				newValue: newValue as Prisma.InputJsonObject,
			},
		}),
	]);

	return updated;
};

const VERIFICATION_REMINDER_COOLDOWN_MS = 24 * 60 * 60 * 1000;

/**
 * Lets the owner nudge the admins about a company that is still unverified.
 * Registration already notifies them once, so this is a reminder, limited to
 * one every 24 hours. That limit counts the registration notification too.
 */
const requestVerification = async (userId: string) => {
	const company = await prisma.company.findFirst({
		where: { ownerId: userId, deletedAt: null },
		select: { id: true, name: true, isVerified: true },
	});

	if (!company) {
		throw new AppError(
			StatusCodes.NOT_FOUND,
			"You don't have a registered company yet.",
		);
	}

	if (company.isVerified) {
		throw new AppError(
			StatusCodes.CONFLICT,
			"Your company is already verified.",
		);
	}

	const recentlyNotified = await prisma.notification.findFirst({
		where: {
			type: "SYSTEM",
			createdAt: {
				gt: new Date(Date.now() - VERIFICATION_REMINDER_COOLDOWN_MS),
			},
			user: { role: "ADMIN" },
			metadata: { path: ["companyId"], equals: company.id },
		},
		select: { id: true },
	});

	if (recentlyNotified) {
		throw new AppError(
			StatusCodes.TOO_MANY_REQUESTS,
			"Admins were already notified in the last 24 hours. Please try again later.",
		);
	}

	const notified = await notifyAdminsOfPendingCompany(company, true);

	if (notified === 0) {
		throw new AppError(
			StatusCodes.SERVICE_UNAVAILABLE,
			"No administrator is available to review your company right now.",
		);
	}

	return { notified };
};

/**
 * Admin-only: mark a company as verified. Kept as a separate endpoint
 * (rather than folded into a generic PATCH) so it's easy to audit-log and
 * to gate behind requireRole("ADMIN") without touching the owner's own
 * update route.
 */
const verifyCompany = async (id: string, actorId: string) => {
	const company = await prisma.company.findFirst({
		where: { id, deletedAt: null },
	});

	if (!company) {
		throw new AppError(StatusCodes.NOT_FOUND, "Company not found.");
	}

	if (company.isVerified) {
		throw new AppError(StatusCodes.CONFLICT, "Company is already verified.");
	}

	const [updated] = await prisma.$transaction([
		prisma.company.update({
			where: { id },
			data: { isVerified: true },
			select: COMPANY_DETAIL_SELECT,
		}),
		prisma.auditLog.create({
			data: {
				userId: actorId,
				action: "STATUS_CHANGE",
				entity: "Company",
				entityId: id,
				oldValue: { isVerified: false },
				newValue: { isVerified: true },
			},
		}),
	]);

	await notifyOwnerOfVerification(updated);

	return updated;
};

/**
 * Soft delete a company. Allowed for the owner (deactivating their own
 * company) or an Admin. The owner's role is stepped back down to
 * CANDIDATE, since RECRUITER without a company doesn't make sense; if
 * they register a new/reactivated company later, registerCompany() will
 * promote them again. Only a RECRUITER is demoted: an ADMIN who happens to
 * own a company keeps their role.
 *
 * Live assessments (PUBLISHED/ACTIVE) are closed and PENDING invitations are
 * cancelled in the same transaction, so a deleted company can't keep
 * accepting candidates.
 */
const softDeleteCompany = async (
	id: string,
	actorId: string,
	actorRole: UserRole,
) => {
	const company = await prisma.company.findFirst({
		where: { id, deletedAt: null },
	});

	if (!company) {
		throw new AppError(StatusCodes.NOT_FOUND, "Company not found.");
	}

	const isOwner = company.ownerId === actorId;

	if (!isOwner && actorRole !== "ADMIN") {
		throw new AppError(
			StatusCodes.FORBIDDEN,
			"You don't have permission to delete this company.",
		);
	}

	await prisma.$transaction(async (tx) => {
		await tx.company.update({
			where: { id },
			data: { deletedAt: new Date() },
		});

		// Once the owner is demoted nobody can manage this company's
		// assessments any more, so stop them from taking new candidates:
		// close anything live and cancel invitations nobody has acted on.
		// Attempts already in progress and ACCEPTED/COMPLETED invitations
		// are left untouched (history is kept).
		const closedAssessments = await tx.assessment.updateMany({
			where: {
				companyId: id,
				deletedAt: null,
				status: { in: ["PUBLISHED", "ACTIVE"] },
			},
			data: { status: "CLOSED" },
		});

		const cancelledInvitations = await tx.assessmentInvitation.deleteMany({
			where: {
				status: "PENDING",
				assessment: { companyId: id },
			},
		});

		await tx.auditLog.create({
			data: {
				userId: actorId,
				action: "DELETE",
				entity: "Company",
				entityId: id,
				oldValue: { name: company.name, isVerified: company.isVerified },
				metadata: {
					deletedByOwner: isOwner,
					closedAssessments: closedAssessments.count,
					cancelledInvitations: cancelledInvitations.count,
				},
			},
		});

		const demoted = await tx.user.updateMany({
			where: { id: company.ownerId, role: "RECRUITER" },
			data: { role: "CANDIDATE" },
		});

		if (demoted.count > 0) {
			await tx.auditLog.create({
				data: {
					userId: actorId,
					action: "ROLE_CHANGE",
					entity: "User",
					entityId: company.ownerId,
					oldValue: { role: "RECRUITER" },
					newValue: { role: "CANDIDATE" },
					metadata: { reason: "company_deleted" },
				},
			});
		}
	});

	return { message: "Company deleted successfully." };
};

const getMySubscription = async (userId: string) => {
	const company = await prisma.company.findFirst({
		where: { ownerId: userId, deletedAt: null },
		include: { subscription: true },
	});

	if (!company) {
		throw new AppError(
			StatusCodes.NOT_FOUND,
			"You don't have a registered company yet.",
		);
	}

	if (!company.subscription) {
		return { message: "No active subscription." };
	}

	let subscription = company.subscription;

	// Lazy expiry: a paid plan lapses back to FREE once its 30-day
	// currentPeriodEnd has passed and nobody has paid again.
	if (
		subscription.plan !== "FREE" &&
		subscription.status === "ACTIVE" &&
		subscription.currentPeriodEnd &&
		subscription.currentPeriodEnd < new Date()
	) {
		subscription = await prisma.subscription.update({
			where: { companyId: company.id },
			data: { plan: "FREE", status: "EXPIRED" },
		});
	}

	const snapshot = await getPlanSnapshot(company.id);

	return { ...subscription, ...snapshot };
};

const updateMySubscription = async (
	userId: string,
	plan: "FREE" | "PRO" | "ENTERPRISE",
) => {
	if (plan !== "FREE") {
		throw new AppError(
			StatusCodes.BAD_REQUEST,
			"Paid plans can only be activated through checkout.",
		);
	}

	const company = await prisma.company.findFirst({
		where: { ownerId: userId, deletedAt: null },
	});

	if (!company) {
		throw new AppError(
			StatusCodes.NOT_FOUND,
			"You don't have a registered company yet.",
		);
	}

	return prisma.subscription.upsert({
		where: { companyId: company.id },
		update: {
			plan: "FREE",
			status: "ACTIVE",
			currentPeriodStart: null,
			currentPeriodEnd: null,
			cancelAtPeriodEnd: false,
			cancelledAt: null,
		},
		create: { companyId: company.id, plan: "FREE", status: "ACTIVE" },
	});
};

const cancelMySubscription = async (userId: string) => {
	const company = await prisma.company.findFirst({
		where: { ownerId: userId, deletedAt: null },
		include: { subscription: true },
	});

	if (!company) {
		throw new AppError(
			StatusCodes.NOT_FOUND,
			"You don't have a registered company yet.",
		);
	}

	if (!company.subscription) {
		throw new AppError(
			StatusCodes.NOT_FOUND,
			"No active subscription to cancel.",
		);
	}

	if (
		company.subscription.status === "CANCELLED" ||
		company.subscription.status === "EXPIRED"
	) {
		throw new AppError(
			StatusCodes.CONFLICT,
			"Subscription is already cancelled or expired.",
		);
	}

	const updated = await prisma.subscription.update({
		where: { companyId: company.id },
		data: {
			status: "CANCELLED",
			cancelledAt: new Date(),
			cancelAtPeriodEnd: true,
		},
	});

	return updated;
};

export const companyService = {
	registerCompany,
	getAllCompanies,
	getCompanyById,
	getMyCompany,
	updateMyCompany,
	requestVerification,
	verifyCompany,
	softDeleteCompany,
	getMySubscription,
	updateMySubscription,
	cancelMySubscription,
};