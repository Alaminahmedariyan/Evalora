import type { AssessmentStatus } from "../../../generated/prisma/enums";

// Statuses where the assessment is over, so candidates may see their results.
const RELEASED_STATUSES: AssessmentStatus[] = ["CLOSED", "ARCHIVED"];

/**
 * Single source of truth for "can a candidate see their result?".
 * The result service and the notification code both use this, so they can
 * never disagree about whether a result is released.
 */
export const isResultReleasedToCandidate = (assessment: {
	showResultImmediately: boolean;
	status: AssessmentStatus;
}): boolean =>
	assessment.showResultImmediately ||
	RELEASED_STATUSES.includes(assessment.status);