"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { trustStats, galleryImages } from "@/data/whyChoose";

export default function TrustSection() {
  const reduceMotion = useReducedMotion();
  // Duplicate the images so the horizontal track loops seamlessly.
  const loopImages = [...galleryImages, ...galleryImages];

  return (
    <section id="about" className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-8xl px-6 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-3xl font-semibold leading-tight tracking-tight text-brand-ink sm:text-4xl lg:text-5xl"
          >
            Built on trust &amp; focused on your future
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          >
            <p className="text-base leading-relaxed text-neutral-600 sm:text-lg">
              Built on trust and dedicated to your future, we guide you through
              every step of your real estate journey. Experience reliable
              service, honest advice, and lasting value with every property.
            </p>

            <dl className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {trustStats.map((stat) => (
                <div key={stat.id}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <span className="block text-3xl font-bold text-brand-green">
                      {stat.value}
                    </span>
                    <span className="mt-1 block text-sm text-neutral-500">
                      {stat.label}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </motion.div>
        </div>
      </div>

      {/* Full-bleed horizontal image slider */}
      <div className="mt-14 overflow-hidden lg:mt-20">
        <motion.div
          className="flex w-max"
          animate={reduceMotion ? undefined : { x: ["-50%", "0%"] }}
          transition={
            reduceMotion
              ? undefined
              : { duration: 40, ease: "linear", repeat: Infinity }
          }
        >
          {loopImages.map((img, i) => (
            <figure
              key={`${img.id}-${i}`}
              className="relative mr-5 h-72 w-60 flex-shrink-0 overflow-hidden rounded-3xl sm:h-80 sm:w-64 lg:h-96 lg:w-72"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 640px) 240px, (max-width: 1024px) 256px, 288px"
                className="object-cover"
              />
            </figure>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
