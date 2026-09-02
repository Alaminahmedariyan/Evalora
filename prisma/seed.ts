import "dotenv/config";
import { randomUUID, createHash } from "node:crypto";

import config from "../src/app/config";
import { auth } from "../src/lib/auth";
import { prisma } from "../src/lib/prisma";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function generateTokenHash() {
	return createHash("sha256").update(randomUUID()).digest("hex");
}

/**
 * Creates a user through Better Auth's own sign-up flow (so a matching
 * `Account` row with a real hashed password is created the same way the
 * app itself would), or returns the existing user if the email is already
 * seeded. Never inserts directly into `User` with a password field —
 * Better Auth owns credentials.
 */
async function signUpOrGetUser(params: { name: string; email: string; password: string }) {
	const existing = await prisma.user.findUnique({ where: { email: params.email } });
	if (existing) return existing;

	await auth.api.signUpEmail({
		body: {
			name: params.name,
			email: params.email,
			password: params.password,
		},
	});

	return prisma.user.findUniqueOrThrow({ where: { email: params.email } });
}

// ---------------------------------------------------------------------------
// 1. Admin
// ---------------------------------------------------------------------------

async function seedAdmin() {
	const user = await signUpOrGetUser(config.superAdmin);

	await prisma.user.update({
		where: { id: user.id },
		data: { role: "ADMIN", emailVerified: true, status: "ACTIVE" },
	});

	console.log(`✅ Admin ready: ${user.email}`);
	return prisma.user.findUniqueOrThrow({ where: { id: user.id } });
}

// ---------------------------------------------------------------------------
// 2. Recruiter + Company + Subscription
// ---------------------------------------------------------------------------

const RECRUITER_DEMO = {
	name: "Rafiq Islam",
	email: "recruiter@demo.com",
	password: "Recruiter@123",
};

async function seedRecruiterWithCompany() {
	const user = await signUpOrGetUser(RECRUITER_DEMO);

	await prisma.user.update({
		where: { id: user.id },
		data: { role: "RECRUITER", emailVerified: true },
	});

	const companyData = {
		name: "Brainstation Labs",
		description: "A software company hiring junior full-stack developers.",
		website: "https://example.com",
		industry: "Software Development",
		isVerified: true,
	};

	const company = await prisma.company.upsert({
		where: { ownerId: user.id },
		update: companyData,
		create: {
			...companyData,
			slug: "brainstation-labs",
			ownerId: user.id,
		},
	});

	const subscriptionData = {
		plan: "PRO" as const,
		status: "ACTIVE" as const,
		currentPeriodStart: new Date(),
		currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
	};

	await prisma.subscription.upsert({
		where: { companyId: company.id },
		update: subscriptionData,
		create: { companyId: company.id, ...subscriptionData },
	});

	console.log(`✅ Recruiter + Company ready: ${company.name} (${user.email})`);
	return { user, company };
}

// ---------------------------------------------------------------------------
// 3. Candidates + Profiles
// ---------------------------------------------------------------------------

const CANDIDATE_DEMOS = [
	{
		name: "Tanvir Hasan",
		email: "candidate1@demo.com",
		password: "Candidate@123",
		headline: "Junior Full-Stack Developer",
		skills: ["JavaScript", "TypeScript", "Node.js", "React", "Prisma"],
		experienceYears: 1,
	},
	{
		name: "Nusrat Jahan",
		email: "candidate2@demo.com",
		password: "Candidate@123",
		headline: "Aspiring Backend Developer",
		skills: ["Python", "SQL", "Django"],
		experienceYears: 0,
	},
];

async function seedCandidates() {
	const candidates: { user: Awaited<ReturnType<typeof signUpOrGetUser>>; profileId: string }[] = [];

	for (const input of CANDIDATE_DEMOS) {
		const user = await signUpOrGetUser(input);

		await prisma.user.update({
			where: { id: user.id },
			data: { role: "CANDIDATE", emailVerified: true },
		});

		const profileData = {
			headline: input.headline,
			bio: "Seeded demo candidate for evaluation purposes.",
			skills: input.skills,
			experienceYears: input.experienceYears,
		};

		const profile = await prisma.candidateProfile.upsert({
			where: { userId: user.id },
			update: profileData,
			create: { userId: user.id, ...profileData },
		});

		await prisma.userConsent.upsert({
			where: { userId_consentType: { userId: user.id, consentType: "TERMS_OF_SERVICE" } },
			update: { granted: true },
			create: { userId: user.id, consentType: "TERMS_OF_SERVICE", granted: true },
		});

		candidates.push({ user, profileId: profile.id });
	}

	console.log(`✅ ${candidates.length} candidates ready`);
	return candidates;
}

