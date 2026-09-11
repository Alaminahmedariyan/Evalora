import request from "supertest";
import { describe, expect, it } from "vitest";

import app from "../../../src/app";
import { prisma } from "../../../src/lib/prisma";
import { createUserWithRole } from "../../helpers/auth";
import { createCompanyWithRecruiter } from "../../helpers/fixtures";

describe("IDOR Protection — Assessment Attempts", () => {
	it("prevents cross-tenant recruiter access and cross-candidate attempt access", async () => {
		const tenantA = await createCompanyWithRecruiter();
		const tenantB = await createCompanyWithRecruiter();

		const candidateB = await createUserWithRole("CANDIDATE");
		const candidateA = await createUserWithRole("CANDIDATE");

		// Assessment in Company B
		const assessmentB = await prisma.assessment.create({
			data: {
				title: "Assessment B",
				slug: `assessment-att-b-${Date.now()}`,
				companyId: tenantB.company.id,
				createdById: tenantB.recruiter.id,
				durationMinutes: 60,
				totalMarks: 100,
				passingMarks: 50,
				status: "PUBLISHED",
			},
		});

		// Attempt by Candidate B on Assessment B
		const attemptB = await prisma.assessmentAttempt.create({
			data: {
				assessmentId: assessmentB.id,
				candidateId: candidateB.id,
				attemptNumber: 1,
				status: "IN_PROGRESS",
				startedAt: new Date(),
				expiresAt: new Date(Date.now() + 3600000),
			},
		});

		// 1. Recruiter A GET Recruiter B's attempt -> 404 Not Found
		const recruiterRes = await request(app)
			.get(`/api/v1/attempts/${attemptB.id}`)
			.set("Cookie", tenantA.recruiter.cookie);
		expect(recruiterRes.status).toBe(404);

		// 2. Candidate A GET Candidate B's attempt -> 404 Not Found
		const candidateRes = await request(app)
			.get(`/api/v1/attempts/${attemptB.id}`)
			.set("Cookie", candidateA.cookie);
		expect(candidateRes.status).toBe(404);
	});
});
