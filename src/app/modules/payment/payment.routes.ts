import { Router } from "express";

import { idempotency } from "../../middlewares/idempotency";
import { requireAuth, requireRole } from "../../middlewares/requireAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { paymentCheckoutLimiter } from "../../middlewares/rateLimiters";

import { paymentController } from "./payment.controller";
import { paymentValidation } from "./payment.validation";

const router = Router();

router.use(requireAuth);

router.post(
	"/checkout",
	requireRole("RECRUITER"),
	idempotency(),
	paymentCheckoutLimiter,
	validateRequest(paymentValidation.createCheckoutSchema),
	paymentController.createCheckoutSession,
);

// Must come before "/:id" so "me" isn't swallowed as an :id value.
router.get("/me", requireRole("RECRUITER"), paymentController.getMyPayments);

router.get("/", requireRole("ADMIN"), paymentController.getAllPayments);

router.get("/:id", paymentController.getPaymentById);

export const paymentRoutes = router;
