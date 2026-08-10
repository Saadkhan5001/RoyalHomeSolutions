/**
 * Stable Turnstile action names, one per protected operation.
 *
 * The widget stamps its action into the token; Cloudflare echoes it back from
 * siteverify; the route compares it against the action it expects. That binding
 * is what stops a token minted on the low-value newsletter widget from being
 * replayed against the seller-lead endpoint.
 *
 * Deliberately dependency-free: both the client widget and the server route
 * import from here, so the two can never drift apart. Cloudflare allows up to
 * 32 characters of `[a-zA-Z0-9_-]`.
 *
 * These names are also what appears in Cloudflare's analytics — renaming one
 * loses continuity there and invalidates any token already in flight.
 */

export const turnstileActions = {
  sellerLead: "seller_lead",
  buyerInterest: "buyer_interest",
  contact: "contact",
  newsletter: "newsletter",
} as const;

export type TurnstileAction =
  (typeof turnstileActions)[keyof typeof turnstileActions];
