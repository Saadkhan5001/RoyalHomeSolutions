import type { Metadata } from "next";
import { Mail, CalendarClock, Home, Building2 } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import GeneralContactForm from "@/components/forms/GeneralContactForm";
import { resolveInquiryType } from "@/lib/contact";

export const metadata: Metadata = pageMetadata({
  title: "Contact Royal Home Solutions, Inc.",
  description:
    "Get in touch with Royal Home Solutions about selling a property, buying a renovated home, a realtor or professional partnership, or a general question.",
  path: "/contact",
});

const CONTACT_EMAIL = "jonah@royalhomesolutions.com";

/**
 * Booking link, rendered only when configured.
 *
 * NEXT_PUBLIC_BOOK_CALL_URL is inlined at build time. It is validated as an
 * absolute http(s) URL rather than merely checked for truthiness, so a
 * half-configured value ("TODO", "calendly.com" without a scheme) produces no
 * button instead of a dead link. When it is absent the page still reads as
 * complete — the email address and form already cover every path.
 */
function bookCallUrl(): string | null {
  const raw = process.env.NEXT_PUBLIC_BOOK_CALL_URL?.trim();
  if (!raw) return null;

  try {
    const url = new URL(raw);
    return url.protocol === "https:" || url.protocol === "http:" ? raw : null;
  } catch {
    return null;
  }
}

interface PageProps {
  /** `?type=` preselects the form's inquiry type, e.g. /contact?type=buying. */
  searchParams: { type?: string };
}

export default function ContactPage({ searchParams }: PageProps) {
  const bookUrl = bookCallUrl();
  const defaultInquiryType = resolveInquiryType(searchParams.type);

  return (
    <>
      <Navbar />
      <main>
        {/* Type-led hero — no stock photography, matching /faq and /agent. */}
        <section className="bg-brand-ink">
          <div className="mx-auto max-w-8xl px-6 pb-16 pt-32 sm:pb-20 sm:pt-36 lg:px-10 lg:pb-24 lg:pt-40">
            <p className="mb-4 inline-flex rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
              Contact
            </p>
            <h1 className="max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Get in touch
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
              Whether you&apos;re thinking about selling, looking for a
              move-in-ready home, a realtor with a client who might be a fit, or
              exploring a partnership — this is the place to reach us. Every
              message goes to our team and we&apos;ll come back to you.
            </p>
          </div>
        </section>

        <section className="bg-white py-20 lg:py-28">
          <div className="mx-auto max-w-8xl px-6 lg:px-10">
            <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
              {/* Left: direct contact details and audience guidance */}
              <div>
                <h2 className="text-2xl font-semibold tracking-tight text-brand-ink sm:text-3xl">
                  Reach us directly
                </h2>
                <p className="mt-4 text-base leading-relaxed text-neutral-600">
                  Royal Home Solutions is led by Jonah Stevens. Email reaches
                  the team directly, and the form on this page goes to the same
                  inbox.
                </p>

                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="mt-6 flex items-center gap-4 rounded-3xl border border-neutral-200 bg-neutral-50 p-5 transition-colors hover:border-neutral-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-yellow focus-visible:ring-offset-2"
                >
                  <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-brand-yellow">
                    <Mail
                      className="h-5 w-5 text-brand-ink"
                      aria-hidden="true"
                    />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-brand-ink">
                      Email us
                    </span>
                    <span className="block break-words text-sm text-neutral-600">
                      {CONTACT_EMAIL}
                    </span>
                  </span>
                </a>

                {/* Only rendered when a valid booking URL is configured. */}
                {bookUrl && (
                  <div className="mt-4 flex items-center gap-4 rounded-3xl border border-neutral-200 bg-neutral-50 p-5">
                    <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-brand-green">
                      <CalendarClock
                        className="h-5 w-5 text-white"
                        aria-hidden="true"
                      />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-brand-ink">
                        Prefer to talk?
                      </p>
                      <p className="mt-0.5 text-sm text-neutral-600">
                        Book a time that suits you.
                      </p>
                    </div>
                    <Button href={bookUrl} variant="dark" className="shrink-0">
                      Book a Call
                    </Button>
                  </div>
                )}

                <h3 className="mt-10 text-lg font-semibold text-brand-ink">
                  Looking for something specific?
                </h3>
                <div className="mt-4 space-y-3">
                  <div className="flex gap-4 rounded-3xl border border-neutral-200 p-5">
                    <Home
                      className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-green"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="text-sm font-semibold text-brand-ink">
                        Want an offer on your house?
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-neutral-600">
                        The{" "}
                        <a
                          href="/sell-your-home#seller-form"
                          className="font-semibold text-brand-ink underline underline-offset-4 hover:no-underline"
                        >
                          seller form
                        </a>{" "}
                        asks the right questions about your property and gets
                        you a faster answer.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4 rounded-3xl border border-neutral-200 p-5">
                    <Building2
                      className="mt-0.5 h-5 w-5 flex-shrink-0 text-brand-green"
                      aria-hidden="true"
                    />
                    <div>
                      <p className="text-sm font-semibold text-brand-ink">
                        Looking to buy?
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-neutral-600">
                        We offer a limited number of renovated homes. See{" "}
                        <a
                          href="/buy-a-home"
                          className="font-semibold text-brand-ink underline underline-offset-4 hover:no-underline"
                        >
                          what&apos;s available
                        </a>
                        , or ask us to keep you posted.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: the general enquiry form */}
              <GeneralContactForm
                id="contact-form"
                defaultInquiryType={defaultInquiryType}
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