// ---------------------------------------------------------------------------
// 4. Problems: one MCQ, one CODING, one WRITTEN
// slug is now company-scoped — see schema change: @@unique([companyId, slug])
// ---------------------------------------------------------------------------

async function seedProblems(companyId: string, createdById: string) {
	const mcqSlug = "js-event-loop-mcq";
	const codingSlug = "two-sum-coding";
	const writtenSlug = "rest-vs-graphql-written";

	await prisma.problem.upsert({
		where: { companyId_slug: { companyId, slug: mcqSlug } },
		update: {
			title: "JavaScript Event Loop",
			description: "Which statement best describes the JavaScript event loop?",
			difficulty: "MEDIUM",
			defaultMarks: 5,
		},
		create: {
			title: "JavaScript Event Loop",
			slug: mcqSlug,
			description: "Which statement best describes the JavaScript event loop?",
			type: "MCQ",
			difficulty: "MEDIUM",
			defaultMarks: 5,
			companyId,
			createdById,
			// Nested rows only get created the first time this upsert runs a
			// `create`; they are intentionally not re-synced on every rerun.
			mcqProblem: {
				create: {
					type: "SINGLE_CHOICE",
					explanation: "The event loop moves callbacks from the queue to the call stack once it is empty.",
					options: {
						create: [
							{ optionText: "It runs multiple threads in parallel.", isCorrect: false, order: 1 },
							{
								optionText: "It moves callback tasks from the queue to the call stack once it's empty.",
								isCorrect: true,
								order: 2,
							},
							{ optionText: "It compiles JavaScript into machine code.", isCorrect: false, order: 3 },
							{ optionText: "It only exists in Node.js, not in browsers.", isCorrect: false, order: 4 },
						],
					},
				},
			},
		},
	});

	await prisma.problem.upsert({
		where: { companyId_slug: { companyId, slug: codingSlug } },
		update: {
			title: "Two Sum",
			difficulty: "EASY",
			defaultMarks: 10,
			timeLimitSeconds: 900,
		},
		create: {
			title: "Two Sum",
			slug: codingSlug,
			description:
				"Given an array of integers and a target, return the indices of the two numbers that add up to target.",
			type: "CODING",
			difficulty: "EASY",
			defaultMarks: 10,
			timeLimitSeconds: 900,
			companyId,
			createdById,
			testCases: {
				create: [
					{ input: "[2,7,11,15]\n9", expectedOutput: "[0,1]", isSample: true, points: 2 },
					{ input: "[3,2,4]\n6", expectedOutput: "[1,2]", isSample: false, points: 4 },
					{ input: "[3,3]\n6", expectedOutput: "[0,1]", isSample: false, points: 4 },
				],
			},
		},
	});

	await prisma.problem.upsert({
		where: { companyId_slug: { companyId, slug: writtenSlug } },
		update: {
			title: "REST vs GraphQL",
			difficulty: "MEDIUM",
			defaultMarks: 10,
		},
		create: {
			title: "REST vs GraphQL",
			slug: writtenSlug,
			description: "Explain the key differences between REST and GraphQL, with one real-world use case for each.",
			type: "WRITTEN",
			difficulty: "MEDIUM",
			defaultMarks: 10,
			companyId,
			createdById,
		},
	});

	// Re-fetch with nested relations so callers get real IDs (mcqProblem.id,
	// mcqOption ids, testCase ids) instead of the plain rows returned by upsert.
	const [mcq, coding, written] = await Promise.all([
		prisma.problem.findUniqueOrThrow({
			where: { companyId_slug: { companyId, slug: mcqSlug } },
			include: { mcqProblem: { include: { options: true } } },
		}),
		prisma.problem.findUniqueOrThrow({
			where: { companyId_slug: { companyId, slug: codingSlug } },
			include: { testCases: true },
		}),
		prisma.problem.findUniqueOrThrow({ where: { companyId_slug: { companyId, slug: writtenSlug } } }),
	]);

	console.log("✅ Problems ready (MCQ, CODING, WRITTEN)");
	return { mcq, coding, written };
}

// ---------------------------------------------------------------------------
// 5. Assessment (links the 3 problems together)
// ---------------------------------------------------------------------------

