import { createHash, randomUUID } from "node:crypto";

import {
	gradeSubmissionForProblem,
	recomputeResult,
} from "../src/app/modules/attempt/grading.util";
import { auth } from "../src/lib/auth";
import { prisma } from "../src/lib/prisma";

export const DEMO_PASSWORD = "Demo@12345";
const MINUTE = 60 * 1000;

async function ensureUser(
	name: string,
	email: string,
	role: "RECRUITER" | "CANDIDATE",
) {
	let user = await prisma.user.findUnique({ where: { email } });

	if (!user) {
		await auth.api.signUpEmail({
			body: { name, email, password: DEMO_PASSWORD },
		});
		user = await prisma.user.findUniqueOrThrow({ where: { email } });
	}

	return prisma.user.update({
		where: { id: user.id },
		data: { role, status: "ACTIVE", emailVerified: true, deletedAt: null },
	});
}

async function ensureCompany(ownerId: string) {
	const existing = await prisma.company.findUnique({ where: { ownerId } });
	if (existing) return existing;

	const company = await prisma.company.create({
		data: {
			name: "Acme Engineering",
			slug: "acme-engineering",
			description: "A demo company for trying out Evalora.",
			website: "https://example.com",
			industry: "Software Development",
			isVerified: true,
			ownerId,
		},
	});

	await prisma.subscription.create({
		data: { companyId: company.id, plan: "FREE", status: "ACTIVE" },
	});

	return company;
}

async function ensureProblems(companyId: string, createdById: string) {
	const find = (slug: string) =>
		prisma.problem.findUnique({
			where: { companyId_slug: { companyId, slug } },
			select: { id: true },
		});

	const mcq =
		(await find("javascript-closures")) ??
		(await prisma.problem.create({
			data: {
				companyId,
				createdById,
				title: "JavaScript closures",
				slug: "javascript-closures",
				description: "Which statement best describes a closure in JavaScript?",
				type: "MCQ",
				difficulty: "MEDIUM",
				defaultMarks: 5,
				mcqProblem: {
					create: {
						type: "SINGLE_CHOICE",
						explanation:
							"A closure is a function that keeps access to the scope it was created in.",
						options: {
							create: [
								{
									optionText:
										"A function bundled with references to its surrounding scope.",
									isCorrect: true,
									order: 1,
								},
								{
									optionText: "A way to permanently freeze an object.",
									isCorrect: false,
									order: 2,
								},
								{
									optionText: "A built-in loop construct.",
									isCorrect: false,
									order: 3,
								},
								{
									optionText: "A CSS layout technique.",
									isCorrect: false,
									order: 4,
								},
							],
						},
					},
				},
			},
			select: { id: true },
		}));

	const coding =
		(await find("two-sum")) ??
		(await prisma.problem.create({
			data: {
				companyId,
				createdById,
				title: "Two Sum",
				slug: "two-sum",
				description:
					"Given an array of integers and a target, return the indices of the two numbers that add up to the target.",
				type: "CODING",
				difficulty: "EASY",
				defaultMarks: 10,
				timeLimitSeconds: 900,
				testCases: {
					create: [
						{
							input: "[2,7,11,15]\n9",
							expectedOutput: "[0,1]",
							isSample: true,
							points: 4,
						},
						{
							input: "[3,2,4]\n6",
							expectedOutput: "[1,2]",
							isSample: false,
							points: 3,
						},
						{
							input: "[3,3]\n6",
							expectedOutput: "[0,1]",
							isSample: false,
							points: 3,
						},
					],
				},
			},
			select: { id: true },
		}));

	const written =
		(await find("rest-vs-graphql")) ??
		(await prisma.problem.create({
			data: {
				companyId,
				createdById,
				title: "REST vs GraphQL",
				slug: "rest-vs-graphql",
				description:
					"Explain the key differences between REST and GraphQL, with one real-world use case for each.",
				type: "WRITTEN",
				difficulty: "MEDIUM",
				defaultMarks: 10,
			},
			select: { id: true },
		}));

	return { mcq: mcq.id, coding: coding.id, written: written.id };
}

async function ensureAssessment(
	companyId: string,
	createdById: string,
	problems: { mcq: string; coding: string; written: string },
) {
	const slug = "junior-full-stack-assessment";

	const existing = await prisma.assessment.findUnique({
		where: { companyId_slug_version: { companyId, slug, version: 1 } },
		select: { id: true },
	});

	if (existing) return existing;

	return prisma.assessment.create({
		data: {
			companyId,
			createdById,
			title: "Junior Full-Stack Assessment",
			slug,
			description: "A short screening assessment for junior developers.",
			instructions:
				"You have 60 minutes. Your answers are saved as you type. Leaving full screen is recorded.",
			durationMinutes: 60,
			totalMarks: 25,
			passingMarks: 15,
			maxAttempts: 2,
			status: "PUBLISHED",
			publishedAt: new Date(),
			showResultImmediately: true,
			assessmentProblems: {
				create: [
					{ problemId: problems.mcq, order: 1, marks: 5 },
					{ problemId: problems.coding, order: 2, marks: 10 },
					{ problemId: problems.written, order: 3, marks: 10 },
				],
			},
		},
		select: { id: true },
	});
}

