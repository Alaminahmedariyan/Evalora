import { Router } from "express";

import { publicRateLimiter } from "../../middlewares/rateLimiters";
import { validateRequest } from "../../middlewares/validateRequest";

import { demoController, demoLoginSchema } from "./demo.controller";

const router = Router();

router.post(
	"/login",
	publicRateLimiter,
	validateRequest(demoLoginSchema),
	demoController.demoLogin,
);

export const demoRoutes = router;