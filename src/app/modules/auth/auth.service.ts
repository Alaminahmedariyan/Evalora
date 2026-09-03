import { StatusCodes } from "http-status-codes";

import AppError from "../../errors/appError";
import { auth } from "../../../lib/auth";
import type {
	ChangePasswordInput,
	LoginInput,
	RegisterInput,
	ResetPasswordOtpInput,
	SendEmailOtpInput,
	VerifyEmailOtpInput,
} from "./auth.interface";
import { AUTH_FALLBACK_MESSAGES } from "./auth.const";

const callAuthEndpoint = async (
	responsePromise: Promise<Response>,
	fallbackMessage: string,
) => {
	const response = await responsePromise;
	const body = await response.json().catch(() => null);

	if (!response.ok) {
		throw new AppError(
			response.status,
			(body as { message?: string } | null)?.message ?? fallbackMessage,
		);
	}

	return {
		data: body,
		headers: response.headers,
	};
};

// Captcha verification is intentionally NOT done here. It lives entirely in
// `auth.ts`'s `hooks.before` (path === "/sign-up/email"), which reads
// `ctx.body.captchaToken`. `captchaToken` is forwarded into the body below
// so that hook can see it — verifying it a second time here would be
// redundant, and since hCaptcha tokens are single-use, a second verify call
// on the same token would fail even for a genuinely valid captcha.
const register = (payload: RegisterInput, headers: Headers) =>
	callAuthEndpoint(
		auth.api.signUpEmail({
			body: {
				name: payload.name,
				email: payload.email,
				password: payload.password,
				captchaToken: payload.captchaToken,
			},
			headers,
			asResponse: true,
		}),
		AUTH_FALLBACK_MESSAGES.REGISTER,
	);

const login = (payload: LoginInput, headers: Headers) =>
	callAuthEndpoint(
		auth.api.signInEmail({
			body: {
				email: payload.email,
				password: payload.password,
				rememberMe: payload.rememberMe,
			},
			headers,
			asResponse: true,
		}),
		AUTH_FALLBACK_MESSAGES.LOGIN,
	);

const logout = (headers: Headers) =>
	callAuthEndpoint(
		auth.api.signOut({
			headers,
			asResponse: true,
		}),
		AUTH_FALLBACK_MESSAGES.LOGOUT,
	);

// Better Auth uses sliding-expiry sessions (see `session.updateAge` in
// auth.ts) rather than a classic access/refresh token pair — reading the
// current session via getSession() is itself what extends it. This endpoint
// exists mainly to give the assignment's required `/auth/refresh-token`
// route a real, working implementation.
const refreshToken = (headers: Headers) =>
	callAuthEndpoint(
		auth.api.getSession({
			headers,
			asResponse: true,
		}),
		AUTH_FALLBACK_MESSAGES.REFRESH_TOKEN,
	);

const sendEmailOtp = (payload: SendEmailOtpInput) =>
	callAuthEndpoint(
		auth.api.sendVerificationOTP({
			body: {
				email: payload.email,
				type: payload.type,
			},
			asResponse: true,
		}),
		AUTH_FALLBACK_MESSAGES.SEND_OTP,
	);

const verifyEmailOtp = (payload: VerifyEmailOtpInput) =>
	callAuthEndpoint(
		auth.api.verifyEmailOTP({
			body: {
				email: payload.email,
				otp: payload.otp,
			},
			asResponse: true,
		}),
		AUTH_FALLBACK_MESSAGES.VERIFY_EMAIL_OTP,
	);

const resetPasswordWithOtp = (payload: ResetPasswordOtpInput) =>
	callAuthEndpoint(
		auth.api.resetPasswordEmailOTP({
			body: {
				email: payload.email,
				otp: payload.otp,
				password: payload.newPassword,
			},
			asResponse: true,
		}),
		AUTH_FALLBACK_MESSAGES.RESET_PASSWORD_OTP,
	);

const changePassword = (payload: ChangePasswordInput, headers: Headers) =>
	callAuthEndpoint(
		auth.api.changePassword({
			body: {
				currentPassword: payload.currentPassword,
				newPassword: payload.newPassword,
				revokeOtherSessions: payload.revokeOtherSessions,
			},
			headers,
			asResponse: true,
		}),
		AUTH_FALLBACK_MESSAGES.CHANGE_PASSWORD,
	);

export const authService = {
	register,
	login,
	logout,
	refreshToken,
	sendEmailOtp,
	verifyEmailOtp,
	resetPasswordWithOtp,
	changePassword,
};