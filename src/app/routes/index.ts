import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.routes";
import { userRoutes } from "../modules/user/user.routes";



const router = Router();

const moduleRoutes = [
	{ path: "/auth", route: authRoutes },
	{ path: "/users", route: userRoutes },
];

for (const { path, route } of moduleRoutes) {
	router.use(path, route);
}

export const globalRoutes = router;