"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  as?: "h2" | "h3";
}

/**
 * Reusable animated section title. Fades and rises into view once when it
 * enters the viewport.
 */
export default function SectionHeading({
  title,
  align = "left",
  className,
  as: Tag = "h2",
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(align === "center" && "text-center", className)}
    >
      <Tag className="text-3xl font-semibold leading-tight tracking-tight text-brand-ink sm:text-4xl lg:text-5xl">
        {title}
      </Tag>
    </motion.div>
  );
}
