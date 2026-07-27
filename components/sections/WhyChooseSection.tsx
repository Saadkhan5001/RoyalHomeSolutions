"use client";

import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import FeatureItem from "@/components/cards/FeatureItem";
import ExpertiseVisualCollage from "@/components/sections/ExpertiseVisualCollage";
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
              A simpler way to
              <br className="hidden sm:block" /> sell your home
            </>
          }
        />

        <div className="mt-14 grid items-center gap-12 lg:mt-20 lg:grid-cols-2 lg:gap-20">
          {/* Founder photo collage */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <ExpertiseVisualCollage />
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