async function seedAssessment(params: {
	companyId: string;
	createdById: string;
	mcqId: string;
	codingId: string;
	writtenId: string;
}) {
	const key = { companyId_slug_version: { companyId: params.companyId, slug: "junior-fullstack-developer", version: 1 } };

	const baseData = {
		title: "Junior Full-Stack Developer Assessment",
		description: "Screening assessment for junior full-stack developer candidates.",
		instructions: "You have 60 minutes. Do not switch tabs or the attempt will be flagged.",
		durationMinutes: 60,
		totalMarks: 25,
		passingMarks: 15,
		maxAttempts: 1,
		status: "PUBLISHED" as const,
	};

	await prisma.assessment.upsert({
		where: key,
		update: baseData,
		create: {
			...baseData,
			slug: "junior-fullstack-developer",
			publishedAt: new Date(),
			companyId: params.companyId,
			createdById: params.createdById,
			assessmentProblems: {
				create: [
					{ problemId: params.mcqId, order: 1, marks: 5 },
					{ problemId: params.codingId, order: 2, marks: 10 },
					{ problemId: params.writtenId, order: 3, marks: 10 },
				],
			},
		},
	});

	const assessment = await prisma.assessment.findUniqueOrThrow({ where: key });

	console.log(`✅ Assessment ready: ${assessment.title}`);
	return assessment;
}

// ---------------------------------------------------------------------------
// 6. Invitations — one accepted (registered candidate), one still pending
//    (email-only, candidate hasn't signed up yet).
// ---------------------------------------------------------------------------

async function seedInvitations(params: { assessmentId: string; candidate1: { id: string; email: string } }) {
	const accepted = await prisma.assessmentInvitation.upsert({
		where: { assessmentId_email: { assessmentId: params.assessmentId, email: params.candidate1.email } },
		// Reset to ACCEPTED on every rerun — seedCompletedAttempt() below will
		// move it back to COMPLETED, so the seed always ends in the same state
		// regardless of how many times it's run.
		update: {
			candidateId: params.candidate1.id,
			status: "ACCEPTED",
			acceptedAt: new Date(),
			expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
			completedAt: null,
		},
		create: {
			assessmentId: params.assessmentId,
			candidateId: params.candidate1.id,
			email: params.candidate1.email,
			status: "ACCEPTED",
			tokenHash: generateTokenHash(),
			expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
			acceptedAt: new Date(),
		},
	});

	await prisma.assessmentInvitation.upsert({
		where: { assessmentId_email: { assessmentId: params.assessmentId, email: "not-yet-registered@demo.com" } },
		update: {},
		create: {
			assessmentId: params.assessmentId,
			candidateId: null,
			email: "not-yet-registered@demo.com",
			status: "PENDING",
			tokenHash: generateTokenHash(),
			expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
		},
	});

	console.log("✅ Invitations ready (1 accepted, 1 pending)");
	return accepted;
}

// ---------------------------------------------------------------------------
// 7. A completed + evaluated attempt for candidate1, so the DB has a real
//    end-to-end example (attempt -> submissions -> evaluations -> result).
// ---------------------------------------------------------------------------

