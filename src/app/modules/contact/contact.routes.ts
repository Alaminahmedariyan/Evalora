import { Router } from "express";

import { contactLimiter } from "../../middlewares/rateLimiters";
import { requireAuth, requireRole } from "../../middlewares/requireAuth";
import { validateRequest } from "../../middlewares/validateRequest";

import { contactController } from "./contact.controller";
import { contactValidation } from "./contact.validation";

const router = Router();

// Public — anyone can send a message, so it is rate limited per IP.
router.post(
	"/",
	contactLimiter,
	validateRequest(contactValidation.createContactMessageSchema),
	contactController.createMessage,
);

// Admin inbox
const adminRouter = Router();

adminRouter.use(requireAuth, requireRole("ADMIN"));

adminRouter.get("/messages", contactController.getMessages);

adminRouter.patch(
	"/messages/:id/status",
	validateRequest(contactValidation.updateContactMessageStatusSchema),
	contactController.updateStatus,
);

adminRouter.delete("/messages/:id", contactController.deleteMessage);

router.use("/admin", adminRouter);

export const contactRoutes = router;