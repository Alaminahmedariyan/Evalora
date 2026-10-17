import { Router } from "express";



import { automationController } from "./automation.controller";
import { requireAutomationApiKey } from "../../middlewares/requireAutomationApiKey";

const router = Router();

router.use(requireAutomationApiKey);

router.post("/dispatch", automationController.dispatch);

// Temporary: remove after the first end-to-end test.
router.post("/test-event", automationController.emitTestEvent);

export const automationRoutes = router;