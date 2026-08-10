import { NextResponse } from "next/server";
import { Resend } from "resend";
import { isValidEmail } from "@/lib/validation";
import {
  checkAndRecordAbuse,
  checkRateLimit,
  getClientIp,
  recordRateLimitHit,
} from "@/lib/rateLimit";
import {
  MIN_ELAPSED_MS_SHORT_FORM,
  readBoundedJson,
  verifySubmission,
} from "@/lib/botProtection";
import { anonymizeIp, logFormRejected } from "@/lib/securityLog";
import { turnstileActions } from "@/lib/turnstileActions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ROUTE = "newsletter";

/** Coarse ceiling on total requests per IP per window. */
const ABUSE_LIMIT = Number(process.env.NEWSLETTER_ABUSE_LIMIT ?? 30);

/** Signups allowed per IP per window. Tighter than the lead form — one person
 * only ever needs one. */
const RATE_LIMIT = Number(process.env.NEWSLETTER_RATE_LIMIT ?? 3);
const RATE_WINDOW_MS = Number(
  process.env.NEWSLETTER_RATE_WINDOW_MS ?? 10 * 60 * 1000,
);

/** Resend reports an existing contact in a few different shapes. */
function isAlreadySubscribed(message: string): boolean {
  const normalized = message.toLowerCase();
  return (
    normalized.includes("already exists") ||
    normalized.includes("already registered") ||
    normalized.includes("contact already")
  );
}

/**
 * Adds a footer newsletter signup to the Resend audience.
 *
 * Uses Resend rather than a separate email platform because it is already a
 * dependency and configured for the seller lead flow — one provider, one key.
 * Swapping to Mailchimp/ConvertKit later only touches the send call below.
 */
export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;

  if (!apiKey || !audienceId) {
    console.error(
      "[newsletter] Missing configuration. Required: RESEND_API_KEY, RESEND_AUDIENCE_ID.",
    );
    return NextResponse.json(
      { error: "Newsletter signup is temporarily unavailable." },
      { status: 500 },
    );
  }

  const ip = getClientIp(request);
  const ipPrefix = anonymizeIp(ip);

  // Coarse ceiling: every request counts, so junk still costs something —
  // but at 30/window it takes real hammering, not three bad payloads.
  const abuse = checkAndRecordAbuse(ROUTE, ip, ABUSE_LIMIT, RATE_WINDOW_MS);
  if (!abuse.allowed) {
    logFormRejected("rate_limit", { route: ROUTE, ipPrefix });
    return NextResponse.json(
      { error: "You've already signed up. Please try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(abuse.retryAfterSeconds) },
      },
    );
  }

  // Tight ceiling, charged only for signups that actually go through.
  const rateKey = `${ROUTE}:${ip}`;
  const limit = checkRateLimit(rateKey, RATE_LIMIT, RATE_WINDOW_MS);

  if (!limit.allowed) {
    logFormRejected("rate_limit", { route: ROUTE, ipPrefix });
    return NextResponse.json(
      { error: "You've already signed up. Please try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfterSeconds) },
      },
    );
  }

  const parsed = await readBoundedJson(request);
  if (!parsed.ok) {
    logFormRejected(parsed.reason, { route: ROUTE, ipPrefix });
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: parsed.reason === "payload_too_large" ? 413 : 400 },
    );
  }

  const rawEmail = parsed.body.email;
  const email = typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : "";

  if (!email) {
    logFormRejected("validation", { route: ROUTE, ipPrefix, errorCount: 1 });
    return NextResponse.json(
      { error: "Please enter your email address." },
      { status: 400 },
    );
  }

  if (!isValidEmail(email)) {
    logFormRejected("validation", { route: ROUTE, ipPrefix, errorCount: 1 });
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  // Honeypot → timing → Turnstile, verified server-side. Nothing below this
  // line runs unless Cloudflare confirmed the token. The timing floor is lower
  // than the lead forms': this is one field, and a genuine signup is quick.
  const gate = await verifySubmission({
    route: ROUTE,
    request,
    ip,
    body: parsed.body,
    action: turnstileActions.newsletter,
    minElapsedMs: MIN_ELAPSED_MS_SHORT_FORM,
  });

  if (!gate.ok) return gate.response;

  // Charged only now that the request is valid and human.
  recordRateLimitHit(rateKey, RATE_WINDOW_MS);

  try {
    const { error } = await new Resend(apiKey).contacts.create({
      audienceId,
      email,
      unsubscribed: false,
    });

    // An address already on the list is a success from the visitor's side —
    // and telling them otherwise would leak who is subscribed.
    if (error && !isAlreadySubscribed(error.message)) {
      throw new Error(error.message);
    }
  } catch (error) {
    console.error("[newsletter] Failed to add contact:", error);
    return NextResponse.json(
      { error: "We couldn't sign you up. Please try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
