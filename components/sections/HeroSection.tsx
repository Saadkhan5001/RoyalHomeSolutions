"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { BadgeCheck } from "lucide-react";
import Button from "@/components/ui/Button";

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
          {/* Trust badge — original layout, spacing and circular-medallion
              treatment, restored without the stock "happy client" portraits
              or the invented 5/5 star rating (both removed in NOD-198). The
              medallion keeps the h-9 w-9 / border-2 border-white/80 styling
              the avatars used; the wording states only what the site's own
              model supports. */}
          <div className="mb-7 flex items-center gap-3">
            <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border-2 border-white/80 bg-white/10 backdrop-blur-sm">
              <BadgeCheck
                className="h-5 w-5 text-brand-yellow"
                aria-hidden="true"
              />
            </span>
            <p className="text-xs font-medium text-white/90">
              Trusted by local homeowners · No fees or commissions
            </p>
          </div>

          <h1 className="text-4xl font-semibold leading-[1.03] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Sell Your House Fast for Cash
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
            We buy houses directly from homeowners — as-is, for cash, with no
            repairs, no showings, and no agent commissions.
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
