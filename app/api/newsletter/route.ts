import { NextResponse } from "next/server";
import { Resend } from "resend";
import { isValidEmail } from "@/lib/validation";
import {
  checkRateLimit,
  getClientIp,
  recordRateLimitHit,
} from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
  const rateKey = `newsletter:${ip}`;
  const limit = checkRateLimit(rateKey, RATE_LIMIT, RATE_WINDOW_MS);

  if (!limit.allowed) {
    console.warn(`[newsletter] Rate limit hit for ${ip}.`);
    return NextResponse.json(
      { error: "You've already signed up. Please try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfterSeconds) },
      },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const rawEmail = (body as Record<string, unknown> | null)?.email;
  const email = typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : "";

  if (!email) {
    return NextResponse.json(
      { error: "Please enter your email address." },
      { status: 400 },
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  // Counted only now that the request is valid, so typos don't cost quota.
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
