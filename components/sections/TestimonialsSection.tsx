"use client";

import { useRef } from "react";
import SectionHeading from "@/components/ui/SectionHeading";
import CarouselControls from "@/components/ui/CarouselControls";
import TestimonialCard from "@/components/cards/TestimonialCard";
import { testimonials } from "@/data/testimonials";

export default function TestimonialsSection() {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const firstCard = track.querySelector<HTMLElement>("[data-card]");
    const amount = firstCard
      ? firstCard.offsetWidth + 24
      : track.clientWidth * 0.8;
    track.scrollBy({ left: amount * direction, behavior: "smooth" });
  };

  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-8xl px-6 lg:px-10">
        <SectionHeading
          align="center"
          className="mx-auto max-w-md"
          title={
            <>
              Hear from our
              <br className="hidden sm:block" /> happy customers
            </>
          }
        />
      </div>

      <div
        ref={trackRef}
        className="no-scrollbar mx-auto mt-12 flex max-w-6xl snap-x snap-mandatory gap-6 overflow-x-auto px-6 lg:mt-16"
      >
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            data-card
            className="w-[85vw] flex-shrink-0 snap-center sm:w-[60vw] lg:w-[calc((100%-1.5rem)/2)]"
          >
            <TestimonialCard testimonial={testimonial} />
          </div>
        ))}
      </div>

      <div className="mx-auto mt-10 flex max-w-6xl justify-center px-6">
        <CarouselControls
          variant="outline"
          onPrev={() => scrollByCard(-1)}
          onNext={() => scrollByCard(1)}
        />
      </div>
    </section>
  );
}
