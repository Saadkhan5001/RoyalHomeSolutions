import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/layout/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import CTASection from "@/components/sections/CTASection";
import ValueCard from "@/components/cards/ValueCard";
import { propertyTypes, propertyConditions } from "@/data/propertyTypes";
import { sellerSituations } from "@/data/sellerSituations";

export const metadata: Metadata = pageMetadata({
  title: "Properties We Buy — Royal Home Solutions, Inc.",
  description:
    "Royal Home Solutions buys single-family homes, condos, multi-family, land, and rentals in any condition — including homes needing repairs, inherited properties, and tenant-occupied houses.",
  path: "/property",
});

export default function PropertyPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          eyebrow="Properties We Buy"
          title="If it's a house, we're interested"
          subtitle="We buy in any condition and just about any situation. No repairs, no cleaning, no listing — just a straightforward conversation about your property."
          image="https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=2400&q=85"
          imageAlt="Bright modern family home with a manicured lawn"
          cta={{
            label: "Get My Free Cash Offer",
            href: "/sell-your-home#seller-form",
          }}
        />

        {/* Property types */}
        <section className="bg-white py-20 lg:py-28">
          <div className="mx-auto max-w-8xl px-6 lg:px-10">
            <SectionHeading
              align="center"
              className="mx-auto max-w-2xl"
              title="Types of property we purchase"
            />
            <p className="mx-auto mt-5 max-w-xl text-center text-sm leading-relaxed text-neutral-600 sm:text-base">
              If your property isn&apos;t listed here, it&apos;s still worth
              asking — these are simply the ones we see most often.
            </p>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {propertyTypes.map((type) => (
                <ValueCard key={type.id} feature={type} />
              ))}
            </div>
          </div>
        </section>

        {/* Conditions */}
        <section className="bg-neutral-50 py-20 lg:py-28">
          <div className="mx-auto max-w-8xl px-6 lg:px-10">
            <SectionHeading
              align="center"
              className="mx-auto max-w-2xl"
              title="Condition is not a dealbreaker"
            />
            <p className="mx-auto mt-5 max-w-xl text-center text-sm leading-relaxed text-neutral-600 sm:text-base">
              The things that make a house hard to list are usually the reasons
              homeowners call us in the first place.
            </p>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {propertyConditions.map((condition) => (
                <div
                  key={condition.id}
                  className="rounded-3xl border border-neutral-200 bg-white p-7"
                >
                  <h3 className="text-lg font-semibold text-brand-ink">
                    {condition.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-neutral-600">
                    {condition.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Situations — reuses the homepage data so the two never drift apart */}
        <section className="bg-white py-20 lg:py-28">
          <div className="mx-auto max-w-8xl px-6 lg:px-10">
            <SectionHeading
              align="center"
              className="mx-auto max-w-2xl"
              title="Situations we help with"
            />

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sellerSituations.map((situation) => (
                <ValueCard key={situation.id} feature={situation} />
              ))}
            </div>
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </>
  );
}
