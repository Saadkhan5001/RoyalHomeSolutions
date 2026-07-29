import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import { faqs } from "@/data/faqs";

export const metadata: Metadata = pageMetadata({
  title: "Frequently Asked Questions — Royal Home Solutions, Inc.",
  description:
    "Common questions about selling a house directly to Royal Home Solutions: how a direct purchase differs from listing with an agent, repairs, commissions, timelines and what happens after you get in touch.",
  path: "/faq",
});

/**
 * FAQPage structured data, built from the same array the page renders.
 *
 * Google requires the marked-up answers to match the visible ones exactly and
 * to cover only questions actually shown, so deriving both from `faqs` is the
 * only safe construction — held-back questions can't leak into the markup
 * because they aren't in the array at all.
 */
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

export default function FaqPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Type-led hero — no stock photography (NOD-110 / NOD-202 rule). */}
        <section className="bg-brand-ink">
          <div className="mx-auto max-w-8xl px-6 pb-16 pt-32 sm:pb-20 sm:pt-36 lg:px-10 lg:pb-24 lg:pt-40">
            <p className="mb-4 inline-flex rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
              FAQ
            </p>
            <h1 className="max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Frequently asked questions
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
              Straight answers about selling your house directly to Royal Home
              Solutions — how it differs from listing with an agent, and what to
              expect along the way.
            </p>
          </div>
        </section>

        <section className="bg-white py-20 lg:py-28">
          <div className="mx-auto max-w-3xl px-6 lg:px-10">
            <dl className="divide-y divide-neutral-200">
              {faqs.map((faq) => (
                <div key={faq.id} id={faq.id} className="py-8 first:pt-0">
                  <dt className="text-lg font-semibold text-brand-ink sm:text-xl">
                    {faq.question}
                  </dt>
                  <dd className="mt-3 text-base leading-relaxed text-neutral-600">
                    {faq.answer}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-14 rounded-3xl border border-neutral-200 bg-neutral-50 p-8 text-center sm:p-10">
              <h2 className="text-2xl font-semibold tracking-tight text-brand-ink">
                Still have a question?
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-neutral-600 sm:text-base">
                Tell us about your property and we&apos;ll get back to you with
                the next step. There&apos;s no obligation.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Button
                  href="/sell-your-home#seller-form"
                  variant="yellow"
                  withArrow
                >
                  Tell Us About Your Property
                </Button>
                <Button href="/buy-a-home" variant="ghost">
                  View Current Homes
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      {/* eslint-disable-next-line react/no-danger */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </>
  );
}
