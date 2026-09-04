import { Router } from "express";

import { requireAuth, requireRole } from "../../middlewares/requireAuth";
import { validateRequest } from "../../middlewares/validateRequest";

import { paymentController } from "./payment.controller";
import { paymentValidation } from "./payment.validation";

const router = Router();

router.use(requireAuth);

router.post(
	"/checkout",
	requireRole("RECRUITER"),
	validateRequest(paymentValidation.createCheckoutSchema),
	paymentController.createCheckoutSession,
);

// Must come before "/:id" so "me" isn't swallowed as an :id value.
router.get("/me", requireRole("RECRUITER"), paymentController.getMyPayments);

router.get("/", requireRole("ADMIN"), paymentController.getAllPayments);

router.get("/:id", paymentController.getPaymentById);

export const paymentRoutes = router;