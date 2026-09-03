import { Router } from "express";

import { requireAuth, requireRole } from "../../middlewares/requireAuth";
import { documentUpload } from "../../middlewares/upload";
import { validateRequestWithFile } from "../../middlewares/validateRequest2";

import { candidateController } from "./candidate.controller";
import { candidateValidation } from "./candidate.validation";

const router = Router();

// Must come before "/:id" so "me" isn't swallowed as an :id value.
router.get("/me", requireAuth, requireRole("CANDIDATE"), candidateController.getMyProfile);

router.patch(
	"/me",
	requireAuth,
	requireRole("CANDIDATE"),
	documentUpload.single("resume"),
	validateRequestWithFile(candidateValidation.upsertProfileSchema),
	candidateController.upsertMyProfile,
);

// Recruiter/Admin browsing — there is no public candidate directory.
router.get("/", requireAuth, requireRole("RECRUITER", "ADMIN"), candidateController.getAllCandidates);

router.get("/:id", requireAuth, requireRole("RECRUITER", "ADMIN"), candidateController.getCandidateProfileById);

export const candidateRoutes = router;