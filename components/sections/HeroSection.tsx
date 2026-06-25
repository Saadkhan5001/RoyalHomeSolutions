"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Button from "@/components/ui/Button";

// Decorative avatar images for the trust badge.
const avatars = [
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
];

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-end overflow-hidden"
    >
      {/* Background image */}
      <Image
        src="/Assets/Images/Hero-background.jpeg"
        alt="Modern luxury home with glass walls overlooking a city skyline at sunset"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {/* Overlay for legibility */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-8xl px-6 pb-20 pt-32 lg:px-10 lg:pb-28">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-2xl"
        >
          {/* Trust badge */}
          <div className="mb-6 flex items-center gap-3">
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
                Trusted by 40+ clients
              </p>
            </div>
          </div>

          <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
            Where Everyone is Treated Like Royalty
          </h1>

          <p className="mt-6 max-w-md text-base leading-relaxed text-white/85 sm:text-lg">
            Find your perfect home with ease. Explore top listings, get expert
            guidance, and make your dream a reality.
          </p>

          <div className="mt-8">
            <Button href="#listings" variant="yellow" withArrow>
              Explore Property
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
