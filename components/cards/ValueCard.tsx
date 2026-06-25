import type { ValueFeature } from "@/data/valueFeatures";

interface ValueCardProps {
  feature: ValueFeature;
}

/**
 * A soft grey feature card with a top icon, used in the value grid.
 */
export default function ValueCard({ feature }: ValueCardProps) {
  const { icon: Icon, title, description } = feature;
  return (
    <div className="rounded-3xl bg-neutral-50 p-6 transition-colors duration-200 hover:bg-neutral-100">
      <Icon className="h-7 w-7 text-brand-ink" aria-hidden="true" />
      <h3 className="mt-4 text-lg font-semibold text-brand-ink">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-neutral-500">
        {description}
      </p>
    </div>
  );
}
