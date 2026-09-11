import request from "supertest";
import { describe, expect, it } from "vitest";

import app from "../../../src/app";
import { prisma } from "../../../src/lib/prisma";
import { createCompanyWithRecruiter } from "../../helpers/fixtures";

describe("IDOR Protection — Invitations", () => {
	it("enforces tenant scoping on invitation read, cancel, and assessment listing", async () => {
		const tenantA = await createCompanyWithRecruiter();
		const tenantB = await createCompanyWithRecruiter();

		// Recruiter B creates an assessment and an invitation in Company B
		const assessmentB = await prisma.assessment.create({
			data: {
				title: "Assessment B",
				slug: `assessment-inv-b-${Date.now()}`,
				companyId: tenantB.company.id,
				createdById: tenantB.recruiter.id,
				durationMinutes: 60,
				totalMarks: 100,
				passingMarks: 50,
				status: "PUBLISHED",
			},
		});

		const invitationB = await prisma.assessmentInvitation.create({
			data: {
				assessmentId: assessmentB.id,
				email: `candidate-${Date.now()}@evalora.test`,
				status: "PENDING",
				tokenHash: `token-${Date.now()}`,
			},
		});

		// 1. Recruiter A GET Recruiter B's invitation -> 404 Not Found
		const getRes = await request(app)
			.get(`/api/v1/invitations/${invitationB.id}`)
			.set("Cookie", tenantA.recruiter.cookie);
		expect(getRes.status).toBe(404);

		// 2. Recruiter A DELETE (cancel) Recruiter B's invitation -> 404 Not Found
		const deleteRes = await request(app)
			.delete(`/api/v1/invitations/${invitationB.id}`)
			.set("Cookie", tenantA.recruiter.cookie);
		expect(deleteRes.status).toBe(404);

		// 3. Recruiter A GET list invitations for Recruiter B's assessment -> 404 Not Found
		const listRes = await request(app)
			.get(`/api/v1/invitations/assessments/${assessmentB.id}`)
			.set("Cookie", tenantA.recruiter.cookie);
		expect(listRes.status).toBe(404);
	});
});
