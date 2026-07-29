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
                Skip repairs, showings, and agent commissions. Tell us about
                your property and we&apos;ll help you understand your best next
                step.
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

        {/* Final CTA */}
        <section className="bg-white py-12 lg:py-20">
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