async function seedCompletedAttempt(params: {
	assessmentId: string;
	candidateId: string;
	invitationId: string;
	evaluatorId: string; // recruiter grading the written answer
	mcq: Awaited<ReturnType<typeof seedProblems>>["mcq"];
	coding: Awaited<ReturnType<typeof seedProblems>>["coding"];
	written: Awaited<ReturnType<typeof seedProblems>>["written"];
}) {
	// Fixed, internally-consistent timeline: started an hour ago, the
	// assessment's own 60-minute window, submitted right as it expires.
	const startedAt = new Date(Date.now() - 60 * 60 * 1000);
	const expiresAt = new Date(startedAt.getTime() + 60 * 60 * 1000);
	const submittedAt = expiresAt;

	const attempt = await prisma.assessmentAttempt.upsert({
		where: {
			assessmentId_candidateId_attemptNumber: {
				assessmentId: params.assessmentId,
				candidateId: params.candidateId,
				attemptNumber: 1,
			},
		},
		update: { status: "SUBMITTED", startedAt, submittedAt, expiresAt, tabSwitchCount: 1 },
		create: {
			assessmentId: params.assessmentId,
			candidateId: params.candidateId,
			invitationId: params.invitationId,
			attemptNumber: 1,
			status: "SUBMITTED",
			startedAt,
			submittedAt,
			expiresAt,
			tabSwitchCount: 1,
		},
	});

	// --- MCQ submission: candidate picks the correct option, auto-graded ---
	const correctOption = params.mcq.mcqProblem!.options.find((option) => option.isCorrect)!;

	const mcqSubmission = await prisma.submission.upsert({
		where: { attemptId_problemId: { attemptId: attempt.id, problemId: params.mcq.id } },
		update: { status: "EVALUATED", submittedAt: new Date() },
		create: {
			attemptId: attempt.id,
			problemId: params.mcq.id,
			status: "EVALUATED",
			submittedAt: new Date(),
			answers: { create: [{ optionId: correctOption.id }] },
		},
	});

	await prisma.submissionEvaluation.upsert({
		where: { submissionId: mcqSubmission.id },
		update: { score: 5, maxScore: 5, status: "COMPLETED", isAutoEvaluated: true, evaluatedAt: new Date() },
		create: {
			submissionId: mcqSubmission.id,
			score: 5,
			maxScore: 5,
			status: "COMPLETED",
			isAutoEvaluated: true,
			evaluatedAt: new Date(),
		},
	});

	// --- Coding submission: passes 2 of 3 test cases, auto-graded ---
	// Intentionally buggy on purpose: `need !== nums[i]` rejects a match against
	// the same value at a different index, so it fails the [3,3] duplicate-value
	// case below — matching the "fails the third test case" story in the result.
	const twoSumCode =
		"function twoSum(nums, target) {\n  const seen = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const need = target - nums[i];\n    if (seen.has(need) && need !== nums[i]) return [seen.get(need), i];\n    seen.set(nums[i], i);\n  }\n}";

	const codingSubmission = await prisma.submission.upsert({
		where: { attemptId_problemId: { attemptId: attempt.id, problemId: params.coding.id } },
		update: { status: "EVALUATED", code: twoSumCode, language: "javascript", submittedAt: new Date() },
		create: {
			attemptId: attempt.id,
			problemId: params.coding.id,
			status: "EVALUATED",
			code: twoSumCode,
			language: "javascript",
			submittedAt: new Date(),
		},
	});

	// Test 1 (points 2) and Test 2 (points 4) pass, Test 3 (points 4) fails
	// the duplicate-value edge case -> 2 + 4 + 0 = 6 out of 10.
	await Promise.all(
		params.coding.testCases.map((testCase, index) => {
			const passed = index !== 2;
			return prisma.testCaseResult.upsert({
				where: { submissionId_testCaseId: { submissionId: codingSubmission.id, testCaseId: testCase.id } },
				update: { passed, actualOutput: passed ? testCase.expectedOutput : "[]", points: passed ? testCase.points : 0 },
				create: {
					submissionId: codingSubmission.id,
					testCaseId: testCase.id,
					passed,
					actualOutput: passed ? testCase.expectedOutput : "[]",
					points: passed ? testCase.points : 0,
				},
			});
		}),
	);

	await prisma.submissionEvaluation.upsert({
		where: { submissionId: codingSubmission.id },
		update: {
			score: 6,
			maxScore: 10,
			status: "COMPLETED",
			isAutoEvaluated: true,
			evaluatedAt: new Date(),
			feedback: "Handles the general case correctly; misses the duplicate-value edge case.",
		},
		create: {
			submissionId: codingSubmission.id,
			score: 6, // 2 + 4 points from the two passed test cases
			maxScore: 10,
			status: "COMPLETED",
			isAutoEvaluated: true,
			evaluatedAt: new Date(),
			feedback: "Handles the general case correctly; misses the duplicate-value edge case.",
		},
	});

	// --- Written submission: manually graded by the recruiter ---
	const writtenAnswerText =
		"REST exposes fixed endpoints per resource; GraphQL exposes a single endpoint and lets the client ask for exactly the fields it needs...";

	const writtenSubmission = await prisma.submission.upsert({
		where: { attemptId_problemId: { attemptId: attempt.id, problemId: params.written.id } },
		update: { status: "EVALUATED", answerText: writtenAnswerText, submittedAt: new Date() },
		create: {
			attemptId: attempt.id,
			problemId: params.written.id,
			status: "EVALUATED",
			answerText: writtenAnswerText,
			submittedAt: new Date(),
		},
	});

	await prisma.submissionEvaluation.upsert({
		where: { submissionId: writtenSubmission.id },
		update: {
			evaluatorId: params.evaluatorId,
			score: 7,
			maxScore: 10,
			status: "COMPLETED",
			isAutoEvaluated: false,
			evaluatedAt: new Date(),
			feedback: "Good core explanation, missing a concrete use case for each approach.",
		},
		create: {
			submissionId: writtenSubmission.id,
			evaluatorId: params.evaluatorId,
			score: 7,
			maxScore: 10,
			status: "COMPLETED",
			isAutoEvaluated: false,
			evaluatedAt: new Date(),
			feedback: "Good core explanation, missing a concrete use case for each approach.",
		},
	});

		// --- Roll up into the final Result row ---
	const totalScore = 5 + 6 + 7;
	const totalMarks = 25;
	const resultStatus: "PASSED" | "FAILED" = totalScore >= 15 ? "PASSED" : "FAILED";

	const resultData = {
		totalScore,
		totalMarks,
		percentage: (totalScore / totalMarks) * 100,
		status: resultStatus,
		rank: 1,
		evaluatedAt: new Date(),
	};

	await prisma.result.upsert({
		where: { attemptId: attempt.id },
		update: resultData,
		create: { attemptId: attempt.id, assessmentId: params.assessmentId, ...resultData },
	});

	// --- Mark the invitation as completed now that the attempt is done ---
	await prisma.assessmentInvitation.update({
		where: { id: params.invitationId },
		data: { status: "COMPLETED", completedAt: new Date() },
	});

	// --- Proctoring event backing the attempt's tabSwitchCount: 1 ---
	const existingProctoringEvent = await prisma.proctoringEvent.findFirst({
		where: { attemptId: attempt.id, eventType: "TAB_SWITCH" },
	});

	if (!existingProctoringEvent) {
		await prisma.proctoringEvent.create({
			data: {
				attemptId: attempt.id,
				eventType: "TAB_SWITCH",
				metadata: { source: "database-seed", tabSwitchNumber: 1 },
			},
		});
	}

	// --- Result-published notification (guarded so reruns don't duplicate it) ---
	const existingNotification = await prisma.notification.findFirst({
		where: {
			userId: params.candidateId,
			type: "ATTEMPT_EVALUATED",
			metadata: { path: ["attemptId"], equals: attempt.id },
		},
	});

	if (!existingNotification) {
		await prisma.notification.create({
			data: {
				userId: params.candidateId,
				title: "Result Published",
				message: "Your result for 'Junior Full-Stack Developer Assessment' is now available.",
				type: "ATTEMPT_EVALUATED",
				metadata: { assessmentId: params.assessmentId, attemptId: attempt.id },
			},
		});
	}

	console.log(`✅ Completed attempt + result seeded (score ${totalScore}/${totalMarks})`);
}

