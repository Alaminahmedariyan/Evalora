import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { bearer, emailOTP, twoFactor } from "better-auth/plugins";

import config from "../app/config";
import {
	clearFailedAttempts,
	isLocked,
	recordFailedAttempt,
} from "../app/utils/bruteForceGuard";
import {
	otpEmailTemplate,
	welcomeEmailTemplate,
} from "../app/utils/emailTemplates";
import { sendEmailSmtp } from "../app/utils/sendEmailSmtp";
import { prisma } from "./prisma";

const isProduction = config.app.env === "production";

const socialProviders: Record<
	string,
	{ clientId: string; clientSecret: string }
> = {};

if (config.oauth.google.clientId && config.oauth.google.clientSecret) {
	socialProviders.google = {
		clientId: config.oauth.google.clientId,
		clientSecret: config.oauth.google.clientSecret,
	};
}

if (config.oauth.github.clientId && config.oauth.github.clientSecret) {
	socialProviders.github = {
		clientId: config.oauth.github.clientId,
		clientSecret: config.oauth.github.clientSecret,
	};
}

const clientOrigins = config.app.clientUrl
	.split(",")
	.map((origin) => origin.trim())
	.filter(Boolean);

const trustedOrigins = [
	"http://localhost:3000",
	"http://127.0.0.1:3000",
	...clientOrigins,
].filter((origin, index, origins) => origins.indexOf(origin) === index);

if (!isProduction) {
	trustedOrigins.push("null");
}

export const auth = betterAuth({
	// The browser reaches this API through the frontend domain (Next.js
	// rewrites), so Better Auth must build its OAuth callback URLs and set
	// its cookies for the FRONTEND origin. Set BETTER_AUTH_URL to it.
	baseURL: config.betterAuth.url || clientOrigins[0],
	database: prismaAdapter(prisma, { provider: "postgresql" }),

	user: {
		additionalFields: {
			role: {
				type: "string",
				required: true,
				// Matches schema.prisma: `enum UserRole { ADMIN RECRUITER CANDIDATE }`
				// and `User.role UserRole @default(CANDIDATE)`. Must never be a value
				// outside that enum, or Postgres will reject the insert.
				defaultValue: "CANDIDATE",
				input: false,
			},
		},
	},

	emailAndPassword: {
		enabled: true,
		requireEmailVerification: isProduction,
	},

	emailVerification: {
		sendOnSignUp: true,
		autoSignInAfterVerification: true,
	},

	socialProviders,

	session: {
		expiresIn: 7 * 24 * 60 * 60,
		updateAge: 24 * 60 * 60,
	},

	trustedOrigins,

	advanced: {
		useSecureCookies: isProduction,

		// Cookies are first-party now (the frontend proxies /api/auth and
		// /api/v1), so Lax is correct and works in every browser. SameSite=None
		// is no longer needed.
		defaultCookieAttributes: {
			sameSite: "lax",
			secure: isProduction,
		},
	},

	plugins: [
		bearer(),

		twoFactor({
			issuer: "Evalora",
		}),

		emailOTP({
			otpLength: 6,
			expiresIn: isProduction ? 5 * 60 : 60 * 60,
			allowedAttempts: 5,
			overrideDefaultEmailVerification: true,

			sendVerificationOTP: async ({ email, otp, type }) => {
				const user = await prisma.user.findUnique({
					where: { email },
				});

				const name = user?.name ?? "there";

				const subjectAndPurpose =
					type === "sign-in"
						? {
								subject: "Your sign-in code",
								purpose: "sign in",
							}
						: type === "email-verification"
							? {
									subject: "Verify your email",
									purpose: "verify your email",
								}
							: {
									subject: "Reset your password",
									purpose: "reset your password",
								};

				if (!isProduction) {
					console.log(
						`[Email OTP] ${subjectAndPurpose.purpose} code for ${email}: ${otp}`,
					);
				}

				await sendEmailSmtp({
					to: email,
					subject: subjectAndPurpose.subject,
					html: otpEmailTemplate(
						name,
						otp,
						5,
						subjectAndPurpose.purpose,
					),
				});
			},
		}),
	],

	// --------------------------------------------------------------
	// Request lifecycle hooks — brute-force lockout
	// --------------------------------------------------------------
	hooks: {
		before: createAuthMiddleware(async (ctx) => {
			if (ctx.path === "/sign-in/email") {
				const email = ctx.body?.email as string | undefined;

				if (email && (await isLocked(email))) {
					throw new APIError("TOO_MANY_REQUESTS", {
						message:
							"Too many failed login attempts. Please try again in 15 minutes.",
					});
				}
			}
		}),

		after: createAuthMiddleware(async (ctx) => {
			if (ctx.path === "/sign-in/email") {
				const email = ctx.body?.email as string | undefined;

				const returned = ctx.context.returned as
					| { status?: number }
					| undefined;

				const failed = Boolean(
					returned &&
						typeof returned === "object" &&
						"status" in returned &&
						(returned.status ?? 0) >= 400,
				);

				if (email) {
					if (failed) {
						await recordFailedAttempt(email);
					} else {
						await clearFailedAttempts(email);
					}
				}
			}
		}),
	},

	// --------------------------------------------------------------
	// Database hooks — fires for BOTH credential signup and OAuth
	// (Google/GitHub) signup, since both create a User row the same way
	// --------------------------------------------------------------
	databaseHooks: {
		session: {
			create: {
				// Stops a suspended or deleted account from getting a new session.
				before: async (session) => {
					const account = await prisma.user.findUnique({
						where: { id: session.userId },
						select: {
							status: true,
							deletedAt: true,
						},
					});

					if (
						!account ||
						account.deletedAt ||
						account.status === "SUSPENDED"
					) {
						throw new APIError("FORBIDDEN", {
							message:
								"This account is suspended or has been deleted. Please contact us if you think this is a mistake.",
						});
					}
				},
			},
		},

		user: {
			create: {
				after: async (user) => {
					// Every new account accepted the Terms and Privacy Policy:
					// email sign-ups through the required checkbox, social sign-ins
					// through the "by continuing" notice on the login page.
					// Never block sign-up if recording fails.
					try {
						await prisma.userConsent.createMany({
							data: [
								{
									userId: user.id,
									consentType: "TERMS_OF_SERVICE",
									granted: true,
								},
								{
									userId: user.id,
									consentType: "PRIVACY_POLICY",
									granted: true,
								},
							],
							skipDuplicates: true,
						});
					} catch (error) {
						console.error(
							"[Auth] Failed to record sign-up consents:",
							error,
						);
					}

					await sendEmailSmtp({
						to: user.email,
						subject: `Welcome, ${user.name}!`,
						html: welcomeEmailTemplate(user.name),
					});
				},
			},
		},
	},
});