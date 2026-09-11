import request from "supertest";
import { describe, expect, it } from "vitest";

import app from "../../../src/app";
import { prisma } from "../../../src/lib/prisma";
import { createCompanyWithRecruiter } from "../../helpers/fixtures";

describe("IDOR Protection — Problems", () => {
	it("enforces tenant scoping on problem read, update, delete, and list", async () => {
		const tenantA = await createCompanyWithRecruiter();
		const tenantB = await createCompanyWithRecruiter();

		// Recruiter B creates a problem in Company B
		const problemB = await prisma.problem.create({
			data: {
				title: "Problem B Title",
				slug: `problem-b-${Date.now()}`,
				description: "Problem B Description",
				companyId: tenantB.company.id,
				createdById: tenantB.recruiter.id,
				type: "WRITTEN",
			},
		});

		// 1. Recruiter A GET Recruiter B's problem -> 404 Not Found
		const getRes = await request(app)
			.get(`/api/v1/problems/${problemB.id}`)
			.set("Cookie", tenantA.recruiter.cookie);
		expect(getRes.status).toBe(404);

		// 2. Recruiter A PATCH Recruiter B's problem -> 404 Not Found
		const patchRes = await request(app)
			.patch(`/api/v1/problems/${problemB.id}`)
			.set("Cookie", tenantA.recruiter.cookie)
			.send({ title: "Hacked Title" });
		expect(patchRes.status).toBe(404);

		// 3. Recruiter A DELETE Recruiter B's problem -> 404 Not Found
		const deleteRes = await request(app)
			.delete(`/api/v1/problems/${problemB.id}`)
			.set("Cookie", tenantA.recruiter.cookie);
		expect(deleteRes.status).toBe(404);

		// 4. Recruiter A GET list endpoint -> does NOT include Recruiter B's problem
		const listRes = await request(app)
			.get("/api/v1/problems")
			.set("Cookie", tenantA.recruiter.cookie);
		expect(listRes.status).toBe(200);
		const ids = listRes.body.data.map((p: { id: string }) => p.id);
		expect(ids).not.toContain(problemB.id);
	});
});
