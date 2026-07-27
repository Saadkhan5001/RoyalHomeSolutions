import { cn } from "@/lib/utils";
import type { ValueFeature } from "@/data/valueFeatures";

interface ValueCardProps {
  feature: ValueFeature;
  /** Extra classes from the parent (e.g. `flex-1` to fill a column). */
  className?: string;
}

/**
 * A feature card with an accent icon badge. Matches the bordered card style
 * used across the site (e.g. the "Homeowners we can help" grid) so sections
 * feel like one system.
 */
export default function ValueCard({ feature, className }: ValueCardProps) {
  const { icon: Icon, title, description } = feature;
  return (
    <div
      className={cn(
        "flex flex-col rounded-3xl border border-neutral-200 bg-white p-6 transition-shadow duration-300 hover:shadow-lg",
        className,
      )}
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-yellow/15">
        <Icon className="h-6 w-6 text-brand-ink" aria-hidden="true" />
      </span>
      <h3 className="mt-5 text-lg font-semibold text-brand-ink">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-neutral-500">
        {description}
      </p>
    </div>
  );
}
