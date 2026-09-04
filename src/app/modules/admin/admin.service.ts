import type { AuditAction, UserRole } from "../../../generated/prisma/enums";
import type { AuditLogWhereInput } from "../../../generated/prisma/models/AuditLog";

import { prisma } from "../../../lib/prisma";
import { QueryBuilder } from "../../queryBuilder";
import type { PrismaDelegate } from "../../queryBuilder/types";

import { AUDIT_LOG_SELECT } from "./admin.const";

/**
 * Prisma 7's `prisma-client` generator doesn't expose an `XGetPayload`
 * helper, so the result shape is derived manually from AUDIT_LOG_SELECT.
 * The delegate is also cast to PrismaDelegate<T> because Prisma 7's
 * generated delegate types don't structurally satisfy QueryBuilder's
 * simplified PrismaDelegate interface once the select shape includes a
 * nested relation.
 */
type AuditLogResult = {
	id: string;
	userId: string | null;
	action: AuditAction;
	entity: string;
	entityId: string | null;
	oldValue: unknown;
	newValue: unknown;
	metadata: unknown;
	ipAddress: string | null;
	userAgent: string | null;
	createdAt: Date;
	user: { id: string; name: string; email: string; role: UserRole } | null;
};

const auditLogQueryBuilder = new QueryBuilder<AuditLogResult, AuditLogWhereInput>(
	prisma.auditLog as unknown as PrismaDelegate<AuditLogResult, AuditLogWhereInput>,
	{
		searchableFields: ["entity"],
		filterableFields: {
			action: {
				type: "enum",
				enum: {
					CREATE: "CREATE",
					UPDATE: "UPDATE",
					DELETE: "DELETE",
					LOGIN: "LOGIN",
					LOGOUT: "LOGOUT",
					STATUS_CHANGE: "STATUS_CHANGE",
					ROLE_CHANGE: "ROLE_CHANGE",
					PAYMENT: "PAYMENT",
					SUBMISSION: "SUBMISSION",
					EVALUATION: "EVALUATION",
					SECURITY: "SECURITY",
				},
			},
			entity: "string",
			createdAt: "date",
		},
		sortableFields: ["createdAt"],
		selectableFields: Object.keys(AUDIT_LOG_SELECT),
		defaultSortField: "createdAt",
	},
);

const getAuditLogs = async (query: Record<string, unknown>) => {
	return auditLogQueryBuilder.execute(query);
};

/**
 * `Payment.amountMinor` is a `BigInt` column in the schema (so it can hold
 * arbitrarily large amounts safely) — but `res.json()` throws on a raw
 * BigInt ("Do not know how to serialize a BigInt"). Converting the summed
 * total to a regular `Number` here is safe: real payment totals for this
 * app are nowhere near Number.MAX_SAFE_INTEGER cents.
 */
const getDashboardStats = async () => {
	const [
		totalUsers,
		usersByRole,
		totalCompanies,
		verifiedCompanies,
		totalProblems,
		totalAssessments,
		assessmentsByStatus,
		totalAttempts,
		attemptsByStatus,
		totalPaidPayments,
		paidRevenue,
	] = await Promise.all([
		prisma.user.count({ where: { deletedAt: null } }),
		prisma.user.groupBy({ by: ["role"], where: { deletedAt: null }, _count: { _all: true } }),
		prisma.company.count({ where: { deletedAt: null } }),
		prisma.company.count({ where: { deletedAt: null, isVerified: true } }),
		prisma.problem.count({ where: { deletedAt: null } }),
		prisma.assessment.count({ where: { deletedAt: null } }),
		prisma.assessment.groupBy({ by: ["status"], where: { deletedAt: null }, _count: { _all: true } }),
		prisma.assessmentAttempt.count(),
		prisma.assessmentAttempt.groupBy({ by: ["status"], _count: { _all: true } }),
		prisma.payment.count({ where: { status: "PAID" } }),
		prisma.payment.aggregate({ where: { status: "PAID" }, _sum: { amountMinor: true } }),
	]);

	return {
		users: {
			total: totalUsers,
			byRole: Object.fromEntries(usersByRole.map((row) => [row.role, row._count._all])),
		},
		companies: { total: totalCompanies, verified: verifiedCompanies },
		problems: { total: totalProblems },
		assessments: {
			total: totalAssessments,
			byStatus: Object.fromEntries(assessmentsByStatus.map((row) => [row.status, row._count._all])),
		},
		attempts: {
			total: totalAttempts,
			byStatus: Object.fromEntries(attemptsByStatus.map((row) => [row.status, row._count._all])),
		},
		payments: {
			totalPaid: totalPaidPayments,
			totalRevenueMinor: Number(paidRevenue._sum.amountMinor ?? 0n),
		},
	};
};

export const adminService = {
	getDashboardStats,
	getAuditLogs,
};