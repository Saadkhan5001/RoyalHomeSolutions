import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { pageMetadata, SITE_NAME, SITE_URL } from "@/lib/seo";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import {
  blogPosts,
  getPost,
  readingMinutes,
  formatPublished,
} from "@/data/blog";

interface PageProps {
  params: { slug: string };
}

/**
 * Internal links inside article prose, written as `[label](/path)`.
 *
 * Deliberately minimal — this is not a Markdown renderer and is not meant to
 * become one. The pattern only accepts paths beginning with a single `/`, so
 * article copy cannot introduce an off-site link, a `javascript:` URL, or a
 * protocol-relative `//host` redirect. Anything that doesn't match is left as
 * literal text rather than being silently dropped.
 */
const INTERNAL_LINK = /\[([^\]\n]+)\]\((\/[A-Za-z0-9\-._~/#?=&%]*)\)/g;

function renderProse(text: string): React.ReactNode {
  const nodes: React.ReactNode[] = [];
  let cursor = 0;
  let match: RegExpExecArray | null;

  // Fresh index per call — the regex is module-scoped and /g is stateful.
  INTERNAL_LINK.lastIndex = 0;

  while ((match = INTERNAL_LINK.exec(text)) !== null) {
    if (match.index > cursor) nodes.push(text.slice(cursor, match.index));
    nodes.push(
      <Link
        key={`${match.index}-${match[2]}`}
        href={match[2]}
        className="font-semibold text-brand-ink underline underline-offset-4 hover:no-underline"
      >
        {match[1]}
      </Link>,
    );
    cursor = match.index + match[0].length;
  }

  if (cursor === 0) return text;
  if (cursor < text.length) nodes.push(text.slice(cursor));
  return nodes;
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const post = getPost(params.slug);
  if (!post) return {};

  return pageMetadata({
    title: `${post.title} — Royal Home Solutions, Inc.`,
    description: post.description,
    path: `/blog/${post.slug}`,
  });
}

export default function BlogArticlePage({ params }: PageProps) {
  const post = getPost(params.slug);
  if (!post) notFound();

  /**
   * Article structured data. Every field is taken from what the page actually
   * displays — headline, description, published date and author all render
   * visibly above — so the markup cannot claim anything the reader can't see.
   * No `image` is declared: these articles have no hero artwork, and pointing
   * at the site's generic OG card would misrepresent it as article imagery.
   */
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    author: { "@type": "Organization", name: post.author },
    publisher: { "@type": "Organization", name: SITE_NAME },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${post.slug}`,
    },
  };

  return (
    <>
      <Navbar />
      <main>
        {/* Type-led header — no stock photography anywhere on the site. */}
        <section className="bg-brand-ink">
          <div className="mx-auto max-w-3xl px-6 pb-14 pt-32 sm:pb-16 sm:pt-36 lg:px-10 lg:pt-40">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-medium text-white/70 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              All resources
            </Link>

            <h1 className="mt-6 text-3xl font-semibold leading-[1.12] tracking-tight text-white sm:text-4xl lg:text-5xl">
              {post.title}
            </h1>

            <div className="mt-6 flex items-center gap-3">
              <span className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border border-white/20 bg-white">
                <Image
                  src="/Assets/Images/Brand-mark.png"
                  alt=""
                  fill
                  sizes="40px"
                  className="object-contain p-1"
                />
              </span>
              <div className="text-sm text-white/80">
                <p className="font-medium text-white">{post.author}</p>
                <p className="text-xs">
                  <time dateTime={post.publishedAt}>
                    {formatPublished(post.publishedAt)}
                  </time>
                  {" · "}
                  {readingMinutes(post)} min read
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Body */}
        <article className="bg-white py-16 lg:py-24">
          <div className="mx-auto max-w-3xl px-6 lg:px-10">
            {post.intro.map((paragraph) => (
              <p
                key={paragraph.slice(0, 40)}
                className="mb-5 text-lg leading-relaxed text-neutral-700"
              >
                {renderProse(paragraph)}
              </p>
            ))}

            {post.sections.map((section) => (
              <section key={section.heading} className="mt-12">
                <h2 className="text-2xl font-semibold tracking-tight text-brand-ink">
                  {section.heading}
                </h2>
                {section.body.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 40)}
                    className="mt-4 text-base leading-relaxed text-neutral-600"
                  >
                    {renderProse(paragraph)}
                  </p>
                ))}
                {section.list && (
                  <ul className="mt-5 space-y-2.5">
                    {section.list.map((item) => (
                      <li
                        key={item}
                        className="flex gap-3 text-base leading-relaxed text-neutral-600"
                      >
                        <span
                          className="mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-brand-yellow"
                          aria-hidden="true"
                        />
                        <span>{renderProse(item)}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}

            <div className="mt-16 rounded-3xl border border-neutral-200 bg-neutral-50 p-8 text-center sm:p-10">
              <h2 className="text-2xl font-semibold tracking-tight text-brand-ink">
                Thinking about selling?
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-neutral-600 sm:text-base">
                Tell us about your property and we&apos;ll review it. There
                &apos;s no obligation, and no agent commission in a direct
                purchase.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Button
                  href="/sell-your-home#seller-form"
                  variant="yellow"
                  withArrow
                >
                  Tell Us About Your Property
                </Button>
                <Button href="/buy-a-home" variant="ghost">
                  View Current Homes
                </Button>
              </div>
              <p className="mt-6 text-sm text-neutral-500">
                Not selling? You can{" "}
                <Link
                  href="/contact"
                  className="font-semibold text-brand-ink underline underline-offset-4 hover:no-underline"
                >
                  ask us anything
                </Link>{" "}
                — buyers, realtors and partners are all welcome.
              </p>
            </div>
          </div>
        </article>
      </main>
      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
    </>
  );
}
