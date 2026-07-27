"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

// Homepage anchors are page-absolute (/#...) so they work from any route.
const navLinks = [
  { label: "Home", href: "/#home" },
  { label: "How It Works", href: "/#process" },
  { label: "Sell Your Home", href: "/sell-your-home" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

// Three explicit header states keep the logic unambiguous (no mixed booleans).
type NavState = "top" | "visible-dark" | "hidden";

// Transparent hero style while within this distance of the top.
const TOP_THRESHOLD = 80;
// Only allow hiding once comfortably past the top zone. The wide gap from
// TOP_THRESHOLD is the hysteresis that stops boundary flicker.
const HIDE_THRESHOLD = 180;
// Accumulated movement (not per-event) required before reacting. Larger than a
// single Lenis easing step so the smoothed micro-updates are ignored.
const SCROLL_DELTA = 14;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [navState, setNavState] = useState<NavState>("top");

  // Refs hold the live scroll values so per-frame scroll events never force a
  // React re-render — we only call setState when the resolved state changes.
  const anchorY = useRef(0); // last position we acted on (deadzone baseline)
  const stateRef = useRef<NavState>("top");
  const openRef = useRef(false);
  const ticking = useRef(false);

  useEffect(() => {
    openRef.current = open;
  }, [open]);

  useEffect(() => {
    anchorY.current = window.scrollY;

    const resolve = () => {
      const y = window.scrollY;
      let next = stateRef.current;

      if (y < TOP_THRESHOLD) {
        // Near the very top: always the transparent hero header.
        next = "top";
        anchorY.current = y;
      } else if (openRef.current) {
        // Menu open: never hide; just pick the dark style once past the top.
        next = "visible-dark";
      } else {
        const diff = y - anchorY.current;
        if (Math.abs(diff) >= SCROLL_DELTA) {
          // Net movement passed the deadzone — act on its direction.
          anchorY.current = y;
          if (diff > 0) {
            // Scrolling down: hide only past the hide threshold.
            next = y > HIDE_THRESHOLD ? "hidden" : "visible-dark";
          } else {
            // Scrolling up: reveal the dark sticky bar.
            next = "visible-dark";
          }
        } else if (stateRef.current === "top") {
          // Crossed below the top zone without a big move yet: show dark bar.
          next = "visible-dark";
        }
        // Otherwise movement is within the deadzone — keep the current state
        // and don't move the anchor, so tiny Lenis updates accumulate.
      }

      if (next !== stateRef.current) {
        stateRef.current = next;
        setNavState(next);
      }
      ticking.current = false;
    };

    const onScroll = () => {
      // rAF throttle: coalesce the many scroll events Lenis emits per frame
      // into a single resolve() per frame.
      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(resolve);
      }
    };

    resolve();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Prevent body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Dark solid bar whenever not at the top, or while the mobile menu is open.
  const solid = navState !== "top" || open;
  // Never hide while the mobile menu is open.
  const isHidden = navState === "hidden" && !open;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[transform,background-color,border-color,box-shadow] duration-300 ease-out",
        isHidden ? "-translate-y-full" : "translate-y-0",
        solid
          ? "border-b border-white/10 bg-brand-ink/95 shadow-lg backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <nav className="mx-auto flex max-w-8xl items-center justify-between px-6 py-3 lg:px-10 lg:py-4">
        {/* Logo — white/monochrome treatment for the dark, transparent header */}
        <Link
          href="/#home"
          className="flex items-center"
          onClick={() => setOpen(false)}
          aria-label="Royal Home Solutions, Inc. — home"
        >
          <Image
            src="/Assets/Images/Logo-cropped.png"
            alt="Royal Home Solutions, Inc."
            width={403}
            height={175}
            priority
            className="h-14 w-auto brightness-0 invert sm:h-16"
          />
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm font-medium text-white/90 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden lg:block">
          <Button href="/sell-your-home#seller-form" variant="white" withArrow>
            Get Cash Offer
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="text-white lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={cn(
          "overflow-hidden bg-brand-ink/95 backdrop-blur-md transition-[max-height] duration-300 lg:hidden",
          open ? "max-h-[28rem]" : "max-h-0"
        )}
      >
        <ul className="flex flex-col gap-1 px-6 pb-6 pt-2">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-3 text-base font-medium text-white/90 transition-colors hover:bg-white/10 hover:text-white"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li className="mt-3">
            <Button
              href="/sell-your-home#seller-form"
              variant="yellow"
              withArrow
              className="w-full"
            >
              Get Cash Offer
            </Button>
          </li>
        </ul>
      </div>
    </header>
  );
}
