export const AUTOMATION_DISPATCH = {
	BATCH_SIZE: 10,
	REQUEST_TIMEOUT_MS: 8_000,
	LOCK_TIMEOUT_MS: 5 * 60 * 1000,
	BASE_RETRY_DELAY_SECONDS: 30,
	MAX_RETRY_DELAY_SECONDS: 3_600,
	LOCAL_INTERVAL_MS: 5_000,
} as const;

export const AUTOMATION_EVENT_TYPES = {
	SYSTEM_TEST: "system.test",
	ATTEMPT_SUBMITTED: "attempt.submitted",
	ATTEMPT_AUTO_SUBMITTED: "attempt.auto_submitted",
	INVITATION_CREATED: "invitation.created",
	SUBMISSION_NEEDS_AI_EVALUATION: "submission.needs_ai_evaluation",
	EVALUATION_REVIEW_NEEDED: "evaluation.review_needed",
} as const;