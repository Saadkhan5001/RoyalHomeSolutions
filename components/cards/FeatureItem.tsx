"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface FeatureItemProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
  isLast: boolean;
}

/**
 * A row in the "Why choose" list: a yellow circular icon connected by a
 * vertical line, with a title and supporting copy.
 */
export default function FeatureItem({
  icon: Icon,
  title,
  description,
  index,
  isLast,
}: FeatureItemProps) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.1 }}
      className="relative flex gap-5 pb-8 last:pb-0"
    >
      {/* Vertical connector line */}
      {!isLast && (
        <span
          className="absolute left-6 top-12 h-[calc(100%-3rem)] w-px border-l border-dashed border-neutral-300"
          aria-hidden="true"
        />
      )}

      <div className="relative z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-brand-yellow">
        <Icon className="h-5 w-5 text-brand-ink" aria-hidden="true" />
      </div>

      <div>
        <h3 className="text-lg font-semibold text-brand-ink">{title}</h3>
        <p className="mt-1.5 max-w-md text-sm leading-relaxed text-neutral-500">
          {description}
        </p>
      </div>
    </motion.li>
  );
}
