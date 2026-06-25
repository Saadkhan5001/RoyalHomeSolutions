"use client";

import { useRef } from "react";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";
import CarouselControls from "@/components/ui/CarouselControls";
import PropertyCard from "@/components/cards/PropertyCard";
import { properties } from "@/data/properties";

export default function PropertyListingsSection() {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const firstCard = track.querySelector<HTMLElement>("[data-card]");
    const amount = firstCard ? firstCard.offsetWidth + 24 : track.clientWidth * 0.8;
    track.scrollBy({ left: amount * direction, behavior: "smooth" });
  };

  return (
    <section id="listings" className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-8xl px-6 lg:px-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <SectionHeading
            className="max-w-lg"
            title={
              <>
                Havenly&apos;s exclusive
                <br className="hidden sm:block" /> property listings
              </>
            }
          />
          <Button href="#listings" variant="yellow" withArrow className="self-start sm:self-auto">
            View All Properties
          </Button>
        </div>
      </div>

      {/* Carousel track — cards peek on both edges */}
      <div
        ref={trackRef}
        className="no-scrollbar mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-2 lg:px-10"
      >
        {properties.map((property) => (
          <div
            key={property.id}
            data-card
            className="w-[80vw] flex-shrink-0 snap-center sm:w-[55vw] md:w-[42vw] lg:w-[calc((100%-3rem)/3)] xl:w-[calc((100%-4.5rem)/4)]"
          >
            <PropertyCard property={property} />
          </div>
        ))}
      </div>

      <div className="mx-auto mt-10 flex max-w-8xl justify-center px-6 lg:px-10">
        <CarouselControls
          variant="outline"
          onPrev={() => scrollByCard(-1)}
          onNext={() => scrollByCard(1)}
        />
      </div>
    </section>
  );
}
