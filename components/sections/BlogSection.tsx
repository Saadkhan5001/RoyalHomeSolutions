"use client";

import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import SectionHeading from "@/components/ui/SectionHeading";
import BlogCard from "@/components/cards/BlogCard";
import { blogPosts } from "@/data/blog";

export default function BlogSection() {
  return (
    <section id="blog" className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-8xl px-6 lg:px-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <SectionHeading
            className="max-w-lg"
            title={
              <>
                Helpful resources
                <br className="hidden sm:block" /> for homeowners
              </>
            }
          />
          <Button
            href="/sell-your-home#seller-form"
            variant="yellow"
            withArrow
            className="self-start sm:self-auto"
          >
            Get My Free Cash Offer
          </Button>
        </div>

        <div className="mt-12 grid gap-6 lg:mt-16 lg:grid-cols-3">
          {blogPosts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, ease: "easeOut", delay: i * 0.1 }}
            >
              <BlogCard post={post} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
