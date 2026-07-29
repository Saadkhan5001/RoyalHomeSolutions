/**
 * Seller lead types, options and server-side validation.
 *
 * Lives outside the form component so the client form and the `/api/seller-leads`
 * route validate against exactly the same rules and option list.
 */

import { isValidEmail, MAX_EMAIL_LENGTH } from "@/lib/validation";

/** Shape of a captured seller lead. */
export interface SellerLead {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  propertyAddress: string;
  timeline: string;
  message: string;
}

/** A lead as it arrives at the API, with its capture point attached. */
export interface SellerLeadSubmission extends SellerLead {
  /** Where the lead came from, e.g. "sell_your_home_page". */
  source?: string;
}

export const timelineOptions = [
  "ASAP",
  "1–3 months",
  "3–6 months",
  "Just exploring",
] as const;

/**
 * Field length ceilings — generous for real input, tight enough to stop abuse.
 * Labels are the human-facing names used in error messages.
 */
const fieldLimits: Record<keyof SellerLead, { label: string; max: number }> = {
  firstName: { label: "First name", max: 80 },
  lastName: { label: "Last name", max: 80 },
  phone: { label: "Phone number", max: 25 },
  email: { label: "Email address", max: MAX_EMAIL_LENGTH },
  propertyAddress: { label: "Property address", max: 200 },
  timeline: { label: "Timeline", max: 40 },
  message: { label: "Message", max: 2000 },
};

export type ValidationResult =
  | { ok: true; lead: SellerLeadSubmission }
  | { ok: false; errors: string[] };

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Validates and normalises an untrusted request body into a `SellerLeadSubmission`.
 * Never trusts the client — the form's `required` attributes are UX, not a gate.
 */
export function validateSellerLead(body: unknown): ValidationResult {
  if (typeof body !== "object" || body === null) {
    return { ok: false, errors: ["Invalid request body."] };
  }

  const raw = body as Record<string, unknown>;
  const errors: string[] = [];

  const lead: SellerLeadSubmission = {
    firstName: asString(raw.firstName),
    lastName: asString(raw.lastName),
    phone: asString(raw.phone),
    email: asString(raw.email).toLowerCase(),
    propertyAddress: asString(raw.propertyAddress),
    timeline: asString(raw.timeline),
    message: asString(raw.message),
    source: asString(raw.source) || undefined,
  };

  if (!lead.firstName) errors.push("First name is required.");
  if (!lead.lastName) errors.push("Last name is required.");

  if (!lead.email) {
    errors.push("Email address is required.");
  } else if (!isValidEmail(lead.email)) {
    errors.push("Please enter a valid email address.");
  }

  // Compare on digits so any formatting the client applied is irrelevant.
  const phoneDigits = lead.phone.replace(/\D/g, "");
  if (!phoneDigits) {
    errors.push("Phone number is required.");
  } else if (phoneDigits.length < 10) {
    errors.push("Please enter a valid phone number.");
  }

  if (!lead.propertyAddress) errors.push("Property address is required.");

  if (!lead.timeline) {
    errors.push("Please tell us how soon you're looking to sell.");
  } else if (!timelineOptions.includes(lead.timeline as (typeof timelineOptions)[number])) {
    errors.push("Please choose a valid selling timeline.");
  }

  for (const [field, { label, max }] of Object.entries(fieldLimits)) {
    if (lead[field as keyof SellerLead].length > max) {
      errors.push(`${label} is too long (max ${max} characters).`);
    }
  }

  return errors.length > 0 ? { ok: false, errors } : { ok: true, lead };
}
