import Image from "next/image";
import { BedDouble, Bath, Ruler, MapPin } from "lucide-react";
import { formatPrice, type RenovatedHome } from "@/data/inventory";
import { cn } from "@/lib/utils";

interface PropertyCardProps {
  home: RenovatedHome;
  /** Anchor the enquiry CTA scrolls to. */
  formHref?: string;
  className?: string;
}

const statusLabels: Record<RenovatedHome["status"], string> = {
  available: "Available now",
  "under-renovation": "Renovation in progress",
  "under-contract": "Under contract",
  sold: "Sold",
};

const statusStyles: Record<RenovatedHome["status"], string> = {
  available: "bg-brand-green text-white",
  "under-renovation": "bg-brand-yellow text-brand-ink",
  "under-contract": "bg-neutral-800 text-white",
  sold: "bg-neutral-200 text-neutral-600",
};

/**
 * A single company-owned home. Renders only what the data provides — location
 * is general by design (no street address), and price falls back to
 * "Price on request".
 */
export default function PropertyCard({
  home,
  formHref = "#buyer-form",
  className,
}: PropertyCardProps) {
  const specs = [
    { icon: BedDouble, label: `${home.beds} bed${home.beds === 1 ? "" : "s"}` },
    { icon: Bath, label: `${home.baths} bath${home.baths === 1 ? "" : "s"}` },
    { icon: Ruler, label: `${home.sqft.toLocaleString("en-US")} sq ft` },
  ];

  return (
    <article
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white",
        className,
      )}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={home.mainImage}
          alt={`${home.title} — ${home.location}`}
          fill
          sizes="(max-width: 1024px) 90vw, 560px"
          className="object-cover"
        />
        <span
          className={cn(
            "absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold",
            statusStyles[home.status],
          )}
        >
          {statusLabels[home.status]}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <p className="flex items-center gap-1.5 text-sm text-neutral-500">
          <MapPin className="h-4 w-4" aria-hidden="true" />
          {home.location}
        </p>
        <h3 className="mt-2 text-xl font-semibold text-brand-ink">
          {home.title}
        </h3>
        <p className="mt-1 text-lg font-semibold text-brand-ink">
          {formatPrice(home.price)}
        </p>

        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
          {specs.map(({ icon: Icon, label }) => (
            <li
              key={label}
              className="flex items-center gap-1.5 text-sm text-neutral-600"
            >
              <Icon className="h-4 w-4 text-neutral-400" aria-hidden="true" />
              {label}
            </li>
          ))}
        </ul>

        <p className="mt-4 flex-1 text-sm leading-relaxed text-neutral-600">
          {home.shortDescription}
        </p>

        {home.renovationHighlights && home.renovationHighlights.length > 0 && (
          <div className="mt-5 border-t border-neutral-200 pt-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Renovation highlights
            </p>
            <ul className="mt-2 space-y-1">
              {home.renovationHighlights.map((highlight) => (
                <li key={highlight} className="text-sm text-neutral-600">
                  · {highlight}
                </li>
              ))}
            </ul>
          </div>
        )}

        {home.availability && (
          <p className="mt-4 text-sm font-medium text-brand-green">
            {home.availability}
          </p>
        )}

        <a
          href={formHref}
          className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-brand-yellow px-6 py-3 text-sm font-semibold text-brand-ink transition-colors hover:bg-brand-yellow-dark"
        >
          {home.enquiryCta ?? "Ask About This Home"}
        </a>
      </div>
    </article>
  );
}
