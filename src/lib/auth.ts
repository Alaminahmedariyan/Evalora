import { betterAuth } from "better-auth";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { bearer, emailOTP, twoFactor } from "better-auth/plugins";

import config from "../app/config";
import { otpEmailTemplate, welcomeEmailTemplate } from "../app/utils/emailTemplates";
import { sendEmailSmtp } from "../app/utils/sendEmailSmtp";
import { clearFailedAttempts, isLocked, recordFailedAttempt } from "../app/utils/bruteForceGuard";
import { verifyCaptcha } from "../app/utils/verifyCaptcha";
import { prisma } from "./prisma";

const socialProviders: Record<string, { clientId: string; clientSecret: string }> = {};

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

const trustedOrigins = [
	"http://localhost:3000",
	"http://127.0.0.1:3000",
	...config.app.clientUrl.split(",").map((origin) => origin.trim()).filter(Boolean),
].filter((origin, index, origins) => origins.indexOf(origin) === index);

if (config.app.env !== "production") {
	trustedOrigins.push("null");
}

export const auth = betterAuth({
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
		requireEmailVerification: config.app.env === "production",
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
		useSecureCookies: config.app.env === "production",
		defaultCookieAttributes: {
			sameSite: config.app.env === "production" ? "none" : "lax",
			secure: config.app.env === "production",
		},
	},

	plugins: [
		bearer(),

		twoFactor({
			issuer: "YourAppName",
		}),

		emailOTP({
			otpLength: 6,
			expiresIn: config.app.env === "production" ? 5 * 60 : 60 * 60,
			allowedAttempts: 5,
			overrideDefaultEmailVerification: true,

		sendVerificationOTP: async ({ email, otp, type }) => {
			const user = await prisma.user.findUnique({ where: { email } });
			const name = user?.name ?? "there";

			const subjectAndPurpose =
				type === "sign-in"
					? { subject: "Your sign-in code", purpose: "sign in" }
					: type === "email-verification"
						? { subject: "Verify your email", purpose: "verify your email" }
						: { subject: "Reset your password", purpose: "reset your password" };

			if (config.app.env !== "production") {
				console.log(`[Email OTP] ${subjectAndPurpose.purpose} code for ${email}: ${otp}`);
			}

			await sendEmailSmtp({
				to: email,
				subject: subjectAndPurpose.subject,
				html: otpEmailTemplate(name, otp, 5, subjectAndPurpose.purpose),
			});
		},
		}),
	],

	// --------------------------------------------------------------
	// Request lifecycle hooks — brute-force lockout + optional captcha
	// --------------------------------------------------------------
hooks: {
        before: createAuthMiddleware(async (ctx) => {
            if (ctx.path === "/sign-in/email") {
                const email = ctx.body?.email as string | undefined;
                if (email && (await isLocked(email))) {
                    throw new APIError("TOO_MANY_REQUESTS", {
                        message: "Too many failed login attempts. Please try again in 15 minutes.",
                    });
                }
            }

            if (ctx.path === "/sign-up/email") {
                const captchaToken = ctx.body?.captchaToken as string | undefined;
                if (config.captcha.hcaptchaSecretKey && captchaToken) {
                    await verifyCaptcha(captchaToken);
                }
            }
        }),

        after: createAuthMiddleware(async (ctx) => {
            if (ctx.path === "/sign-in/email") {
                const email = ctx.body?.email as string | undefined;
                const returned = ctx.context.returned as { status?: number } | undefined;
                const failed = Boolean(returned && typeof returned === "object" && "status" in returned && (returned.status ?? 0) >= 400);

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
		user: {
			create: {
				after: async (user) => {
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