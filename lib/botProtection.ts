/**
 * The single anti-bot gate every public form endpoint runs before it is allowed
 * to spend a Resend call, store a lead, or notify the team.
 *
 * Layered on purpose, cheapest first:
 *
 *   1. bounded body read   — an oversized payload never reaches JSON.parse
 *   2. honeypot            — free, catches naive form-fillers
 *   3. submission timing   — free, catches instant replays; advisory only
 *   4. Turnstile           — Cloudflare decides, server-side. Authoritative.
 *
 * Only step 4 is real security. The first three are cheap filters that keep
 * obvious junk off the network call; none of them is trusted to stand alone,
 * and none of them can pass a request that Turnstile rejects.
 *
 * Origin/Referer is recorded as a signal and never used to authorise anything —
 * both headers are attacker-controlled.
 */

import { NextResponse } from "next/server";
import {
  anonymizeIp,
  logFormAccepted,
  logFormRejected,
  type RejectionReason,
} from "@/lib/securityLog";
import { verifyTurnstileToken } from "@/lib/turnstile";
import type { TurnstileAction } from "@/lib/turnstileActions";

/**
 * Hidden field name. Deliberately plausible-but-unused: bots fill fields that
 * look real, browsers have no autofill heuristic for it.
 */
export const HONEYPOT_FIELD = "companyWebsite";

/** Milliseconds between the form rendering and the visitor submitting it. */
export const ELAPSED_FIELD = "formElapsedMs";

/** The Turnstile response token produced by the widget. */
export const TURNSTILE_FIELD = "turnstileToken";

/**
 * Largest body accepted, before parsing. The roomiest form (contact) allows a
 * 4000-character message and a ~2KB Turnstile token, so 16KB is generous for a
 * real submission and stops a multi-megabyte parse.
 */
export const MAX_REQUEST_BYTES = 16 * 1024;

/**
 * Below this, a submission is treated as automated.
 *
 * Kept deliberately low. A password manager filling every field and the visitor
 * clicking submit immediately can land near two seconds, so this is set well
 * under any plausible human path rather than at the average one — a false
 * positive here costs a real lead, and Turnstile is the control that matters.
 */
export const MIN_ELAPSED_MS = 1_200;

/** Single-field forms (the footer newsletter) are legitimately faster. */
export const MIN_ELAPSED_MS_SHORT_FORM = 500;

/**
 * One message for every visible bot-shaped rejection.
 *
 * Timing and Turnstile failures are indistinguishable in the response, so a
 * script cannot use our error text to work out which layer caught it. Real
 * visitors who hit these (an expired challenge, mostly) get an actionable
 * instruction. A honeypot hit is handled differently — see `verifySubmission`.
 */
const GENERIC_REJECTION =
  "We couldn't verify your submission. Please refresh the page and try again.";

const UNAVAILABLE_MESSAGE =
  "Verification is temporarily unavailable. Please try again in a moment.";

export type BoundedBodyResult =
  | { ok: true; body: Record<string, unknown> }
  | { ok: false; reason: Extract<RejectionReason, "payload_too_large" | "invalid_json"> };

/**
 * Reads and parses a request body, refusing anything oversized.
 *
 * `Content-Length` is checked first as a free early exit, then the actual byte
 * length is measured — the header is client-supplied and may lie or be absent.
 */
export async function readBoundedJson(
  request: Request,
  maxBytes: number = MAX_REQUEST_BYTES,
): Promise<BoundedBodyResult> {
  const declared = Number(request.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > maxBytes) {
    return { ok: false, reason: "payload_too_large" };
  }

  let text: string;
  try {
    text = await request.text();
  } catch {
    return { ok: false, reason: "invalid_json" };
  }

  // Byte length, not character count — multi-byte input must not slip past.
  if (Buffer.byteLength(text, "utf8") > maxBytes) {
    return { ok: false, reason: "payload_too_large" };
  }

  try {
    const parsed: unknown = JSON.parse(text);
    // Arrays and primitives are valid JSON but never a valid submission.
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return { ok: false, reason: "invalid_json" };
    }
    return { ok: true, body: parsed as Record<string, unknown> };
  } catch {
    return { ok: false, reason: "invalid_json" };
  }
}

/** True when the honeypot was filled in — i.e. something non-human typed. */
export function isHoneypotTripped(body: Record<string, unknown>): boolean {
  const value = body[HONEYPOT_FIELD];
  if (value === undefined || value === null) return false;
  if (typeof value === "string") return value.trim().length > 0;
  // A non-string in a text input is itself a sign the form wasn't used.
  return true;
}

