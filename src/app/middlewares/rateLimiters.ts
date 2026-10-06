import { timingSafeEqual } from "node:crypto";
import rateLimit, { type Store, ipKeyGenerator } from "express-rate-limit";
import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { RedisStore } from "./rate-limit-store";

const makeLimiter = (
  windowMs: number,
  baseLimit: number,
  message: string,
  store: Store,
  keyType: "user" | "ip" = "ip",
  skip: (req: Request) => boolean = () => false,
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
    skip: (req) => skip(req),
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

      return ipKeyGenerator(req.ip ?? "unknown");
    },
  });
};

const isInternalRequest = (req: Request): boolean => {
  const secret = process.env.INTERNAL_API_SECRET;
  const header = req.headers["x-internal-secret"];

  if (!secret || typeof header !== "string") return false;

  const received = Buffer.from(header);
  const expected = Buffer.from(secret);

  return (
    received.length === expected.length &&
    timingSafeEqual(received, expected)
  );
};

export const generalRateLimiter = makeLimiter(
  15 * 60 * 1000,
  300,
  "Too many requests. Please try again later.",
  new RedisStore(15 * 60 * 1000, "general"),
  "ip",
  isInternalRequest,
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
  60,
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

export const contactLimiter = makeLimiter(
  60 * 60 * 1000,
  5,
  "Too many messages from this connection. Please try again later.",
  new RedisStore(60 * 60 * 1000, "contact"),
  "ip",
);

export const accountActionLimiter = makeLimiter(
  60 * 60 * 1000,
  10,
  "Too many account requests. Please try again later.",
  new RedisStore(60 * 60 * 1000, "account-action"),
  "user",
);

export const proctoringEventLimiter = makeLimiter(
  60_000,
  120,
  "Too many proctoring events. Please slow down.",
  new RedisStore(60_000, "proctoring-event"),
  "user",
);

export const twoFactorLimiter = makeLimiter(
  15 * 60 * 1000,
  20,
  "Too many verification attempts. Please try again in 15 minutes.",
  new RedisStore(15 * 60 * 1000, "two-factor"),
  "ip",
);