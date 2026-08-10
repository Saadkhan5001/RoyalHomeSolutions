"use client";

import { useState } from "react";
import { Lock, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";
import HoneypotField from "@/components/forms/HoneypotField";
import TurnstileWidget from "@/components/forms/TurnstileWidget";
import {
  useFormProtection,
  verificationMessage,
} from "@/components/forms/useFormProtection";
import { inquiryTypes, type ContactEnquiry } from "@/lib/contact";
import { turnstileActions } from "@/lib/turnstileActions";
import { cn } from "@/lib/utils";

const emptyEnquiry: ContactEnquiry = {
  name: "",
  email: "",
  phone: "",
  inquiryType: "",
  message: "",
};

/** Formats a US phone number as the user types: (000) 000-0000. */
function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length === 0) return "";
  if (digits.length < 4) return `(${digits}`;
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

interface GeneralContactFormProps {
  id?: string;
  className?: string;
  /** Preselects the inquiry type, e.g. from `/contact?type=buying`. */
  defaultInquiryType?: string;
}

/**
 * General enquiry form for the /contact page.
 *
 * Behaviour matches `SellerLeadForm` and `BuyerInterestForm` — submitting /
 * success / error states, and typed values preserved on failure so nothing is
 * retyped. Two deliberate differences:
 *
 *   - Labels are visible rather than `sr-only`. The other two forms sit inside
 *     dense hero cards where placeholders carry the labelling; this page has
 *     room, and a form serving realtors and partners reads better labelled.
 *   - Phone is optional, so it is marked "(optional)" rather than "*".
 *
 * No Meta Pixel event fires here. The Pixel `Lead` conversion is tuned to the
 * seller funnel; firing it for a vendor enquiry would pollute that signal.
 */
