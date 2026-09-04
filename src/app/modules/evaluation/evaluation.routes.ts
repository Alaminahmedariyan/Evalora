import { Router } from "express";

import { requireAuth, requireRole } from "../../middlewares/requireAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { attemptValidation } from "../attempt/attempt.validation";

import { evaluationController } from "./evaluation.controller";

const router = Router();

router.use(requireAuth, requireRole("RECRUITER", "ADMIN"));

router.get("/attempts/:attemptId/submissions", evaluationController.getSubmissionsForAttempt);

router.get("/assessments/:assessmentId/pending", evaluationController.getPendingEvaluations);

router.get("/submissions/:id", evaluationController.getSubmissionById);

router.patch(
	"/submissions/:id",
	validateRequest(attemptValidation.manualEvaluationSchema),
	evaluationController.evaluateSubmission,
);

export const evaluationRoutes = router;