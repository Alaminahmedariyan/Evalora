import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    // setupFiles run before every test file. tests/setup.ts performs the
    // Neon warm-up query and DB truncation between tests.
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/**/*.test.ts"],
    fileParallelism: false,
    pool: "forks",
    testTimeout: 30_000,
    hookTimeout: 30_000,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/**/*.ts"],
      exclude: ["src/generated/**", "src/**/*.d.ts"],
      thresholds: {
        lines: 40,
        functions: 40,
        branches: 40,
        statements: 40,
      },
    },
  },
});
