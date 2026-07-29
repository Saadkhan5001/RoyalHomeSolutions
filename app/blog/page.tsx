import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/layout/PageHero";
import CTASection from "@/components/sections/CTASection";
import BlogCard from "@/components/cards/BlogCard";
import { blogPosts } from "@/data/blog";

export const metadata: Metadata = {
  title: "Homeowner Resources — Royal Home Solutions, Inc.",
  description:
    "Practical guides for homeowners weighing a sale: selling a house that needs repairs, what to know before accepting a cash offer, and handling an inherited property.",
};

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          eyebrow="Homeowner Resources"
          title="Straight answers about selling"
          subtitle="Short, practical guides for the situations homeowners actually call us about — no jargon and nothing designed to talk you into a sale."
          image="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=2400&q=85"
          imageAlt="Sunlit living room in a comfortable family home"
        />

        <section className="bg-white py-20 lg:py-28">
          <div className="mx-auto max-w-8xl px-6 lg:px-10">
            {/*
              Cards are not links: `data/blog.ts` holds titles and metadata but
              no article bodies, so there is nothing to route to yet. Add a
              `/blog/[slug]` route once posts have content — wrapping these in
              dead links now would be worse than leaving them static.
            */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {blogPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>

            <p className="mt-14 text-center text-sm text-neutral-500">
              More guides are on the way. Have a question we haven&apos;t
              covered?{" "}
              <a
                href="/sell-your-home#seller-form"
                className="font-semibold text-brand-ink underline underline-offset-4 hover:no-underline"
              >
                Ask us directly
              </a>
              .
            </p>
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </>
  );
}
