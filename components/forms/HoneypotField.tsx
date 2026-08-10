"use client";

import { HONEYPOT_FIELD } from "@/lib/botProtection";

/**
 * Hidden decoy input, submitted with every protected form.
 *
 * Anything that fills it in is not a person, and the server rejects the
 * submission before Resend is touched.
 *
 * Hidden by position rather than `display:none` or the `hidden` attribute:
 * simple form-fillers skip fields the browser reports as hidden, which defeats
 * the point. Kept out of everyone else's way instead —
 *
 *   - `aria-hidden` so screen readers never announce it;
 *   - `tabIndex={-1}` so keyboard navigation skips straight past it;
 *   - a name with no autofill meaning plus `autoComplete="off"`, so password
 *     managers have nothing to offer and won't fill it on a visitor's behalf.
 */
export default function HoneypotField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden opacity-0"
    >
      <label htmlFor={HONEYPOT_FIELD}>Company website</label>
      <input
        id={HONEYPOT_FIELD}
        name={HONEYPOT_FIELD}
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
