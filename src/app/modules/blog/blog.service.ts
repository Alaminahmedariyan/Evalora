import { StatusCodes } from "http-status-codes";

import type { Prisma } from "../../../generated/prisma/client";
import type { BlogPostStatus } from "../../../generated/prisma/enums";
import type { BlogPostWhereInput } from "../../../generated/prisma/models/BlogPost";

import { prisma } from "../../../lib/prisma";
import AppError from "../../errors/appError";
import { uploadFileToCloudinary } from "../../utils/fileUploader";
import { generateUniqueSlug, slugify } from "../../utils/generateUniqueSlug";
import { calculateReadingTime } from "../../utils/readingTime";

import {
	BLOG_AUTHOR_PUBLIC_SELECT,
	BLOG_CATEGORY_SELECT,
	BLOG_POST_DETAIL_SELECT,
	BLOG_POST_LIST_SELECT,
} from "./blog.const";
import type {
	CreateBlogCategoryInput,
	CreateBlogPostInput,
	UpdateBlogCategoryInput,
	UpdateBlogPostInput,
} from "./blog.interface";

const POST_STATUSES: BlogPostStatus[] = ["DRAFT", "PUBLISHED", "ARCHIVED"];

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------

const str = (value: unknown): string | undefined =>
	typeof value === "string" && value.trim() ? value.trim() : undefined;

const parsePagination = (
	query: Record<string, unknown>,
	maxLimit: number,
	defaultLimit: number,
) => {
	const page = Math.max(1, Number.parseInt(String(query.page ?? "1"), 10) || 1);
	const limit = Math.min(
		maxLimit,
		Math.max(
			1,
			Number.parseInt(String(query.limit ?? defaultLimit), 10) || defaultLimit,
		),
	);
	return { page, limit, skip: (page - 1) * limit };
};

const buildMeta = (page: number, limit: number, total: number) => ({
	page,
	limit,
	total,
	totalPage: Math.max(1, Math.ceil(total / limit)),
});

/** Prisma returns tags as join rows; the API exposes a plain tag array. */
const flattenTags = <
	T extends { tags: { tag: { id: string; name: string; slug: string } }[] },
>(
	post: T,
) => ({ ...post, tags: post.tags.map((entry) => entry.tag) });

const normalizeTags = (tags: string[] = []) => {
	const bySlug = new Map<string, { name: string; slug: string }>();

	for (const raw of tags) {
		const name = raw.trim().replace(/\s+/g, " ");
		const slug = slugify(name);
		if (name && !bySlug.has(slug)) bySlug.set(slug, { name, slug });
	}

	return Array.from(bySlug.values());
};

const toTagCreates = (tags: { name: string; slug: string }[]) =>
	tags.map((tag) => ({
		tag: { connectOrCreate: { where: { slug: tag.slug }, create: tag } },
	}));

const assertCategoryExists = async (categoryId: string) => {
	const category = await prisma.blogCategory.findUnique({
		where: { id: categoryId },
		select: { id: true },
	});

	if (!category) {
		throw new AppError(StatusCodes.BAD_REQUEST, "Blog category not found.");
	}
};

const publicPostWhere = (query: Record<string, unknown>): BlogPostWhereInput => {
	const search = str(query.search)?.slice(0, 100);
	const category = str(query.category);
	const tag = str(query.tag);
	const author = str(query.author);

	return {
		status: "PUBLISHED",
		deletedAt: null,
		...(category && { category: { slug: category } }),
		...(tag && { tags: { some: { tag: { slug: tag } } } }),
		...(author && { authorId: author }),
		...(search && {
			OR: [
				{ title: { contains: search, mode: "insensitive" } },
				{ excerpt: { contains: search, mode: "insensitive" } },
				{ content: { contains: search, mode: "insensitive" } },
			],
		}),
	};
};

const mapCategory = (category: {
	id: string;
	name: string;
	slug: string;
	description: string | null;
	createdAt: Date;
	_count: { posts: number };
}) => {
	const { _count, ...rest } = category;
	return { ...rest, postCount: _count.posts };
};

