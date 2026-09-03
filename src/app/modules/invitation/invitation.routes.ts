import { Router } from "express";

import { requireAuth, requireRole } from "../../middlewares/requireAuth";
import { validateRequest } from "../../middlewares/validateRequest";

import { invitationController } from "./invitation.controller";
import { invitationValidation } from "./invitation.validation";

const router = Router();

router.use(requireAuth);

router.post(
	"/assessments/:assessmentId",
	requireRole("RECRUITER"),
	validateRequest(invitationValidation.inviteCandidatesSchema),
	invitationController.inviteCandidates,
);

router.get(
	"/assessments/:assessmentId",
	requireRole("RECRUITER", "ADMIN"),
	invitationController.getInvitationsForAssessment,
);

// Must be declared before "/:id" so "me" isn't swallowed as an :id value.
router.get("/me", requireRole("CANDIDATE"), invitationController.getMyInvitations);

// Permission (owning recruiter / invited candidate / admin) is enforced
// inside the service, since it depends on the invitation's own data.
router.get("/:id", invitationController.getInvitationById);

router.post("/:id/accept", requireRole("CANDIDATE"), invitationController.acceptInvitation);

router.post("/:id/decline", requireRole("CANDIDATE"), invitationController.declineInvitation);

router.delete("/:id", requireRole("RECRUITER"), invitationController.cancelInvitation);

export const invitationRoutes = router;