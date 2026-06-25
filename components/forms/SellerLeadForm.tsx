"use client";

import { useState } from "react";
import { Lock, CheckCircle2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/** Shape of a captured seller lead. Ready to POST to an API later. */
export interface SellerLead {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  propertyAddress: string;
  timeline: string;
  message: string;
}

const emptyLead: SellerLead = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  propertyAddress: "",
  timeline: "",
  message: "",
};

const timelineOptions = ["ASAP", "1–3 months", "3–6 months", "Just exploring"];

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
  },
};

export default function SellerLeadForm({
  id,
  variant = "page",
  className,
}: SellerLeadFormProps) {
  const s = variantStyles[variant];
  const inputClasses = cn(
    "w-full min-w-0 rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors",
    s.input
  );

  const [data, setData] = useState<SellerLead>(emptyLead);
  const [submitted, setSubmitted] = useState(false);

  const update =
    (field: keyof SellerLead) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) =>
      setData((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Format the submitted data into a clean object for later use.
    const lead: SellerLead = { ...data };

    // TODO: Replace this with a real API/database call, e.g.
    //   await fetch("/api/seller-leads", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(lead),
    //   });
    console.log("Seller lead submitted:", lead);

    setSubmitted(true);
    setData(emptyLead);
  };

  return (
    <div
      id={id}
      className={cn("w-full rounded-3xl p-6 sm:p-7", s.card, className)}
    >
      {variant === "hero" && (
        <span className="mb-3 inline-flex items-center rounded-full border border-brand-yellow/40 bg-brand-yellow/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-yellow">
          Free Home Review
        </span>
      )}

      <h2
        className={cn(
          "text-2xl font-semibold tracking-tight",
          s.heading
        )}
      >
        Need to sell your home quickly?
      </h2>
      <p className={cn("mt-2 text-sm leading-relaxed", s.sub)}>
        Tell us a little about your property and our team will get back to you
        with the next step.
      </p>

      {submitted ? (
        <div
          className={cn(
            "mt-6 flex items-start gap-3 rounded-2xl border p-5",
            s.success
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
              onClick={() => setSubmitted(false)}
              className={cn(
                "mt-3 text-sm font-semibold underline underline-offset-4 hover:no-underline",
                s.secondaryBtn
              )}
            >
              Submit another property
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-3.5">
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
              className={cn(inputClasses, data.timeline === "" && s.placeholder)}
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

          <Button type="submit" variant="yellow" withArrow className="w-full">
            Get My Free Home Review
          </Button>

          <p
            className={cn(
              "flex items-center justify-center gap-2 text-xs",
              s.privacy
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
