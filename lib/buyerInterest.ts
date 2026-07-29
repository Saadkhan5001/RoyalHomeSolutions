/**
 * Buyer-interest types, options and server-side validation.
 *
 * Mirrors `lib/leads.ts` so the buyer and seller flows behave identically:
 * shared email rules, the same never-trust-the-client posture, and the same
 * human-readable error strings.
 *
 * Deliberately collects no income, assets, debts, SSN or loan documentation.
 * The archived "get pre-qualified" flow implied handing those to a lender;
 * a price-range band captures the same buying-power signal without putting
 * sensitive financial data in an inbox.
 */

import { isValidEmail, MAX_EMAIL_LENGTH } from "@/lib/validation";

export interface BuyerInterest {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  priceRange: string;
  timeline: string;
  /** Slug or title of the home being asked about; empty when none is shown. */
  interestedProperty: string;
  message: string;
}

export interface BuyerInterestSubmission extends BuyerInterest {
  /** Where the enquiry came from, e.g. "buy_a_home_page". */
  source?: string;
}

export const priceRangeOptions = [
  "Under $250,000",
  "$250,000–$400,000",
  "$400,000–$600,000",
  "$600,000+",
  "Not sure yet",
] as const;

export const buyerTimelineOptions = [
  "Ready now",
  "1–3 months",
  "3–6 months",
  "Just exploring",
] as const;

const fieldLimits: Record<keyof BuyerInterest, { label: string; max: number }> =
  {
    firstName: { label: "First name", max: 80 },
    lastName: { label: "Last name", max: 80 },
    phone: { label: "Phone number", max: 25 },
    email: { label: "Email address", max: MAX_EMAIL_LENGTH },
    priceRange: { label: "Price range", max: 40 },
    timeline: { label: "Timeline", max: 40 },
    interestedProperty: { label: "Property", max: 120 },
    message: { label: "Message", max: 2000 },
  };

export type BuyerValidationResult =
  | { ok: true; enquiry: BuyerInterestSubmission }
  | { ok: false; errors: string[] };

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Validates and normalises an untrusted request body into a
 * `BuyerInterestSubmission`. The form's `required` attributes are UX, not a
 * gate — everything is re-checked here.
 */
export function validateBuyerInterest(body: unknown): BuyerValidationResult {
  if (typeof body !== "object" || body === null) {
    return { ok: false, errors: ["Invalid request body."] };
  }

  const raw = body as Record<string, unknown>;
  const errors: string[] = [];

  const enquiry: BuyerInterestSubmission = {
    firstName: asString(raw.firstName),
    lastName: asString(raw.lastName),
    phone: asString(raw.phone),
    email: asString(raw.email).toLowerCase(),
    priceRange: asString(raw.priceRange),
    timeline: asString(raw.timeline),
    interestedProperty: asString(raw.interestedProperty),
    message: asString(raw.message),
    source: asString(raw.source) || undefined,
  };

  if (!enquiry.firstName) errors.push("First name is required.");
  if (!enquiry.lastName) errors.push("Last name is required.");

  if (!enquiry.email) {
    errors.push("Email address is required.");
  } else if (!isValidEmail(enquiry.email)) {
    errors.push("Please enter a valid email address.");
  }

  // Compare on digits so client-side formatting is irrelevant.
  const phoneDigits = enquiry.phone.replace(/\D/g, "");
  if (!phoneDigits) {
    errors.push("Phone number is required.");
  } else if (phoneDigits.length < 10) {
    errors.push("Please enter a valid phone number.");
  }

  if (!enquiry.priceRange) {
    errors.push("Please choose a price range.");
  } else if (
    !priceRangeOptions.includes(
      enquiry.priceRange as (typeof priceRangeOptions)[number],
    )
  ) {
    errors.push("Please choose a valid price range.");
  }

  if (!enquiry.timeline) {
    errors.push("Please tell us your buying timeline.");
  } else if (
    !buyerTimelineOptions.includes(
      enquiry.timeline as (typeof buyerTimelineOptions)[number],
    )
  ) {
    errors.push("Please choose a valid buying timeline.");
  }

  for (const [field, { label, max }] of Object.entries(fieldLimits)) {
    if (enquiry[field as keyof BuyerInterest].length > max) {
      errors.push(`${label} is too long (max ${max} characters).`);
    }
  }

  return errors.length > 0 ? { ok: false, errors } : { ok: true, enquiry };
}
