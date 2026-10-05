// Public author shape — deliberately no email/role, this is shown on the
// open internet.
const BLOG_AUTHOR_SELECT = {
	id: true,
	name: true,
	image: true,
} as const;

export const BLOG_POST_LIST_SELECT = {
	id: true,
	title: true,
	slug: true,
	excerpt: true,
	coverImage: true,
	status: true,
	readingTimeMinutes: true,
	publishedAt: true,
	createdAt: true,
	author: { select: BLOG_AUTHOR_SELECT },
	category: { select: { id: true, name: true, slug: true } },
	tags: {
		select: { tag: { select: { id: true, name: true, slug: true } } },
	},
} as const;

export const BLOG_POST_DETAIL_SELECT = {
	...BLOG_POST_LIST_SELECT,
	content: true,
	updatedAt: true,
} as const;

export const BLOG_CATEGORY_SELECT = {
	id: true,
	name: true,
	slug: true,
	description: true,
	createdAt: true,
	_count: {
		select: { posts: { where: { status: "PUBLISHED", deletedAt: null } } },
	},
} as const;

export const BLOG_AUTHOR_PUBLIC_SELECT = BLOG_AUTHOR_SELECT;