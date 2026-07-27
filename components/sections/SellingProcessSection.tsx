"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import CarouselControls from "@/components/ui/CarouselControls";
import { processSteps, processSlides } from "@/data/processSteps";

export default function SellingProcessSection() {
  const [index, setIndex] = useState(0);
  const slide = processSlides[index];

  const go = (direction: 1 | -1) => {
    setIndex((prev) => (prev + direction + processSlides.length) % processSlides.length);
  };

  return (
    <section id="process" className="bg-brand-green py-20 lg:py-28">
      <div className="mx-auto max-w-8xl px-6 lg:px-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mx-auto max-w-2xl text-center text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl"
        >
          The simple way to sell your house
        </motion.h2>

        {/* Process timeline */}
        <div className="mt-14 lg:mt-16">
          <ol className="grid grid-cols-2 gap-y-10 sm:grid-cols-4 sm:gap-y-0">
            {processSteps.map((step, i) => {
              const Icon = step.icon;
              const reached = i <= index;
              const active = i === index;
              return (
                <li
                  key={step.id}
                  className="relative flex flex-col items-center text-center"
                >
                  {/* Dotted connector between steps (hidden on the last) */}
                  {i < processSteps.length - 1 && (
                    <span
                      className="absolute left-1/2 top-7 hidden h-px w-full border-t border-dashed border-white/50 sm:block"
                      aria-hidden="true"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-current={active ? "step" : undefined}
                    aria-label={`Go to step: ${step.label}`}
                    className={[
                      "relative z-10 flex h-14 w-14 items-center justify-center rounded-full border transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-green",
                      reached
                        ? "border-white bg-white text-brand-green"
                        : "border-white/60 text-white hover:bg-white/10",
                    ].join(" ")}
                  >
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </button>
                  <span
                    className={[
                      "mt-3 text-sm transition-opacity duration-300",
                      active
                        ? "font-semibold text-white"
                        : "font-medium text-white/80",
                    ].join(" ")}
                  >
                    {step.label}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Content card */}
        <div className="mt-12 overflow-hidden rounded-4xl bg-white p-4 sm:p-6 lg:mt-16 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="grid gap-8 lg:grid-cols-2 lg:gap-12"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl lg:aspect-auto">
                <Image
                  src={slide.image}
                  alt={slide.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 90vw, 560px"
                  className="object-cover"
                />
              </div>

              <div className="flex flex-col justify-center">
                <h3 className="text-2xl font-semibold text-brand-ink sm:text-3xl">
                  {slide.heading}
                </h3>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-neutral-500 sm:text-base">
                  {slide.description}
                </p>

                <ul className="mt-6 space-y-4">
                  {slide.checklist.map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand-ink">
                        <Check className="h-3.5 w-3.5 text-white" aria-hidden="true" />
                      </span>
                      <span className="text-sm font-medium text-brand-ink">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 flex justify-end">
                  <CarouselControls
                    variant="yellow"
                    onPrev={() => go(-1)}
                    onNext={() => go(1)}
                  />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