async function ensureInvitation(
	assessmentId: string,
	candidate: { id: string; email: string },
	status: "PENDING" | "COMPLETED",
) {
	const existing = await prisma.assessmentInvitation.findUnique({
		where: { assessmentId_email: { assessmentId, email: candidate.email } },
	});

	if (existing) return existing;

	const now = new Date();

	return prisma.assessmentInvitation.create({
		data: {
			assessmentId,
			email: candidate.email,
			candidateId: candidate.id,
			status,
			tokenHash: createHash("sha256").update(randomUUID()).digest("hex"),
			expiresAt: new Date(Date.now() + 30 * 24 * 60 * MINUTE),
			...(status === "COMPLETED" ? { acceptedAt: now, completedAt: now } : {}),
		},
	});
}

async function ensureFinishedAttempt(
	assessmentId: string,
	candidateId: string,
	invitationId: string,
	problems: { mcq: string; coding: string; written: string },
) {
	const existing = await prisma.assessmentAttempt.findFirst({
		where: { assessmentId, candidateId },
		select: { id: true },
	});

	if (existing) return;

	const now = Date.now();

	const attempt = await prisma.assessmentAttempt.create({
		data: {
			assessmentId,
			candidateId,
			invitationId,
			attemptNumber: 1,
			status: "SUBMITTED",
			startedAt: new Date(now - 45 * MINUTE),
			submittedAt: new Date(now - 5 * MINUTE),
			expiresAt: new Date(now + 15 * MINUTE),
			tabSwitchCount: 2,
		},
	});

	await prisma.proctoringEvent.createMany({
		data: [
			{
				attemptId: attempt.id,
				eventType: "TAB_SWITCH",
				timestamp: new Date(now - 32 * MINUTE),
			},
			{
				attemptId: attempt.id,
				eventType: "WINDOW_BLUR",
				timestamp: new Date(now - 32 * MINUTE),
			},
			{
				attemptId: attempt.id,
				eventType: "TAB_SWITCH",
				timestamp: new Date(now - 18 * MINUTE),
			},
			{
				attemptId: attempt.id,
				eventType: "FULLSCREEN_EXIT",
				timestamp: new Date(now - 11 * MINUTE),
			},
		],
	});

	const correct = await prisma.mcqOption.findFirstOrThrow({
		where: { isCorrect: true, mcqProblem: { problemId: problems.mcq } },
		select: { id: true },
	});

	const mcqSubmission = await prisma.submission.create({
		data: {
			attemptId: attempt.id,
			problemId: problems.mcq,
			status: "SUBMITTED",
			submittedAt: new Date(now - 40 * MINUTE),
		},
	});

	await prisma.submissionAnswer.create({
		data: { submissionId: mcqSubmission.id, optionId: correct.id },
	});

	await prisma.submission.create({
		data: {
			attemptId: attempt.id,
			problemId: problems.coding,
			status: "SUBMITTED",
			submittedAt: new Date(now - 20 * MINUTE),
			language: "javascript",
			code: [
				"function twoSum(nums, target) {",
				"  const seen = new Map();",
				"  for (let i = 0; i < nums.length; i++) {",
				"    const need = target - nums[i];",
				"    if (seen.has(need)) return [seen.get(need), i];",
				"    seen.set(nums[i], i);",
				"  }",
				"}",
			].join("\n"),
		},
	});

	await prisma.submission.create({
		data: {
			attemptId: attempt.id,
			problemId: problems.written,
			status: "SUBMITTED",
			submittedAt: new Date(now - 8 * MINUTE),
			answerText:
				"REST exposes a fixed endpoint per resource, while GraphQL exposes one endpoint and lets the client ask for exactly the fields it needs. REST suits simple public APIs; GraphQL suits apps with varied data needs, such as a mobile app combining many resources in one request.",
		},
	});

	// Same grading path a real submission goes through.
	const graded = [
		{ problemId: problems.mcq, problemType: "MCQ" as const, marks: 5 },
		{ problemId: problems.coding, problemType: "CODING" as const, marks: 10 },
		{ problemId: problems.written, problemType: "WRITTEN" as const, marks: 10 },
	];

	for (const item of graded) {
		await gradeSubmissionForProblem({ attemptId: attempt.id, ...item });
	}

	await recomputeResult(attempt.id);
}

export async function seedDemo() {
	const recruiter = await ensureUser("Riya Recruiter", "recruiter@demo.com", "RECRUITER");
	const candidate1 = await ensureUser("Arif Candidate", "candidate1@demo.com", "CANDIDATE");
	const candidate2 = await ensureUser("Nadia Candidate", "candidate2@demo.com", "CANDIDATE");

	await prisma.candidateProfile.upsert({
		where: { userId: candidate1.id },
		update: {},
		create: {
			userId: candidate1.id,
			headline: "Full-stack developer",
			bio: "Builds web apps with React, Node.js and PostgreSQL.",
			location: "Dhaka, Bangladesh",
			skills: ["React", "TypeScript", "Node.js", "PostgreSQL"],
			experienceYears: 2,
		},
	});

	await prisma.candidateProfile.upsert({
		where: { userId: candidate2.id },
		update: {},
		create: {
			userId: candidate2.id,
			headline: "Frontend developer",
			location: "Chattogram, Bangladesh",
			skills: ["React", "Next.js", "Tailwind CSS"],
			experienceYears: 1,
		},
	});

	const company = await ensureCompany(recruiter.id);
	const problems = await ensureProblems(company.id, recruiter.id);
	const assessment = await ensureAssessment(company.id, recruiter.id, problems);

	const doneInvitation = await ensureInvitation(assessment.id, candidate1, "COMPLETED");
	await ensureInvitation(assessment.id, candidate2, "PENDING");

	await ensureFinishedAttempt(assessment.id, candidate1.id, doneInvitation.id, problems);

	console.log(`✅ Demo data ready. Demo accounts use the password ${DEMO_PASSWORD}`);
}