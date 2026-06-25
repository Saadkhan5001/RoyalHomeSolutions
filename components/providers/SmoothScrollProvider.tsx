"use client";

import { useEffect, useState } from "react";
import { ReactLenis } from "lenis/react";

/**
 * Adds Lenis smooth scrolling across the app.
 *
 * - `root` makes Lenis drive the real window scroll, so native scroll events
 *   still fire (the navbar's hide/show logic keeps working) and anchor links
 *   continue to resolve to the right position.
 * - Smoothing is applied to the mouse wheel only; touch scrolling stays native
 *   to avoid janky/odd mobile behavior.
 * - Disabled entirely for users who prefer reduced motion (falls back to the
 *   browser's default scrolling).
 */
export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  if (reducedMotion) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      options={{
        duration: 1.1,
        smoothWheel: true,
        wheelMultiplier: 0.9,
      }}
    >
      {children}
    </ReactLenis>
  );
}
