import type { Metadata } from "next";
import Image from "next/image";
import { ShieldCheck, MessageSquare, CalendarClock } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/layout/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import CTASection from "@/components/sections/CTASection";
import ValueCard from "@/components/cards/ValueCard";
import type { ValueFeature } from "@/data/valueFeatures";

export const metadata: Metadata = {
  title: "Meet Jonah Stevens — Royal Home Solutions, Inc.",
  description:
    "Jonah Stevens founded Royal Home Solutions to give homeowners a direct, no-pressure alternative to listing. Talk to the person who will actually handle your sale.",
};

/**
 * How the team works. These describe the company's process, which is asserted
 * across the rest of the site — not personal claims about Jonah.
 */
const principles: ValueFeature[] = [
  {
    id: "straight-answers",
    title: "Straight Answers",
    description:
      "If selling to us isn't your best option, we'll tell you that. A clear no is more useful than a vague maybe.",
    icon: MessageSquare,
  },
  {
    id: "no-pressure",
    title: "No Pressure",
    description:
      "No deadlines invented to rush you, and no obligation after a home review. You decide if and when to move.",
    icon: ShieldCheck,
  },
  {
    id: "your-timeline",
    title: "Your Timeline",
    description:
      "Some homeowners need to close in weeks, others need months to plan. Both are fine.",
    icon: CalendarClock,
  },
];

export default function AgentPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          eyebrow="Meet the Founder"
          title="You'll be working with Jonah"
          subtitle="Royal Home Solutions is a small, direct operation — not a call center. The person who reviews your property is the person you'll deal with."
          image="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2400&q=85"
          imageAlt="Warm timber-clad modern home among greenery"
        />

        {/* Profile */}
        <section className="bg-white py-20 lg:py-28">
          <div className="mx-auto grid max-w-8xl items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16 lg:px-10">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-4xl">
              <Image
                src="/Assets/Images/Jonah%20Stevens%201.jpeg"
                alt="Jonah Stevens, founder of Royal Home Solutions"
                fill
                sizes="(max-width: 1024px) 90vw, 560px"
                className="object-cover"
              />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-green">
                Founder, Royal Home Solutions, Inc.
              </p>
              <SectionHeading className="mt-3" title="Jonah Stevens" />

              {/*
                TODO: Replace the two paragraphs below with Jonah's own bio.
                They are written at company level on purpose — everything here
                is already asserted elsewhere on the site, so nothing personal
                is claimed that hasn't been confirmed. Add real detail (years
                in the area, background, why he started the company) before
                this page carries traffic.
              */}
              <p className="mt-6 text-base leading-relaxed text-neutral-600">
                Royal Home Solutions was built around a simple idea: selling a
                house shouldn&apos;t require repairs you can&apos;t afford,
                showings you don&apos;t want, or commissions that take a chunk
                of the result. Some homeowners are better served by listing
                traditionally — and when that&apos;s true, we say so.
              </p>
              <p className="mt-4 text-base leading-relaxed text-neutral-600">
                When it isn&apos;t, we make a direct offer, handle the details,
                and close on the timeline that fits your situation rather than
                ours.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Button
                  href="/sell-your-home#seller-form"
                  variant="yellow"
                  withArrow
                >
                  Get My Free Cash Offer
                </Button>
                <Button href="/property" variant="ghost">
                  See what we buy
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Principles */}
        <section className="bg-neutral-50 py-20 lg:py-28">
          <div className="mx-auto max-w-8xl px-6 lg:px-10">
            <SectionHeading
              align="center"
              className="mx-auto max-w-2xl"
              title="How we work with homeowners"
            />

            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {principles.map((principle) => (
                <ValueCard key={principle.id} feature={principle} />
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
