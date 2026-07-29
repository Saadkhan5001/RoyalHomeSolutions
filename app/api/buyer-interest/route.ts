import { NextResponse } from "next/server";
import { Resend } from "resend";
import { validateBuyerInterest } from "@/lib/buyerInterest";
import {
  buildBuyerInternalEmail,
  buildBuyerConfirmationEmail,
} from "@/lib/buyerEmails";
import {
  checkRateLimit,
  getClientIp,
  recordRateLimitHit,
} from "@/lib/rateLimit";

// Resend's SDK needs the Node runtime, and this route must never be cached.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Enquiries allowed per IP per window. Reuses the seller-lead settings. */
const RATE_LIMIT = Number(process.env.LEAD_RATE_LIMIT ?? 5);
const RATE_WINDOW_MS = Number(process.env.LEAD_RATE_WINDOW_MS ?? 10 * 60 * 1000);

/**
 * Receives buyer enquiries from `BuyerInterestForm` and emails them to the team.
 *
 * Same contract as `/api/seller-leads`: the internal notification decides the
 * response, so a visitor is never told it worked when nothing was sent; the
 * buyer's confirmation is best-effort and only logged on failure. Reuses the
 * existing RESEND_API_KEY / LEAD_NOTIFY_EMAIL / LEAD_FROM_EMAIL — no new
 * environment variables.
 *
 * Enquiries are emailed, not persisted (same limitation as seller leads on
 * serverless — see NOD-192).
 */
export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.LEAD_NOTIFY_EMAIL;
  const fromEmail = process.env.LEAD_FROM_EMAIL;

  if (!apiKey || !notifyEmail || !fromEmail) {
    // Config problem, not a visitor problem — log loudly, stay vague publicly.
    console.error(
      "[buyer-interest] Missing email configuration. Required: RESEND_API_KEY, LEAD_NOTIFY_EMAIL, LEAD_FROM_EMAIL.",
    );
    return NextResponse.json(
      { error: "Enquiries are temporarily unavailable." },
      { status: 500 },
    );
  }

  // Checked before parsing so a flood costs us as little work as possible.
  const ip = getClientIp(request);
  const rateKey = `buyer-interest:${ip}`;
  const limit = checkRateLimit(rateKey, RATE_LIMIT, RATE_WINDOW_MS);

  if (!limit.allowed) {
    console.warn(`[buyer-interest] Rate limit hit for ${ip}.`);
    return NextResponse.json(
      {
        error:
          "You've submitted a few times already. Please wait a moment and try again, or call us directly.",
      },
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
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 },
    );
  }

  const result = validateBuyerInterest(body);
  if (!result.ok) {
    return NextResponse.json(
      { error: result.errors[0], errors: result.errors },
      { status: 400 },
    );
  }

  const { enquiry } = result;

  // Counted only now that the enquiry is valid, so a visitor correcting a typo
  // doesn't burn their allowance on rejected attempts.
  recordRateLimitHit(rateKey, RATE_WINDOW_MS);

  const resend = new Resend(apiKey);
  const internal = buildBuyerInternalEmail(enquiry);

  try {
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: notifyEmail.split(",").map((address) => address.trim()),
      // Lets the team hit reply and land straight in the buyer's inbox.
      replyTo: enquiry.email,
      subject: internal.subject,
      html: internal.html,
      text: internal.text,
    });

    if (error) throw new Error(error.message);
  } catch (error) {
    console.error(
      "[buyer-interest] Failed to send internal notification:",
      error,
    );
    return NextResponse.json(
      { error: "We couldn't submit your enquiry. Please try again." },
      { status: 502 },
    );
  }

  // Best-effort: the enquiry is already delivered past this point.
  try {
    const confirmation = buildBuyerConfirmationEmail(enquiry);
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: enquiry.email,
      replyTo: notifyEmail.split(",")[0].trim(),
      subject: confirmation.subject,
      html: confirmation.html,
      text: confirmation.text,
    });

    if (error) throw new Error(error.message);
  } catch (error) {
    console.error(
      "[buyer-interest] Failed to send buyer confirmation (enquiry was still delivered):",
      error,
    );
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
