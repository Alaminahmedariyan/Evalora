import { Router } from "express";

import { accountActionLimiter } from "../../middlewares/rateLimiters";
import { requireAuth, requireRole } from "../../middlewares/requireAuth";
import { imageUpload } from "../../middlewares/upload";
import { validateRequest } from "../../middlewares/validateRequest";
import { validateRequestWithFile } from "../../middlewares/validateRequestWithFile";

import { accountController } from "./account.controller";
import { accountValidation } from "./account.validation";
import { userController } from "./user.controller";
import { userValidation } from "./user.validation";

const router = Router();

router.use(requireAuth);

router.get("/me", userController.getMyProfile);

router.patch(
  "/me",
  imageUpload.single("image"),
  validateRequestWithFile(userValidation.updateProfileSchema),
  userController.updateMyProfile,
);

// Self-service data rights — available to every signed-in user.
router.get("/me/export", accountActionLimiter, accountController.exportMyData);

router.post(
  "/me/delete",
  accountActionLimiter,
  validateRequest(accountValidation.deleteAccountSchema),
  accountController.deleteMyAccount,
);

router.get("/", requireRole("ADMIN"), userController.getAllUsers);

router.get("/:id", requireRole("ADMIN"), userController.getUserById);

router.patch(
  "/:id/role",
  requireRole("ADMIN"),
  validateRequest(userValidation.updateRoleSchema),
  userController.updateRole,
);

router.patch(
  "/:id/status",
  requireRole("ADMIN"),
  validateRequest(userValidation.updateStatusSchema),
  userController.updateStatus,
);

router.delete("/:id", requireRole("ADMIN"), userController.deleteUser);

export const userRoutes = router;