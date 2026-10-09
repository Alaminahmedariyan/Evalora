import { prisma } from "../../../lib/prisma";

/**
 * Called when an assessment is closed while showResultImmediately is false.
 * Candidates whose results were fully graded earlier were held back; tell
 * them now. Results that finish grading after the close are notified by
 * recomputeResult, so nobody is notified twice.
 */
export const notifyResultsReleased = async (
	assessmentId: string,
	assessmentTitle: string,
) => {
	const results = await prisma.result.findMany({
		where: { assessmentId, status: { in: ["PASSED", "FAILED"] } },
		select: {
			attemptId: true,
			attempt: { select: { candidateId: true } },
		},
	});

	if (results.length === 0) return;

	await prisma.notification.createMany({
		data: results.map((result) => ({
			userId: result.attempt.candidateId,
			title: "Result ready",
			message: `Your result for "${assessmentTitle}" is ready to view.`,
			type: "ASSESSMENT_RESULT" as const,
			metadata: { assessmentId, attemptId: result.attemptId },
		})),
	});
};