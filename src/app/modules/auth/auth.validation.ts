import { z } from "zod";

// One password rule for every place a password is created or changed.
// Login deliberately does NOT use it: sign-in only checks that a password
// was typed, so an existing account is never locked out by a rule it
// predates (the old loginSchema did exactly that).
const passwordSchema = z
	.string()
	.min(8, "Password must be at least 8 characters long.")
	.regex(/[a-z]/, "Password must contain at least 1 lowercase letter.")
	.regex(/[A-Z]/, "Password must contain at least 1 uppercase letter.")
	.regex(/[0-9]/, "Password must contain at least 1 number.")
	.regex(/[^A-Za-z0-9]/, "Password must contain at least 1 special character.");

const registerSchema = z.object({
	name: z.string().trim().min(2, "Name must be at least 2 characters.").max(100),
	email: z.string().email("Invalid email address."),
	password: passwordSchema,
	acceptTerms: z.custom<boolean>(
		(value) => value === true,
		"You must accept the Terms of Service and Privacy Policy.",
	),
});

const loginSchema = z.object({
	email: z.string().email("Invalid email address."),
	password: z.string().min(1, "Password is required."),
	rememberMe: z.boolean().optional(),
});

const sendEmailOtpSchema = z.object({
	email: z.string().email("Invalid email address."),
	type: z.enum(["sign-in", "email-verification", "forget-password"]),
});

const verifyEmailOtpSchema = z.object({
	email: z.string().email("Invalid email address."),
	otp: z.string().length(6, "OTP must be 6 digits."),
});

const resetPasswordOtpSchema = z.object({
	email: z.string().email("Invalid email address."),
	otp: z.string().length(6, "OTP must be 6 digits."),
	newPassword: passwordSchema,
});

const changePasswordSchema = z.object({
	currentPassword: z.string().min(1, "Current password is required."),
	newPassword: passwordSchema,
	revokeOtherSessions: z.boolean().optional(),
});

export const authValidation = {
	registerSchema,
	loginSchema,
	sendEmailOtpSchema,
	verifyEmailOtpSchema,
	resetPasswordOtpSchema,
	changePasswordSchema,
};