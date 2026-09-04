import { Router } from "express";

import { authRoutes } from "../modules/auth/auth.routes";
import { userRoutes } from "../modules/user/user.routes";
import { companyRoutes } from "../modules/company/company.routes";
import { problemRoutes } from "../modules/problem/problem.routes";
import { assessmentRoutes } from "../modules/assessment/assessment.routes";
import { invitationRoutes } from "../modules/invitation/invitation.routes";
import { attemptRoutes } from "../modules/attempt/attempt.routes";
import { evaluationRoutes } from "../modules/evaluation/evaluation.routes";
import { resultRoutes } from "../modules/result/result.routes";
import { paymentRoutes } from "../modules/payment/payment.routes";
import { notificationRoutes } from "../modules/notification/notification.routes";
import { adminRoutes } from "../modules/admin/admin.routes";
import { candidateRoutes } from "../modules/candidade/candidate.routes";

const router = Router();

const moduleRoutes = [
	{ path: "/auth", route: authRoutes },
	{ path: "/users", route: userRoutes },
	{ path: "/companies", route: companyRoutes },
	{ path: "/candidates", route: candidateRoutes },
	{ path: "/problems", route: problemRoutes },
	{ path: "/assessments", route: assessmentRoutes },
	{ path: "/invitations", route: invitationRoutes },
	{ path: "/attempts", route: attemptRoutes },
	{ path: "/evaluations", route: evaluationRoutes },
	{ path: "/results", route: resultRoutes },
	{ path: "/payments", route: paymentRoutes },
	{ path: "/notifications", route: notificationRoutes },
	{ path: "/admin", route: adminRoutes },
];

for (const { path, route } of moduleRoutes) {
	router.use(path, route);
}

export const globalRoutes = router;