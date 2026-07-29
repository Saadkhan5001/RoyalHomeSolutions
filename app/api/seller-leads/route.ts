import { NextResponse } from "next/server";
import { Resend } from "resend";
import { validateSellerLead } from "@/lib/leads";
import {
  buildInternalEmail,
  buildSellerConfirmationEmail,
} from "@/lib/leadEmails";
import { appendLead } from "@/lib/leadStore";
import {
  checkRateLimit,
  getClientIp,
  recordRateLimitHit,
} from "@/lib/rateLimit";

// Resend's SDK needs the Node runtime, and this route must never be cached.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Submissions allowed per IP per window. Generous for a household, tight for a bot. */
const RATE_LIMIT = Number(process.env.LEAD_RATE_LIMIT ?? 5);
const RATE_WINDOW_MS = Number(process.env.LEAD_RATE_WINDOW_MS ?? 10 * 60 * 1000);

/**
 * Receives seller leads from `SellerLeadForm` and emails them to the team.
 *
 * The internal notification is the source of truth: if it fails, the caller
 * gets an error so the visitor can retry rather than being told it worked.
 * The seller's confirmation is best-effort — a bad address on their side must
 * not lose us a lead we've already delivered.
 */
export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.LEAD_NOTIFY_EMAIL;
  const fromEmail = process.env.LEAD_FROM_EMAIL;

  if (!apiKey || !notifyEmail || !fromEmail) {
    // Config problem, not a visitor problem — log loudly, stay vague publicly.
    console.error(
      "[seller-leads] Missing email configuration. Required: RESEND_API_KEY, LEAD_NOTIFY_EMAIL, LEAD_FROM_EMAIL.",
    );
    return NextResponse.json(
      { error: "Lead submission is temporarily unavailable." },
      { status: 500 },
    );
  }

  // Checked before parsing so a flood costs us as little work as possible.
  const ip = getClientIp(request);
  const rateKey = `seller-leads:${ip}`;
  const limit = checkRateLimit(rateKey, RATE_LIMIT, RATE_WINDOW_MS);

  if (!limit.allowed) {
    console.warn(`[seller-leads] Rate limit hit for ${ip}.`);
    return NextResponse.json(
      {
        error:
          "You've submitted a few times already. Please wait a moment and try again, or call us directly.",
      },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
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

  const result = validateSellerLead(body);
  if (!result.ok) {
    return NextResponse.json(
      { error: result.errors[0], errors: result.errors },
      { status: 400 },
    );
  }

  const { lead } = result;

  // Counted only now that the lead is valid, so a visitor correcting a typo
  // doesn't burn their allowance on rejected attempts.
  recordRateLimitHit(rateKey, RATE_WINDOW_MS);

  const resend = new Resend(apiKey);
  const internal = buildInternalEmail(lead);

  try {
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: notifyEmail.split(",").map((address) => address.trim()),
      // Lets the team hit reply and land straight in the seller's inbox.
      replyTo: lead.email,
      subject: internal.subject,
      html: internal.html,
      text: internal.text,
    });

    if (error) throw new Error(error.message);
  } catch (error) {
    console.error("[seller-leads] Failed to send internal notification:", error);
    return NextResponse.json(
      { error: "We couldn't submit your details. Please try again." },
      { status: 502 },
    );
  }

  // Everything below is best-effort: the lead is already delivered, so nothing
  // here may turn a successful submission into an error for the visitor.

  // Written after the email rather than before, so a visitor retrying a failed
  // send doesn't leave a duplicate record behind.
  await appendLead(lead, {
    ip,
    userAgent: request.headers.get("user-agent") ?? "unknown",
  });

  try {
    const confirmation = buildSellerConfirmationEmail(lead);
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: lead.email,
      replyTo: notifyEmail.split(",")[0].trim(),
      subject: confirmation.subject,
      html: confirmation.html,
      text: confirmation.text,
    });

    if (error) throw new Error(error.message);
  } catch (error) {
    console.error(
      "[seller-leads] Failed to send seller confirmation (lead was still delivered):",
      error,
    );
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
