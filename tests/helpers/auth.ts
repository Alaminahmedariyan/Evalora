import request from "supertest";
import type { Response } from "supertest";

import type { UserRole } from "../../src/generated/prisma/enums";
import app from "../../src/app";
import { prisma } from "../../src/lib/prisma";

type TestCredentials = {
  email: string;
  password: string;
  name: string;
};

export type AuthenticatedTestUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  /** Cookie header value (`better-auth.session_token=...`) to pass to subsequent requests. */
  cookie: string;
};

// Better Auth's session cookie name (default prefix "better-auth" + "session_token").
const SESSION_COOKIE_NAME = "better-auth.session_token";

/**
 * Build a `Cookie` header string from a supertest response's `set-cookie`
 * headers. Keeps only the `name=value` pair of each cookie (dropping Path /
 * HttpOnly / etc. attributes), which is what a browser would send back.
 */
function extractCookieHeader(response: Response): string {
  const raw = response.get("set-cookie");
  const cookies = Array.isArray(raw) ? raw : raw ? [raw] : [];

  const pairs = cookies.map((cookie) => cookie.split(";")[0]?.trim()).filter((pair): pair is string => Boolean(pair));

  return pairs.join("; ");
}

function findSessionCookie(cookieHeader: string): string | null {
  for (const part of cookieHeader.split("; ")) {
    if (part.startsWith(`${SESSION_COOKIE_NAME}=`)) {
      return cookieHeader;
    }
  }
  return null;
}

let counter = 0;

function uniqueCredentials(role: UserRole): TestCredentials {
  counter += 1;
  const stem = role.toLowerCase();
  return {
    name: `Test ${role}`,
    email: `${stem}-${Date.now()}-${counter}@evalora.test`,
    password: "Testing123!secure",
  };
}

/**
 * Create and authenticate a user through the REAL HTTP layer (Better Auth).
 *
 * Flow:
 *   1. POST /api/auth/sign-up/email
 *   2. If sign-up returns a session cookie, use it; otherwise sign in via
 *      POST /api/auth/sign-in/email (covers the email-verification-required path).
 *   3. Flip the freshly created user's `role` to the requested role.
 *
 * Returns the user id, email, role, and a Cookie header that authenticates
 * subsequent requests as that user. No hand-rolled cookie signing — the
 * `set-cookie` value produced by Better Auth is captured as-is.
 */
export async function createUserWithRole(role: UserRole): Promise<AuthenticatedTestUser> {
  const credentials = uniqueCredentials(role);

  const signUp = await request(app)
    .post("/api/auth/sign-up/email")
    .send({ ...credentials });

  // sign-up may return 200 (with session) or 200 (verification pending). We
  // don't assume — just try to log in afterward to be sure we have a session.
  if (signUp.status >= 400) {
    throw new Error(`Sign-up failed (${signUp.status}): ${JSON.stringify(signUp.body)}`);
  }

  const signIn = await request(app).post("/api/auth/sign-in/email").send({ email: credentials.email, password: credentials.password });

  if (signIn.status >= 400) {
    throw new Error(`Sign-in failed (${signIn.status}): ${JSON.stringify(signIn.body)}`);
  }

  const cookie = findSessionCookie(extractCookieHeader(signIn));
  if (!cookie) {
    throw new Error(`No ${SESSION_COOKIE_NAME} cookie in sign-in response. set-cookie=${JSON.stringify(signIn.get("set-cookie"))}`);
  }

  const user = await prisma.user.findUnique({
    where: { email: credentials.email },
  });

  if (!user) {
    throw new Error(`User not found after sign-up: ${credentials.email}`);
  }

  if (user.role !== role) {
    await prisma.user.update({
      where: { id: user.id },
      data: { role },
    });
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role,
    cookie,
  };
}
