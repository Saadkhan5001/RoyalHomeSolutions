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
} from "lucide-react";

const landingsLinks = [
  { label: "Homepage", href: "#home" },
  { label: "About us", href: "#about" },
  { label: "Contact", href: "#contact" },
];

const informationLinks = [
  { label: "Property", href: "#listings" },
  { label: "Property Details", href: "#listings" },
  { label: "Agent", href: "#agent" },
  { label: "Agent Details", href: "#agent" },
  { label: "Blog", href: "#blog" },
  { label: "Blog Details", href: "#blog" },
  { label: "404", href: "#" },
];

const socials = [
  { label: "Facebook", href: "#", icon: Facebook },
  { label: "Instagram", href: "#", icon: Instagram },
  { label: "Twitter", href: "#", icon: Twitter },
  { label: "LinkedIn", href: "#", icon: Linkedin },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setEmail("");
  };

  return (
    <footer className="border-t border-neutral-100 bg-white">
      <div className="mx-auto max-w-8xl px-6 py-16 lg:px-10">
        {/* Top row: brand + contact */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
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

          <div className="flex flex-col gap-2 text-sm sm:flex-row sm:gap-8">
            <p className="text-neutral-500">
              <span className="font-semibold text-brand-ink">Contact Us</span>{" "}
              <a
                href="mailto:hello@royalhomesolutions.com"
                className="transition-colors hover:text-brand-ink"
              >
                hello@royalhomesolutions.com
              </a>
            </p>
            <p className="text-neutral-500">
              <span className="font-semibold text-brand-ink">Location</span> San
              Francisco, CA
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
            <h3 className="text-sm font-semibold text-brand-ink">newsletter</h3>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-neutral-500">
              Subscribe to our newsletter for exclusive real estate updates,
              tips, and market insights.
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
                placeholder="Enter your email"
                className="w-full rounded-full border border-neutral-300 px-5 py-3 text-sm text-brand-ink outline-none transition-colors placeholder:text-neutral-400 focus:border-brand-ink"
              />
              <button
                type="submit"
                aria-label="Subscribe to newsletter"
                className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-brand-yellow text-brand-ink transition-colors hover:bg-brand-yellow-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow focus-visible:ring-offset-2"
              >
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </form>
            {submitted && (
              <p className="mt-3 text-sm text-brand-green" role="status">
                Thanks for subscribing!
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
