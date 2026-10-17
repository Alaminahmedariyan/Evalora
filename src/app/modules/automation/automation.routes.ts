import { Router } from "express";

import { requireAutomationApiKey } from "../../middlewares/requireAutomationApiKey";

import { automationController } from "./automation.controller";

const router = Router();

router.use(requireAutomationApiKey);

router.post("/dispatch", automationController.dispatch);
router.post("/maintenance", automationController.runMaintenance);

export const automationRoutes = router;