/**
 * Thin client-side wrapper around the Meta (Facebook) Pixel.
 *
 * The Pixel ID is public by design, so it lives in a NEXT_PUBLIC_ env var
 * rather than being hardcoded in components. If the variable is missing
 * (e.g. local dev without a .env.local) every helper here becomes a no-op,
 * so nothing throws and the build/SSR stay clean.
 *
 * TODO: The Conversions API (server-side events) can be layered on later,
 * once the seller lead database/API flow is finalized — the same events fired
 * here would then be mirrored server-side with an `event_id` for dedupe.
 */

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "";

type Fbq = (...args: unknown[]) => void;

declare global {
  interface Window {
    fbq?: Fbq;
  }
}

/** True only in the browser, once the pixel snippet has loaded. */
function getFbq(): Fbq | null {
  if (typeof window === "undefined") return null;
  if (!META_PIXEL_ID) return null;
  return window.fbq ?? null;
}

/** Fires a standard PageView event. */
export function pageview(): void {
  getFbq()?.("track", "PageView");
}

/** Fires a standard Lead event — call only after a successful submission. */
export function trackLead(): void {
  getFbq()?.("track", "Lead");
}
