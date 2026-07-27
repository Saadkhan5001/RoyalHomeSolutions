"use client";

import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";
import { sellerSituations } from "@/data/sellerSituations";

/**
 * "Homeowners we can help" — replaces the old buyer-facing listings carousel
 * with the real situations Royal Home Solutions buys houses in.
 */
export default function SellerSituationsSection() {
  return (
    <section id="situations" className="bg-neutral-50 py-20 lg:py-28">
      <div className="mx-auto max-w-8xl px-6 lg:px-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            className="max-w-lg"
            title={
              <>
                Homeowners
                <br className="hidden sm:block" /> we can help
              </>
            }
          />
          <Button
            href="/sell-your-home#seller-form"
            variant="yellow"
            withArrow
            className="self-start sm:self-auto"
          >
            Get My Free Cash Offer
          </Button>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {sellerSituations.map((situation, i) => {
            const Icon = situation.icon;
            return (
              <motion.article
                key={situation.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, ease: "easeOut", delay: i * 0.05 }}
                className="flex h-full flex-col rounded-3xl border border-neutral-200 bg-white p-6 transition-shadow duration-300 hover:shadow-lg"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-yellow/15">
                  <Icon
                    className="h-6 w-6 text-brand-ink"
                    aria-hidden="true"
                  />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-brand-ink">
                  {situation.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-500">
                  {situation.description}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
