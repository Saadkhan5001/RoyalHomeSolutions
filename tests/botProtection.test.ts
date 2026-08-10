import { describe, expect, it } from "vitest";
import {
  ELAPSED_FIELD,
  HONEYPOT_FIELD,
  MAX_REQUEST_BYTES,
  hasOriginMismatch,
  isHoneypotTripped,
  readBoundedJson,
  readElapsedMs,
} from "@/lib/botProtection";
import { anonymizeIp } from "@/lib/securityLog";

/** Unit tests for the cheap filters that run before Turnstile. */

function jsonRequest(body: string, headers: Record<string, string> = {}) {
  return new Request("https://royalhomesolutions.com/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body,
  });
}

describe("readBoundedJson", () => {
  it("parses a normal object body", async () => {
    const result = await readBoundedJson(jsonRequest('{"email":"a@b.co"}'));
    expect(result).toEqual({ ok: true, body: { email: "a@b.co" } });
  });

  it("rejects a body over the byte limit", async () => {
    const huge = JSON.stringify({ message: "x".repeat(MAX_REQUEST_BYTES) });
    const result = await readBoundedJson(jsonRequest(huge));
    expect(result).toEqual({ ok: false, reason: "payload_too_large" });
  });

  it("rejects on an oversized Content-Length before reading the stream", async () => {
    const result = await readBoundedJson(
      jsonRequest("{}", { "content-length": String(MAX_REQUEST_BYTES + 1) }),
    );
    expect(result).toEqual({ ok: false, reason: "payload_too_large" });
  });

  it("measures bytes, not characters, so multi-byte input can't slip past", async () => {
    // Each emoji is 4 bytes; the string length alone would be under the limit.
    const body = JSON.stringify({ m: "🏠".repeat(MAX_REQUEST_BYTES / 3) });
    expect(body.length).toBeLessThan(MAX_REQUEST_BYTES);
    await expect(readBoundedJson(jsonRequest(body))).resolves.toEqual({
      ok: false,
      reason: "payload_too_large",
    });
  });

  it.each([
    ["malformed JSON", "{not json"],
    ["a bare array", "[1,2,3]"],
    ["a bare string", '"hello"'],
    ["null", "null"],
  ])("rejects %s", async (_label, body) => {
    const result = await readBoundedJson(jsonRequest(body));
    expect(result).toEqual({ ok: false, reason: "invalid_json" });
  });
});

describe("isHoneypotTripped", () => {
  it("passes an empty or absent honeypot", () => {
    expect(isHoneypotTripped({})).toBe(false);
    expect(isHoneypotTripped({ [HONEYPOT_FIELD]: "" })).toBe(false);
    expect(isHoneypotTripped({ [HONEYPOT_FIELD]: "   " })).toBe(false);
  });

  it("trips on any filled value", () => {
    expect(isHoneypotTripped({ [HONEYPOT_FIELD]: "https://spam.example" })).toBe(
      true,
    );
    expect(isHoneypotTripped({ [HONEYPOT_FIELD]: 42 })).toBe(true);
  });
});

describe("readElapsedMs", () => {
  it("reads a numeric duration", () => {
    expect(readElapsedMs({ [ELAPSED_FIELD]: 4200 })).toBe(4200);
  });

  it("returns undefined for missing or nonsensical values, so nothing is rejected on timing alone", () => {
    expect(readElapsedMs({})).toBeUndefined();
    expect(readElapsedMs({ [ELAPSED_FIELD]: "abc" })).toBeUndefined();
    expect(readElapsedMs({ [ELAPSED_FIELD]: -5 })).toBeUndefined();
    expect(readElapsedMs({ [ELAPSED_FIELD]: Infinity })).toBeUndefined();
  });
});

describe("anonymizeIp", () => {
  it("keeps enough of an IPv4 address to tell one network from another", () => {
    expect(anonymizeIp("203.0.113.42")).toBe("203.0.113.x");
    expect(anonymizeIp("198.51.100.7")).toBe("198.51.100.x");
    // Two hits from the same network still correlate; the host does not.
    expect(anonymizeIp("203.0.113.42")).toBe(anonymizeIp("203.0.113.99"));
  });

  it("keeps the IPv6 routing prefix", () => {
    expect(anonymizeIp("2001:db8:85a3:1234:5678:8a2e:370:7334")).toBe(
      "2001:db8:85a3:1234::x",
    );
  });

  it("passes through the placeholders the limiter uses", () => {
    expect(anonymizeIp("unknown")).toBe("unknown");
    expect(anonymizeIp(undefined)).toBeUndefined();
  });

  it("never returns something longer than what it was given", () => {
    for (const ip of ["203.0.113.42", "10.0.0.1", "::1"]) {
      expect(anonymizeIp(ip)).not.toBe(ip);
    }
  });
});

describe("hasOriginMismatch", () => {
  const build = (headers: Record<string, string>) =>
    new Request("https://royalhomesolutions.com/api/contact", {
      method: "POST",
      headers,
    });

  it("is false when Origin matches Host", () => {
    expect(
      hasOriginMismatch(
        build({
          origin: "https://royalhomesolutions.com",
          host: "royalhomesolutions.com",
        }),
      ),
    ).toBe(false);
  });

  it("is false when the headers are absent — a missing Origin proves nothing", () => {
    expect(hasOriginMismatch(build({}))).toBe(false);
  });

  it("is true for a foreign Origin", () => {
    expect(
      hasOriginMismatch(
        build({ origin: "https://evil.example", host: "royalhomesolutions.com" }),
      ),
    ).toBe(true);
  });
});
