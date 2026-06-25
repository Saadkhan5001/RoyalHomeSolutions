"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import FeatureItem from "@/components/cards/FeatureItem";
import { whyChooseItems } from "@/data/whyChoose";

export default function WhyChooseSection() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-8xl px-6 lg:px-10">
        <SectionHeading
          align="center"
          className="mx-auto max-w-xl"
          title={
            <>
              Why choose our real
              <br className="hidden sm:block" /> estate expertise
            </>
          }
        />

        <div className="mt-14 grid items-center gap-12 lg:mt-20 lg:grid-cols-2 lg:gap-20">
          {/* Overlapping images with scribble accent */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative mx-auto w-full max-w-md lg:mx-0"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl">
              <Image
                src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1000&q=80"
                alt="Modern home exterior with landscaped garden"
                fill
                sizes="(max-width: 1024px) 90vw, 420px"
                className="object-cover"
              />
            </div>

            <div className="absolute -bottom-10 right-2 aspect-[4/3] w-3/5 overflow-hidden rounded-3xl border-4 border-white shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80"
                alt="Two advisors discussing property details on laptops"
                fill
                sizes="(max-width: 1024px) 55vw, 250px"
                className="object-cover"
              />
            </div>

            {/* Hand-drawn yellow scribble arrow */}
            <svg
              className="absolute -right-4 top-1/3 hidden h-24 w-24 text-brand-yellow lg:block"
              viewBox="0 0 100 100"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M88 18C70 8 30 10 18 38c-8 18 4 36 24 38"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
              />
              <path
                d="M60 78c-2-8-5-14-12-18M62 58c-6 6-9 13-14 20"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>

          {/* Feature list */}
          <ul className="mt-10 lg:mt-0">
            {whyChooseItems.map((item, i) => (
              <FeatureItem
                key={item.id}
                icon={item.icon}
                title={item.title}
                description={item.description}
                index={i}
                isLast={i === whyChooseItems.length - 1}
              />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
