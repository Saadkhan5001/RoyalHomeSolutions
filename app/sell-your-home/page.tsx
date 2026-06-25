import type { Metadata } from "next";
import Image from "next/image";
import { Gauge, ClipboardCheck, MapPin, Handshake } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";
import ValueCard from "@/components/cards/ValueCard";
import SellerLeadForm from "@/components/forms/SellerLeadForm";
import type { ValueFeature } from "@/data/valueFeatures";

export const metadata: Metadata = {
  title: "Sell Your Home With Confidence — Royal Home Solutions, Inc.",
  description:
    "Royal Home Solutions helps homeowners understand their options, move quickly, and make informed decisions with a smooth, guided selling process.",
};

const sellerValues: ValueFeature[] = [
  {
    id: "fast-guided",
    title: "Fast, Guided Process",
    description:
      "Move at your own pace with a clear, step-by-step process and a dedicated team guiding every decision.",
    icon: Gauge,
  },
  {
    id: "honest-review",
    title: "Honest Property Review",
    description:
      "Get a straightforward assessment of your home and its value—no pressure, no hidden agendas.",
    icon: ClipboardCheck,
  },
  {
    id: "local-expertise",
    title: "Local Market Expertise",
    description:
      "Tap into deep knowledge of your neighborhood and current market to price and position with confidence.",
    icon: MapPin,
  },
  {
    id: "flexible-options",
    title: "Flexible Selling Options",
    description:
      "Explore multiple paths to sell—on the market or off—and choose the option that best fits your goals.",
    icon: Handshake,
  },
];

const sellingSteps = [
  {
    title: "Share Your Property Details",
    description:
      "Tell us about your home and timeline with a quick, no-pressure form.",
  },
  {
    title: "Get a Free Home Review",
    description:
      "Our team reviews your property and local market to outline your options.",
  },
  {
    title: "Review Your Options",
    description:
      "Compare offers and selling paths with clear, honest guidance throughout.",
  },
  {
    title: "Move Forward With Confidence",
    description:
      "Choose the path that fits you and we handle the details all the way to closing.",
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
            src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=2000&q=80"
            alt="Luxury modern home exterior at dusk"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/40"
            aria-hidden="true"
          />

          <div className="relative z-10 mx-auto grid w-full max-w-8xl items-center gap-12 px-6 pb-16 pt-32 lg:grid-cols-2 lg:gap-10 lg:px-10 lg:pb-24 lg:pt-40">
            <div className="max-w-2xl">
              <p className="mb-4 inline-flex rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
                For Home Sellers
              </p>
              <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
                Sell Your Home With Confidence
              </h1>
              <p className="mt-6 max-w-md text-base leading-relaxed text-white/85 sm:text-lg">
                Royal Home Solutions helps homeowners understand their options,
                move quickly, and make informed decisions with a smooth, guided
                selling process.
              </p>
              <div className="mt-8">
                <Button href="#seller-form" variant="yellow" withArrow>
                  Start Your Free Home Review
                </Button>
              </div>
            </div>

            <div className="w-full lg:ml-auto lg:max-w-md">
              <SellerLeadForm id="seller-form" variant="hero" />
            </div>
          </div>
        </section>

        {/* Trust / value */}
        <section className="bg-white py-20 lg:py-28">
          <div className="mx-auto max-w-8xl px-6 lg:px-10">
            <SectionHeading
              align="center"
              className="mx-auto max-w-2xl"
              title="Why sellers work with Royal Home Solutions"
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
              title="How the selling process works"
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
                Ready to talk about selling your property?
              </h2>
              <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/80 sm:text-base">
                Send us your details and our team will reach out with the next
                step.
              </p>
              <div className="mt-8 flex justify-center">
                <Button href="#seller-form" variant="yellow" withArrow>
                  Start Your Free Home Review
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
