import rateLimit, {
	type Store,
	ipKeyGenerator,
} from "express-rate-limit";
import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { RedisStore } from "./rate-limit-store";

/**
 * Shared factory for all rate limiters.
 *
 * - `store` is required (Redis-backed) so limits are consistent across
 *   Vercel instances instead of per-process memory.
 * - `keyType` selects per-user (req.user.id) vs per-IP keying. IP keys use
 *   `ipKeyGenerator` (handles IPv6 subnetting) rather than `req.ip` directly,
 *   which avoids express-rate-limit's `keyGeneratorIpFallback` validation.
 * - `limit` is a function (express-rate-limit v8 supports
 *   `ValueDeterminingMiddleware<number>`), evaluated per-request. This lets
 *   the test multiplier be read at request time rather than module-load time,
 *   so `beforeAll` env mutation works without `vi.resetModules`.
 */
const makeLimiter = (
	windowMs: number,
	baseLimit: number,
	message: string,
	store: Store,
	keyType: "user" | "ip" = "ip",
) => {
	const limitFn = (_req: Request, _res: Response): number => {
		if (process.env.NODE_ENV === "test") {
			const raw = Number.parseFloat(
				process.env.RATE_LIMIT_TEST_MULTIPLIER ?? "100",
			);
			if (Number.isFinite(raw) && raw > 0) {
				return Math.max(1, Math.floor(baseLimit * raw));
			}
		}
		return baseLimit;
	};

	return rateLimit({
		windowMs,
		limit: limitFn,
		standardHeaders: true,
		legacyHeaders: false,
		store,
		// Always active. The effective limit is multiplied by an env-controlled
		// factor in test mode so Phase 3 tests can actually trigger 429s while
		// Phase 2 tests (which never hit these endpoints) stay unaffected.
		skip: () => false,
		// If Redis errors, allow the request through (fail-open). Idempotency
		// middleware (Phase 2) still guards duplicate submissions, so this is
		// acceptable. Production deployments should run Redis HA.
		passOnStoreError: true,
		message: {
			success: false,
			statusCode: StatusCodes.TOO_MANY_REQUESTS,
			message,
		},
		keyGenerator: (req) => {
			if (keyType === "user" && req.user?.id) {
				return req.user.id;
			}
			return ipKeyGenerator(req.ip);
		},
	});
};

export const generalRateLimiter = makeLimiter(
	15 * 60 * 1000,
	300,
	"Too many requests. Please try again later.",
	new RedisStore(15 * 60 * 1000, "general"),
);

export const authRateLimiter = makeLimiter(
	15 * 60 * 1000,
	10,
	"Too many login attempts. Please try again in 15 minutes.",
	new RedisStore(15 * 60 * 1000, "auth"),
);

export const publicRateLimiter = makeLimiter(
	15 * 60 * 1000,
	20,
	"Too many requests. Please try again later.",
	new RedisStore(15 * 60 * 1000, "public"),
);

// ---------------------------------------------------------------------------
// Endpoint-specific limiters (Phase 3)
// ---------------------------------------------------------------------------
//
// All use a Redis store so limits are consistent across Vercel instances.
// In NODE_ENV=test the effective limit is multiplied by RATE_LIMIT_TEST_MULTIPLIER
// (default 100) so that:
//   - Phase 2 idempotency tests keep passing without modification
//   - Phase 3 rate-limit tests set RATE_LIMIT_TEST_MULTIPLIER=0.02 to
//     actually trigger 429s
// ---------------------------------------------------------------------------

export const invitationAcceptLimiter = makeLimiter(
	60_000,
	10,
	"Too many invitation actions. Please try again shortly.",
	new RedisStore(60_000, "invitation"),
	"ip",
);

export const attemptSubmitLimiter = makeLimiter(
	60_000,
	5,
	"Too many submission attempts. Please try again shortly.",
	new RedisStore(60_000, "attempt-submit"),
	"user",
);

export const submissionAnswerLimiter = makeLimiter(
	60_000,
	20,
	"Too many answer submissions. Please try again shortly.",
	new RedisStore(60_000, "submission-answer"),
	"user",
);

export const paymentCheckoutLimiter = makeLimiter(
	60_000,
	5,
	"Too many checkout attempts. Please try again shortly.",
	new RedisStore(60_000, "payment-checkout"),
	"user",
);