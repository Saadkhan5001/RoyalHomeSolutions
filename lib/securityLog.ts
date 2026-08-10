/**
 * Structured, low-noise security logging for the public form endpoints.
 *
 * One greppable line per rejected submission:
 *
 *   form_rejected: turnstile_failed {"route":"buyer-interest","ip":"…","codes":["invalid-input-response"]}
 *
 * Deliberately narrow about what it records. Secrets (RESEND_API_KEY,
 * TURNSTILE_SECRET_KEY) and Turnstile tokens never reach it — a token is a
 * single-use credential, so only its length is ever logged. Neither do the
 * visitor's name, email, phone or message: a rejection log exists to show the
 * shape of an attack, not to make people's enquiries searchable in a log drain.
 */

/** Why a submission was turned away. Stable strings — they are grepped. */
export type RejectionReason =
  | "rate_limit"
  | "payload_too_large"
  | "invalid_json"
  | "validation"
  | "honeypot"
  | "too_fast"
  | "turnstile_missing"
  | "turnstile_failed"
  | "turnstile_unavailable"
  | "turnstile_unconfigured";

/**
 * Reduces an IP to its network prefix for logging.
 *
 * The rate limiter still keys on the full address in memory — it has to. What
 * gets *written down* is a different question: the operational need is "are
 * these hits coming from one source or many", and a prefix answers that. A full
 * address in a log drain is personal data we have no reason to retain.
 *
 * IPv4 keeps three octets (203.0.113.x); IPv6 keeps its /64 routing prefix.
 */
export function anonymizeIp(ip: string | undefined): string | undefined {
  if (!ip || ip === "unknown") return ip;

  if (ip.includes(".") && !ip.includes(":")) {
    const octets = ip.split(".");
    return octets.length === 4 ? `${octets.slice(0, 3).join(".")}.x` : "invalid";
  }

  if (ip.includes(":")) {
    const groups = ip.split(":");
    return `${groups.slice(0, 4).join(":")}::x`;
  }

  return "invalid";
}

export interface SecurityLogContext {
  /** Endpoint slug, e.g. "buyer-interest". */
  route: string;
  /** Network prefix only — pass through `anonymizeIp`, never a full address. */
  ipPrefix?: string;
  /** Milliseconds between the form rendering and submitting, when supplied. */
  elapsedMs?: number;
  /** Length only — never the token itself. */
  tokenLength?: number;
  /** Cloudflare `error-codes` from siteverify. */
  codes?: string[];
  /** How many validation rules failed. Never which values failed them. */
  errorCount?: number;
  /** True when Origin/Referer did not match the request host. Signal only. */
  originMismatch?: boolean;
}

function serialize(context: SecurityLogContext): string {
  // Drop undefined keys so the line stays readable at a glance.
  const entries = Object.entries(context).filter(([, v]) => v !== undefined);
  return JSON.stringify(Object.fromEntries(entries));
}

/** Records a turned-away submission. */
export function logFormRejected(
  reason: RejectionReason,
  context: SecurityLogContext,
): void {
  console.warn(`form_rejected: ${reason} ${serialize({ ...context })}`);
}

/**
 * Records a submission that cleared every gate and is about to be processed.
 *
 * Logged at info level so the accept/reject ratio is visible without turning on
 * debug logging — the single most useful number when judging whether the
 * protection is working or is silently blocking real people.
 */
export function logFormAccepted(context: SecurityLogContext): void {
  console.info(`form_accepted ${serialize(context)}`);
}