// ---------------------------------------------------------------------------
// public
// ---------------------------------------------------------------------------

const getPublishedPosts = async (query: Record<string, unknown>) => {
	const { page, limit, skip } = parsePagination(query, 24, 9);
	const where = publicPostWhere(query);

	const [total, posts] = await Promise.all([
		prisma.blogPost.count({ where }),
		prisma.blogPost.findMany({
			where,
			select: BLOG_POST_LIST_SELECT,
			orderBy: [{ publishedAt: "desc" }, { id: "desc" }],
			skip,
			take: limit,
		}),
	]);

	return { data: posts.map(flattenTags), meta: buildMeta(page, limit, total) };
};

const getPublishedPostBySlug = async (slug: string) => {
	const post = await prisma.blogPost.findFirst({
		where: { slug, status: "PUBLISHED", deletedAt: null },
		select: BLOG_POST_DETAIL_SELECT,
	});

	if (!post) {
		throw new AppError(StatusCodes.NOT_FOUND, "Blog post not found.");
	}

	const related = await prisma.blogPost.findMany({
		where: {
			status: "PUBLISHED",
			deletedAt: null,
			categoryId: post.category.id,
			id: { not: post.id },
		},
		select: BLOG_POST_LIST_SELECT,
		orderBy: { publishedAt: "desc" },
		take: 3,
	});

	return { ...flattenTags(post), related: related.map(flattenTags) };
};

const getCategories = async () => {
	const categories = await prisma.blogCategory.findMany({
		select: BLOG_CATEGORY_SELECT,
		orderBy: { name: "asc" },
	});

	return categories.map(mapCategory);
};

const getTags = async () => {
	const tags = await prisma.blogTag.findMany({
		select: {
			id: true,
			name: true,
			slug: true,
			_count: {
				select: {
					posts: { where: { post: { status: "PUBLISHED", deletedAt: null } } },
				},
			},
		},
		orderBy: { name: "asc" },
	});

	return tags
		.map(({ _count, ...tag }) => ({ ...tag, postCount: _count.posts }))
		.filter((tag) => tag.postCount > 0);
};

/** Only users who have at least one published post are visible as authors. */
const getAuthor = async (id: string) => {
	const author = await prisma.user.findFirst({
		where: {
			id,
			deletedAt: null,
			blogPosts: { some: { status: "PUBLISHED", deletedAt: null } },
		},
		select: BLOG_AUTHOR_PUBLIC_SELECT,
	});

	if (!author) {
		throw new AppError(StatusCodes.NOT_FOUND, "Author not found.");
	}

	const postCount = await prisma.blogPost.count({
		where: { authorId: id, status: "PUBLISHED", deletedAt: null },
	});

	return { ...author, postCount };
};

// ---------------------------------------------------------------------------
// admin — posts
// ---------------------------------------------------------------------------

const getAdminPosts = async (query: Record<string, unknown>) => {
	const { page, limit, skip } = parsePagination(query, 50, 10);
	const status = str(query.status);
	const search = str(query.search)?.slice(0, 100);

	const where: BlogPostWhereInput = {
		deletedAt: null,
		...(status &&
			POST_STATUSES.includes(status as BlogPostStatus) && {
				status: status as BlogPostStatus,
			}),
		...(search && { title: { contains: search, mode: "insensitive" } }),
	};

	const [total, posts] = await Promise.all([
		prisma.blogPost.count({ where }),
		prisma.blogPost.findMany({
			where,
			select: BLOG_POST_LIST_SELECT,
			orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
			skip,
			take: limit,
		}),
	]);

	return { data: posts.map(flattenTags), meta: buildMeta(page, limit, total) };
};

const getAdminPostById = async (id: string) => {
	const post = await prisma.blogPost.findFirst({
		where: { id, deletedAt: null },
		select: BLOG_POST_DETAIL_SELECT,
	});

	if (!post) {
		throw new AppError(StatusCodes.NOT_FOUND, "Blog post not found.");
	}

	return flattenTags(post);
};

