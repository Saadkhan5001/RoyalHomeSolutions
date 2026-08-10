import { NextResponse } from "next/server";
import { Resend } from "resend";
import { validateBuyerInterest } from "@/lib/buyerInterest";
import {
  buildBuyerInternalEmail,
  buildBuyerConfirmationEmail,
} from "@/lib/buyerEmails";
import {
  checkAndRecordAbuse,
  checkRateLimit,
  getClientIp,
  recordRateLimitHit,
} from "@/lib/rateLimit";
import { readBoundedJson, verifySubmission } from "@/lib/botProtection";
import { anonymizeIp, logFormRejected } from "@/lib/securityLog";
import { turnstileActions } from "@/lib/turnstileActions";
import { routeSources } from "@/lib/formSources";

// Resend's SDK needs the Node runtime, and this route must never be cached.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ROUTE = "buyer-interest";

/** Successful enquiries allowed per IP per window. Reuses the seller settings. */
const RATE_LIMIT = Number(process.env.LEAD_RATE_LIMIT ?? 5);
/** Coarse ceiling on total requests per IP per window — see `checkAbuse`. */
const ABUSE_LIMIT = Number(process.env.LEAD_ABUSE_LIMIT ?? 30);
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
  const ipPrefix = anonymizeIp(ip);

  // Coarse ceiling: every request counts, so junk still costs something —
  // but at 30/window it takes real hammering, not five bad payloads.
  const abuse = checkAndRecordAbuse(ROUTE, ip, ABUSE_LIMIT, RATE_WINDOW_MS);
  if (!abuse.allowed) {
    logFormRejected("rate_limit", { route: ROUTE, ipPrefix });
    return NextResponse.json(
      {
        error:
          "You've submitted a few times already. Please wait a moment and try again, or call us directly.",
      },
      {
        status: 429,
        headers: { "Retry-After": String(abuse.retryAfterSeconds) },
      },
    );
  }

  // Tight ceiling, charged only for enquiries that actually go through.
  const rateKey = `${ROUTE}:${ip}`;
  const limit = checkRateLimit(rateKey, RATE_LIMIT, RATE_WINDOW_MS);

  if (!limit.allowed) {
    logFormRejected("rate_limit", { route: ROUTE, ipPrefix });
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

  const parsed = await readBoundedJson(request);
  if (!parsed.ok) {
    logFormRejected(parsed.reason, { route: ROUTE, ipPrefix });
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: parsed.reason === "payload_too_large" ? 413 : 400 },
    );
  }

  const result = validateBuyerInterest(parsed.body);
  if (!result.ok) {
    logFormRejected("validation", {
      route: ROUTE,
      ipPrefix,
      errorCount: result.errors.length,
    });
    return NextResponse.json(
      { error: result.errors[0], errors: result.errors },
      { status: 400 },
    );
  }

  // Attribution is the server's to decide — this route is only ever reached
  // from the Buy a Home form, so nothing the caller sent is consulted.
  const enquiry = { ...result.enquiry, source: routeSources.buyerInterest };

  // Honeypot → timing → Turnstile, verified server-side against this route's
  // own action. Nothing below this line runs unless Cloudflare confirmed it.
  const gate = await verifySubmission({
    route: ROUTE,
    request,
    ip,
    body: parsed.body,
    action: turnstileActions.buyerInterest,
  });

  if (!gate.ok) return gate.response;

  // Charged only now that the enquiry is valid and human.
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
