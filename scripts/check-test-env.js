// Guard against running tests against anything other than the dedicated test
// branch. This runs as `pretest` BEFORE the dotenv-cli-backed `test` script,
// so it must load `.env.test` itself.
//
// It fails fast if:
//   - TEST_DB_MARKER !== "evalora-test-branch" (the isolated Neon test branch)
//   - NODE_ENV !== "test"
//   - DATABASE_URL points at a pooled ("-pooler") host — tests must use the
//     unpooled URL so `prisma migrate deploy` / TRUNCATE hit the branch DB and
//     never the production pooler.
import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

const errors = [];

if (process.env.TEST_DB_MARKER !== "evalora-test-branch") {
  errors.push('TEST_DB_MARKER must be "evalora-test-branch" (refusing to run against a non-test DB)');
}

if (process.env.NODE_ENV !== "test") {
  errors.push('NODE_ENV must be "test" (refusing to run against a non-test env)');
}

if (process.env.DATABASE_URL?.includes("-pooler")) {
  errors.push("DATABASE_URL must be the unpooled Neon URL (do NOT use a -pooler host)");
}

if (errors.length > 0) {
  console.error("[check-test-env] Refusing to run tests:");
  for (const error of errors) {
    console.error(`  - ${error}`);
  }
  process.exit(1);
}

console.log("[check-test-env] OK: test environment verified.");
