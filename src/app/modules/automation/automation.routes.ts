import { Router } from "express";

import { requireAutomationApiKey } from "../../middlewares/requireAutomationApiKey";
import { validateRequest } from "../../middlewares/validateRequest";

import { automationController } from "./automation.controller";
import { automationValidation } from "./automation.validation";

const router = Router();

router.use(requireAutomationApiKey);

router.post("/dispatch", automationController.dispatch);
router.post("/maintenance", automationController.runMaintenance);

router.get("/submissions/:id/ai-input", automationController.getAiInput);
router.post(
	"/submissions/:id/ai-result",
	validateRequest(automationValidation.aiResultSchema),
	automationController.saveAiResult,
);

export const automationRoutes = router;