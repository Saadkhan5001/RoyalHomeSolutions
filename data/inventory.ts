/**
 * Homes Royal Home Solutions owns and has renovated, offered for sale on
 * `/buy-a-home`.
 *
 * This is **company-owned inventory**, not a listings catalog — Royal Home
 * Solutions is not a brokerage and does not list third-party properties. The
 * business carries one or two renovated homes at a time, so `MAX_DISPLAYED`
 * caps what the page renders regardless of what is in the array.
 *
 * ⚠️ Never add a speculative entry here. Every field must come from the client:
 * real title, real location, real specs, real photos the company owns. An empty
 * array renders an honest "no homes currently available" state, which is
 * correct and preferable to an invented one.
 */

export type PropertyStatus =
  /** Renovated, ready, and for sale now. */
  | "available"
  /** Owned and being renovated — shown as "coming soon". */
  | "under-renovation"
  /** Buyer found, sale in progress. */
  | "under-contract"
  /** Kept briefly as proof of work, then removed. */
  | "sold";

export interface RenovatedHome {
  /** URL-safe slug, also the React key. */
  id: string;
  title: string;
  /**
   * General location only, e.g. "Oakland Park, FL". Full street addresses are
   * deliberately not published — vacant renovated homes are a theft target,
   * and the exact address belongs in the enquiry conversation.
   */
  location: string;
  /** Omit or set null to display "Price on request". */
  price?: number | null;
  beds: number;
  /** Supports halves, e.g. 2.5. */
  baths: number;
  sqft: number;
  status: PropertyStatus;
  /** Local path under /public. Owned photography only — never stock. */
  mainImage: string;
  gallery?: string[];
  shortDescription: string;
  /** e.g. "New roof (2026)", "Updated electrical throughout". */
  renovationHighlights?: string[];
  /** Free-text availability note, e.g. "Move-in ready now". */
  availability?: string;
  /** Overrides the default "Ask About This Home" button label. */
  enquiryCta?: string;
}

/** Hard ceiling on what the page renders — the business sells 1–2 at a time. */
export const MAX_DISPLAYED = 2;

/**
 * Currently empty: no property has been confirmed available by the client.
 * Populate only with client-supplied details and owned photography.
 */
export const inventory: RenovatedHome[] = [];

/** Homes a buyer can act on now, capped at the display limit. */
export const availableHomes: RenovatedHome[] = inventory
  .filter(
    (home) => home.status === "available" || home.status === "under-renovation",
  )
  .slice(0, MAX_DISPLAYED);

/** Formats price for display, falling back to the on-request label. */
export function formatPrice(price?: number | null): string {
  if (price == null) return "Price on request";
  return `$${price.toLocaleString("en-US")}`;
}
