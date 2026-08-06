import { inquiryTypeLabel, type ContactSubmission } from "@/lib/contact";
import { escapeHtml } from "@/lib/html";

/**
 * HTML email bodies for the general-contact flow.
 *
 * Same construction as `leadEmails.ts` and `buyerEmails.ts`: inline-styled
 * tables rather than modern CSS, because Outlook and Gmail strip <style>
 * blocks, flexbox and grid. All visitor input passes through `escapeHtml()`
 * before it reaches the markup.
 *
 * The internal subject is prefixed with the inquiry type so these are
 * unmistakable against "New seller lead" and "Buyer enquiry" in the same inbox.
 */

const BRAND_INK = "#0D0D0D";
const BRAND_YELLOW = "#F5CE3E";
const BRAND_GREEN = "#22A24B";

/** One label/value row in the enquiry details table. */
function detailRow(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #eeeeee;font-size:13px;color:#666666;width:150px;vertical-align:top;">${escapeHtml(label)}</td>
      <td style="padding:10px 0;border-bottom:1px solid #eeeeee;font-size:15px;color:${BRAND_INK};font-weight:600;">${escapeHtml(value)}</td>
    </tr>`;
}

function shell(inner: string): string {
  return `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background-color:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background-color:#ffffff;border-radius:12px;overflow:hidden;">
            ${inner}
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

/** Readable timestamp for the team, in US Eastern — the company's own clock. */
function formatSubmittedAt(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    timeZone: "America/New_York",
    dateStyle: "medium",
    timeStyle: "short",
  });
}

/** Internal notification sent to the Royal Home Solutions inbox. */
export function buildContactInternalEmail(enquiry: ContactSubmission): {
  subject: string;
  html: string;
  text: string;
} {
  const typeLabel = inquiryTypeLabel(enquiry.inquiryType);
  const submittedAt = enquiry.submittedAt
    ? formatSubmittedAt(enquiry.submittedAt)
    : "";

  const rows = [
    detailRow("Name", enquiry.name),
    detailRow("Email", enquiry.email),
    detailRow("Phone", enquiry.phone || "Not provided"),
    detailRow("Inquiry type", typeLabel),
    submittedAt ? detailRow("Submitted", `${submittedAt} ET`) : "",
    detailRow("Source", enquiry.source ?? "website"),
  ].join("");

  // Message rendered as its own block rather than a table row: general
  // enquiries run long, and line breaks matter more here than in the seller
  // and buyer forms.
  const messageBlock = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;background-color:#fafafa;border-left:3px solid ${BRAND_GREEN};border-radius:6px;">
      <tr>
        <td style="padding:16px 20px;">
          <p style="margin:0 0 8px;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#888888;font-weight:700;">Message</p>
          <p style="margin:0;font-size:15px;color:#444444;line-height:1.7;">${escapeHtml(
            enquiry.message,
          ).replace(/\n/g, "<br/>")}</p>
        </td>
      </tr>
    </table>`;

  const html = shell(`
    <tr>
      <td style="background-color:${BRAND_INK};padding:24px 32px;">
        <p style="margin:0;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:${BRAND_YELLOW};font-weight:700;">${escapeHtml(typeLabel)}</p>
        <h1 style="margin:8px 0 0;font-size:22px;color:#ffffff;font-weight:600;">${escapeHtml(enquiry.name)}</h1>
      </td>
    </tr>
    <tr>
      <td style="padding:24px 32px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>
        ${messageBlock}
        <p style="margin:20px 0 0;font-size:13px;color:#888888;line-height:1.5;">
          Sent from the general contact page on royalhomesolutions.com. Reply directly to reach ${escapeHtml(enquiry.name)}.
        </p>
      </td>
    </tr>`);

  const text = [
    `General enquiry — ${typeLabel}`,
    ``,
    `Name: ${enquiry.name}`,
    `Email: ${enquiry.email}`,
    `Phone: ${enquiry.phone || "Not provided"}`,
    `Inquiry type: ${typeLabel}`,
    submittedAt ? `Submitted: ${submittedAt} ET` : null,
    `Source: ${enquiry.source ?? "website"}`,
    ``,
    `Message:`,
    enquiry.message,
  ]
    .filter((line) => line !== null)
    .join("\n");

  return {
    subject: `${typeLabel} — ${enquiry.name}`,
    html,
    text,
  };
}

/** Confirmation sent back to the visitor so they know the message landed. */
export function buildContactConfirmationEmail(enquiry: ContactSubmission): {
  subject: string;
  html: string;
  text: string;
} {
  // First name only, for a warmer greeting on a form that collects one field.
  const firstName = enquiry.name.split(/\s+/)[0];
  const typeLabel = inquiryTypeLabel(enquiry.inquiryType);

  const html = shell(`
    <tr>
      <td style="background-color:${BRAND_INK};padding:28px 32px;">
        <h1 style="margin:0;font-size:22px;color:#ffffff;font-weight:600;">Royal Home Solutions</h1>
      </td>
    </tr>
    <tr>
      <td style="padding:32px;">
        <p style="margin:0 0 16px;font-size:16px;color:${BRAND_INK};line-height:1.6;">Hi ${escapeHtml(firstName)},</p>
        <p style="margin:0 0 16px;font-size:15px;color:#444444;line-height:1.7;">
          Thanks for getting in touch. We've received your message and someone will get back to you.
        </p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fafafa;border-left:3px solid ${BRAND_GREEN};border-radius:6px;">
          <tr>
            <td style="padding:16px 20px;">
              <p style="margin:0 0 6px;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#888888;font-weight:700;">What you sent</p>
              <p style="margin:0;font-size:14px;color:#444444;line-height:1.6;">
                Regarding: ${escapeHtml(typeLabel)}<br/>
                ${escapeHtml(enquiry.message).replace(/\n/g, "<br/>")}
              </p>
            </td>
          </tr>
        </table>
        <p style="margin:24px 0 0;font-size:15px;color:#444444;line-height:1.7;">
          If it's easier, you can also reply to this email directly.
        </p>
        <p style="margin:24px 0 0;font-size:15px;color:#444444;line-height:1.7;">
          Best,<br/><strong style="color:${BRAND_INK};">The Royal Home Solutions Team</strong>
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding:20px 32px;background-color:#fafafa;">
        <p style="margin:0;font-size:12px;color:#999999;line-height:1.5;">
          You're receiving this because you contacted Royal Home Solutions through royalhomesolutions.com. We never share your information.
        </p>
      </td>
    </tr>`);

  const text = [
    `Hi ${firstName},`,
    ``,
    `Thanks for getting in touch. We've received your message and someone will get back to you.`,
    ``,
    `What you sent:`,
    `Regarding: ${typeLabel}`,
    enquiry.message,
    ``,
    `If it's easier, you can also reply to this email directly.`,
    ``,
    `Best,`,
    `The Royal Home Solutions Team`,
  ].join("\n");

  return {
    subject: "We've received your message",
    html,
    text,
  };
}
