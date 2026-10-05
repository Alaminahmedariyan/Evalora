import { Router } from "express";

import { imageUpload } from "../../middlewares/upload";
import { requireAuth, requireRole } from "../../middlewares/requireAuth";
import { validateRequest } from "../../middlewares/validateRequest";

import { blogController } from "./blog.controller";
import { blogValidation } from "./blog.validation";

const router = Router();

// ---------------------------------------------------------------------------
// Public — no auth. Only PUBLISHED, non-deleted content is ever returned.
// ---------------------------------------------------------------------------
router.get("/posts", blogController.getPublishedPosts);
router.get("/posts/:slug", blogController.getPublishedPostBySlug);
router.get("/categories", blogController.getCategories);
router.get("/tags", blogController.getTags);
router.get("/authors/:id", blogController.getAuthor);

// ---------------------------------------------------------------------------
// Admin
// ---------------------------------------------------------------------------
const adminRouter = Router();

adminRouter.use(requireAuth, requireRole("ADMIN"));

adminRouter.get("/posts", blogController.getAdminPosts);
adminRouter.get("/posts/:id", blogController.getAdminPostById);

adminRouter.post(
	"/posts",
	validateRequest(blogValidation.createBlogPostSchema),
	blogController.createPost,
);

adminRouter.patch(
	"/posts/:id",
	validateRequest(blogValidation.updateBlogPostSchema),
	blogController.updatePost,
);

adminRouter.patch("/posts/:id/publish", blogController.publishPost);
adminRouter.patch("/posts/:id/unpublish", blogController.unpublishPost);
adminRouter.delete("/posts/:id", blogController.deletePost);

adminRouter.post(
	"/categories",
	validateRequest(blogValidation.createBlogCategorySchema),
	blogController.createCategory,
);

adminRouter.patch(
	"/categories/:id",
	validateRequest(blogValidation.updateBlogCategorySchema),
	blogController.updateCategory,
);

adminRouter.delete("/categories/:id", blogController.deleteCategory);

adminRouter.post(
	"/upload-cover",
	imageUpload.single("image"),
	blogController.uploadCover,
);

router.use("/admin", adminRouter);

export const blogRoutes = router;