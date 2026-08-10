import { NextResponse } from "next/server";
import { Resend } from "resend";
import { validateContactEnquiry } from "@/lib/contact";
import {
  buildContactInternalEmail,
  buildContactConfirmationEmail,
} from "@/lib/contactEmails";
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

const ROUTE = "contact";

/** Successful enquiries allowed per IP per window. Reuses the seller settings. */
const RATE_LIMIT = Number(process.env.LEAD_RATE_LIMIT ?? 5);
/** Coarse ceiling on total requests per IP per window — see `checkAndRecordAbuse`. */
const ABUSE_LIMIT = Number(process.env.LEAD_ABUSE_LIMIT ?? 30);
const RATE_WINDOW_MS = Number(process.env.LEAD_RATE_WINDOW_MS ?? 10 * 60 * 1000);

/**
 * Receives general enquiries from `GeneralContactForm` and emails them to the
 * team.
 *
 * Same contract as `/api/seller-leads` and `/api/buyer-interest`: the internal
 * notification decides the response, so a visitor is never told it worked when
 * nothing was sent; the visitor's confirmation is best-effort and only logged
 * on failure.
 *
 * Delivery target is CONTACT_NOTIFY_EMAIL, falling back to LEAD_NOTIFY_EMAIL.
 * The fallback is deliberate: general enquiries are lower-volume than seller
 * leads and both currently reach the same inbox, so a deploy that hasn't set
 * the new variable keeps working rather than silently dropping messages. Set
 * CONTACT_NOTIFY_EMAIL to route them somewhere separate.
 *
 * Enquiries are emailed, not persisted — same limitation as seller leads on
 * serverless (see NOD-192 / HANDOVER.md).
 */
export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const notifyEmail =
    process.env.CONTACT_NOTIFY_EMAIL || process.env.LEAD_NOTIFY_EMAIL;
  const fromEmail = process.env.LEAD_FROM_EMAIL;

  if (!apiKey || !notifyEmail || !fromEmail) {
    // Config problem, not a visitor problem — log loudly, stay vague publicly.
    console.error(
      "[contact] Missing email configuration. Required: RESEND_API_KEY, CONTACT_NOTIFY_EMAIL (or LEAD_NOTIFY_EMAIL), LEAD_FROM_EMAIL.",
    );
    return NextResponse.json(
      { error: "The contact form is temporarily unavailable." },
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
          "You've sent a few messages already. Please wait a moment and try again, or email us directly at jonah@royalhomesolutions.com.",
      },
      {
        status: 429,
        headers: { "Retry-After": String(abuse.retryAfterSeconds) },
      },
    );
  }

  // Tight ceiling, charged only for messages that actually go through.
  const rateKey = `${ROUTE}:${ip}`;
  const limit = checkRateLimit(rateKey, RATE_LIMIT, RATE_WINDOW_MS);

  if (!limit.allowed) {
    logFormRejected("rate_limit", { route: ROUTE, ipPrefix });
    return NextResponse.json(
      {
        error:
          "You've sent a few messages already. Please wait a moment and try again, or email us directly at jonah@royalhomesolutions.com.",
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

  const result = validateContactEnquiry(parsed.body);
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

  // Honeypot → timing → Turnstile, verified server-side against this route's
  // own action. Nothing below this line runs unless Cloudflare confirmed it.
  const gate = await verifySubmission({
    route: ROUTE,
    request,
    ip,
    body: parsed.body,
    action: turnstileActions.contact,
  });

  if (!gate.ok) return gate.response;

  // Both stamped server-side. A client-supplied timestamp would be
  // unverifiable, and this route is only ever reached from the contact form,
  // so its attribution is not the caller's to choose either.
  const enquiry = {
    ...result.enquiry,
    source: routeSources.contact,
    submittedAt: new Date().toISOString(),
  };

  // Charged only now that the enquiry is valid and human.
  recordRateLimitHit(rateKey, RATE_WINDOW_MS);

  const resend = new Resend(apiKey);
  const internal = buildContactInternalEmail(enquiry);

  try {
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: notifyEmail.split(",").map((address) => address.trim()),
      // Lets the team hit reply and land straight in the visitor's inbox.
      replyTo: enquiry.email,
      subject: internal.subject,
      html: internal.html,
      text: internal.text,
    });

    if (error) throw new Error(error.message);
  } catch (error) {
    console.error("[contact] Failed to send internal notification:", error);
    return NextResponse.json(
      {
        error:
          "We couldn't send your message. Please try again, or email us directly at jonah@royalhomesolutions.com.",
      },
      { status: 502 },
    );
  }

  // Best-effort: the enquiry is already delivered past this point.
  try {
    const confirmation = buildContactConfirmationEmail(enquiry);
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
      "[contact] Failed to send visitor confirmation (message was still delivered):",
      error,
    );
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
