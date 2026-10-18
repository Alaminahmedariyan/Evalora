import { Router } from "express";

import { requireAutomationApiKey } from "../../middlewares/requireAutomationApiKey";
import { requireAuth, requireRole } from "../../middlewares/requireAuth";
import { validateRequest } from "../../middlewares/validateRequest";

import { automationExtraController } from "./automation.extra.controller";
import { reportResultSchema } from "./automation.report.validation";

// Called by n8n with the x-api-key header.
const internalRouter = Router();
internalRouter.use(requireAutomationApiKey);
internalRouter.get(
	"/attempts/:id/report-input",
	automationExtraController.getReportInput,
);
internalRouter.post(
	"/attempts/:id/report-result",
	validateRequest(reportResultSchema),
	automationExtraController.saveReportResult,
);

// Called by the admin dashboard with a normal login session.
const adminRouter = Router();
adminRouter.use(requireAuth, requireRole("ADMIN"));
adminRouter.get("/events", automationExtraController.listEvents);
adminRouter.get("/stats", automationExtraController.getStats);
adminRouter.post("/events/:id/retry", automationExtraController.retryEvent);

export const automationInternalExtraRoutes = internalRouter;
export const automationAdminRoutes = adminRouter;