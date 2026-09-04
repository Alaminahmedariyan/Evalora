import type { Response } from "express";

/**
 * Copies auth-related headers from Better Auth's internal Response object
 * onto our real Express response.
 *
 * - `set-cookie`: session cookie for browser/cookie-based clients.
 * - `set-auth-token`: emitted by the `bearer()` plugin (see lib/auth.ts) —
 *   without forwarding this, any client that isn't relying on cookies
 *   (Postman with its cookie jar disabled, a future mobile app, etc.)
 *   has no way to obtain a token to send as `Authorization: Bearer <token>`
 *   on subsequent requests, even though the server is fully willing to
 *   accept one.
 */
export const applyAuthCookies = (headers: Headers, res: Response) => {
	const setCookieHeaders =
		typeof headers.getSetCookie === "function" ? headers.getSetCookie() : headers.get("set-cookie");

	if (setCookieHeaders && (Array.isArray(setCookieHeaders) ? setCookieHeaders.length > 0 : true)) {
		res.setHeader("set-cookie", setCookieHeaders);
	}

	const authToken = headers.get("set-auth-token");

	if (authToken) {
		res.setHeader("set-auth-token", authToken);
	}
};