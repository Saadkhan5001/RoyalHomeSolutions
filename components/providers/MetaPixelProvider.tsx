"use client";

import { Suspense, useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { META_PIXEL_ID, pageview } from "@/lib/metaPixel";

/**
 * Fires a PageView on first load and on every App Router navigation.
 *
 * Lives in its own component because `useSearchParams()` opts the subtree into
 * client-side rendering; the Suspense boundary below keeps that from bubbling
 * up and de-opting the whole layout.
 */
function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastUrl = useRef<string | null>(null);

  useEffect(() => {
    const query = searchParams.toString();
    const url = query ? `${pathname}?${query}` : pathname;

    // Guard against duplicate events from re-renders that don't change the URL.
    if (lastUrl.current === url) return;
    lastUrl.current = url;

    pageview();
  }, [pathname, searchParams]);

  return null;
}

/**
 * Loads the Meta Pixel base script once, globally.
 *
 * The base snippet only calls `fbq('init', ...)` — the initial PageView is left
 * to <PageViewTracker /> so that first load and subsequent route changes go
 * through exactly one code path and never double-count.
 */
export default function MetaPixelProvider() {
  if (!META_PIXEL_ID) return null;

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window,document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
        `}
      </Script>
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
    </>
  );
}
