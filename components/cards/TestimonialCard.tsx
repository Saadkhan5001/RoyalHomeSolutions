import { Quote } from "lucide-react";
import type { Testimonial } from "@/data/testimonials";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

/**
 * A genuine customer testimonial: quote first, author below.
 *
 * Deliberately photo-free — the site has no authorised customer imagery, so an
 * initials monogram stands in for a portrait (see `data/testimonials.ts`).
 * No star rating either: the archived source reviews carry none, and rendering
 * one would be an invented claim.
 */
export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <article className="flex h-full flex-col rounded-3xl bg-neutral-50 p-8 sm:p-10">
      <Quote
        className="h-8 w-8 -scale-x-100 text-brand-yellow"
        aria-hidden="true"
      />

      <blockquote className="mt-6 flex-1 text-base leading-relaxed text-neutral-700 sm:text-lg">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>

      <div className="mt-8 flex items-center gap-3 border-t border-neutral-200 pt-6">
        <span
          className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-brand-yellow/15 text-sm font-semibold text-brand-ink"
          aria-hidden="true"
        >
          {testimonial.initials}
        </span>
        {/* Name only — the archived source carries no role or byline, and
            adding one would be an invented claim (NOD-198). */}
        <p className="text-sm font-semibold text-brand-ink">
          {testimonial.name}
        </p>
      </div>
    </article>
  );
}
