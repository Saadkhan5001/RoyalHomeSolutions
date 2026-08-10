import { defineConfig } from "vitest/config";
import path from "node:path";

/**
 * Test runner for the anti-bot protection.
 *
 * Vitest is a dev-only dependency — nothing here ships to production or costs
 * anything to run. The `@/` alias is wired by hand rather than via a tsconfig
 * paths plugin so no extra package is needed.
 */
export default defineConfig({
  resolve: {
    alias: { "@": path.resolve(__dirname, "./") },
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    setupFiles: ["tests/setup.ts"],
    // Route modules read process.env and share the in-memory rate limiter, so
    // files must not share a worker.
    fileParallelism: false,
  },
});
