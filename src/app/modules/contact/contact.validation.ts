import { z } from "zod";

const singleLine = (label: string, min: number, max: number) =>
	z
		.string()
		.trim()
		.min(min, `${label} must be at least ${min} characters.`)
		.max(max, `${label} must be at most ${max} characters.`)
		.regex(/^[^\r\n]*$/, `${label} must be a single line.`);

export const createContactMessageSchema = z.object({
	name: singleLine("Name", 2, 100),
	email: z
		.string()
		.trim()
		.toLowerCase()
		.email("Enter a valid email address.")
		.max(320, "Email is too long."),
	subject: singleLine("Subject", 3, 150),
	message: z
		.string()
		.trim()
		.min(10, "Message must be at least 10 characters.")
		.max(5000, "Message must be at most 5000 characters."),
	website: z.string().max(200).optional(),
});

export const updateContactMessageStatusSchema = z.object({
	status: z.enum(["NEW", "READ"]),
});

export const contactValidation = {
	createContactMessageSchema,
	updateContactMessageStatusSchema,
};