// ---------------------------------------------------------------------------
// 8. Audit log entry (demonstrates the audit trail requirement)
// ---------------------------------------------------------------------------

async function seedAuditLog(params: { actorId: string; assessmentId: string }) {
	const existing = await prisma.auditLog.findFirst({
		where: {
			userId: params.actorId,
			action: "STATUS_CHANGE",
			entity: "Assessment",
			entityId: params.assessmentId,
		},
	});

	if (!existing) {
		await prisma.auditLog.create({
			data: {
				userId: params.actorId,
				action: "STATUS_CHANGE",
				entity: "Assessment",
				entityId: params.assessmentId,
				oldValue: { status: "DRAFT" },
				newValue: { status: "PUBLISHED" },
			},
		});
	}

	console.log("✅ Audit log entry ready");
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
	console.log("🌱 Starting database seed...");

	const admin = await seedAdmin();
	const { user: recruiter, company } = await seedRecruiterWithCompany();
	const candidates = await seedCandidates();
	const problems = await seedProblems(company.id, recruiter.id);
	const assessment = await seedAssessment({
		companyId: company.id,
		createdById: recruiter.id,
		mcqId: problems.mcq.id,
		codingId: problems.coding.id,
		writtenId: problems.written.id,
	});

	const [candidate1] = candidates;
	const invitation = await seedInvitations({
		assessmentId: assessment.id,
		candidate1: { id: candidate1.user.id, email: candidate1.user.email },
	});

	await seedCompletedAttempt({
		assessmentId: assessment.id,
		candidateId: candidate1.user.id,
		invitationId: invitation.id,
		evaluatorId: recruiter.id,
		mcq: problems.mcq,
		coding: problems.coding,
		written: problems.written,
	});

	await seedAuditLog({ actorId: admin.id, assessmentId: assessment.id });

	console.log("🎉 Seed completed.");
	console.log("—".repeat(40));
	console.log(`Admin login:     ${config.superAdmin.email} / (see config)`);
	console.log(`Recruiter login: ${RECRUITER_DEMO.email} / ${RECRUITER_DEMO.password}`);
	console.log(`Candidate login: ${CANDIDATE_DEMOS[0].email} / ${CANDIDATE_DEMOS[0].password}`);
}

main()
	.catch((error) => {
		console.error("❌ Seed failed:", error);
		process.exitCode = 1;
	})
	.finally(async () => {
		await prisma.$disconnect();
	});