/**
 * Reads the client's self-reported fill duration.
 *
 * Client-supplied and therefore trivially faked, which is exactly why a missing
 * or nonsensical value is *not* a rejection — only an implausibly small one is.
 * Assistive tech, autofill and prefetched pages must not be punished here.
 */
export function readElapsedMs(body: Record<string, unknown>): number | undefined {
  const raw = body[ELAPSED_FIELD];
  const value = typeof raw === "number" ? raw : Number(raw);
  if (!Number.isFinite(value) || value < 0) return undefined;
  return value;
}

/**
 * Compares Origin (falling back to Referer) against the request host.
 *
 * Returns true on a mismatch. Recorded as a signal only — never a gate.
 */
export function hasOriginMismatch(request: Request): boolean {
  const origin = request.headers.get("origin") ?? request.headers.get("referer");
  const host = request.headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host !== host;
  } catch {
    return true;
  }
}

export type BotCheckResult =
  | { ok: true }
  | { ok: false; reason: RejectionReason; response: NextResponse };

export interface BotCheckOptions {
  /** Endpoint slug used in logs, e.g. "buyer-interest". */
  route: string;
  request: Request;
  /** Best-effort client IP, already resolved by the route. */
  ip: string;
  /** Parsed body — call `readBoundedJson` first. */
  body: Record<string, unknown>;
  /**
   * The Turnstile action this endpoint expects, decided by the route. Never
   * read from the request body — that would let the caller pick its own gate.
   */
  action: TurnstileAction;
  /** Override for single-field forms. */
  minElapsedMs?: number;
}

/**
 * Runs honeypot → timing → Turnstile, in that order, and logs the outcome.
 *
 * Returns a ready-to-send response on rejection so every route rejects
 * identically. Callers MUST return that response without touching Resend,
 * the lead store, or anything else with a side effect.
 */
export async function verifySubmission(
  options: BotCheckOptions,
): Promise<BotCheckResult> {
  const { route, request, ip, body, action } = options;
  const minElapsedMs = options.minElapsedMs ?? MIN_ELAPSED_MS;

  const elapsedMs = readElapsedMs(body);
  const originMismatch = hasOriginMismatch(request);
  // Network prefix only — the full address stays in the limiter's memory.
  const base = { route, ipPrefix: anonymizeIp(ip), elapsedMs, originMismatch };

  const reject = (
    reason: RejectionReason,
    status: number,
    message: string,
    extra: { codes?: string[]; tokenLength?: number } = {},
  ): BotCheckResult => {
    logFormRejected(reason, { ...base, ...extra });
    return {
      ok: false,
      reason,
      response: NextResponse.json({ error: message }, { status }),
    };
  };

  if (isHoneypotTripped(body)) {
    // Deliberately indistinguishable from success, and deliberately the only
    // check that behaves this way. A filled honeypot is never a recoverable
    // human mistake, so there is no one to give an actionable error to — while
    // a 400 teaches a bot that the hidden field is a trap and invites it to
    // retry without it. `delivered: false` is how the browser knows not to
    // fire conversion tracking; a bot posting straight to the API never reads
    // it, and never learns anything.
    logFormRejected("honeypot", base);
    return {
      ok: false,
      reason: "honeypot",
      response: NextResponse.json({ ok: true, delivered: false }, { status: 200 }),
    };
  }

  if (elapsedMs !== undefined && elapsedMs < minElapsedMs) {
    return reject("too_fast", 400, GENERIC_REJECTION);
  }

  const token = body[TURNSTILE_FIELD];
  const tokenLength = typeof token === "string" ? token.length : 0;

  const verdict = await verifyTurnstileToken(token, {
    remoteIp: ip,
    expectedAction: action,
  });

  if (!verdict.ok) {
    // Cloudflare being unreachable or unconfigured is our problem, not the
    // visitor's — a 503 tells an honest retry to come back, while still
    // sending zero emails.
    const isOurFault =
      verdict.reason === "turnstile_unavailable" ||
      verdict.reason === "turnstile_unconfigured";

    if (verdict.reason === "turnstile_unconfigured") {
      console.error(
        `[${route}] TURNSTILE_SECRET_KEY is not set — every submission is being rejected. ` +
          `Set NEXT_PUBLIC_TURNSTILE_SITE_KEY and TURNSTILE_SECRET_KEY (see .env.example).`,
      );
    }

    return reject(
      verdict.reason,
      isOurFault ? 503 : 400,
      isOurFault ? UNAVAILABLE_MESSAGE : GENERIC_REJECTION,
      { codes: verdict.codes, tokenLength },
    );
  }

  logFormAccepted(base);
  return { ok: true };
}
