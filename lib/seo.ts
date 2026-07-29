import type { Metadata } from "next";

/**
 * Per-page metadata builder.
 *
 * Next.js merges metadata *shallowly*: a child route that declares `openGraph`
 * replaces the parent's object wholesale, and one that declares nothing
 * inherits the parent's values verbatim — including `alternates.canonical`.
 * Page-specific fields therefore must not live in the root layout, or every
 * route ends up claiming the homepage as its canonical URL and advertising the
 * homepage title in link previews.
 *
 * Every indexable route calls this so the full set is always declared together.
 */

export const SITE_NAME = "Royal Home Solutions, Inc.";

// Overridable so preview deployments can self-reference instead of pointing at
// production.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://royalhomesolutions.com";

/**
 * The card from `app/opengraph-image.png`, referenced explicitly.
 *
 * That file convention only attaches the image to the segment it sits in — a
 * child route that declares its own `openGraph` ends up with no image at all.
 * Naming it here keeps every route's preview intact. Resolved absolutely via
 * `metadataBase`.
 */
const OG_IMAGE = {
  url: "/opengraph-image.png",
  width: 1200,
  height: 630,
  alt: "Royal Home Solutions, Inc. — Sell your house fast for cash. No repairs. No showings. No agent commissions.",
};

interface PageMetaOptions {
  title: string;
  description: string;
  /** Route path, leading slash, e.g. "/property". Resolved against metadataBase. */
  path: string;
}

export function pageMetadata({
  title,
  description,
  path,
}: PageMetaOptions): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "en_US",
      title,
      description,
      url: path,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE.url],
    },
  };
}
