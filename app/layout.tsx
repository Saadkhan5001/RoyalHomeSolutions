import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import MetaPixelProvider from "@/components/providers/MetaPixelProvider";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

/**
 * Root metadata holds only what is genuinely global. Titles, descriptions,
 * canonicals and og:url are page-specific and live in each route's own
 * `pageMetadata()` call — Next merges metadata shallowly, so anything
 * page-specific placed here silently leaks into every child route.
 */
export const metadata: Metadata = {
  // Absolute base for og:image and canonical URLs — relative paths are invalid
  // in link previews.
  metadataBase: new URL(SITE_URL),
  title: "Sell Your House Fast for Cash | Royal Home Solutions, Inc.",
  description:
    "Royal Home Solutions buys houses for cash. Sell as-is with no repairs, no showings, and no agent commissions. Get your free cash offer and close on your timeline.",
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="overflow-x-hidden font-sans antialiased">
        <MetaPixelProvider />
        {metaPixelId && (
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              alt=""
              src={`https://www.facebook.com/tr?id=${metaPixelId}&ev=PageView&noscript=1`}
            />
          </noscript>
        )}
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
