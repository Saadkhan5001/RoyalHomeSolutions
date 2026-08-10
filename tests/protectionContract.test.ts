import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Structural guard rails.
 *
 * The route tests prove the endpoints that exist today are protected. These
 * prove the *next* one will be too: a new public endpoint that calls Resend, or
 * a new form that posts to one, fails this suite until it is wired through the
 * shared gate. That is the difference between fixing this incident and fixing
 * the class of incident.
 */

const root = process.cwd();

function walk(dir: string, extension: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) return walk(full, extension);
    return full.endsWith(extension) ? [full] : [];
  });
}

const routeFiles = walk(path.join(root, "app", "api"), "route.ts");

const formFiles = [
  ...walk(path.join(root, "components"), ".tsx"),
].filter((file) => readFileSync(file, "utf8").includes('fetch("/api/'));

const rel = (file: string) => path.relative(root, file).replace(/\\/g, "/");

describe("API route contract", () => {
  it("found the API routes to check", () => {
    expect(routeFiles.length).toBeGreaterThanOrEqual(4);
  });

  it.each(routeFiles.map((f) => [rel(f), f]))(
    "%s routes every side effect through the shared bot-protection gate",
    (_name, file) => {
      const source = readFileSync(file, "utf8");

      // Only endpoints with a real side effect need the gate.
      const hasSideEffect =
        source.includes('from "resend"') || source.includes("@/lib/leadStore");
      if (!hasSideEffect) return;

      expect(source).toContain("@/lib/botProtection");
      expect(source).toContain("verifySubmission");
      expect(source).toContain("readBoundedJson");

      // The route must name the action it expects. Without it the token is
      // only proved genuine, not proved to be *for this endpoint*.
      expect(source).toMatch(/action:\s*turnstileActions\.\w+/);

      // `request.json()` is unbounded — readBoundedJson replaces it.
      expect(source).not.toContain("request.json()");

      // The gate must be awaited and its rejection returned before any send.
      const gateIndex = source.indexOf("verifySubmission");
      const sendIndex = Math.min(
        ...[
          source.indexOf("emails.send"),
          source.indexOf("contacts.create"),
          source.indexOf("appendLead("),
        ].filter((i) => i !== -1),
      );
      expect(gateIndex).toBeGreaterThan(-1);
      expect(gateIndex).toBeLessThan(sendIndex);
    },
  );

  it.each(routeFiles.map((f) => [rel(f), f]))(
    "%s never logs a secret's value",
    (_name, file) => {
      const source = readFileSync(file, "utf8");

      // Naming a variable in a "you forgot to set this" message is fine and
      // useful; reading its value into a log line is not.
      expect(source).not.toMatch(
        /console\.\w+\([^;]*process\.env\.(RESEND_API_KEY|TURNSTILE_SECRET_KEY)/,
      );
      expect(source).not.toMatch(/console\.\w+\([^;]*\bapiKey\b/);
    },
  );

  it.each(routeFiles.map((f) => [rel(f), f]))(
    "%s logs an anonymised IP, never the raw address",
    (_name, file) => {
      const source = readFileSync(file, "utf8");
      if (!source.includes("logFormRejected")) return;

      // `ip` is what the limiter keys on; `ipPrefix` is what gets written.
      expect(source).toContain("ipPrefix");
      expect(source).not.toMatch(/logFormRejected\([^)]*\bip,/);
      expect(source).not.toMatch(/\{\s*route:\s*ROUTE,\s*ip\s*\}/);
    },
  );

  it.each(routeFiles.map((f) => [rel(f), f]))(
    "%s decides its own attribution instead of trusting the payload",
    (_name, file) => {
      const source = readFileSync(file, "utf8");
      if (!source.includes("routeSources")) return;

      expect(source).toMatch(/source:\s*routeSources\.\w+/);
    },
  );
});

describe("form contract", () => {
  it("found the forms to check", () => {
    // Seller, buyer, contact, newsletter.
    expect(formFiles.length).toBe(4);
  });

  it.each(formFiles.map((f) => [rel(f), f]))(
    "%s supplies a Turnstile token, honeypot and timing with its submission",
    (_name, file) => {
      const source = readFileSync(file, "utf8");

      expect(source).toContain("useFormProtection");
      expect(source).toContain("HoneypotField");
      expect(source).toContain("TurnstileWidget");

      // A hard-coded action string would drift from the server's expectation
      // the first time either side is renamed.
      expect(source).toMatch(/action=\{turnstileActions\.\w+\}/);

      // Attribution is the server's; a form claiming its own would be ignored
      // at best and misleading at worst.
      expect(source).not.toMatch(/body: JSON\.stringify\(\{[^)]*\bsource\b/s);

      const collected = source.indexOf("await collect()");
      // First occurrence is the destructure; the payload spread is the last.
      const spread = source.lastIndexOf("...protection");
      const shortCircuit = source.indexOf("if (!hasToken)");
      const request = source.indexOf('fetch("/api/');

      expect(collected).toBeGreaterThan(-1);
      expect(source.split("...protection").length - 1).toBeGreaterThanOrEqual(2);

      // The collected fields have to be spread into the payload, and the
      // request must not be made at all when there is no token — otherwise the
      // form is only pretending to be protected.
      expect(spread).toBeGreaterThan(collected);
      expect(shortCircuit).toBeGreaterThan(collected);
      expect(shortCircuit).toBeLessThan(request);
    },
  );
});

describe("cost contract", () => {
  it("adds no paid runtime dependency", () => {
    const pkg = JSON.parse(
      readFileSync(path.join(root, "package.json"), "utf8"),
    ) as { dependencies: Record<string, string> };

    const banned = ["@upstash/redis", "@upstash/ratelimit", "ioredis", "redis"];
    for (const name of banned) {
      expect(Object.keys(pkg.dependencies)).not.toContain(name);
    }
  });
});
