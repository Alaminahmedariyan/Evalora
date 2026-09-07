import "dotenv/config";

import config from "../src/app/config";
import { auth } from "../src/lib/auth";
import { prisma } from "../src/lib/prisma";

async function ensureAdmin() {
	const existing = await prisma.user.findUnique({
		where: { email: config.superAdmin.email },
	});

	if (existing) {
		await prisma.user.update({
			where: { id: existing.id },
			data: {
				role: "ADMIN",
				status: "ACTIVE",
				emailVerified: true,
				...(config.superAdmin.name ? { name: config.superAdmin.name } : {}),
			},
		});
		console.log(`✅ Admin ensured: ${existing.email}`);
		return;
	}

	await auth.api.signUpEmail({
		body: {
			name: config.superAdmin.name ?? "Super Admin",
			email: config.superAdmin.email,
			password: config.superAdmin.password,
		},
	});

	const user = await prisma.user.findUniqueOrThrow({
		where: { email: config.superAdmin.email },
	});

	await prisma.user.update({
		where: { id: user.id },
		data: { role: "ADMIN", status: "ACTIVE", emailVerified: true },
	});

	console.log(`✅ Admin created: ${user.email}`);
}

async function main() {
	console.log("🌱 Seeding admin...");
	await ensureAdmin();
	console.log("🎉 Seed completed.");
}

main()
	.catch((error) => {
		console.error("❌ Seed failed:", error);
		process.exitCode = 1;
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
