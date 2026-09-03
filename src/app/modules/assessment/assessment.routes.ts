import { Router } from "express";

import { requireAuth, requireRole } from "../../middlewares/requireAuth";
import { validateRequest } from "../../middlewares/validateRequest";

import { assessmentController } from "./assessment.controller";
import { assessmentValidation } from "./assessment.validation";

const router = Router();

router.use(requireAuth);

router.post(
	"/",
	requireRole("RECRUITER"),
	validateRequest(assessmentValidation.createAssessmentSchema),
	assessmentController.createAssessment,
);

router.get("/", requireRole("RECRUITER", "ADMIN"), assessmentController.getAllAssessments);

router.get("/:id", requireRole("RECRUITER", "ADMIN"), assessmentController.getAssessmentById);

router.patch(
	"/:id",
	requireRole("RECRUITER"),
	validateRequest(assessmentValidation.updateAssessmentSchema),
	assessmentController.updateAssessment,
);

router.patch("/:id/publish", requireRole("RECRUITER"), assessmentController.publishAssessment);

router.patch("/:id/close", requireRole("RECRUITER"), assessmentController.closeAssessment);

router.delete("/:id", requireRole("RECRUITER"), assessmentController.deleteAssessment);

export const assessmentRoutes = router;