import { Router } from "express";

import { requireAuth, requireRole } from "../../middlewares/requireAuth";
import { adminController } from "./admin.controller";



const router = Router();

router.use(requireAuth, requireRole("ADMIN"));

router.get("/dashboard-stats", adminController.getDashboardStats);

router.get("/audit-logs", adminController.getAuditLogs);

export const adminRoutes = router;