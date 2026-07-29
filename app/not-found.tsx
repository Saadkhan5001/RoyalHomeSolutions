import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Page Not Found — Royal Home Solutions, Inc.",
};

const suggestions = [
  {
    href: "/sell-your-home",
    label: "Sell your home",
    description: "Get a free cash offer on your property.",
  },
  {
    href: "/buy-a-home",
    label: "Buy a home",
    description: "Renovated homes we own and offer for sale.",
  },
  {
    href: "/agent",
    label: "Meet Jonah",
    description: "The person who'll handle your sale.",
  },
  {
    href: "/blog",
    label: "Homeowner resources",
    description: "Practical guides on selling.",
  },
];

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="bg-white">
        <section className="mx-auto flex max-w-8xl flex-col items-center px-6 pb-24 pt-40 text-center lg:px-10 lg:pb-32 lg:pt-48">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-green">
            Error 404
          </p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-brand-ink sm:text-5xl lg:text-6xl">
            We couldn&apos;t find that page
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-neutral-600">
            The link may be out of date, or the page may have moved. Here&apos;s
            where most people are heading.
          </p>

          <div className="mt-9">
            <Button href="/" variant="yellow" withArrow>
              Back to homepage
            </Button>
          </div>

          <div className="mt-16 grid w-full gap-4 text-left sm:grid-cols-2 lg:max-w-3xl">
            {suggestions.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-2xl border border-neutral-200 p-5 transition-colors hover:border-brand-ink hover:bg-neutral-50"
              >
                <p className="font-semibold text-brand-ink">{item.label}</p>
                <p className="mt-1 text-sm text-neutral-500">
                  {item.description}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
