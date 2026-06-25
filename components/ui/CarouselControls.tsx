"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CarouselControlsProps {
  onPrev: () => void;
  onNext: () => void;
  variant?: "outline" | "yellow";
  className?: string;
  prevDisabled?: boolean;
  nextDisabled?: boolean;
}

/**
 * A pair of circular previous/next buttons used by the listing and process
 * carousels.
 */
export default function CarouselControls({
  onPrev,
  onNext,
  variant = "outline",
  className,
  prevDisabled = false,
  nextDisabled = false,
}: CarouselControlsProps) {
  const base =
    "flex h-12 w-12 items-center justify-center rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40";

  const styles =
    variant === "yellow"
      ? "bg-brand-yellow text-brand-ink hover:bg-brand-yellow-dark"
      : "border border-neutral-300 text-brand-ink hover:border-brand-ink hover:bg-brand-ink hover:text-white";

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <button
        type="button"
        onClick={onPrev}
        disabled={prevDisabled}
        aria-label="Previous"
        className={cn(base, styles)}
      >
        <ArrowLeft className="h-5 w-5" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={nextDisabled}
        aria-label="Next"
        className={cn(base, styles)}
      >
        <ArrowRight className="h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  );
}
