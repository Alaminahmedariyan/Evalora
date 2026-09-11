import { afterAll, beforeAll, beforeEach, vi } from "vitest";

import { prisma } from "../src/lib/prisma";
import { resetDb } from "./helpers/db";

// Mock the email senders at their real module paths so no real SMTP/Resend
// call ever fires during tests (fast + deterministic + no quota usage).
//
// The sign-up flow triggers BOTH:
//   - dbHooks.user.create.after → sendEmailSmtp (welcome email)
//   - emailOTP plugin → sendEmailSmtp (OTP email)
// and invitation.service.ts imports sendEmail (Resend). Mocking the modules
// themselves (rather than the nodemailer/resend clients) covers every importer.
vi.mock("../src/app/utils/sendEmailSmtp", () => ({
  sendEmailSmtp: vi.fn().mockResolvedValue({ messageId: "test-msg-id" }),
}));

vi.mock("../src/app/utils/sendEmail", () => ({
  sendEmail: vi.fn().mockResolvedValue({ id: "test-email-id" }),
}));

// Mock Redis at the app's own `radis` module boundary.
//
// src/lib/radis.ts calls `new Redis(...)` EAGERLY at import time (imported by
// cache.ts and bruteForceGuard.ts → lib/auth.ts). In a non-production env it
// uses ioredis's default connection (localhost:6379), which would emit
// unhandled ECONNREFUSED errors during tests. Mocking the module means the
// ioredis constructor never runs and no connection is ever attempted.
vi.mock("../src/lib/radis", () => ({
  redis: {
    get: vi.fn().mockResolvedValue(null),
    set: vi.fn().mockResolvedValue("OK"),
    del: vi.fn().mockResolvedValue(1),
    incr: vi.fn().mockResolvedValue(1),
    expire: vi.fn().mockResolvedValue(1),
    quit: vi.fn().mockResolvedValue("OK"),
    on: vi.fn(),
  },
}));

// NOTE: `.env.test` is NOT loaded here — `dotenv-cli` loads it at the script
// level (`dotenv -e .env.test -- vitest ...`), so `process.env` is already
// populated by the time this file (and `src/app/config`) runs. Loading it here
// too would be redundant. Also note `pretest` runs `scripts/check-test-env.js`
// which verifies TEST_DB_MARKER/NODE_ENV before any DB is touched.
//
// The Postgres database must be created MANUALLY before running tests. Because
// Docker is not available on this machine, we use the Neon test branch instead
// of a Testcontainers/docker-compose Postgres. Before first run:
//   pnpm migrate:deploy   (with DATABASE_URL pointing at the test branch)

// Neon free tier suspends compute when idle; the first connection has to wake
// it up. Race it against a 15s timeout so a suspended/dead branch fails fast
// instead of hanging the suite.
const WARMUP_TIMEOUT_MS = 15_000;

beforeAll(async () => {
  await Promise.race([
    prisma.$queryRaw`SELECT 1`,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Neon warm-up query timed out after ${WARMUP_TIMEOUT_MS}ms`)), WARMUP_TIMEOUT_MS),
    ),
  ]);
}, WARMUP_TIMEOUT_MS);

// Truncate-all-between-tests isolation (chosen over per-test transactions because
// the codebase uses raw SQL and a webhook path that would escape a transaction).
beforeEach(async () => {
  await resetDb();
});

afterAll(async () => {
  await prisma.$disconnect();
});
