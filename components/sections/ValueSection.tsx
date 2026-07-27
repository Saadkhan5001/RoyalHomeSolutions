"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";
import ValueCard from "@/components/cards/ValueCard";
import {
  valueFeaturesLeft,
  valueFeaturesRight,
  valueImages,
} from "@/data/valueFeatures";

export default function ValueSection() {
  const reduceMotion = useReducedMotion();
  // Duplicate the images so the vertical track can loop seamlessly.
  const loopImages = [...valueImages, ...valueImages];

  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-8xl px-6 lg:px-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <SectionHeading
            className="max-w-lg"
            title={
              <>
                Why homeowners choose
                <br className="hidden sm:block" /> Royal Home Solutions
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

        <div className="mt-12 grid items-stretch gap-6 lg:mt-16 lg:grid-cols-3">
          {/* Left feature column — cards flex-1 so they fill the column height
              and sit flush with the centre image instead of floating apart. */}
          <div className="flex flex-col gap-6">
            {valueFeaturesLeft.map((feature) => (
              <ValueCard key={feature.id} feature={feature} className="flex-1" />
            ))}
          </div>

          {/* Centre vertical image slider. Its height drives the row: on lg the
              side columns stretch to match, so a min-height here sets the
              section height. */}
          <div className="relative order-first h-[300px] overflow-hidden rounded-3xl sm:h-[380px] lg:order-none lg:h-auto lg:min-h-[420px]">
            <motion.div
              className="absolute inset-x-0 top-0"
              animate={reduceMotion ? undefined : { y: ["-50%", "0%"] }}
              transition={
                reduceMotion
                  ? undefined
                  : { duration: 24, ease: "linear", repeat: Infinity }
              }
            >
              {loopImages.map((img, i) => (
                <div
                  key={`${img.id}-${i}`}
                  className="relative mb-6 h-64 w-full overflow-hidden rounded-3xl"
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 1024px) 90vw, 420px"
                    className="object-cover"
                  />
                </div>
              ))}
            </motion.div>

            {/* Faded edges */}
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white to-transparent"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent"
              aria-hidden="true"
            />
          </div>

          {/* Right feature column */}
          <div className="flex flex-col gap-6">
            {valueFeaturesRight.map((feature) => (
              <ValueCard key={feature.id} feature={feature} className="flex-1" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
