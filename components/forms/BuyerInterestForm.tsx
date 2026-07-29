"use client";

import { useState } from "react";
import { Lock, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";
import {
  priceRangeOptions,
  buyerTimelineOptions,
  type BuyerInterest,
} from "@/lib/buyerInterest";
import { cn } from "@/lib/utils";

const emptyEnquiry: BuyerInterest = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  priceRange: "",
  timeline: "",
  interestedProperty: "",
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

interface BuyerInterestFormProps {
  /** Optional id on the card wrapper, used as a scroll anchor target. */
  id?: string;
  className?: string;
  /**
   * Homes currently for sale. When empty the "interested property" select is
   * hidden entirely — there is nothing to choose between.
   */
  propertyOptions?: { id: string; title: string }[];
  /** Pre-selects a property when the visitor arrives from its card. */
  defaultProperty?: string;
  /** Attribution tag on the submitted payload. */
  source?: string;
}

/**
 * Buyer-interest enquiry form.
 *
 * Mirrors `SellerLeadForm`'s behaviour — submitting/success/error states, typed
 * values preserved on failure, Meta Pixel left alone — but collects only what
 * is needed to have a conversation. No income, assets, debts, SSN or loan
 * documentation: a price-range band gives the same buying-power signal without
 * putting sensitive financial data in an inbox.
 */
export default function BuyerInterestForm({
  id,
  className,
  propertyOptions = [],
  defaultProperty = "",
  source,
}: BuyerInterestFormProps) {
  const inputClasses = cn(
    "w-full min-w-0 rounded-xl border px-4 py-3 text-base outline-none transition-colors",
    "border-neutral-300 bg-white text-brand-ink placeholder:text-neutral-400 focus:border-brand-ink",
  );

  const [data, setData] = useState<BuyerInterest>({
    ...emptyEnquiry,
    interestedProperty: defaultProperty,
  });
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const submitted = status === "success";
  const isSubmitting = status === "submitting";

  const update =
    (field: keyof BuyerInterest) =>
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

    try {
      const response = await fetch("/api/buyer-interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, source }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(
          body?.error ?? "We couldn't submit your enquiry. Please try again.",
        );
      }

      setStatus("success");
      setData({ ...emptyEnquiry, interestedProperty: defaultProperty });
    } catch (error) {
      // Values stay in state so nothing needs retyping.
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "We couldn't submit your enquiry. Please try again.",
      );
      setStatus("error");
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
        Join the buyer list
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-neutral-600">
        Tell us what you&apos;re looking for and we&apos;ll be in touch when a
        home matches.
      </p>

      {submitted ? (
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-brand-green/30 bg-brand-green/10 p-5">
          <CheckCircle2
            className="mt-0.5 h-6 w-6 flex-shrink-0 text-brand-green"
            aria-hidden="true"
          />
          <div>
            <p className="font-semibold text-brand-ink">
              Thanks — we&apos;ll be in touch.
            </p>
            <p className="mt-1 text-sm text-neutral-600">
              A member of our team will review your details and reach out.
            </p>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="mt-3 text-sm font-semibold text-brand-ink underline underline-offset-4 hover:no-underline"
            >
              Send another enquiry
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-3.5">
          {status === "error" && errorMessage && (
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-xl border border-red-300 bg-red-50 p-3.5 text-sm text-red-800"
            >
              <AlertCircle
                className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-600"
                aria-hidden="true"
              />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="grid gap-3.5 sm:grid-cols-2">
            <div>
              <label htmlFor="buyerFirstName" className="sr-only">
                First name
              </label>
              <input
                id="buyerFirstName"
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
              <label htmlFor="buyerLastName" className="sr-only">
                Last name
              </label>
              <input
                id="buyerLastName"
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
              <label htmlFor="buyerPhone" className="sr-only">
                Phone
              </label>
              <input
                id="buyerPhone"
                name="phone"
                type="tel"
                inputMode="numeric"
                required
                autoComplete="tel"
                maxLength={14}
                placeholder="(000) 000-0000 *"
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
              <label htmlFor="buyerEmail" className="sr-only">
                Email address
              </label>
              <input
                id="buyerEmail"
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
            <label htmlFor="buyerPriceRange" className="sr-only">
              Price range
            </label>
            <select
              id="buyerPriceRange"
              name="priceRange"
              required
              value={data.priceRange}
              onChange={update("priceRange")}
              className={cn(
                inputClasses,
                data.priceRange === "" && "text-neutral-400",
              )}
            >
              <option value="" disabled>
                Price range *
              </option>
              {priceRangeOptions.map((option) => (
                <option key={option} value={option} className="text-brand-ink">
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="buyerTimeline" className="sr-only">
              How soon are you looking to buy?
            </label>
            <select
              id="buyerTimeline"
              name="timeline"
              required
              value={data.timeline}
              onChange={update("timeline")}
              className={cn(
                inputClasses,
                data.timeline === "" && "text-neutral-400",
              )}
            >
              <option value="" disabled>
                How soon are you looking to buy? *
              </option>
              {buyerTimelineOptions.map((option) => (
                <option key={option} value={option} className="text-brand-ink">
                  {option}
                </option>
              ))}
            </select>
          </div>

          {/* Only rendered when there is inventory to choose between. */}
          {propertyOptions.length > 0 && (
            <div>
              <label htmlFor="buyerProperty" className="sr-only">
                Which home are you interested in?
              </label>
              <select
                id="buyerProperty"
                name="interestedProperty"
                value={data.interestedProperty}
                onChange={update("interestedProperty")}
                className={cn(
                  inputClasses,
                  data.interestedProperty === "" && "text-neutral-400",
                )}
              >
                <option value="">
                  Which home are you interested in? (optional)
                </option>
                {propertyOptions.map((option) => (
                  <option
                    key={option.id}
                    value={option.title}
                    className="text-brand-ink"
                  >
                    {option.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label htmlFor="buyerMessage" className="sr-only">
              Message (optional)
            </label>
            <textarea
              id="buyerMessage"
              name="message"
              rows={3}
              placeholder="Anything else we should know? (optional)"
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
              "Join the Buyer List"
            )}
          </Button>

          <p className="flex items-start justify-center gap-2 text-xs leading-relaxed text-neutral-500">
            <Lock
              className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-neutral-500"
              aria-hidden="true"
            />
            We&apos;ll review your information and reach out shortly. There is
            no obligation, and your details will only be used to respond to your
            enquiry.
          </p>
        </form>
      )}
    </div>
  );
}
