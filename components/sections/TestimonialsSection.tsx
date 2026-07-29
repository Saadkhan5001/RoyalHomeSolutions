import SectionHeading from "@/components/ui/SectionHeading";
import TestimonialCard from "@/components/cards/TestimonialCard";
import { publishedTestimonials } from "@/data/testimonials";
import { cn } from "@/lib/utils";

/**
 * Genuine testimonials from `data/testimonials.ts`.
 *
 * Static layout rather than the old carousel: the business has two real
 * reviews (one published until the second is client-approved), and a carousel
 * of one or two cards reads as filler. Centered single column for one entry,
 * two-up grid once the second is published. Renders nothing if the published
 * list is ever empty — an empty "what customers say" section is worse than
 * none.
 */
export default function TestimonialsSection() {
  if (publishedTestimonials.length === 0) return null;

  const single = publishedTestimonials.length === 1;

  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-8xl px-6 lg:px-10">
        <SectionHeading
          align="center"
          className="mx-auto max-w-md"
          title={
            <>
              What homeowners
              <br className="hidden sm:block" /> say about us
            </>
          }
        />

        <div
          className={cn(
            "mx-auto mt-12 lg:mt-16",
            single
              ? "max-w-3xl"
              : "grid max-w-6xl gap-6 lg:grid-cols-2",
          )}
        >
          {publishedTestimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}
