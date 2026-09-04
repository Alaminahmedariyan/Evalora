export const AUDIT_LOG_SELECT = {
	id: true,
	userId: true,
	action: true,
	entity: true,
	entityId: true,
	oldValue: true,
	newValue: true,
	metadata: true,
	ipAddress: true,
	userAgent: true,
	createdAt: true,
	user: { select: { id: true, name: true, email: true, role: true } },
} as const;