import request from "supertest";
import { describe, expect, it } from "vitest";

import app from "../../src/app";
import { createUserWithRole } from "../helpers/auth";

// Verifies the auth test helper produces a genuinely valid session (not just a
// syntactically-plausible cookie). This is the "prove the helper works" smoke
// test for Phase 0.5 — NOT a Phase 1 IDOR test.
describe("auth helper", () => {
  it("returns a cookie that resolves to a valid session", async () => {
    const user = await createUserWithRole("CANDIDATE");

    const response = await request(app).get("/api/auth/get-session").set("Cookie", user.cookie);

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.user).toBeDefined();
    expect(response.body.user.email).toBe(user.email);
    expect(response.body.user.role).toBe("CANDIDATE");
  });
});
