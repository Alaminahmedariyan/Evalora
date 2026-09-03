import type { ProblemType } from "../../../generated/prisma/enums";

import { prisma } from "../../../lib/prisma";

/**
 * Called once per assessment problem when an attempt is finalized (either
 * an explicit submit or a lazy auto-submit on expiry). Ensures every
 * problem in the assessment ends up with exactly one Submission +
 * SubmissionEvaluation row, even if the candidate never answered it.
 *
 * - No submission exists at all (candidate skipped it) -> create a blank
 *   Submission and grade it 0/marks, COMPLETED immediately. There's
 *   nothing to manually review about a blank answer, and leaving it
 *   ungraded would permanently block the attempt's Result from finalizing.
 * - MCQ with a submission -> auto-graded by comparing the selected option
 *   set against the correct option set. COMPLETED immediately.
 * - CODING/WRITTEN with a real answer -> left PENDING for a recruiter to
 *   grade manually (see evaluation.service.ts). This project intentionally
 *   does not execute candidate-submitted code — see the design note in
 *   attempt.interface.ts / the module's opening explanation.
 */
export const gradeSubmissionForProblem = async (params: {
	attemptId: string;
	problemId: string;
	problemType: ProblemType;
	marks: number;
}) => {
	const { attemptId, problemId, problemType, marks } = params;

	const submission = await prisma.submission.findUnique({
		where: { attemptId_problemId: { attemptId, problemId } },
	});

	if (!submission) {
		const blank = await prisma.submission.create({
			data: { attemptId, problemId, status: "EVALUATED" },
		});

		await prisma.submissionEvaluation.create({
			data: { submissionId: blank.id, score: 0, maxScore: marks, status: "COMPLETED", isAutoEvaluated: true, evaluatedAt: new Date() },
		});
		return;
	}

	if (problemType === "MCQ") {
		const [mcqProblem, selectedAnswers] = await Promise.all([
			prisma.mcqProblem.findUniqueOrThrow({
				where: { problemId },
				include: { options: { select: { id: true, isCorrect: true } } },
			}),
			prisma.submissionAnswer.findMany({ where: { submissionId: submission.id }, select: { optionId: true } }),
		]);

		const selectedIds = new Set(selectedAnswers.map((answer) => answer.optionId));
		const correctIds = new Set(mcqProblem.options.filter((option) => option.isCorrect).map((option) => option.id));
		const isFullyCorrect =
			selectedIds.size === correctIds.size && [...selectedIds].every((id) => correctIds.has(id));

		const score = isFullyCorrect ? marks : 0;

		await prisma.submission.update({ where: { id: submission.id }, data: { status: "EVALUATED" } });
		await prisma.submissionEvaluation.upsert({
			where: { submissionId: submission.id },
			update: { score, maxScore: marks, status: "COMPLETED", isAutoEvaluated: true, evaluatedAt: new Date() },
			create: {
				submissionId: submission.id,
				score,
				maxScore: marks,
				status: "COMPLETED",
				isAutoEvaluated: true,
				evaluatedAt: new Date(),
			},
		});
		return;
	}

	// CODING / WRITTEN with a real answer — needs a human. Submission moves
	// to EVALUATING (not EVALUATED) until a recruiter grades it.
	await prisma.submission.update({ where: { id: submission.id }, data: { status: "EVALUATING" } });
	await prisma.submissionEvaluation.upsert({
		where: { submissionId: submission.id },
		update: { maxScore: marks, status: "PENDING", isAutoEvaluated: false },
		create: { submissionId: submission.id, score: 0, maxScore: marks, status: "PENDING", isAutoEvaluated: false },
	});
};

/**
 * Recomputes and upserts the attempt's Result row from its current
 * submissions/evaluations. Safe to call multiple times — once right after
 * an attempt is finalized (some evaluations may still be PENDING), and
 * again after each manual grade (evaluation.service.ts), until every
 * evaluation is COMPLETED and the Result can carry a final PASSED/FAILED
 * verdict instead of PENDING.
 *
 * Fires a "result published" notification exactly once — the moment the
 * result transitions from not-fully-graded to fully-graded, not on every
 * call.
 */
export const recomputeResult = async (attemptId: string) => {
	const attempt = await prisma.assessmentAttempt.findUniqueOrThrow({
		where: { id: attemptId },
		include: {
			assessment: { select: { id: true, totalMarks: true, passingMarks: true } },
			submissions: { include: { evaluation: true } },
		},
	});

	const allCompleted = attempt.submissions.every((submission) => submission.evaluation?.status === "COMPLETED");
	const totalScore = attempt.submissions.reduce((sum, submission) => sum + (submission.evaluation?.score ?? 0), 0);
	const totalMarks = attempt.assessment.totalMarks;
	const percentage = totalMarks > 0 ? Math.round((totalScore / totalMarks) * 10000) / 100 : 0;
	const status = !allCompleted ? "PENDING" : totalScore >= attempt.assessment.passingMarks ? "PASSED" : "FAILED";

	const existingResult = await prisma.result.findUnique({ where: { attemptId } });
	const isNewlyCompleted = allCompleted && (!existingResult || existingResult.status === "PENDING");

	await prisma.result.upsert({
		where: { attemptId },
		update: { totalScore, totalMarks, percentage, status, evaluatedAt: allCompleted ? new Date() : null },
		create: {
			attemptId,
			assessmentId: attempt.assessment.id,
			totalScore,
			totalMarks,
			percentage,
			status,
			evaluatedAt: allCompleted ? new Date() : null,
		},
	});

	if (isNewlyCompleted) {
		await prisma.notification.create({
			data: {
				userId: attempt.candidateId,
				title: "Result Published",
				message: `Your result is now available: ${totalScore}/${totalMarks} (${status}).`,
				type: "ATTEMPT_EVALUATED",
				metadata: { assessmentId: attempt.assessment.id, attemptId },
			},
		});
	}

	return { allCompleted, totalScore, totalMarks, percentage, status };
};