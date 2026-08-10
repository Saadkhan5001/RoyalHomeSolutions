/**
 * Attribution tag for each lead-producing endpoint.
 *
 * `source` is a business value that appears in the team's inbox, and every one
 * of these routes already knows its own answer — the buyer endpoint is only
 * ever reached from the Buy a Home form. So the server assigns it and the
 * browser is not asked, which removes a whole field from the trust boundary:
 * nothing a caller sends can change what Jonah reads in the email.
 *
 * If a route ever legitimately serves several capture points, that is the
 * moment to accept a client value again — and to validate it against a list
 * like this one. Until then, one route means one source.
 */

export const routeSources = {
  sellerLeads: "sell_your_home_page",
  buyerInterest: "buy_a_home_page",
  contact: "contact_page",
} as const;

export type RouteSource = (typeof routeSources)[keyof typeof routeSources];
