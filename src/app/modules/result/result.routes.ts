import { Router } from "express";

import { requireAuth, requireRole } from "../../middlewares/requireAuth";

import { resultController } from "./result.controller";

const router = Router();

router.use(requireAuth);

// Owner candidate / owning recruiter / admin — enforced inside the service.
router.get("/attempts/:attemptId", resultController.getResultByAttemptId);

router.get(
	"/assessments/:assessmentId",
	requireRole("RECRUITER", "ADMIN"),
	resultController.getResultsForAssessment,
);

router.post(
	"/assessments/:assessmentId/compute-ranks",
	requireRole("RECRUITER"),
	resultController.computeRanks,
);

export const resultRoutes = router;