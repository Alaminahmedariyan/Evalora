import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";

import app from "../../../src/app";
import { prisma } from "../../../src/lib/prisma";
import {
	type AuthenticatedTestUser,
	createUserWithRole,
} from "../../helpers/auth";
import {
	type CompanyWithRecruiter,
	createCompanyWithRecruiter,
} from "../../helpers/fixtures";

describe("Idempotency Middleware", () => {
	let tenant: CompanyWithRecruiter;
	let candidate: AuthenticatedTestUser;
	let assessment1: { id: string };
	let assessment2: { id: string };

	beforeEach(async () => {
		tenant = await createCompanyWithRecruiter();
		candidate = await createUserWithRole("CANDIDATE");

		assessment1 = await prisma.assessment.create({
			data: {
				title: "Idempotency Assessment 1",
				slug: `idempotency-ass-1-${Date.now()}-${Math.random()}`,
				companyId: tenant.company.id,
				createdById: tenant.recruiter.id,
				durationMinutes: 60,
				totalMarks: 100,
				passingMarks: 50,
				status: "PUBLISHED",
			},
			select: { id: true },
		});

		assessment2 = await prisma.assessment.create({
			data: {
				title: "Idempotency Assessment 2",
				slug: `idempotency-ass-2-${Date.now()}-${Math.random()}`,
				companyId: tenant.company.id,
				createdById: tenant.recruiter.id,
				durationMinutes: 60,
				totalMarks: 100,
				passingMarks: 50,
				status: "PUBLISHED",
			},
			select: { id: true },
		});

		await prisma.assessmentInvitation.createMany({
			data: [
				{
					assessmentId: assessment1.id,
					candidateId: candidate.id,
					email: candidate.email,
					status: "ACCEPTED",
					tokenHash: `token-hash-1-${Date.now()}-${Math.random()}`,
				},
				{
					assessmentId: assessment2.id,
					candidateId: candidate.id,
					email: candidate.email,
					status: "ACCEPTED",
					tokenHash: `token-hash-2-${Date.now()}-${Math.random()}`,
				},
			],
		});
	});

	it("1. Same key + same body -> 2nd call replays stored response and header", async () => {
		const idempotencyKey = `key-replay-${Date.now()}`;

		// 1st call: fresh request
		const res1 = await request(app)
			.post("/api/v1/attempts/start")
			.set("Cookie", candidate.cookie)
			.set("Idempotency-Key", idempotencyKey)
			.send({ assessmentId: assessment1.id });

		expect(res1.status).toBe(201);
		expect(res1.headers["x-idempotent-replay"]).toBeUndefined();

		const attemptCountAfterFirst = await prisma.assessmentAttempt.count({
			where: { candidateId: candidate.id, assessmentId: assessment1.id },
		});
		expect(attemptCountAfterFirst).toBe(1);

		// 2nd call: replay request
		const res2 = await request(app)
			.post("/api/v1/attempts/start")
			.set("Cookie", candidate.cookie)
			.set("Idempotency-Key", idempotencyKey)
			.send({ assessmentId: assessment1.id });

		expect(res2.status).toBe(201);
		expect(res2.headers["x-idempotent-replay"]).toBe("true");
		expect(res2.body).toEqual(res1.body);

		const attemptCountAfterSecond = await prisma.assessmentAttempt.count({
			where: { candidateId: candidate.id, assessmentId: assessment1.id },
		});
		expect(attemptCountAfterSecond).toBe(1);
	});

	it("2. Same key + different body -> 409 IDEMPOTENCY_CONFLICT", async () => {
		const idempotencyKey = `key-conflict-${Date.now()}`;

		// 1st call with assessment1
		const res1 = await request(app)
			.post("/api/v1/attempts/start")
			.set("Cookie", candidate.cookie)
			.set("Idempotency-Key", idempotencyKey)
			.send({ assessmentId: assessment1.id });

		expect(res1.status).toBe(201);

		// 2nd call with different body (assessment2)
		const res2 = await request(app)
			.post("/api/v1/attempts/start")
			.set("Cookie", candidate.cookie)
			.set("Idempotency-Key", idempotencyKey)
			.send({ assessmentId: assessment2.id });

		expect(res2.status).toBe(409);
		expect(res2.body.errorCode).toBe("IDEMPOTENCY_CONFLICT");
	});

	it("3. Missing key -> 400 MISSING_IDEMPOTENCY_KEY", async () => {
		const res = await request(app)
			.post("/api/v1/attempts/start")
			.set("Cookie", candidate.cookie)
			.send({ assessmentId: assessment1.id });

		expect(res.status).toBe(400);
		expect(res.body.errorCode).toBe("MISSING_IDEMPOTENCY_KEY");
	});

	it("4. Expired key -> treated as new key", async () => {
		const idempotencyKey = `key-expired-${Date.now()}`;

		// Manually insert an expired IdempotencyKey row
		await prisma.idempotencyKey.create({
			data: {
				key: idempotencyKey,
				userId: candidate.id,
				endpoint: "POST /api/v1/attempts/start",
				requestHash: "stale-hash",
				response: { success: false, statusCode: 400, message: "Old" },
				statusCode: 400,
				expiresAt: new Date(Date.now() - 10000), // 10s in the past
			},
		});

		// Call endpoint with expired key
		const res = await request(app)
			.post("/api/v1/attempts/start")
			.set("Cookie", candidate.cookie)
			.set("Idempotency-Key", idempotencyKey)
			.send({ assessmentId: assessment1.id });

		expect(res.status).toBe(201);
		expect(res.headers["x-idempotent-replay"]).toBeUndefined();

		const keyInDb = await prisma.idempotencyKey.findUnique({
			where: { key_userId: { key: idempotencyKey, userId: candidate.id } },
		});
		expect(keyInDb).not.toBeNull();
		expect(keyInDb?.statusCode).toBe(201);
		expect(keyInDb?.expiresAt.getTime()).toBeGreaterThan(Date.now());
	});

	it("5. Different users with same key -> no collision", async () => {
		const candidateB = await createUserWithRole("CANDIDATE");

		await prisma.assessmentInvitation.create({
			data: {
				assessmentId: assessment1.id,
				candidateId: candidateB.id,
				email: candidateB.email,
				status: "ACCEPTED",
				tokenHash: `token-hash-b1-${Date.now()}-${Math.random()}`,
			},
		});

		const sharedKey = `shared-key-${Date.now()}`;

		// User A request
		const resA = await request(app)
			.post("/api/v1/attempts/start")
			.set("Cookie", candidate.cookie)
			.set("Idempotency-Key", sharedKey)
			.send({ assessmentId: assessment1.id });

		expect(resA.status).toBe(201);
		expect(resA.headers["x-idempotent-replay"]).toBeUndefined();

		// User B request with SAME key
		const resB = await request(app)
			.post("/api/v1/attempts/start")
			.set("Cookie", candidateB.cookie)
			.set("Idempotency-Key", sharedKey)
			.send({ assessmentId: assessment1.id });

		expect(resB.status).toBe(201);
		expect(resB.headers["x-idempotent-replay"]).toBeUndefined();

		// User B gets candidateB's attempt ID/data, not candidate A's
		expect(resB.body.data.candidateId).toBe(candidateB.id);
	});
});
