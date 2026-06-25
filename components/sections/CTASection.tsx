"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";

export default function CTASection() {
  return (
    <section id="contact" className="bg-white py-12 lg:py-20">
      <div className="mx-auto max-w-8xl px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative overflow-hidden rounded-4xl"
        >
          {/* Background image */}
          <Image
            src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=2000&q=80"
            alt="Lakeside cabin nestled among misty mountains and forest"
            fill
            sizes="(max-width: 1024px) 100vw, 1200px"
            className="object-cover"
          />
          <div
            className="absolute inset-0 bg-black/55"
            aria-hidden="true"
          />

          <div className="relative z-10 flex flex-col items-center px-6 py-20 text-center sm:py-24 lg:py-28">
            <h2 className="max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
              Get in touch &ndash; find your dream home today!
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-white/85 sm:text-base">
              Reach out today to explore top listings, get expert advice, and
              find your perfect home with ease.
            </p>
            <div className="mt-8">
              <Button href="#listings" variant="yellow" withArrow>
                Explore Property
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
