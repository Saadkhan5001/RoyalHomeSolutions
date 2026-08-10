/**
 * Server-side Cloudflare Turnstile verification.
 *
 * The browser's Turnstile widget produces a single-use token. That token proves
 * nothing until Cloudflare is asked about it here — a client-supplied boolean
 * ("captchaPassed": true) is worth exactly as much as the bot that typed it, so
 * every protected route calls this and nothing else decides the question.
 *
 * Free plan is sufficient: siteverify has no per-request cost.
 * https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
 *
 * Fails CLOSED. A missing secret, an unreachable Cloudflare, or a timeout all
 * reject the submission. That is deliberate: the alternative is an outage in
 * Cloudflare quietly reopening the endpoint that is being abused right now.
 */

import type { RejectionReason } from "@/lib/securityLog";
import type { TurnstileAction } from "@/lib/turnstileActions";

const SITEVERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/** Cloudflare tokens are documented as up to 2048 characters. */
export const MAX_TOKEN_LENGTH = 2048;

const DEFAULT_TIMEOUT_MS = 5_000;

/**
 * Hostnames a production token may have been solved on.
 *
 * Overridable with TURNSTILE_ALLOWED_HOSTNAMES (comma-separated) — needed for
 * Vercel preview deployments, which serve from *.vercel.app.
 */
const PRODUCTION_HOSTNAMES = [
  "royalhomesolutions.com",
  "www.royalhomesolutions.com",
];

export type TurnstileVerdict =
  | { ok: true }
  | {
      ok: false;
      /** Maps 1:1 onto the security log's rejection reasons. */
      reason: Extract<
        RejectionReason,
        | "turnstile_missing"
        | "turnstile_failed"
        | "turnstile_unavailable"
        | "turnstile_unconfigured"
      >;
      /** Cloudflare's `error-codes`, empty when the call never got that far. */
      codes: string[];
    };

/** True when TURNSTILE_SECRET_KEY is present. Never returns the key itself. */
export function isTurnstileConfigured(): boolean {
  return Boolean(process.env.TURNSTILE_SECRET_KEY);
}

function timeoutMs(): number {
  const raw = Number(process.env.TURNSTILE_TIMEOUT_MS);
  return Number.isFinite(raw) && raw > 0 ? raw : DEFAULT_TIMEOUT_MS;
}

/**
 * Whether to enforce hostname and action binding.
 *
 * On by default in production, off elsewhere. Cloudflare's official test keys
 * answer with a placeholder hostname and no action at all, so enforcing the
 * binding locally would make them unusable and leave developers unable to run
 * the forms — while a production deploy gets the strict check that actually
 * matters. `TURNSTILE_STRICT_BINDING` forces it either way.
 */
function isStrictBinding(): boolean {
  const configured = process.env.TURNSTILE_STRICT_BINDING;
  if (configured === "true") return true;
  if (configured === "false") return false;
  return process.env.NODE_ENV === "production";
}

/** Hostnames accepted in strict mode. */
function allowedHostnames(): string[] {
  const configured = process.env.TURNSTILE_ALLOWED_HOSTNAMES;
  if (configured) {
    return configured
      .split(",")
      .map((host) => host.trim().toLowerCase())
      .filter(Boolean);
  }
  return PRODUCTION_HOSTNAMES;
}

/**
 * Asks Cloudflare whether `token` is a genuine, unused challenge response
 * solved on one of our hostnames for the operation the caller expects.
 *
 * `success` alone is not enough. Without the hostname check, a token solved on
 * an attacker's own page using our public site key would verify here; without
 * the action check, a token minted by the footer newsletter widget could be
 * replayed against the seller-lead endpoint. `expectedAction` is supplied by
 * the route — never read from the request body.
 *
 * `remoteIp` is optional and advisory — Cloudflare uses it as an extra signal.
 * We pass the same best-effort IP the rate limiter uses.
 */
export async function verifyTurnstileToken(
  token: unknown,
  options: { remoteIp?: string; expectedAction?: TurnstileAction } = {},
): Promise<TurnstileVerdict> {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    // Config problem, not a visitor problem. Logged by the caller; the key
    // itself is never referenced beyond this presence check.
    return { ok: false, reason: "turnstile_unconfigured", codes: [] };
  }

  if (typeof token !== "string" || token.length === 0) {
    return { ok: false, reason: "turnstile_missing", codes: [] };
  }

  // Rejected before the network call: an oversized "token" is never valid, and
  // there is no reason to forward it to Cloudflare.
  if (token.length > MAX_TOKEN_LENGTH) {
    return { ok: false, reason: "turnstile_failed", codes: ["oversized-token"] };
  }

  const form = new URLSearchParams({ secret, response: token });
  if (options.remoteIp && options.remoteIp !== "unknown") {
    form.set("remoteip", options.remoteIp);
  }

  // Without a deadline a hung Cloudflare connection would hold the serverless
  // invocation open until the platform kills it.
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs());

  try {
    const response = await fetch(SITEVERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString(),
      signal: controller.signal,
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        ok: false,
        reason: "turnstile_unavailable",
        codes: [`http-${response.status}`],
      };
    }

    const result = (await response.json()) as {
      success?: boolean;
      hostname?: string;
      action?: string;
      "error-codes"?: string[];
    };

    if (result?.success !== true) {
      return {
        ok: false,
        reason: "turnstile_failed",
        codes: Array.isArray(result?.["error-codes"])
          ? result["error-codes"]
          : [],
      };
    }

    // `success: true` only means the token was genuine and unused. It says
    // nothing about *where* it was solved or *what for* — both are checked
    // below before the caller is allowed to proceed.
    if (isStrictBinding()) {
      const hostname = (result.hostname ?? "").toLowerCase();
      if (!allowedHostnames().includes(hostname)) {
        // The hostname is Cloudflare's word, not the client's, so logging the
        // mismatch marker is safe and is the signal worth having.
        return {
          ok: false,
          reason: "turnstile_failed",
          codes: ["hostname-mismatch"],
        };
      }

      if (options.expectedAction && result.action !== options.expectedAction) {
        return {
          ok: false,
          reason: "turnstile_failed",
          codes: ["action-mismatch"],
        };
      }
    }

    return { ok: true };
  } catch (error) {
    // Timeout, DNS failure, malformed JSON — all indistinguishable from the
    // visitor's side, and all resolved the same way: reject and let them retry.
    const aborted = error instanceof Error && error.name === "AbortError";
    return {
      ok: false,
      reason: "turnstile_unavailable",
      codes: [aborted ? "timeout" : "network-error"],
    };
  } finally {
    clearTimeout(timer);
  }
}
