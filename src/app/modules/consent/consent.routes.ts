import { Router } from "express";

import { requireAuth } from "../../middlewares/requireAuth";
import { validateRequest } from "../../middlewares/validateRequest";

import { consentController } from "./consent.controller";
import { consentValidation } from "./consent.validation";

const router = Router();

router.use(requireAuth);

router.get("/me", consentController.getMyConsents);

router.patch(
	"/me",
	validateRequest(consentValidation.updateConsentSchema),
	consentController.updateConsent,
);

router.delete("/me/:consentType", consentController.revokeConsent);

export const consentRoutes = router;