const createPost = async (authorId: string, payload: CreateBlogPostInput) => {
	await assertCategoryExists(payload.categoryId);

	// Slugs are never reused, even after a soft delete, so old links can't
	// silently start pointing at a different article.
	const slug = await generateUniqueSlug(payload.title, (candidate) =>
		prisma.blogPost.findUnique({ where: { slug: candidate } }).then(Boolean),
	);

	const post = await prisma.blogPost.create({
		data: {
			title: payload.title,
			slug,
			excerpt: payload.excerpt,
			content: payload.content,
			readingTimeMinutes: calculateReadingTime(payload.content),
			...(payload.coverImage !== undefined && {
				coverImage: payload.coverImage,
			}),
			authorId,
			categoryId: payload.categoryId,
			tags: { create: toTagCreates(normalizeTags(payload.tags)) },
		},
		select: BLOG_POST_DETAIL_SELECT,
	});

	return flattenTags(post);
};

const updatePost = async (id: string, payload: UpdateBlogPostInput) => {
	const existing = await prisma.blogPost.findFirst({
		where: { id, deletedAt: null },
		select: { id: true },
	});

	if (!existing) {
		throw new AppError(StatusCodes.NOT_FOUND, "Blog post not found.");
	}

	if (payload.categoryId !== undefined) {
		await assertCategoryExists(payload.categoryId);
	}

	// The slug is intentionally not regenerated when the title changes —
	// published URLs must stay stable.
	const data: Prisma.BlogPostUpdateInput = {
		...(payload.title !== undefined && { title: payload.title }),
		...(payload.excerpt !== undefined && { excerpt: payload.excerpt }),
		...(payload.content !== undefined && {
			content: payload.content,
			readingTimeMinutes: calculateReadingTime(payload.content),
		}),
		...(payload.coverImage !== undefined && { coverImage: payload.coverImage }),
		...(payload.categoryId !== undefined && {
			category: { connect: { id: payload.categoryId } },
		}),
		...(payload.tags !== undefined && {
			tags: { deleteMany: {}, create: toTagCreates(normalizeTags(payload.tags)) },
		}),
	};

	const post = await prisma.blogPost.update({
		where: { id },
		data,
		select: BLOG_POST_DETAIL_SELECT,
	});

	return flattenTags(post);
};

const publishPost = async (id: string, actorId: string) => {
	const existing = await prisma.blogPost.findFirst({
		where: { id, deletedAt: null },
		select: { id: true, status: true, publishedAt: true },
	});

	if (!existing) {
		throw new AppError(StatusCodes.NOT_FOUND, "Blog post not found.");
	}

	if (existing.status === "PUBLISHED") return getAdminPostById(id);

	await prisma.$transaction([
		prisma.blogPost.update({
			where: { id },
			// Re-publishing keeps the original publish date.
			data: { status: "PUBLISHED", publishedAt: existing.publishedAt ?? new Date() },
		}),
		prisma.auditLog.create({
			data: {
				userId: actorId,
				action: "STATUS_CHANGE",
				entity: "BlogPost",
				entityId: id,
				oldValue: { status: existing.status },
				newValue: { status: "PUBLISHED" },
			},
		}),
	]);

	return getAdminPostById(id);
};

const unpublishPost = async (id: string, actorId: string) => {
	const existing = await prisma.blogPost.findFirst({
		where: { id, deletedAt: null },
		select: { id: true, status: true },
	});

	if (!existing) {
		throw new AppError(StatusCodes.NOT_FOUND, "Blog post not found.");
	}

	if (existing.status !== "PUBLISHED") return getAdminPostById(id);

	await prisma.$transaction([
		prisma.blogPost.update({ where: { id }, data: { status: "DRAFT" } }),
		prisma.auditLog.create({
			data: {
				userId: actorId,
				action: "STATUS_CHANGE",
				entity: "BlogPost",
				entityId: id,
				oldValue: { status: "PUBLISHED" },
				newValue: { status: "DRAFT" },
			},
		}),
	]);

	return getAdminPostById(id);
};

