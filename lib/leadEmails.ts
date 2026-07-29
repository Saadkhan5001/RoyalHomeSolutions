import type { SellerLeadSubmission } from "@/lib/leads";

/**
 * HTML email bodies for the seller lead flow.
 *
 * Written as inline-styled tables rather than modern CSS — Outlook and Gmail
 * strip <style> blocks, flexbox and grid.
 */

const BRAND_INK = "#0D0D0D";
const BRAND_YELLOW = "#F5CE3E";
const BRAND_GREEN = "#22A24B";

/**
 * Escapes untrusted lead input before it goes into an HTML email body.
 * Without this a submitted name or message could inject markup into the
 * notification Jonah opens.
 */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** One label/value row in the lead details table. */
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

/** Internal notification sent to the Royal Home Solutions inbox. */
export function buildInternalEmail(lead: SellerLeadSubmission): {
  subject: string;
  html: string;
  text: string;
} {
  const fullName = `${lead.firstName} ${lead.lastName}`.trim();

  const rows = [
    detailRow("Name", fullName),
    detailRow("Phone", lead.phone),
    detailRow("Email", lead.email),
    detailRow("Property address", lead.propertyAddress),
    detailRow("Timeline", lead.timeline),
    lead.message ? detailRow("Message", lead.message) : "",
    detailRow("Source", lead.source ?? "website"),
  ].join("");

  const html = shell(`
    <tr>
      <td style="background-color:${BRAND_INK};padding:24px 32px;">
        <p style="margin:0;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:${BRAND_YELLOW};font-weight:700;">New Seller Lead</p>
        <h1 style="margin:8px 0 0;font-size:22px;color:#ffffff;font-weight:600;">${escapeHtml(fullName)}</h1>
      </td>
    </tr>
    <tr>
      <td style="padding:24px 32px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>
        <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:24px;">
          <tr>
            <td style="background-color:${BRAND_YELLOW};border-radius:999px;">
              <a href="tel:${encodeURIComponent(lead.phone.replace(/\D/g, ""))}" style="display:inline-block;padding:12px 24px;font-size:14px;font-weight:700;color:${BRAND_INK};text-decoration:none;">Call ${escapeHtml(lead.firstName)}</a>
            </td>
          </tr>
        </table>
        <p style="margin:20px 0 0;font-size:13px;color:#888888;line-height:1.5;">
          Reply directly to this email to reach ${escapeHtml(lead.firstName)} — the reply-to address is already set to their inbox.
        </p>
      </td>
    </tr>`);

  const text = [
    `New seller lead: ${fullName}`,
    ``,
    `Phone: ${lead.phone}`,
    `Email: ${lead.email}`,
    `Property address: ${lead.propertyAddress}`,
    `Timeline: ${lead.timeline}`,
    lead.message ? `Message: ${lead.message}` : null,
    `Source: ${lead.source ?? "website"}`,
  ]
    .filter((line) => line !== null)
    .join("\n");

  return {
    subject: `New seller lead — ${fullName}, ${lead.propertyAddress}`,
    html,
    text,
  };
}

/** Confirmation sent back to the seller so they know the form landed. */
export function buildSellerConfirmationEmail(lead: SellerLeadSubmission): {
  subject: string;
  html: string;
  text: string;
} {
  const html = shell(`
    <tr>
      <td style="background-color:${BRAND_INK};padding:28px 32px;">
        <h1 style="margin:0;font-size:22px;color:#ffffff;font-weight:600;">Royal Home Solutions</h1>
      </td>
    </tr>
    <tr>
      <td style="padding:32px;">
        <p style="margin:0 0 16px;font-size:16px;color:${BRAND_INK};line-height:1.6;">Hi ${escapeHtml(lead.firstName)},</p>
        <p style="margin:0 0 16px;font-size:15px;color:#444444;line-height:1.7;">
          Thanks for reaching out about <strong style="color:${BRAND_INK};">${escapeHtml(lead.propertyAddress)}</strong>. We've received your details and a member of our team will be in touch shortly with your free, no-obligation home review.
        </p>
        <p style="margin:0 0 24px;font-size:15px;color:#444444;line-height:1.7;">
          There's nothing else you need to do right now — just reply to this email if anything changes or you'd like to add more detail about the property.
        </p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fafafa;border-left:3px solid ${BRAND_GREEN};border-radius:6px;">
          <tr>
            <td style="padding:16px 20px;">
              <p style="margin:0 0 6px;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#888888;font-weight:700;">What you told us</p>
              <p style="margin:0;font-size:14px;color:#444444;line-height:1.6;">
                Property: ${escapeHtml(lead.propertyAddress)}<br/>
                Timeline: ${escapeHtml(lead.timeline)}
              </p>
            </td>
          </tr>
        </table>
        <p style="margin:24px 0 0;font-size:15px;color:#444444;line-height:1.7;">
          Talk soon,<br/><strong style="color:${BRAND_INK};">The Royal Home Solutions Team</strong>
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding:20px 32px;background-color:#fafafa;">
        <p style="margin:0;font-size:12px;color:#999999;line-height:1.5;">
          You're receiving this because you submitted a home review request on royalhomesolutions.com. We never share your information.
        </p>
      </td>
    </tr>`);

  const text = [
    `Hi ${lead.firstName},`,
    ``,
    `Thanks for reaching out about ${lead.propertyAddress}. We've received your details and a member of our team will be in touch shortly with your free, no-obligation home review.`,
    ``,
    `There's nothing else you need to do right now — just reply to this email if anything changes.`,
    ``,
    `What you told us:`,
    `Property: ${lead.propertyAddress}`,
    `Timeline: ${lead.timeline}`,
    ``,
    `Talk soon,`,
    `The Royal Home Solutions Team`,
  ].join("\n");

  return {
    subject: "We've received your home review request",
    html,
    text,
  };
}
