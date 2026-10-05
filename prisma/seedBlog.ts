import { prisma } from "../src/lib/prisma";
import { slugify } from "../src/app/utils/generateUniqueSlug";
import { calculateReadingTime } from "../src/app/utils/readingTime";

const CATEGORIES = [
	{
		name: "Assessments",
		slug: "assessments",
		description: "Designing coding assessments that measure real skill.",
	},
	{
		name: "Hiring",
		slug: "hiring",
		description: "Practical advice for engineering hiring teams.",
	},
	{
		name: "Proctoring",
		slug: "proctoring",
		description: "Keeping remote assessments fair without being heavy-handed.",
	},
];

const POSTS = [
	{
		slug: "how-to-design-a-fair-coding-assessment",
		title: "How to design a fair coding assessment",
		excerpt:
			"A fair assessment measures the skills the job needs, in the time you give. Here is how to scope problems, set marks, and avoid trick questions.",
		category: "assessments",
		tags: ["Coding", "Assessments", "Hiring"],
		content: `## Start from the job, not the puzzle

List the three things a new hire must do in their first month. Build the assessment around those, not around algorithm trivia.

## Keep it short and scoped

- Aim for 60 to 90 minutes in total.
- One problem should be solvable in 20 to 30 minutes by someone who knows the topic.
- Add sample test cases so candidates can check their understanding.

## Make the marks match the effort

Give harder, longer problems more marks. If a quick multiple-choice question and a coding task carry the same marks, candidates will notice, and so will your leaderboard.

## Review before you publish

Take the assessment yourself with a timer. If you cannot finish it comfortably, your candidates will not either.`,
	},
	{
		slug: "tab-switch-proctoring-a-signal-not-a-verdict",
		title: "Tab-switch proctoring: a signal, not a verdict",
		excerpt:
			"A tab switch does not prove cheating. Treat proctoring events as context for a conversation, and review the whole timeline before deciding anything.",
		category: "proctoring",
		tags: ["Proctoring", "Integrity"],
		content: `## What a tab switch really tells you

Candidates look up documentation, answer a message, or lose focus when a notification pops up. One switch is noise. A pattern is worth a closer look.

## Read the timeline, not the count

A single number hides the story. Look at when the events happened, how long they lasted, and what the candidate did right before and after.

## Be clear up front

Tell candidates what is recorded before they start. Transparent rules make honest candidates comfortable and discourage the rest.

## Decide with people, not with a threshold

Use proctoring data to start a conversation or to ask for a follow-up interview. Rejecting someone automatically because of a counter is rarely fair.`,
	},
	{
		slug: "mcq-coding-or-written-picking-the-right-mix",
		title: "MCQ, coding or written: picking the right mix",
		excerpt:
			"Each question type tests something different. Combine them on purpose so the assessment stays short and still tells you what you need to know.",
		category: "assessments",
		tags: ["MCQ", "Coding", "Written"],
		content: `## Multiple choice: fast checks on fundamentals

Good for language basics and concepts. They grade instantly, but they cannot show how someone works through a problem.

## Coding: the closest thing to the job

Use one or two realistic tasks with clear sample cases. This is where you see structure, naming and edge-case thinking.

## Written: reasoning and communication

Ask for a short explanation of a trade-off. Written answers show how a candidate explains decisions, which matters in every team.

## A simple starting mix

For a 75-minute assessment, try five multiple-choice questions, one coding task and one short written question. Adjust after your first few candidates.`,
	},
	{
		slug: "a-checklist-before-you-send-the-invitations",
		title: "A checklist before you send the invitations",
		excerpt:
			"A few minutes of preparation prevents most candidate complaints. Run through this list before inviting anyone to an assessment.",
		category: "hiring",
		tags: ["Hiring", "Checklist"],
		content: `## Before you publish

- Take the assessment yourself, with a timer.
- Check that the marks add up and the passing score makes sense.
- Write short, specific instructions.

## Before you invite

- Confirm the time window and the number of attempts.
- Paste candidate emails carefully; typos mean lost invitations.
- Tell candidates what proctoring is active.

## After they submit

Clear the grading queue promptly. Candidates remember how long they waited for feedback far longer than they remember the questions.`,
	},
];

export async function seedBlog(authorId: string) {
	for (const category of CATEGORIES) {
		await prisma.blogCategory.upsert({
			where: { slug: category.slug },
			update: {},
			create: category,
		});
	}

	let offsetDays = 0;

	for (const post of POSTS) {
		offsetDays += 3;

		const existing = await prisma.blogPost.findUnique({
			where: { slug: post.slug },
			select: { id: true },
		});

		if (existing) continue;

		const category = await prisma.blogCategory.findUniqueOrThrow({
			where: { slug: post.category },
		});

		await prisma.blogPost.create({
			data: {
				title: post.title,
				slug: post.slug,
				excerpt: post.excerpt,
				content: post.content,
				readingTimeMinutes: calculateReadingTime(post.content),
				status: "PUBLISHED",
				publishedAt: new Date(Date.now() - offsetDays * 24 * 60 * 60 * 1000),
				authorId,
				categoryId: category.id,
				tags: {
					create: post.tags.map((name) => ({
						tag: {
							connectOrCreate: {
								where: { slug: slugify(name) },
								create: { name, slug: slugify(name) },
							},
						},
					})),
				},
			},
		});
	}

	console.log(`✅ Blog seeded: ${CATEGORIES.length} categories, ${POSTS.length} posts`);
}