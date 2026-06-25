import Image from "next/image";
import { BedDouble, Bath, Maximize } from "lucide-react";
import type { Property } from "@/data/properties";
import { formatPrice } from "@/lib/utils";

interface PropertyCardProps {
  property: Property;
}

/**
 * A single listing card: rounded image with a status badge, then price,
 * name, address, and the key specs row.
 */
export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white transition-shadow duration-300 hover:shadow-xl">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={property.image}
          alt={property.imageAlt}
          fill
          sizes="(max-width: 768px) 80vw, (max-width: 1280px) 33vw, 360px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full bg-brand-green px-3 py-1 text-xs font-semibold text-white shadow-sm">
          {property.status}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-lg font-bold text-brand-ink">
          {formatPrice(property.price)}
        </p>
        <h3 className="mt-2 text-xl font-semibold text-brand-ink">
          {property.name}
        </h3>
        <p className="mt-1 text-sm text-neutral-500">{property.address}</p>

        <div className="mt-5 flex items-center gap-4 border-t border-neutral-100 pt-4 text-sm text-neutral-600">
          <span className="flex items-center gap-1.5">
            <BedDouble className="h-4 w-4 text-neutral-400" aria-hidden="true" />
            {property.bedrooms} Bedroom
          </span>
          <span className="flex items-center gap-1.5">
            <Bath className="h-4 w-4 text-neutral-400" aria-hidden="true" />
            {property.bathrooms} Bathroom
          </span>
          <span className="flex items-center gap-1.5">
            <Maximize className="h-4 w-4 text-neutral-400" aria-hidden="true" />
            {property.area}m²
          </span>
        </div>
      </div>
    </article>
  );
}