export default function GeneralContactForm({
  id,
  className,
  defaultInquiryType = "",
}: GeneralContactFormProps) {
  const inputClasses = cn(
    "w-full min-w-0 rounded-xl border px-4 py-3 text-base outline-none transition-colors",
    "border-neutral-300 bg-white text-brand-ink placeholder:text-neutral-400 focus:border-brand-ink",
  );
  const labelClasses = "mb-1.5 block text-sm font-medium text-brand-ink";

  const [data, setData] = useState<ContactEnquiry>({
    ...emptyEnquiry,
    inquiryType: defaultInquiryType,
  });
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<string[]>([]);
  const {
    turnstileRef,
    honeypot,
    setHoneypot,
    activate,
    collect,
    reset: resetProtection,
  } = useFormProtection();

  const submitted = status === "success";
  const isSubmitting = status === "submitting";

  const update =
    (field: keyof ContactEnquiry) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) =>
      setData((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setStatus("submitting");
    setErrorMessage("");
    setFieldErrors([]);

    // Honeypot value, fill duration and the Turnstile token. All three are
    // re-checked server-side — this only gathers them. `collect()` already
    // waited for a challenge in progress, so no token here means it either
    // needs the visitor or couldn't load at all.
    const { hasToken, verificationBlocked, ...protection } = await collect();

    if (!hasToken) {
      setErrorMessage(verificationMessage(verificationBlocked));
      setStatus("error");
      resetProtection();
      return;
    }

    try {
      // No `source`: attribution is assigned by the route, not claimed here.
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, ...protection }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        // The route returns every validation failure, not just the first, so
        // a visitor with two problems fixes both in one pass.
        if (Array.isArray(body?.errors)) setFieldErrors(body.errors);
        throw new Error(
          body?.error ?? "We couldn't send your message. Please try again.",
        );
      }

      setStatus("success");
      setData({ ...emptyEnquiry, inquiryType: defaultInquiryType });
    } catch (error) {
      // Values stay in state so nothing needs retyping.
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "We couldn't send your message. Please try again.",
      );
      setStatus("error");
    } finally {
      // A Turnstile token is single-use either way — success or failure, the
      // next submission needs a fresh one.
      resetProtection();
    }
  };

  return (
    <div
      id={id}
      className={cn(
        "w-full rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8",
        className,
      )}
    >
      <h2 className="text-2xl font-semibold tracking-tight text-brand-ink">
        Send us a message
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-neutral-600">
        Tell us a little about what you need and we&apos;ll get back to you.
      </p>

      {submitted ? (
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-brand-green/30 bg-brand-green/10 p-5">
          <CheckCircle2
            className="mt-0.5 h-6 w-6 flex-shrink-0 text-brand-green"
            aria-hidden="true"
          />
          <div>
            <p className="font-semibold text-brand-ink">
              Thanks — your message is on its way.
            </p>
            <p className="mt-1 text-sm text-neutral-600">
              We&apos;ve sent a copy to your email. Someone will get back to you.
            </p>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="mt-3 text-sm font-semibold text-brand-ink underline underline-offset-4 hover:no-underline"
            >
              Send another message
            </button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          // Loads the Turnstile challenge on first interaction rather than on
          // page load, so it is ready by the time anyone reaches Submit.
          onFocus={activate}
          className="relative mt-6 space-y-4"
          noValidate
        >
          {status === "error" && errorMessage && (
            <div
              role="alert"
              className="rounded-xl border border-red-300 bg-red-50 p-3.5 text-sm text-red-800"
            >
              <div className="flex items-start gap-2.5">
                <AlertCircle
                  className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-600"
                  aria-hidden="true"
                />
                <span>{errorMessage}</span>
              </div>
              {fieldErrors.length > 1 && (
                <ul className="mt-2 list-disc space-y-1 pl-9">
                  {fieldErrors.slice(1).map((err) => (
                    <li key={err}>{err}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <div>
            <label htmlFor="contactName" className={labelClasses}>
              Name <span aria-hidden="true">*</span>
            </label>
            <input
              id="contactName"
              name="name"
              type="text"
              required
              autoComplete="name"
              placeholder="Your full name"
              value={data.name}
              onChange={update("name")}
              className={inputClasses}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="contactEmail" className={labelClasses}>
                Email <span aria-hidden="true">*</span>
              </label>
              <input
                id="contactEmail"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                value={data.email}
                onChange={update("email")}
                className={inputClasses}
              />
            </div>
            <div>
              <label htmlFor="contactPhone" className={labelClasses}>
                Phone{" "}
                <span className="font-normal text-neutral-500">(optional)</span>
              </label>
              <input
                id="contactPhone"
                name="phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                maxLength={14}
                placeholder="(000) 000-0000"
                value={data.phone}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    phone: formatPhone(e.target.value),
                  }))
                }
                className={inputClasses}
              />
            </div>
          </div>

          <div>
            <label htmlFor="contactType" className={labelClasses}>
              What is this about? <span aria-hidden="true">*</span>
            </label>
            <select
              id="contactType"
              name="inquiryType"
              required
              value={data.inquiryType}
              onChange={update("inquiryType")}
              className={cn(
                inputClasses,
                data.inquiryType === "" && "text-neutral-400",
              )}
            >
              <option value="" disabled>
                Choose one
              </option>
              {inquiryTypes.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  className="text-brand-ink"
                >
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="contactMessage" className={labelClasses}>
              Message <span aria-hidden="true">*</span>
            </label>
            <textarea
              id="contactMessage"
              name="message"
              rows={5}
              required
              placeholder="How can we help?"
              value={data.message}
              onChange={update("message")}
              className={cn(inputClasses, "resize-none")}
            />
          </div>

          <HoneypotField value={honeypot} onChange={setHoneypot} />

          {/* Renders nothing unless Cloudflare decides a human check is needed.
              Auto-activated: this is a conversion path, so the challenge is
              warm before anyone can reach the button. */}
          <TurnstileWidget
            ref={turnstileRef}
            action={turnstileActions.contact}
            theme="light"
            autoActivate
            className="empty:hidden"
          />

          <Button
            type="submit"
            variant="yellow"
            withArrow={!isSubmitting}
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Sending…
              </>
            ) : (
              "Send Message"
            )}
          </Button>

          <p className="flex items-start justify-center gap-2 text-xs leading-relaxed text-neutral-500">
            <Lock
              className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-neutral-500"
              aria-hidden="true"
            />
            Your details are only used to respond to your enquiry. We do not
            sell the information you submit.
          </p>
        </form>
      )}
    </div>
  );
}
