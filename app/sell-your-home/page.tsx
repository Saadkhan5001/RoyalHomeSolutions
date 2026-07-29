import type { Metadata } from "next";
import Image from "next/image";
import { BadgeDollarSign, Home, Percent, CalendarClock } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";
import ValueCard from "@/components/cards/ValueCard";
import SellerLeadForm from "@/components/forms/SellerLeadForm";
import type { ValueFeature } from "@/data/valueFeatures";
import { propertyTypes, propertyConditions } from "@/data/propertyTypes";

export const metadata: Metadata = pageMetadata({
  title: "Sell Your House Fast for Cash — Royal Home Solutions, Inc.",
  description:
    "Get a free cash offer on your house. Sell as-is with no repairs, no showings, and no agent commissions. Royal Home Solutions helps homeowners close on their timeline.",
  path: "/sell-your-home",
});

const sellerValues: ValueFeature[] = [
  {
    id: "fair-cash-offer",
    title: "Fair Cash Offer",
    description:
      "Get a straightforward cash offer based on your home and situation—no pressure, no hidden agendas.",
    icon: BadgeDollarSign,
  },
  {
    id: "no-repairs",
    title: "No Repairs Needed",
    description:
      "Sell your home exactly as it is. No fixing, cleaning, or updating before you reach out.",
    icon: Home,
  },
  {
    id: "no-commissions",
    title: "No Agent Commissions",
    description:
      "Work directly with our team and skip the listing agent fees and commissions.",
    icon: Percent,
  },
  {
    id: "flexible-closing",
    title: "Flexible Closing",
    description:
      "Close on the timeline that fits your life—move quickly or take the time you need.",
    icon: CalendarClock,
  },
];

/**
 * "Why Work With Us" points, restored from the archived site and modernised
 * (NOD-201). The offer point describes what the offer is *based on* rather
 * than promising market value or a highest offer — neither is verifiable.
 */
const whyWorkWithUs = [
  {
    title: "Direct buyer",
    description:
      "Royal Home Solutions evaluates and purchases properties directly rather than listing them for third-party buyers.",
  },
  {
    title: "Sell as-is",
    description:
      "No repairs, renovations, cleaning, staging, or repeated showings are required before contacting us.",
  },
  {
    title: "No agent commission",
    description:
      "A direct purchase does not involve a traditional listing-agent commission.",
  },
  {
    title: "Flexible timing",
    description:
      "The closing date is discussed with the seller and based on the property and transaction requirements.",
  },
  {
    title: "No obligation",
    description:
      "Submitting the property or reviewing an offer does not require the homeowner to proceed.",
  },
  {
    title: "Clear offer approach",
    description:
      "The offer reflects the property's condition, expected renovation work, holding costs, and resale considerations.",
  },
];

const sellingSteps = [
  {
    title: "Tell Us About Your Property",
    description:
      "Share a few details about your home and timeline with a quick, no-pressure form.",
  },
  {
    title: "Get a Free Home Review",
    description:
      "Our team reviews your property and situation to outline your options.",
  },
  {
    title: "Review Your Options",
    description:
      "Compare your paths forward with clear, honest guidance and no obligation.",
  },
  {
    title: "Close on Your Timeline",
    description:
      "Choose what fits you and we handle the details all the way to closing.",
  },
];