const softDeletePost = async (id: string, actorId: string) => {
	const existing = await prisma.blogPost.findFirst({
		where: { id, deletedAt: null },
		select: { id: true, title: true },
	});

	if (!existing) {
		throw new AppError(StatusCodes.NOT_FOUND, "Blog post not found.");
	}

	await prisma.$transaction([
		prisma.blogPost.update({ where: { id }, data: { deletedAt: new Date() } }),
		prisma.auditLog.create({
			data: {
				userId: actorId,
				action: "DELETE",
				entity: "BlogPost",
				entityId: id,
				oldValue: { title: existing.title },
			},
		}),
	]);

	return { message: "Blog post deleted successfully." };
};

// ---------------------------------------------------------------------------
// admin — categories
// ---------------------------------------------------------------------------

const createCategory = async (payload: CreateBlogCategoryInput) => {
	const duplicate = await prisma.blogCategory.findFirst({
		where: { name: { equals: payload.name, mode: "insensitive" } },
		select: { id: true },
	});

	if (duplicate) {
		throw new AppError(
			StatusCodes.CONFLICT,
			"A category with this name already exists.",
		);
	}

	const slug = await generateUniqueSlug(payload.name, (candidate) =>
		prisma.blogCategory.findUnique({ where: { slug: candidate } }).then(Boolean),
	);

	const category = await prisma.blogCategory.create({
		data: {
			name: payload.name,
			slug,
			...(payload.description !== undefined && {
				description: payload.description,
			}),
		},
		select: BLOG_CATEGORY_SELECT,
	});

	return mapCategory(category);
};

const updateCategory = async (id: string, payload: UpdateBlogCategoryInput) => {
	const existing = await prisma.blogCategory.findUnique({
		where: { id },
		select: { id: true },
	});

	if (!existing) {
		throw new AppError(StatusCodes.NOT_FOUND, "Blog category not found.");
	}

	if (payload.name !== undefined) {
		const duplicate = await prisma.blogCategory.findFirst({
			where: {
				id: { not: id },
				name: { equals: payload.name, mode: "insensitive" },
			},
			select: { id: true },
		});

		if (duplicate) {
			throw new AppError(
				StatusCodes.CONFLICT,
				"A category with this name already exists.",
			);
		}
	}

	const category = await prisma.blogCategory.update({
		where: { id },
		data: {
			...(payload.name !== undefined && { name: payload.name }),
			...(payload.description !== undefined && {
				description: payload.description,
			}),
		},
		select: BLOG_CATEGORY_SELECT,
	});

	return mapCategory(category);
};

const deleteCategory = async (id: string) => {
	const existing = await prisma.blogCategory.findUnique({
		where: { id },
		select: { id: true },
	});

	if (!existing) {
		throw new AppError(StatusCodes.NOT_FOUND, "Blog category not found.");
	}

	// Counts soft-deleted posts too — the foreign key is onDelete: Restrict.
	const postCount = await prisma.blogPost.count({ where: { categoryId: id } });

	if (postCount > 0) {
		throw new AppError(
			StatusCodes.CONFLICT,
			"This category still has posts. Move them to another category first.",
		);
	}

	await prisma.blogCategory.delete({ where: { id } });

	return { message: "Blog category deleted successfully." };
};

// ---------------------------------------------------------------------------
// admin — cover image
// ---------------------------------------------------------------------------

const uploadCover = async (file?: Express.Multer.File) => {
	if (!file) {
		throw new AppError(StatusCodes.BAD_REQUEST, "An image file is required.");
	}

	const uploaded = await uploadFileToCloudinary(
		file.buffer,
		file.originalname,
		"blog-covers",
	);

	return { url: uploaded.secure_url };
};

export const blogService = {
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
	softDeletePost,
	createCategory,
	updateCategory,
	deleteCategory,
	uploadCover,
};