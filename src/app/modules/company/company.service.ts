import { StatusCodes } from "http-status-codes";

import type { Prisma } from "../../../generated/prisma/client";
import type { UserRole } from "../../../generated/prisma/enums";
import type { CompanyWhereInput } from "../../../generated/prisma/models/Company";

import { prisma } from "../../../lib/prisma";
import AppError from "../../errors/appError";
import { QueryBuilder } from "../../queryBuilder";
import { generateUniqueSlug } from "../../utils/generateUniqueSlug";
import { uploadFileToCloudinary } from "../../utils/fileUploader";

import { COMPANY_DETAIL_SELECT, COMPANY_LIST_SELECT } from "./company.const";
import type { RegisterCompanyInput, UpdateCompanyInput } from "./company.interface";

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
	softDelete: true,
	defaultSortField: "createdAt",
});

/**
 * Register a company for the current user, and promote them to RECRUITER.
 *
 * `Company.ownerId` is unique — including on soft-deleted rows, since
 * Prisma has no partial-unique-index support here. So if this user
 * previously registered and then deleted a company, we reactivate that
 * same row (resetting it to unverified, since it's effectively a fresh
 * submission) instead of trying to create a second one, which the unique
 * constraint would reject anyway.
 */
const registerCompany = async (userId: string, payload: RegisterCompanyInput) => {
	const existing = await prisma.company.findUnique({ where: { ownerId: userId } });

	if (existing && !existing.deletedAt) {
		throw new AppError(StatusCodes.CONFLICT, "You already have a company registered.");
	}

	const company = await prisma.$transaction(async (tx) => {
		let record;

		if (existing) {
			record = await tx.company.update({
				where: { id: existing.id },
				data: {
					name: payload.name,
					...(payload.description !== undefined && { description: payload.description }),
					...(payload.website !== undefined && { website: payload.website }),
					...(payload.industry !== undefined && { industry: payload.industry }),
					isVerified: false,
					deletedAt: null,
				},
				select: COMPANY_DETAIL_SELECT,
			});
		} else {
			const slug = await generateUniqueSlug(payload.name, (candidate) =>
				tx.company.findUnique({ where: { slug: candidate } }).then(Boolean),
			);

			record = await tx.company.create({
				data: {
					name: payload.name,
					slug,
					...(payload.description !== undefined && { description: payload.description }),
					...(payload.website !== undefined && { website: payload.website }),
					...(payload.industry !== undefined && { industry: payload.industry }),
					ownerId: userId,
				},
				select: COMPANY_DETAIL_SELECT,
			});

			await tx.subscription.create({
				data: { companyId: record.id, plan: "FREE", status: "ACTIVE" },
			});
		}

		await tx.user.update({
			where: { id: userId },
			data: { role: "RECRUITER" },
		});

		return record;
	});

	return company;
};

/**
 * List companies. Non-admins only ever see verified, non-deleted companies
 * (softDelete: true in the query builder already excludes deleted rows) —
 * an unverified company is only visible to its owner or an Admin.
 */
const getAllCompanies = async (query: Record<string, unknown>, requesterRole: UserRole) => {
	const tenantScope = requesterRole === "ADMIN" ? undefined : { isVerified: true };
	return companyQueryBuilder.execute(query, tenantScope);
};

const getCompanyById = async (id: string, requesterId: string, requesterRole: UserRole) => {
	const company = await prisma.company.findFirst({
		where: { id, deletedAt: null },
		select: COMPANY_DETAIL_SELECT,
	});

	if (!company) {
		throw new AppError(StatusCodes.NOT_FOUND, "Company not found.");
	}

	const canSeeUnverified = requesterRole === "ADMIN" || company.ownerId === requesterId;

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
		throw new AppError(StatusCodes.NOT_FOUND, "You don't have a registered company yet.");
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
		throw new AppError(StatusCodes.NOT_FOUND, "You don't have a registered company yet.");
	}

	const updateData: Prisma.CompanyUpdateInput = {
		...(payload.description !== undefined && { description: payload.description }),
		...(payload.website !== undefined && { website: payload.website }),
		...(payload.industry !== undefined && { industry: payload.industry }),
	};

	if (file) {
		const uploaded = await uploadFileToCloudinary(file.buffer, file.originalname, "company-logos");
		updateData.logo = uploaded.secure_url;
	}

	return prisma.company.update({
		where: { id: existing.id },
		data: updateData,
		select: COMPANY_DETAIL_SELECT,
	});
};

/**
 * Admin-only: mark a company as verified. Kept as a separate endpoint
 * (rather than folded into a generic PATCH) so it's easy to audit-log and
 * to gate behind requireRole("ADMIN") without touching the owner's own
 * update route.
 */
const verifyCompany = async (id: string, actorId: string) => {
	const company = await prisma.company.findFirst({ where: { id, deletedAt: null } });

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

	return updated;
};

/**
 * Soft delete a company. Allowed for the owner (deactivating their own
 * company) or an Admin. The owner's role is stepped back down to
 * CANDIDATE, since RECRUITER without a company doesn't make sense — if
 * they register a new/reactivated company later, registerCompany() will
 * promote them again.
 */
const softDeleteCompany = async (id: string, actorId: string, actorRole: UserRole) => {
	const company = await prisma.company.findFirst({ where: { id, deletedAt: null } });

	if (!company) {
		throw new AppError(StatusCodes.NOT_FOUND, "Company not found.");
	}

	const isOwner = company.ownerId === actorId;

	if (!isOwner && actorRole !== "ADMIN") {
		throw new AppError(StatusCodes.FORBIDDEN, "You don't have permission to delete this company.");
	}

	await prisma.$transaction([
		prisma.company.update({
			where: { id },
			data: { deletedAt: new Date() },
		}),
		prisma.user.update({
			where: { id: company.ownerId },
			data: { role: "CANDIDATE" },
		}),
	]);

	return { message: "Company deleted successfully." };
};

export const companyService = {
	registerCompany,
	getAllCompanies,
	getCompanyById,
	getMyCompany,
	updateMyCompany,
	verifyCompany,
	softDeleteCompany,
};