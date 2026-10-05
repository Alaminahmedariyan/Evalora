import { z } from "zod";

const httpsUrl = z
	.string()
	.trim()
	.url("Cover image must be a valid URL.")
	.refine((value) => value.startsWith("https://"), "Cover image URL must use https.");

const postFields = {
	title: z
		.string()
		.trim()
		.min(5, "Title must be at least 5 characters.")
		.max(160),
	excerpt: z
		.string()
		.trim()
		.min(20, "Excerpt must be at least 20 characters.")
		.max(300),
	content: z
		.string()
		.trim()
		.min(100, "Content must be at least 100 characters.")
		.max(100000),
	coverImage: httpsUrl.optional(),
	categoryId: z.string().trim().min(1, "Category is required."),
	tags: z
		.array(z.string().trim().min(2, "Tags must be at least 2 characters.").max(30))
		.max(8, "At most 8 tags are allowed.")
		.optional(),
};

export const createBlogPostSchema = z.object(postFields);

export const updateBlogPostSchema = z
	.object(postFields)
	.partial()
	.extend({ coverImage: httpsUrl.nullable().optional() })
	.refine((data) => Object.keys(data).length > 0, {
		message: "Provide at least one field to update.",
	});

const categoryFields = {
	name: z.string().trim().min(2, "Name must be at least 2 characters.").max(50),
	description: z.string().trim().max(300).optional(),
};

export const createBlogCategorySchema = z.object(categoryFields);

export const updateBlogCategorySchema = z
	.object(categoryFields)
	.partial()
	.refine((data) => Object.keys(data).length > 0, {
		message: "Provide at least one field to update.",
	});

export const blogValidation = {
	createBlogPostSchema,
	updateBlogPostSchema,
	createBlogCategorySchema,
	updateBlogCategorySchema,
};