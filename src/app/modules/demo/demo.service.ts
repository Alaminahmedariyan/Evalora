import { StatusCodes } from "http-status-codes";

import { auth } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";
import config from "../../config";
import AppError from "../../errors/appError";

import { DEMO_ACCOUNTS, DEMO_PASSWORD, type DemoRoleKey } from "./demo.const";

const isDemoEnabled = () => config.demo.enabled;

// Creates the demo user on first use, so no manual seeding is required.
const ensureDemoUser = async (key: DemoRoleKey) => {
	const demo = DEMO_ACCOUNTS[key];
	let user = await prisma.user.findUnique({ where: { email: demo.email } });

	if (!user) {
		await auth.api.signUpEmail({
			body: { name: demo.name, email: demo.email, password: DEMO_PASSWORD },
		});
		user = await prisma.user.findUniqueOrThrow({
			where: { email: demo.email },
		});
	}

	if (
		user.role !== demo.role ||
		!user.emailVerified ||
		user.status !== "ACTIVE" ||
		user.deletedAt
	) {
		await prisma.user.update({
			where: { id: user.id },
			data: {
				role: demo.role,
				status: "ACTIVE",
				emailVerified: true,
				deletedAt: null,
			},
		});
	}
};

const demoLogin = async (key: DemoRoleKey, headers: Headers) => {
	if (!isDemoEnabled()) {
		throw new AppError(StatusCodes.NOT_FOUND, "Demo access is not enabled.");
	}

	await ensureDemoUser(key);

	const response = await auth.api.signInEmail({
		body: { email: DEMO_ACCOUNTS[key].email, password: DEMO_PASSWORD },
		headers,
		asResponse: true,
	});

	const body = await response.json().catch(() => null);

	if (!response.ok) {
		throw new AppError(
			response.status,
			(body as { message?: string } | null)?.message ??
				"Could not start the demo session.",
		);
	}

	return {
		data: body,
		headers: response.headers,
	};
};

export const demoService = { demoLogin };