"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Loader2,
} from "lucide-react";

const landingsLinks = [
  { label: "Homepage", href: "/#home" },
  { label: "How It Works", href: "/#process" },
  { label: "Buy a Home", href: "/buy-a-home" },
  { label: "About Us", href: "/agent" },
  { label: "Contact", href: "/#contact" },
];

const informationLinks = [
  { label: "Sell Your Home", href: "/sell-your-home" },
  { label: "Get a Cash Offer", href: "/sell-your-home#seller-form" },
  { label: "Homeowners We Help", href: "/#situations" },
  { label: "FAQ", href: "/faq" },
  { label: "Homeowner Resources", href: "/blog" },
];

const socials = [
  { label: "Facebook", href: "#", icon: Facebook },
  { label: "Instagram", href: "#", icon: Instagram },
  { label: "Twitter", href: "#", icon: Twitter },
  { label: "LinkedIn", href: "#", icon: Linkedin },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const submitting = status === "submitting";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || submitting) return;

    setStatus("submitting");
    setErrorMessage("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(
          body?.error ?? "We couldn't sign you up. Please try again.",
        );
      }

      setStatus("success");
      setEmail("");
    } catch (error) {
      // Keep the typed address so they don't have to retype it to retry.
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "We couldn't sign you up. Please try again.",
      );
      setStatus("error");
    }
  };

  return (
    <footer className="border-t border-neutral-100 bg-white">
      <div className="mx-auto max-w-8xl px-6 py-16 lg:px-10">
        {/* Top row: brand + contact */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              href="#home"
              className="inline-flex items-center"
              aria-label="Royal Home Solutions, Inc. — home"
            >
              <Image
                src="/Assets/Images/Logo-cropped.png"
                alt="Royal Home Solutions, Inc."
                width={403}
                height={175}
                className="h-20 w-auto"
              />
            </Link>
            {/* Investor-positioning brand line (NOD-199). No service-area
                claim until NOD-196 confirms it. */}
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-neutral-500">
              Royal Home Solutions buys homes directly from owners, renovates
              select properties, and resells a limited number of move-in-ready
              homes.
            </p>
          </div>

          <div className="flex flex-col gap-2 text-sm sm:flex-row sm:gap-8">
            <p className="text-neutral-500">
              <span className="font-semibold text-brand-ink">Contact Us</span>{" "}
              <a
                href="mailto:jonah@royalhomesolutions.com"
                className="transition-colors hover:text-brand-ink"
              >
                jonah@royalhomesolutions.com
              </a>
            </p>
            <p className="text-neutral-500">
              <span className="font-semibold text-brand-ink">Location</span>{" "}
              Florida
            </p>
          </div>
        </div>

        <hr className="my-10 border-neutral-100" />

        {/* Link columns + newsletter */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1fr_1fr_1.4fr]">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-brand-ink">
              Landings
            </h3>
            <ul className="mt-4 space-y-3">
              {landingsLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-500 transition-colors hover:text-brand-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-brand-ink">Information</h3>
            <ul className="mt-4 space-y-3">
              {informationLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-500 transition-colors hover:text-brand-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-brand-ink">Newsletter</h3>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-neutral-500">
              Subscribe for helpful tips on selling your home quickly, plus
              homeowner resources and updates.
            </p>

            <form onSubmit={handleSubmit} className="mt-5 flex max-w-sm gap-3">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitting}
                placeholder="Enter your email"
                className="w-full rounded-full border border-neutral-300 px-5 py-3 text-sm text-brand-ink outline-none transition-colors placeholder:text-neutral-400 focus:border-brand-ink disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={submitting}
                aria-label="Subscribe to newsletter"
                className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-brand-yellow text-brand-ink transition-colors hover:bg-brand-yellow-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                ) : (
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            </form>
            {status === "success" && (
              <p className="mt-3 text-sm text-brand-green" role="status">
                Thanks for subscribing!
              </p>
            )}
            {status === "error" && errorMessage && (
              <p className="mt-3 text-sm text-red-600" role="alert">
                {errorMessage}
              </p>
            )}

            <div className="mt-6 flex gap-3">
              {socials.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 text-brand-ink transition-colors hover:border-brand-ink hover:bg-brand-ink hover:text-white"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <hr className="my-10 border-neutral-100" />

        <p className="text-center text-sm text-neutral-500">
          &copy; {new Date().getFullYear()} Royal Home Solutions, Inc. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}
