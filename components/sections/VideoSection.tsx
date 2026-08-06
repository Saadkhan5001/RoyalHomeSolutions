"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

const VIDEO_ID = "924fXKU56rs";
const VIDEO_TITLE =
  "Royal Home Solutions, Inc. — Real Estate Investment Company";

/**
 * Company intro video, placed between the trust section and "Why choose" so a
 * homeowner scrolling the page passes it without it competing with the hero.
 *
 * Deliberately a click-to-play facade rather than a live <iframe>: a normal
 * YouTube embed pulls ~1MB of player scripts and sets Google cookies on every
 * page load, whether or not anyone watches. Here the poster frame is served
 * from /public and the player is only mounted on click, so the page makes no
 * request to Google until the visitor asks for one. nocookie.com is used for
 * the same reason. It also keeps the section still — the page already has two
 * auto-scrolling image tracks and does not need a third moving element.
 */
export default function VideoSection() {
  const [playing, setPlaying] = useState(false);

  return (
    <section className="bg-neutral-50 py-20 lg:py-28">
      <div className="mx-auto max-w-8xl px-6 lg:px-10">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="max-w-lg">
            <SectionHeading title="See how we work" />
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
              className="mt-5 text-base leading-relaxed text-neutral-600 sm:text-lg"
            >
              A short introduction to who we are and how a direct sale to Royal
              Home Solutions actually works — no listing, no repairs, and no
              agent commission.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative aspect-video w-full overflow-hidden rounded-3xl bg-brand-ink shadow-lg"
          >
            {playing ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${VIDEO_ID}?autoplay=1&rel=0`}
                title={VIDEO_TITLE}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            ) : (
              <button
                type="button"
                onClick={() => setPlaying(true)}
                aria-label={`Play video: ${VIDEO_TITLE}`}
                className="group absolute inset-0 h-full w-full cursor-pointer"
              >
                <Image
                  src="/Assets/Images/Video-thumbnail.jpg"
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 90vw, 640px"
                  className="object-cover"
                />
                {/* Dim the poster so the play control stays legible over the
                    lighter areas of the frame. */}
                <span
                  className="absolute inset-0 bg-black/25 transition-colors group-hover:bg-black/35"
                  aria-hidden="true"
                />
                <span
                  className="absolute inset-0 flex items-center justify-center"
                  aria-hidden="true"
                >
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-yellow shadow-lg transition-transform duration-300 group-hover:scale-110 sm:h-20 sm:w-20">
                    <Play
                      className="ml-1 h-7 w-7 fill-brand-ink text-brand-ink sm:h-8 sm:w-8"
                      strokeWidth={1.5}
                    />
                  </span>
                </span>
              </button>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
