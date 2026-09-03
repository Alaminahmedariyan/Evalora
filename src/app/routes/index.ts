import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.routes";
import { userRoutes } from "../modules/user/user.routes";
import { companyRoutes } from "../modules/company/company.routes";



const router = Router();

const moduleRoutes = [
	{ path: "/auth", route: authRoutes },
	{ path: "/users", route: userRoutes },
	{ path: "/companies", route: companyRoutes },
	{ path: "/candidates", route: candidateRoutes },
    { path: "/problems", route: problemRoutes },
];

for (const { path, route } of moduleRoutes) {
	router.use(path, route);
}

export const globalRoutes = router;