import { Router } from "express";

import { requireAuth, requireRole } from "../../middlewares/requireAuth";
import { validateRequest } from "../../middlewares/validateRequest";

import { attemptController } from "./attempt.controller";
import { attemptValidation } from "./attempt.validation";

const router = Router();

router.use(requireAuth);

router.post(
	"/start",
	requireRole("CANDIDATE"),
	validateRequest(attemptValidation.startAttemptSchema),
	attemptController.startAttempt,
);

// Must come before "/:id" so "me" isn't swallowed as an :id value.
router.get("/me", requireRole("CANDIDATE"), attemptController.getMyAttempts);

// Owner candidate / owning recruiter / admin — enforced inside the service.
router.get("/:id", attemptController.getAttemptById);

router.put(
	"/:id/submissions/:problemId",
	requireRole("CANDIDATE"),
	validateRequest(attemptValidation.saveSubmissionSchema),
	attemptController.saveSubmission,
);

router.post("/:id/submit", requireRole("CANDIDATE"), attemptController.submitAttempt);

router.post(
	"/:id/proctoring-events",
	requireRole("CANDIDATE"),
	validateRequest(attemptValidation.proctoringEventSchema),
	attemptController.recordProctoringEvent,
);

export const attemptRoutes = router;