export default function SellYourHomePage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Seller hero */}
        <section className="relative flex min-h-screen items-center overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2400&q=85"
            alt="Warm timber-clad modern home among greenery"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/40"
            aria-hidden="true"
          />

          <div className="relative z-10 mx-auto grid w-full max-w-8xl items-center gap-10 px-6 pb-14 pt-24 sm:gap-12 sm:pt-24 lg:grid-cols-2 lg:gap-10 lg:px-10 lg:pb-16 lg:pt-24">
            <div className="max-w-2xl">
              <p className="mb-4 inline-flex rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                We Buy Houses — Cash
              </p>
              <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
                Sell Your Home Without the Stress
              </h1>
              <p className="mt-6 max-w-md text-base leading-relaxed text-white/85 sm:text-lg">
                We&apos;re not listing your home — we&apos;re buying it
                directly. No agent commissions, no repairs, and no showings.
                Tell us about the property and we&apos;ll review it for a
                direct cash offer.
              </p>
              <div className="mt-8">
                <Button href="#seller-form" variant="yellow" withArrow>
                  Start My Free Home Review
                </Button>
              </div>
            </div>

            <div className="w-full lg:ml-auto lg:max-w-md">
              <SellerLeadForm
                id="seller-form"
                variant="hero"
                source="sell_your_home_page"
              />
            </div>
          </div>
        </section>

        {/* Trust / value */}
        <section className="bg-white py-20 lg:py-28">
          <div className="mx-auto max-w-8xl px-6 lg:px-10">
            <SectionHeading
              align="center"
              className="mx-auto max-w-2xl"
              title="Why homeowners sell to Royal Home Solutions"
            />
            <div className="mt-12 grid gap-6 lg:mt-16 lg:grid-cols-4 sm:grid-cols-2">
              {sellerValues.map((feature) => (
                <ValueCard key={feature.id} feature={feature} />
              ))}
            </div>
          </div>
        </section>

        {/* Property types — relocated from the former /property route when it
            became the buyer-facing inventory page (NOD-200/NOD-203). This is
            seller-facing content, so it belongs here. */}
        <section className="bg-neutral-50 py-20 lg:py-28">
          <div className="mx-auto max-w-8xl px-6 lg:px-10">
            <SectionHeading
              align="center"
              className="mx-auto max-w-2xl"
              title="Types of property we purchase"
            />
            <p className="mx-auto mt-5 max-w-xl text-center text-sm leading-relaxed text-neutral-600 sm:text-base">
              These are the types of properties we commonly purchase directly.
              You are selling to Royal Home Solutions, not listing the property
              with an agent. If your property isn&apos;t listed here, it&apos;s
              still worth asking.
            </p>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {propertyTypes.map((type) => (
                <ValueCard key={type.id} feature={type} />
              ))}
            </div>
          </div>
        </section>

        {/* Conditions — also relocated from /property. */}
        <section className="bg-white py-20 lg:py-28">
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
                  className="rounded-3xl border border-neutral-200 bg-neutral-50 p-7"
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

        {/* Selling process */}
        <section className="bg-neutral-50 py-20 lg:py-28">
          <div className="mx-auto max-w-8xl px-6 lg:px-10">
            <SectionHeading
              align="center"
              className="mx-auto max-w-2xl"
              title="The simple way to sell your house"
            />
            <ol className="mt-12 grid gap-6 lg:mt-16 sm:grid-cols-2 lg:grid-cols-4">
              {sellingSteps.map((step, i) => (
                <li
                  key={step.title}
                  className="relative rounded-3xl border border-neutral-200 bg-white p-6"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-yellow text-base font-bold text-brand-ink">
                    {i + 1}
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-brand-ink">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-500">
                    {step.description}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Why Work With Us — restored from the archived site (NOD-201),
            modernised. Deliberately makes no "market value" or "highest offer"
            claim: the offer basis is described, not the outcome. */}
        <section className="bg-white py-20 lg:py-28">
          <div className="mx-auto max-w-8xl px-6 lg:px-10">
            <SectionHeading
              align="center"
              className="mx-auto max-w-3xl"
              title="Why homeowners work with Royal Home Solutions"
            />
            <p className="mx-auto mt-5 max-w-2xl text-center text-base leading-relaxed text-neutral-600">
              Selling through a traditional listing is not the right solution
              for every homeowner. Royal Home Solutions offers a direct-sale
              option for people who value a simpler process, an as-is sale, and
              a clear conversation about their property.
            </p>

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {whyWorkWithUs.map((benefit) => (
                <div
                  key={benefit.title}
                  className="rounded-3xl border border-neutral-200 bg-neutral-50 p-7"
                >
                  <h3 className="text-lg font-semibold text-brand-ink">
                    {benefit.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-neutral-600">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-neutral-50 py-12 lg:py-20">
          <div className="mx-auto max-w-8xl px-6 lg:px-10">
            <div className="overflow-hidden rounded-4xl bg-brand-ink px-6 py-16 text-center sm:py-20 lg:px-16">
              <h2 className="mx-auto max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
                Ready to talk about selling your house?
              </h2>
              <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/80 sm:text-base">
                Send us your details and Royal Home Solutions will follow up
                with the next step.
              </p>
              <div className="mt-8 flex justify-center">
                <Button href="#seller-form" variant="yellow" withArrow>
                  Get My Free Cash Offer
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
