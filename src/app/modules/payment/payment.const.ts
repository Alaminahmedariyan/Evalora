/**
 * Fixed pricing per plan, in minor units (cents) — matches `Payment.amountMinor`.
 * FREE has no checkout flow; it's the default a company starts on.
 */
export const PLAN_PRICING: Record<"PRO" | "ENTERPRISE", { amountMinor: number; currency: string }> = {
	PRO: { amountMinor: 2900, currency: "usd" },
	ENTERPRISE: { amountMinor: 9900, currency: "usd" },
};

export const PAYMENT_SELECT = {
	id: true,
	userId: true,
	companyId: true,
	subscriptionId: true,
	provider: true,
	status: true,
	amountMinor: true,
	currency: true,
	transactionId: true,
	providerPaymentId: true,
	paidAt: true,
	failedAt: true,
	createdAt: true,
} as const;