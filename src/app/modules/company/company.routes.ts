import { Router } from "express";

import {
  optionalAuth,
  requireAuth,
  requireRole,
} from "../../middlewares/requireAuth";
import { imageUpload } from "../../middlewares/upload";
import { validateRequest } from "../../middlewares/validateRequest";
import { validateRequestWithFile } from "../../middlewares/validateRequestWithFile";

import { companyController } from "./company.controller";
import { companyValidation } from "./company.validation";

const router = Router();

// Any authenticated user can register a company — doing so promotes them
// to RECRUITER (see company.service.ts#registerCompany).
router.post(
  "/register",
  requireAuth,
  validateRequest(companyValidation.registerCompanySchema),
  companyController.registerCompany,
);

// Public browse. optionalAuth fills in req.user when a session exists, so an
// ADMIN sees every company while anonymous and candidate visitors only see
// verified ones (decided in the controller).
router.get("/", optionalAuth, companyController.getAllCompanies);

// Must be declared before "/:id" so "me" isn't swallowed as an :id value.
router.get("/me", requireAuth, companyController.getMyCompany);

router.post(
  "/me/request-verification",
  requireAuth,
  requireRole("RECRUITER"),
  companyController.requestVerification,
);

router.patch(
  "/me",
  requireAuth,
  requireRole("RECRUITER"),
  imageUpload.single("logo"),
  validateRequestWithFile(companyValidation.updateCompanySchema),
  companyController.updateMyCompany,
);

router.get(
  "/me/subscription",
  requireAuth,
  requireRole("RECRUITER"),
  companyController.getMySubscription,
);

router.patch(
  "/me/subscription",
  requireAuth,
  requireRole("RECRUITER"),
  validateRequest(companyValidation.updateSubscriptionSchema),
  companyController.updateMySubscription,
);

router.post(
  "/me/subscription/cancel",
  requireAuth,
  requireRole("RECRUITER"),
  companyController.cancelMySubscription,
);

router.get("/:id", optionalAuth, companyController.getCompanyById);

router.patch(
  "/:id/verify",
  requireAuth,
  requireRole("ADMIN"),
  companyController.verifyCompany,
);

// Owner-or-Admin check happens inside the service, not here, since "owner"
// isn't knowable from the route alone.
router.delete("/:id", requireAuth, companyController.deleteCompany);

export const companyRoutes = router;