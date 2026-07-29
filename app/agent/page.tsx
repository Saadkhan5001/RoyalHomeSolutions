import type { Metadata } from "next";
import Image from "next/image";
import { pageMetadata } from "@/lib/seo";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";

export const metadata: Metadata = pageMetadata({
  title: "About Royal Home Solutions, Inc.",
  description:
    "Royal Home Solutions is a real estate investment company that buys homes directly from owners, renovates select properties, and offers a limited number of move-in-ready homes for sale.",
  // Route deliberately unchanged: /agent is already indexed with a canonical
  // and is linked as "About" from the nav and footer. Renaming it would break
  // those without adding value — this is a content update, not a move.
  path: "/agent",
});

/**
 * How the business works, in three steps. Company-level facts already asserted
 * across the site — no invented history, credentials, results or service area.
 */
const businessModel = [
  {
    step: "1",
    title: "We buy directly",
    description:
      "We speak with property owners and evaluate whether the home is a fit for a direct purchase.",
  },
  {
    step: "2",
    title: "We renovate select homes",
    description:
      "Some properties are repaired and updated based on what the home needs.",
  },
  {
    step: "3",
    title: "We resell limited inventory",
    description:
      "When a renovated home is ready, it may be offered directly through the Buy a Home page. Inventory is intentionally limited.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Type-led hero. The previous version used an Unsplash photograph;
            removed under NOD-202's no-stock-imagery rule. */}
        <section className="bg-brand-ink">
          <div className="mx-auto max-w-8xl px-6 pb-16 pt-32 sm:pb-20 sm:pt-36 lg:px-10 lg:pb-24 lg:pt-40">
            <p className="mb-4 inline-flex rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
              About Us
            </p>
            <h1 className="max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
              About Royal Home Solutions
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
              Royal Home Solutions is a real estate investment company that
              works directly with property owners. We purchase select homes,
              improve them through renovation, and later offer a limited number
              of move-in-ready properties for sale.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="bg-white py-20 lg:py-28">
          <div className="mx-auto max-w-3xl px-6 text-center lg:px-10">
            <SectionHeading
              align="center"
              title="Improving homes and strengthening neighbourhoods"
            />
            <p className="mt-6 text-base leading-relaxed text-neutral-600 sm:text-lg">
              Our mission is to improve the quality of housing one property at a
              time. By purchasing homes that need a new direction, investing in
              thoughtful renovations, and returning improved properties to the
              market, Royal Home Solutions aims to create better outcomes for
              sellers, buyers, and the surrounding neighbourhood.
            </p>
          </div>
        </section>

        {/* Business model */}
        <section className="bg-neutral-50 py-20 lg:py-28">
          <div className="mx-auto max-w-8xl px-6 lg:px-10">
            <SectionHeading
              align="center"
              className="mx-auto max-w-2xl"
              title="How our business works"
            />

            <ol className="mt-14 grid gap-6 lg:grid-cols-3">
              {businessModel.map((item) => (
                <li
                  key={item.step}
                  className="rounded-3xl border border-neutral-200 bg-white p-7"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-yellow text-base font-bold text-brand-ink">
                    {item.step}
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-brand-ink">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                    {item.description}
                  </p>
                </li>
              ))}
            </ol>

            {/* Positioning — the two statements that keep the company's role
                unambiguous on both sides of the transaction. */}
            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border border-neutral-200 bg-white p-7">
                <h3 className="text-lg font-semibold text-brand-ink">
                  If you&apos;re selling
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-neutral-600">
                  When Royal Home Solutions purchases a property directly, we
                  are the buyer — not the homeowner&apos;s listing agent. The
                  seller does not go through a traditional listing process or
                  pay a listing-agent commission.
                </p>
              </div>
              <div className="rounded-3xl border border-neutral-200 bg-white p-7">
                <h3 className="text-lg font-semibold text-brand-ink">
                  If you&apos;re buying
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-neutral-600">
                  Royal Home Solutions is not a general property-listings
                  website. The Buy a Home page only displays the small number of
                  properties owned and offered by the company.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Jonah */}
        <section className="bg-white py-20 lg:py-28">
          <div className="mx-auto grid max-w-8xl items-center gap-12 px-6 lg:grid-cols-2 lg:gap-16 lg:px-10">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-4xl">
              {/* Real, client-supplied photograph — optimised under NOD-111. */}
              <Image
                src="/Assets/Images/Jonah%20Stevens%201.jpeg"
                alt="Jonah Stevens of Royal Home Solutions"
                fill
                sizes="(max-width: 1024px) 90vw, 560px"
                className="object-cover"
              />
            </div>

            <div>
              {/*
                No job title. "Founder" appears only in `data/blog.ts`, which is
                placeholder content flagged as invented under NOD-204 — it is not
                a confirmed source. Do not add "Founder", "CEO", "licensed
                agent" or any other title, and do not add years of experience,
                transaction counts, awards, licences, biography or service-area
                claims, until the client confirms them in writing (NOD-202).
              */}
              <SectionHeading title="Jonah Stevens" />
              <p className="mt-6 text-base leading-relaxed text-neutral-600">
                Jonah Stevens represents Royal Home Solutions and works with
                property owners throughout the direct-purchase process. The
                focus is clear communication, practical solutions, and improving
                properties through responsible investment and renovation.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Button
                  href="/sell-your-home#seller-form"
                  variant="yellow"
                  withArrow
                >
                  Tell Us About Your Property
                </Button>
                {/* Works with an empty inventory — the Buy a Home page renders
                    its no-inventory state and the buyer list form. */}
                <Button href="/buy-a-home" variant="ghost">
                  View Current Homes
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
