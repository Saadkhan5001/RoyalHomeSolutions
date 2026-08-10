/**
 * General-contact types, options and server-side validation.
 *
 * Mirrors `lib/leads.ts` and `lib/buyerInterest.ts` so all three flows behave
 * identically: shared email rules via `lib/validation`, the same
 * never-trust-the-client posture, and the same human-readable error strings.
 *
 * This is the catch-all route for people who are not in the seller funnel —
 * buyers, realtors, investors, partners, vendors and general questions. The
 * seller-specific form at /sell-your-home is unchanged and remains the
 * conversion path for homeowners wanting an offer.
 *
 * Phone is OPTIONAL here, unlike the seller and buyer forms. Those exist to
 * start a phone conversation about a specific property; a realtor asking a
 * general question should not be forced to hand over a number.
 */

import { isValidEmail, MAX_EMAIL_LENGTH } from "@/lib/validation";

export interface ContactEnquiry {
  name: string;
  email: string;
  /** Optional — see the note above. */
  phone: string;
  inquiryType: string;
  message: string;
}

export interface ContactSubmission extends ContactEnquiry {
  /**
   * Where the enquiry came from, e.g. "contact_page". Assigned by the route
   * from `lib/formSources.ts` — never parsed out of the request body.
   */
  source?: string;
  /** Server-stamped ISO timestamp, set in the API route. */
  submittedAt?: string;
}

/**
 * Inquiry types offered in the form's select.
 *
 * The values double as the query-parameter values accepted by /contact
 * (`/contact?type=buying`), so a link from elsewhere on the site can preselect
 * the right option. Keep `value` URL-safe and stable — changing one silently
 * breaks any existing link that uses it.
 */
export const inquiryTypes = [
  { value: "selling", label: "Selling a property" },
  { value: "buying", label: "Buying a property" },
  { value: "realtor", label: "Realtor or professional partnership" },
  { value: "investment", label: "Investment or business inquiry" },
  { value: "general", label: "General question" },
] as const;

export type InquiryTypeValue = (typeof inquiryTypes)[number]["value"];

const inquiryValues = inquiryTypes.map((t) => t.value) as readonly string[];

/** Resolves a `?type=` query value to a valid option, or "" if unrecognised. */
export function resolveInquiryType(raw: string | undefined): string {
  if (!raw) return "";
  return inquiryValues.includes(raw) ? raw : "";
}

/** Human label for a stored value, for use in emails. Falls back to the raw value. */
export function inquiryTypeLabel(value: string): string {
  return inquiryTypes.find((t) => t.value === value)?.label ?? value;
}

const fieldLimits: Record<keyof ContactEnquiry, { label: string; max: number }> =
  {
    name: { label: "Name", max: 120 },
    email: { label: "Email address", max: MAX_EMAIL_LENGTH },
    phone: { label: "Phone number", max: 25 },
    inquiryType: { label: "Inquiry type", max: 40 },
    message: { label: "Message", max: 4000 },
  };

export type ContactValidationResult =
  | { ok: true; enquiry: ContactSubmission }
  | { ok: false; errors: string[] };

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Validates and normalises an untrusted request body into a
 * `ContactSubmission`. The form's `required` attributes are UX, not a gate —
 * everything is re-checked here.
 */
export function validateContactEnquiry(body: unknown): ContactValidationResult {
  if (typeof body !== "object" || body === null) {
    return { ok: false, errors: ["Invalid request body."] };
  }

  const raw = body as Record<string, unknown>;
  const errors: string[] = [];

  const enquiry: ContactSubmission = {
    name: asString(raw.name),
    email: asString(raw.email).toLowerCase(),
    phone: asString(raw.phone),
    inquiryType: asString(raw.inquiryType),
    message: asString(raw.message),
    // `source` is deliberately absent: the route owns it.
  };

  if (!enquiry.name) errors.push("Name is required.");

  if (!enquiry.email) {
    errors.push("Email address is required.");
  } else if (!isValidEmail(enquiry.email)) {
    errors.push("Please enter a valid email address.");
  }

  // Optional, but if supplied it has to be plausible — otherwise the team gets
  // a number they cannot call. Compared on digits so formatting is irrelevant.
  if (enquiry.phone) {
    const digits = enquiry.phone.replace(/\D/g, "");
    if (digits.length < 10) {
      errors.push("Please enter a valid phone number, or leave it blank.");
    }
  }

  if (!enquiry.inquiryType) {
    errors.push("Please choose what your enquiry is about.");
  } else if (!inquiryValues.includes(enquiry.inquiryType)) {
    errors.push("Please choose a valid inquiry type.");
  }

  if (!enquiry.message) errors.push("Please include a message.");

  for (const [field, { label, max }] of Object.entries(fieldLimits)) {
    if (enquiry[field as keyof ContactEnquiry].length > max) {
      errors.push(`${label} is too long (max ${max} characters).`);
    }
  }

  return errors.length > 0 ? { ok: false, errors } : { ok: true, enquiry };
}
