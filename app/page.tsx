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
