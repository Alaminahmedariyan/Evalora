import { Router } from "express";

import { requireAuth, requireRole } from "../../middlewares/requireAuth";
import { imageUpload } from "../../middlewares/upload";
import { validateRequest } from "../../middlewares/validateRequest";
import { validateRequestWithFile } from "../../middlewares/validateRequest2";

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

// Public browse — no requireAuth. Anonymous/candidate visitors only see
// verified companies; ADMIN sees everything (handled in the controller).
router.get("/", companyController.getAllCompanies);

// Must be declared before "/:id" so "me" isn't swallowed as an :id value.
router.get("/me", requireAuth, companyController.getMyCompany);

router.patch(
	"/me",
	requireAuth,
	requireRole("RECRUITER"),
	imageUpload.single("logo"),
	validateRequestWithFile(companyValidation.updateCompanySchema),
	companyController.updateMyCompany,
);

router.get("/:id", companyController.getCompanyById);

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