import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import type { AuthenticatedUser } from "../../middlewares/requireAuth";
import { catchAsync } from "../../utils/catchAsync";

import { blogService } from "./blog.service";

const setPublicCache = (res: Response) => {
	res.setHeader(
		"Cache-Control",
		"public, s-maxage=60, stale-while-revalidate=300",
	);
};

const queryOf = (req: Request) => req.query as Record<string, unknown>;

// ---- public ----

const getPublishedPosts = catchAsync(async (req: Request, res: Response) => {
	const result = await blogService.getPublishedPosts(queryOf(req));
	setPublicCache(res);
	res.status(StatusCodes.OK).json({
		success: true,
		message: "Blog posts retrieved successfully.",
		meta: result.meta,
		data: result.data,
	});
});

const getPublishedPostBySlug = catchAsync(async (req: Request, res: Response) => {
	const post = await blogService.getPublishedPostBySlug(req.params.slug as string);
	setPublicCache(res);
	res.status(StatusCodes.OK).json({
		success: true,
		message: "Blog post retrieved successfully.",
		data: post,
	});
});

const getCategories = catchAsync(async (_req: Request, res: Response) => {
	const categories = await blogService.getCategories();
	setPublicCache(res);
	res.status(StatusCodes.OK).json({
		success: true,
		message: "Blog categories retrieved successfully.",
		data: categories,
	});
});

const getTags = catchAsync(async (_req: Request, res: Response) => {
	const tags = await blogService.getTags();
	setPublicCache(res);
	res.status(StatusCodes.OK).json({
		success: true,
		message: "Blog tags retrieved successfully.",
		data: tags,
	});
});

const getAuthor = catchAsync(async (req: Request, res: Response) => {
	const author = await blogService.getAuthor(req.params.id as string);
	setPublicCache(res);
	res.status(StatusCodes.OK).json({
		success: true,
		message: "Author retrieved successfully.",
		data: author,
	});
});

// ---- admin ----

const getAdminPosts = catchAsync(async (req: Request, res: Response) => {
	const result = await blogService.getAdminPosts(queryOf(req));
	res.status(StatusCodes.OK).json({
		success: true,
		message: "Blog posts retrieved successfully.",
		meta: result.meta,
		data: result.data,
	});
});

const getAdminPostById = catchAsync(async (req: Request, res: Response) => {
	const post = await blogService.getAdminPostById(req.params.id as string);
	res.status(StatusCodes.OK).json({
		success: true,
		message: "Blog post retrieved successfully.",
		data: post,
	});
});

const createPost = catchAsync(async (req: Request, res: Response) => {
	const currentUser = req.user as AuthenticatedUser;
	const post = await blogService.createPost(currentUser.id, req.body);
	res.status(StatusCodes.CREATED).json({
		success: true,
		message: "Blog post created successfully.",
		data: post,
	});
});

const updatePost = catchAsync(async (req: Request, res: Response) => {
	const post = await blogService.updatePost(req.params.id as string, req.body);
	res.status(StatusCodes.OK).json({
		success: true,
		message: "Blog post updated successfully.",
		data: post,
	});
});

const publishPost = catchAsync(async (req: Request, res: Response) => {
	const currentUser = req.user as AuthenticatedUser;
	const post = await blogService.publishPost(req.params.id as string, currentUser.id);
	res.status(StatusCodes.OK).json({
		success: true,
		message: "Blog post published.",
		data: post,
	});
});

const unpublishPost = catchAsync(async (req: Request, res: Response) => {
	const currentUser = req.user as AuthenticatedUser;
	const post = await blogService.unpublishPost(req.params.id as string, currentUser.id);
	res.status(StatusCodes.OK).json({
		success: true,
		message: "Blog post moved back to draft.",
		data: post,
	});
});

const deletePost = catchAsync(async (req: Request, res: Response) => {
	const currentUser = req.user as AuthenticatedUser;
	const result = await blogService.softDeletePost(req.params.id as string, currentUser.id);
	res.status(StatusCodes.OK).json({
		success: true,
		message: result.message,
		data: null,
	});
});

const createCategory = catchAsync(async (req: Request, res: Response) => {
	const category = await blogService.createCategory(req.body);
	res.status(StatusCodes.CREATED).json({
		success: true,
		message: "Blog category created successfully.",
		data: category,
	});
});

const updateCategory = catchAsync(async (req: Request, res: Response) => {
	const category = await blogService.updateCategory(req.params.id as string, req.body);
	res.status(StatusCodes.OK).json({
		success: true,
		message: "Blog category updated successfully.",
		data: category,
	});
});

const deleteCategory = catchAsync(async (req: Request, res: Response) => {
	const result = await blogService.deleteCategory(req.params.id as string);
	res.status(StatusCodes.OK).json({
		success: true,
		message: result.message,
		data: null,
	});
});

const uploadCover = catchAsync(async (req: Request, res: Response) => {
	const result = await blogService.uploadCover(req.file);
	res.status(StatusCodes.CREATED).json({
		success: true,
		message: "Cover image uploaded successfully.",
		data: result,
	});
});

export const blogController = {
	getPublishedPosts,
	getPublishedPostBySlug,
	getCategories,
	getTags,
	getAuthor,
	getAdminPosts,
	getAdminPostById,
	createPost,
	updatePost,
	publishPost,
	unpublishPost,
	deletePost,
	createCategory,
	updateCategory,
	deleteCategory,
	uploadCover,
};