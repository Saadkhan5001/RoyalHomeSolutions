/**
 * Escapes untrusted input before it goes into an HTML email body.
 *
 * Without this, a submitted name or message could inject markup into the
 * notification the team opens. Shared by every transactional email builder so
 * the rule can't drift between them.
 */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
