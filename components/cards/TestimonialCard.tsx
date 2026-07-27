import Image from "next/image";
import { Check } from "lucide-react";
import StarRating from "@/components/ui/StarRating";
import type { Testimonial } from "@/data/testimonials";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

/**
 * A customer testimonial: author and rating on top, the quote in the middle,
 * and the related property below a divider.
 */
export default function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <article className="flex h-full min-h-[260px] flex-col rounded-3xl bg-neutral-50 p-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-full">
            <Image
              src={testimonial.avatar}
              alt={`Portrait of ${testimonial.name}`}
              fill
              sizes="44px"
              className="object-cover"
            />
          </span>
          <div>
            <p className="text-sm font-semibold text-brand-ink">
              {testimonial.name}
            </p>
            <p className="text-xs text-neutral-500">{testimonial.role}</p>
          </div>
        </div>
        <StarRating rating={testimonial.rating} className="mt-1" />
      </div>

      <blockquote className="mt-7 flex-1 text-base leading-relaxed text-neutral-700">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>

      <div className="mt-7 border-t border-neutral-200 pt-5">
        <p className="font-semibold text-brand-ink">{testimonial.propertyName}</p>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-neutral-500">
          <Check className="h-4 w-4 text-brand-green" aria-hidden="true" />
          {testimonial.propertyAddress}
        </p>
      </div>
    </article>
  );
}
