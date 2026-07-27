"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Button from "@/components/ui/Button";

// Decorative avatar images for the trust badge.
const avatars = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=160&q=80",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=80",
];

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden"
    >
      {/* Background image */}
      <Image
        src="/Assets/Images/Hero-background.jpeg"
        alt="Modern luxury home with glass walls overlooking a city skyline at sunset"
        fill
        priority
        sizes="100vw"
        className="object-cover brightness-110"
      />
      {/* Overlay for legibility — biased left so the headline reads cleanly
          over the imagery now that the hero is a single column. Kept light so
          the brightened background still shows through on the right. */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-transparent"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-8xl px-6 pb-20 pt-32 lg:px-10 lg:pb-28 lg:pt-40">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-3xl"
        >
          {/* Trust badge */}
          <div className="mb-7 flex items-center gap-3">
            <div className="flex -space-x-3">
              {avatars.map((src, i) => (
                <span
                  key={src}
                  className="relative h-9 w-9 overflow-hidden rounded-full border-2 border-white/80"
                >
                  <Image
                    src={src}
                    alt={`Happy client ${i + 1}`}
                    fill
                    sizes="36px"
                    className="object-cover"
                  />
                </span>
              ))}
            </div>
            <div>
              <div className="flex gap-0.5" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-3.5 w-3.5 fill-brand-yellow text-brand-yellow"
                    aria-hidden="true"
                  />
                ))}
              </div>
              <p className="mt-0.5 text-xs font-medium text-white/90">
                Trusted by local homeowners
              </p>
            </div>
          </div>

          <h1 className="text-4xl font-semibold leading-[1.03] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Sell Your House Fast for Cash
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
            Royal Home Solutions helps homeowners sell as-is with a simple,
            guided process — no repairs, no showings, and no agent commissions.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button
              href="/sell-your-home#seller-form"
              variant="yellow"
              withArrow
            >
              Get My Free Cash Offer
            </Button>
            <Button href="#process" variant="white">
              See How It Works
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
