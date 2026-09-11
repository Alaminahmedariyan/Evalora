import request from "supertest";
import { describe, expect, it } from "vitest";

import app from "../../../src/app";
import { prisma } from "../../../src/lib/prisma";
import { createCompanyWithRecruiter } from "../../helpers/fixtures";

describe("IDOR Protection — Assessments", () => {
	it("enforces tenant scoping on assessment read, update, delete, and list", async () => {
		const tenantA = await createCompanyWithRecruiter();
		const tenantB = await createCompanyWithRecruiter();

		// Recruiter B creates an assessment in Company B
		const assessmentB = await prisma.assessment.create({
			data: {
				title: "Assessment B",
				slug: `assessment-b-${Date.now()}`,
				companyId: tenantB.company.id,
				createdById: tenantB.recruiter.id,
				durationMinutes: 60,
				totalMarks: 100,
				passingMarks: 50,
				status: "DRAFT",
			},
		});

		// 1. Recruiter A GET Recruiter B's assessment -> 404 Not Found
		const getRes = await request(app)
			.get(`/api/v1/assessments/${assessmentB.id}`)
			.set("Cookie", tenantA.recruiter.cookie);
		expect(getRes.status).toBe(404);

		// 2. Recruiter A PATCH Recruiter B's assessment -> 404 Not Found
		const patchRes = await request(app)
			.patch(`/api/v1/assessments/${assessmentB.id}`)
			.set("Cookie", tenantA.recruiter.cookie)
			.send({ title: "Hacked Title" });
		expect(patchRes.status).toBe(404);

		// 3. Recruiter A DELETE Recruiter B's assessment -> 404 Not Found
		const deleteRes = await request(app)
			.delete(`/api/v1/assessments/${assessmentB.id}`)
			.set("Cookie", tenantA.recruiter.cookie);
		expect(deleteRes.status).toBe(404);

		// 4. Recruiter A list endpoint -> does NOT include Recruiter B's assessment
		const listRes = await request(app)
			.get("/api/v1/assessments")
			.set("Cookie", tenantA.recruiter.cookie);
		expect(listRes.status).toBe(200);
		const ids = listRes.body.data.map((a: { id: string }) => a.id);
		expect(ids).not.toContain(assessmentB.id);
	});
});
