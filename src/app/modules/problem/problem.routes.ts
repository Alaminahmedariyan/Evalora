import { Router } from "express";

import { requireAuth, requireRole } from "../../middlewares/requireAuth";
import { validateRequest } from "../../middlewares/validateRequest";

import { problemController } from "./problem.controller";
import { problemValidation } from "./problem.validation";

const router = Router();

router.use(requireAuth);

router.post(
	"/",
	requireRole("RECRUITER"),
	validateRequest(problemValidation.createProblemSchema),
	problemController.createProblem,
);

router.get("/", requireRole("RECRUITER", "ADMIN"), problemController.getAllProblems);

router.get("/:id", requireRole("RECRUITER", "ADMIN"), problemController.getProblemById);

router.patch(
	"/:id",
	requireRole("RECRUITER"),
	validateRequest(problemValidation.updateProblemSchema),
	problemController.updateProblem,
);

router.delete("/:id", requireRole("RECRUITER"), problemController.deleteProblem);

export const problemRoutes = router;