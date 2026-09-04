import { Router } from "express";

import { requireAuth } from "../../middlewares/requireAuth";

import { notificationController } from "./notification.controller";

const router = Router();

router.use(requireAuth);

router.get("/me", notificationController.getMyNotifications);

router.get("/unread-count", notificationController.getUnreadCount);

router.patch("/read-all", notificationController.markAllAsRead);

router.patch("/:id/read", notificationController.markAsRead);

router.delete("/:id", notificationController.deleteNotification);

export const notificationRoutes = router;