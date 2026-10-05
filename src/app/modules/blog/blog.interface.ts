export type CreateBlogPostInput = {
	title: string;
	excerpt: string;
	content: string;
	coverImage?: string;
	categoryId: string;
	tags?: string[];
};

export type UpdateBlogPostInput = Partial<
	Omit<CreateBlogPostInput, "coverImage">
> & {
	// null removes the cover image.
	coverImage?: string | null;
};

export type CreateBlogCategoryInput = {
	name: string;
	description?: string;
};

export type UpdateBlogCategoryInput = Partial<CreateBlogCategoryInput>;