import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/ui/SectionHeading";
import PropertyCard from "@/components/cards/PropertyCard";
import BuyerInterestForm from "@/components/forms/BuyerInterestForm";
import { availableHomes } from "@/data/inventory";

export const metadata: Metadata = pageMetadata({
  title: "Buy a Renovated Home — Royal Home Solutions, Inc.",
  description:
    "Royal Home Solutions buys and renovates select properties, then offers a limited number of move-in-ready homes for sale. See what's available or join the buyer list.",
  path: "/buy-a-home",
});

/**
 * Buyer-facing inventory and enquiry page.
 *
 * No hero photograph on purpose: the site's other heroes use stock imagery
 * (tracked in NOD-110), and a stock house at the top of the page that sells
 * actual company-owned homes would read as inventory. A type-led hero avoids
 * implying a property we don't have.
 */
export default function BuyAHomePage() {
  const hasInventory = availableHomes.length > 0;

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-brand-ink">
          <div className="mx-auto max-w-8xl px-6 pb-16 pt-32 sm:pb-20 sm:pt-36 lg:px-10 lg:pb-24 lg:pt-40">
            <p className="mb-4 inline-flex rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
              Buy a Home
            </p>
            <h1 className="max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Buy a renovated home directly from us
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/85 sm:text-lg">
              Royal Home Solutions buys and renovates select properties, then
              offers a limited number of move-in-ready homes for sale. We are
              not a brokerage, and this is not a general property-listings
              website. When one of our homes is available, you will find it
              here.
            </p>
          </div>
        </section>

        {/* Inventory, or the honest empty state */}
        <section className="bg-white py-20 lg:py-28">
          <div className="mx-auto max-w-8xl px-6 lg:px-10">
            {hasInventory ? (
              <>
                <SectionHeading
                  align="center"
                  className="mx-auto max-w-2xl"
                  title="Available now"
                />
                <p className="mx-auto mt-5 max-w-xl text-center text-sm leading-relaxed text-neutral-600 sm:text-base">
                  Every home here is owned and was renovated by Royal Home
                  Solutions. This is our full current inventory.
                </p>

                <div
                  className={
                    availableHomes.length === 1
                      ? "mx-auto mt-14 max-w-2xl"
                      : "mx-auto mt-14 grid max-w-6xl gap-8 lg:grid-cols-2"
                  }
                >
                  {availableHomes.map((home) => (
                    <PropertyCard key={home.id} home={home} />
                  ))}
                </div>
              </>
            ) : (
              <div className="mx-auto max-w-xl text-center">
                <h2 className="text-3xl font-semibold leading-tight tracking-tight text-brand-ink sm:text-4xl">
                  No homes are currently available
                </h2>
                <p className="mt-5 text-base leading-relaxed text-neutral-600">
                  Our inventory is intentionally limited. Join the buyer list
                  and we&apos;ll let you know when our next renovated home
                  becomes available.
                </p>
                <div className="mt-8">
                  <a
                    href="#buyer-form"
                    className="inline-flex items-center justify-center rounded-full bg-brand-yellow px-6 py-3 text-sm font-semibold text-brand-ink transition-colors hover:bg-brand-yellow-dark"
                  >
                    Join the Buyer List
                  </a>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Enquiry form */}
        <section className="bg-neutral-50 py-20 lg:py-28">
          <div className="mx-auto max-w-2xl px-6 lg:px-10">
            <BuyerInterestForm
              id="buyer-form"
              source="buy_a_home_page"
              propertyOptions={availableHomes.map((home) => ({
                id: home.id,
                title: home.title,
              }))}
            />

            <p className="mt-8 text-center text-xs leading-relaxed text-neutral-500">
              Royal Home Solutions sells only homes it owns. We do not list
              properties for third parties, and our available inventory is
              intentionally limited.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
