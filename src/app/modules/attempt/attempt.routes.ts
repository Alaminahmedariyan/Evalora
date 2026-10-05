import { Router } from "express";

import { idempotency } from "../../middlewares/idempotency";
import { requireAuth, requireRole } from "../../middlewares/requireAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import {
	attemptSubmitLimiter,
	proctoringEventLimiter,
	submissionAnswerLimiter,
} from "../../middlewares/rateLimiters";

import { attemptController } from "./attempt.controller";
import { attemptValidation } from "./attempt.validation";

const router = Router();

router.use(requireAuth);

router.post(
	"/start",
	requireRole("CANDIDATE"),
	idempotency(),
	validateRequest(attemptValidation.startAttemptSchema),
	attemptController.startAttempt,
);

// Must come before "/:id" so "me" isn't swallowed as an :id value.
router.get("/me", requireRole("CANDIDATE"), attemptController.getMyAttempts);

// Owner candidate / owning recruiter / admin — enforced inside the service.
router.get("/:id", attemptController.getAttemptById);

// A PUT replaces the whole answer, so repeating it is already harmless;
// storing an idempotency row for every autosave would only bloat the table.
router.put(
	"/:id/submissions/:problemId",
	requireRole("CANDIDATE"),
	submissionAnswerLimiter,
	validateRequest(attemptValidation.saveSubmissionSchema),
	attemptController.saveSubmission,
);

router.post(
	"/:id/submit",
	requireRole("CANDIDATE"),
	idempotency(),
	attemptSubmitLimiter,
	attemptController.submitAttempt,
);

router.post(
	"/:id/proctoring-events",
	requireRole("CANDIDATE"),
	proctoringEventLimiter,
	validateRequest(attemptValidation.proctoringEventSchema),
	attemptController.recordProctoringEvent,
);

router.get("/:id/proctoring-events", attemptController.getProctoringEvents);

// The controller reads both :id and :eventId — the old path had no :id.
router.get(
	"/:id/proctoring-events/:eventId",
	attemptController.getProctoringEventById,
);

export const attemptRoutes = router;