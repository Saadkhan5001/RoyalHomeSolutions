"use client";

import { useState } from "react";
import { Lock, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { trackLead } from "@/lib/metaPixel";
import { timelineOptions, type SellerLead } from "@/lib/leads";
import { cn } from "@/lib/utils";

export type { SellerLead };

const emptyLead: SellerLead = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  propertyAddress: "",
  timeline: "",
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

type Variant = "hero" | "page";

interface SellerLeadFormProps {
  /** Optional id on the card wrapper, used as a scroll anchor target. */
  id?: string;
  /** "hero" = dark frosted glass for use over imagery; "page" = light card. */
  variant?: Variant;
  className?: string;
  /** Overridable copy so the same form can be reused across pages. */
  heading?: string;
  subheading?: string;
  submitLabel?: string;
  /** Small pill shown above the heading on the hero variant. */
  eyebrow?: string;
  /** Where the lead came from, attached to the submitted payload for later
   * attribution (e.g. "sell_your_home_page"). */
  source?: string;
}

/** Per-variant class tokens so the markup stays single-source. */
const variantStyles: Record<
  Variant,
  {
    card: string;
    heading: string;
    sub: string;
    input: string;
    placeholder: string;
    privacy: string;
    lock: string;
    secondaryBtn: string;
    success: string;
    successTitle: string;
    successText: string;
    error: string;
    errorIcon: string;
  }
> = {
  hero: {
    card: "border border-white/15 bg-neutral-950/30 shadow-xl backdrop-blur-xl",
    heading: "text-white",
    sub: "text-white/70",
    input:
      "border-white/15 bg-white/10 text-white placeholder:text-white/55 focus:border-yellow-300 focus:ring-2 focus:ring-yellow-300/30",
    placeholder: "text-white/55",
    privacy: "text-white/70",
    lock: "text-brand-yellow",
    secondaryBtn: "text-white",
    success: "border-white/15 bg-white/10",
    successTitle: "text-white",
    successText: "text-white/70",
    error: "border-red-400/40 bg-red-500/15 text-red-50",
    errorIcon: "text-red-300",
  },
  page: {
    card: "border border-white/60 bg-white/85 shadow-2xl backdrop-blur-md",
    heading: "text-brand-ink",
    sub: "text-neutral-600",
    input:
      "border-neutral-300 bg-white/80 text-brand-ink placeholder:text-neutral-400 focus:border-brand-ink",
    placeholder: "text-neutral-400",
    privacy: "text-neutral-500",
    lock: "text-neutral-500",
    secondaryBtn: "text-brand-ink",
    success: "border-brand-green/30 bg-brand-green/10",
    successTitle: "text-brand-ink",
    successText: "text-neutral-600",
    error: "border-red-300 bg-red-50 text-red-800",
    errorIcon: "text-red-600",
  },
};

export default function SellerLeadForm({
  id,
  variant = "page",
  className,
  heading = "Want to sell your home quickly?",
  subheading = "Share a few details and our team will contact you with the next step.",
  submitLabel = "Get My Free Cash Offer",
  eyebrow = "Free Cash Offer",
  source,
}: SellerLeadFormProps) {
  const s = variantStyles[variant];
  // text-base (16px) keeps iOS from auto-zooming on focus; roomy padding keeps
  // inputs comfortably tappable on mobile ad traffic.
  const inputClasses = cn(
    "w-full min-w-0 rounded-xl border px-4 py-3 text-base outline-none transition-colors",
    s.input,
  );

  const [data, setData] = useState<SellerLead>(emptyLead);
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const submitted = status === "success";
  const isSubmitting = status === "submitting";

  const update =
    (field: keyof SellerLead) =>
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

    // `source` tags which page/entry point captured the lead for attribution.
    const lead = { ...data, source };

    try {
      const response = await fetch("/api/seller-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(
          body?.error ?? "We couldn't submit your details. Please try again.",
        );
      }

      // Meta Pixel: standard Lead event, fired only once the submit succeeds.
      // TODO: Mirror this with the Conversions API (server-side) from the route
      // handler, using a shared event_id for deduplication.
      trackLead();

      setStatus("success");
      setData(emptyLead);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "We couldn't submit your details. Please try again.",
      );
      setStatus("error");
    }
  };

  return (
    <div
      id={id}
      className={cn("w-full rounded-3xl p-6 sm:p-7", s.card, className)}
    >
      {variant === "hero" && (
        <span className="mb-3 inline-flex items-center rounded-full border border-brand-yellow/40 bg-brand-yellow/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-yellow">
          {eyebrow}
        </span>
      )}

      <h2 className={cn("text-2xl font-semibold tracking-tight", s.heading)}>
        {heading}
      </h2>
      <p className={cn("mt-2 text-sm leading-relaxed", s.sub)}>{subheading}</p>

      {submitted ? (
        <div
          className={cn(
            "mt-6 flex items-start gap-3 rounded-2xl border p-5",
            s.success,
          )}
        >
          <CheckCircle2
            className="mt-0.5 h-6 w-6 flex-shrink-0 text-brand-green"
            aria-hidden="true"
          />
          <div>
            <p className={cn("font-semibold", s.successTitle)}>
              Thanks — we&apos;ll be in touch shortly.
            </p>
            <p className={cn("mt-1 text-sm", s.successText)}>
              A member of our team will review your details and reach out with
              your free home review.
            </p>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className={cn(
                "mt-3 text-sm font-semibold underline underline-offset-4 hover:no-underline",
                s.secondaryBtn,
              )}
            >
              Submit another property
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-3.5">
          {status === "error" && errorMessage && (
            <div
              role="alert"
              className={cn(
                "flex items-start gap-2.5 rounded-xl border p-3.5 text-sm",
                s.error,
              )}
            >
              <AlertCircle
                className={cn("mt-0.5 h-4 w-4 flex-shrink-0", s.errorIcon)}
                aria-hidden="true"
              />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="grid gap-3.5 sm:grid-cols-2">
            <div>
              <label htmlFor="firstName" className="sr-only">
                First name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                autoComplete="given-name"
                placeholder="First name *"
                value={data.firstName}
                onChange={update("firstName")}
                className={inputClasses}
              />
            </div>
            <div>
              <label htmlFor="lastName" className="sr-only">
                Last name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                autoComplete="family-name"
                placeholder="Last name *"
                value={data.lastName}
                onChange={update("lastName")}
                className={inputClasses}
              />
            </div>
          </div>

          <div className="grid gap-3.5 sm:grid-cols-2">
            <div>
              <label htmlFor="phone" className="sr-only">
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                inputMode="numeric"
                required
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
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="Email address *"
                value={data.email}
                onChange={update("email")}
                className={inputClasses}
              />
            </div>
          </div>

          <div>
            <label htmlFor="propertyAddress" className="sr-only">
              Property address
            </label>
            <input
              id="propertyAddress"
              name="propertyAddress"
              type="text"
              required
              autoComplete="street-address"
              placeholder="Property address *"
              value={data.propertyAddress}
              onChange={update("propertyAddress")}
              className={inputClasses}
            />
          </div>

          <div>
            <label htmlFor="timeline" className="sr-only">
              How soon are you looking to sell?
            </label>
            <select
              id="timeline"
              name="timeline"
              required
              value={data.timeline}
              onChange={update("timeline")}
              className={cn(
                inputClasses,
                data.timeline === "" && s.placeholder,
              )}
            >
              <option value="" disabled>
                How soon are you looking to sell? *
              </option>
              {timelineOptions.map((option) => (
                <option key={option} value={option} className="text-brand-ink">
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="message" className="sr-only">
              Message (optional)
            </label>
            <textarea
              id="message"
              name="message"
              rows={3}
              placeholder="Message (optional)"
              value={data.message}
              onChange={update("message")}
              className={cn(inputClasses, "resize-none")}
            />
          </div>

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
              submitLabel
            )}
          </Button>

          <p
            className={cn(
              "flex items-center justify-center gap-2 text-xs",
              s.privacy,
            )}
          >
            <Lock className={cn("h-3.5 w-3.5", s.lock)} aria-hidden="true" />
            We respect your privacy. Your information is never shared.
          </p>
        </form>
      )}
    </div>
  );
}
