import type { BuyerInterestSubmission } from "@/lib/buyerInterest";
import { escapeHtml } from "@/lib/html";

/**
 * HTML email bodies for the buyer-interest flow.
 *
 * Inline-styled tables rather than modern CSS — Outlook and Gmail strip
 * <style> blocks, flexbox and grid. Same construction as `leadEmails.ts`.
 *
 * The internal subject is prefixed "Buyer enquiry" so it is unmistakable
 * against the "New seller lead" notifications in the same inbox.
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

/** Internal notification sent to the Royal Home Solutions inbox. */
export function buildBuyerInternalEmail(enquiry: BuyerInterestSubmission): {
  subject: string;
  html: string;
  text: string;
} {
  const fullName = `${enquiry.firstName} ${enquiry.lastName}`.trim();

  const rows = [
    detailRow("Name", fullName),
    detailRow("Phone", enquiry.phone),
    detailRow("Email", enquiry.email),
    detailRow("Price range", enquiry.priceRange),
    detailRow("Timeline", enquiry.timeline),
    enquiry.interestedProperty
      ? detailRow("Interested in", enquiry.interestedProperty)
      : "",
    enquiry.message ? detailRow("Message", enquiry.message) : "",
    detailRow("Source", enquiry.source ?? "website"),
  ].join("");

  const html = shell(`
    <tr>
      <td style="background-color:${BRAND_INK};padding:24px 32px;">
        <p style="margin:0;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:${BRAND_YELLOW};font-weight:700;">Buyer Enquiry</p>
        <h1 style="margin:8px 0 0;font-size:22px;color:#ffffff;font-weight:600;">${escapeHtml(fullName)}</h1>
      </td>
    </tr>
    <tr>
      <td style="padding:24px 32px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>
        <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:24px;">
          <tr>
            <td style="background-color:${BRAND_YELLOW};border-radius:999px;">
              <a href="tel:${encodeURIComponent(enquiry.phone.replace(/\D/g, ""))}" style="display:inline-block;padding:12px 24px;font-size:14px;font-weight:700;color:${BRAND_INK};text-decoration:none;">Call ${escapeHtml(enquiry.firstName)}</a>
            </td>
          </tr>
        </table>
        <p style="margin:20px 0 0;font-size:13px;color:#888888;line-height:1.5;">
          This is a <strong>buyer</strong> enquiry from the Buy a Home page — someone looking to purchase, not sell. Reply directly to reach ${escapeHtml(enquiry.firstName)}.
        </p>
      </td>
    </tr>`);

  const text = [
    `Buyer enquiry: ${fullName}`,
    ``,
    `Phone: ${enquiry.phone}`,
    `Email: ${enquiry.email}`,
    `Price range: ${enquiry.priceRange}`,
    `Timeline: ${enquiry.timeline}`,
    enquiry.interestedProperty
      ? `Interested in: ${enquiry.interestedProperty}`
      : null,
    enquiry.message ? `Message: ${enquiry.message}` : null,
    `Source: ${enquiry.source ?? "website"}`,
  ]
    .filter((line) => line !== null)
    .join("\n");

  return {
    subject: `Buyer enquiry — ${fullName}, ${enquiry.priceRange}`,
    html,
    text,
  };
}

/** Confirmation sent back to the buyer so they know the enquiry landed. */
export function buildBuyerConfirmationEmail(enquiry: BuyerInterestSubmission): {
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
        <p style="margin:0 0 16px;font-size:16px;color:${BRAND_INK};line-height:1.6;">Hi ${escapeHtml(enquiry.firstName)},</p>
        <p style="margin:0 0 16px;font-size:15px;color:#444444;line-height:1.7;">
          Thanks for your interest in buying a home from Royal Home Solutions. We've received your details and a member of our team will be in touch.
        </p>
        <p style="margin:0 0 24px;font-size:15px;color:#444444;line-height:1.7;">
          We buy houses, renovate them, and sell a limited number of move-in-ready homes — so our inventory is small and changes over time. We'll let you know what's available and what's coming.
        </p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fafafa;border-left:3px solid ${BRAND_GREEN};border-radius:6px;">
          <tr>
            <td style="padding:16px 20px;">
              <p style="margin:0 0 6px;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#888888;font-weight:700;">What you told us</p>
              <p style="margin:0;font-size:14px;color:#444444;line-height:1.6;">
                Price range: ${escapeHtml(enquiry.priceRange)}<br/>
                Timeline: ${escapeHtml(enquiry.timeline)}${
                  enquiry.interestedProperty
                    ? `<br/>Interested in: ${escapeHtml(enquiry.interestedProperty)}`
                    : ""
                }
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
          You're receiving this because you enquired about buying a home on royalhomesolutions.com. We never share your information.
        </p>
      </td>
    </tr>`);

  const text = [
    `Hi ${enquiry.firstName},`,
    ``,
    `Thanks for your interest in buying a home from Royal Home Solutions. We've received your details and a member of our team will be in touch.`,
    ``,
    `We buy houses, renovate them, and sell a limited number of move-in-ready homes — so our inventory is small and changes over time. We'll let you know what's available and what's coming.`,
    ``,
    `What you told us:`,
    `Price range: ${enquiry.priceRange}`,
    `Timeline: ${enquiry.timeline}`,
    enquiry.interestedProperty
      ? `Interested in: ${enquiry.interestedProperty}`
      : null,
    ``,
    `Talk soon,`,
    `The Royal Home Solutions Team`,
  ]
    .filter((line) => line !== null)
    .join("\n");

  return {
    subject: "We've received your enquiry",
    html,
    text,
  };
}
