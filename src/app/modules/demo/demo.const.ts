import type { UserRole } from "../../../generated/prisma/enums";

export const DEMO_EMAIL_DOMAIN = "demo.evalora.app";
export const DEMO_PASSWORD = "Demo@12345";

export type DemoRoleKey = "CANDIDATE" | "RECRUITER" | "ADMIN";

export const DEMO_ACCOUNTS: Record<
	DemoRoleKey,
	{ name: string; email: string; role: UserRole }
> = {
	CANDIDATE: {
		name: "Demo Candidate",
		email: `candidate@${DEMO_EMAIL_DOMAIN}`,
		role: "CANDIDATE",
	},
	RECRUITER: {
		name: "Demo Recruiter",
		email: `recruiter@${DEMO_EMAIL_DOMAIN}`,
		role: "RECRUITER",
	},
	ADMIN: {
		name: "Demo Admin",
		email: `admin@${DEMO_EMAIL_DOMAIN}`,
		role: "ADMIN",
	},
};