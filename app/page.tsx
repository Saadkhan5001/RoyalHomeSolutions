import { pageMetadata } from "@/lib/seo";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import TrustSection from "@/components/sections/TrustSection";
import WhyChooseSection from "@/components/sections/WhyChooseSection";
import SellerSituationsSection from "@/components/sections/SellerSituationsSection";
import SellingProcessSection from "@/components/sections/SellingProcessSection";
import ValueSection from "@/components/sections/ValueSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import BlogSection from "@/components/sections/BlogSection";
import CTASection from "@/components/sections/CTASection";
import Footer from "@/components/layout/Footer";

export const metadata = pageMetadata({
  title: "Sell Your House Fast for Cash | Royal Home Solutions, Inc.",
  description:
    "Royal Home Solutions buys houses for cash. Sell as-is with no repairs, no showings, and no agent commissions. Get your free cash offer and close on your timeline.",
  path: "/",
});

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <TrustSection />
        <WhyChooseSection />
        <SellerSituationsSection />
        <SellingProcessSection />
        <ValueSection />
        <TestimonialsSection />
        <BlogSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
