export type DashboardStatsResponse = {
	users: {
		total: number;
		byRole: Record<string, number>;
	};
	companies: { total: number; verified: number };
	problems: { total: number };
	assessments: {
		total: number;
		byStatus: Record<string, number>;
	};
	attempts: {
		total: number;
		byStatus: Record<string, number>;
	};
	payments: {
		totalPaid: number;
		totalRevenueMinor: number;
	};
};

export type AuditLogResponse = {
	id: string;
	userId: string | null;
	action: string;
	entity: string;
	entityId: string | null;
	oldValue: unknown;
	newValue: unknown;
	metadata: unknown;
	ipAddress: string | null;
	userAgent: string | null;
	createdAt: Date;
	user: {
		id: string;
		name: string;
		email: string;
		role: string;
	} | null;
};
