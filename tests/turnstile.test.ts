import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { verifyTurnstileToken, MAX_TOKEN_LENGTH } from "@/lib/turnstile";
import { turnstileActions } from "@/lib/turnstileActions";

/**
 * Unit tests for the server-side Turnstile check.
 *
 * Cloudflare is never contacted — `fetch` is stubbed for every case, including
 * the ones that assert what happens when Cloudflare is unreachable.
 */

const SECRET = process.env.TURNSTILE_SECRET_KEY as string;

function siteverifyResponse(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "content-type": "application/json" },
  });
}

/** A well-formed approval from Cloudflare, on one of our hostnames. */
function approval(overrides: Record<string, unknown> = {}) {
  return { success: true, hostname: "royalhomesolutions.com", ...overrides };
}

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);
  process.env.TURNSTILE_SECRET_KEY = SECRET;
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("verifyTurnstileToken", () => {
  it("accepts a token Cloudflare confirms", async () => {
    fetchMock.mockResolvedValue(siteverifyResponse(approval()));

    await expect(verifyTurnstileToken("good-token")).resolves.toEqual({
      ok: true,
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("rejects when Cloudflare says the token is invalid", async () => {
    fetchMock.mockResolvedValue(
      siteverifyResponse({
        success: false,
        "error-codes": ["invalid-input-response"],
      }),
    );

    const verdict = await verifyTurnstileToken("bad-token");

    expect(verdict).toEqual({
      ok: false,
      reason: "turnstile_failed",
      codes: ["invalid-input-response"],
    });
  });

  it("rejects a replayed token", async () => {
    fetchMock.mockResolvedValue(
      siteverifyResponse({
        success: false,
        "error-codes": ["timeout-or-duplicate"],
      }),
    );

    const verdict = await verifyTurnstileToken("reused-token");
    expect(verdict.ok).toBe(false);
  });

  it.each([
    ["undefined", undefined],
    ["null", null],
    ["an empty string", ""],
    ["a boolean — never trust a client-supplied captchaPassed", true],
    ["a number", 1],
  ])("treats %s as a missing token and never calls Cloudflare", async (_l, token) => {
    const verdict = await verifyTurnstileToken(token);

    expect(verdict).toEqual({
      ok: false,
      reason: "turnstile_missing",
      codes: [],
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects an oversized token without a network call", async () => {
    const verdict = await verifyTurnstileToken("x".repeat(MAX_TOKEN_LENGTH + 1));

    expect(verdict).toMatchObject({ ok: false, reason: "turnstile_failed" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("fails closed when the secret is not configured", async () => {
    delete process.env.TURNSTILE_SECRET_KEY;

    const verdict = await verifyTurnstileToken("any-token");

    expect(verdict).toMatchObject({
      ok: false,
      reason: "turnstile_unconfigured",
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("fails closed when Cloudflare returns a server error", async () => {
    fetchMock.mockResolvedValue(siteverifyResponse({}, 502));

    const verdict = await verifyTurnstileToken("token");

    expect(verdict).toMatchObject({
      ok: false,
      reason: "turnstile_unavailable",
      codes: ["http-502"],
    });
  });

  it("fails closed when the network call throws", async () => {
    fetchMock.mockRejectedValue(new Error("ECONNRESET"));

    const verdict = await verifyTurnstileToken("token");

    expect(verdict).toMatchObject({
      ok: false,
      reason: "turnstile_unavailable",
      codes: ["network-error"],
    });
  });

  it("fails closed when the request times out", async () => {
    process.env.TURNSTILE_TIMEOUT_MS = "20";
    fetchMock.mockImplementation(
      (_url: string, init: RequestInit) =>
        new Promise((_resolve, reject) => {
          init.signal?.addEventListener("abort", () => {
            const error = new Error("aborted");
            error.name = "AbortError";
            reject(error);
          });
        }),
    );

    const verdict = await verifyTurnstileToken("token");
    delete process.env.TURNSTILE_TIMEOUT_MS;

    expect(verdict).toMatchObject({
      ok: false,
      reason: "turnstile_unavailable",
      codes: ["timeout"],
    });
  });

  it("sends the secret in the POST body, never in the URL", async () => {
    fetchMock.mockResolvedValue(siteverifyResponse(approval()));

    await verifyTurnstileToken("token", { remoteIp: "203.0.113.4" });

    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    );
    expect(url).not.toContain(SECRET);

    const body = new URLSearchParams(init.body as string);
    expect(body.get("secret")).toBe(SECRET);
    expect(body.get("response")).toBe("token");
    expect(body.get("remoteip")).toBe("203.0.113.4");
  });

  it("omits an unknown remote IP rather than sending the literal 'unknown'", async () => {
    fetchMock.mockResolvedValue(siteverifyResponse(approval()));

    await verifyTurnstileToken("token", { remoteIp: "unknown" });

    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(new URLSearchParams(init.body as string).has("remoteip")).toBe(false);
  });
});

/**
 * `success: true` is necessary but not sufficient. These cover the two ways a
 * genuine, unused token can still be the wrong token.
 */
describe("verifyTurnstileToken — response binding", () => {
  it("accepts a token with the right hostname and action", async () => {
    fetchMock.mockResolvedValue(
      siteverifyResponse(approval({ action: turnstileActions.buyerInterest })),
    );

    await expect(
      verifyTurnstileToken("token", {
        expectedAction: turnstileActions.buyerInterest,
      }),
    ).resolves.toEqual({ ok: true });
  });

  it("rejects a token solved on a hostname that is not ours", async () => {
    // The attack this closes: our site key is public, so anyone can embed the
    // widget on their own page and harvest genuinely-solved tokens.
    fetchMock.mockResolvedValue(
      siteverifyResponse(
        approval({
          hostname: "royalhomesolutions.phishing.example",
          action: turnstileActions.buyerInterest,
        }),
      ),
    );

    await expect(
      verifyTurnstileToken("token", {
        expectedAction: turnstileActions.buyerInterest,
      }),
    ).resolves.toEqual({
      ok: false,
      reason: "turnstile_failed",
      codes: ["hostname-mismatch"],
    });
  });

  it("rejects a token issued for a different operation", async () => {
    fetchMock.mockResolvedValue(
      siteverifyResponse(approval({ action: turnstileActions.newsletter })),
    );

    await expect(
      verifyTurnstileToken("token", {
        expectedAction: turnstileActions.sellerLead,
      }),
    ).resolves.toEqual({
      ok: false,
      reason: "turnstile_failed",
      codes: ["action-mismatch"],
    });
  });

  it("rejects a token carrying no action when one is expected", async () => {
    fetchMock.mockResolvedValue(siteverifyResponse(approval()));

    await expect(
      verifyTurnstileToken("token", {
        expectedAction: turnstileActions.contact,
      }),
    ).resolves.toMatchObject({ ok: false, codes: ["action-mismatch"] });
  });

  it("honours a configured hostname allow-list, e.g. a preview deployment", async () => {
    process.env.TURNSTILE_ALLOWED_HOSTNAMES =
      "royalhomesolutions.com, rhs-preview.vercel.app";
    fetchMock.mockResolvedValue(
      siteverifyResponse(approval({ hostname: "rhs-preview.vercel.app" })),
    );

    await expect(verifyTurnstileToken("token")).resolves.toEqual({ ok: true });

    process.env.TURNSTILE_ALLOWED_HOSTNAMES = "royalhomesolutions.com";
  });

  it("skips binding outside production so Cloudflare's test keys stay usable", async () => {
    process.env.TURNSTILE_STRICT_BINDING = "false";
    // What a dummy token actually answers with: placeholder host, no action.
    fetchMock.mockResolvedValue(
      siteverifyResponse({ success: true, hostname: "example.com" }),
    );

    await expect(
      verifyTurnstileToken("token", {
        expectedAction: turnstileActions.sellerLead,
      }),
    ).resolves.toEqual({ ok: true });

    process.env.TURNSTILE_STRICT_BINDING = "true";
  });
});
