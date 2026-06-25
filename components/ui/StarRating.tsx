import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  /** Rating out of 5; halves are rendered with a half-star. */
  rating: number;
  className?: string;
}

/**
 * Green star rating used in testimonial cards. Renders full and half stars
 * up to 5 and exposes an accessible label.
 */
export default function StarRating({ rating, className }: StarRatingProps) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;

  return (
    <div
      className={cn("flex items-center gap-0.5", className)}
      aria-label={`Rated ${rating} out of 5`}
      role="img"
    >
      {Array.from({ length: 5 }).map((_, i) => {
        if (i < full) {
          return (
            <Star
              key={i}
              className="h-4 w-4 fill-brand-green text-brand-green"
              aria-hidden="true"
            />
          );
        }
        if (i === full && hasHalf) {
          return (
            <StarHalf
              key={i}
              className="h-4 w-4 fill-brand-green text-brand-green"
              aria-hidden="true"
            />
          );
        }
        return (
          <Star key={i} className="h-4 w-4 text-neutral-300" aria-hidden="true" />
        );
      })}
    </div>
  );
}
