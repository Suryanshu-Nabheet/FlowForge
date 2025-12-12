import { Navbar } from "@/components/landing/navbar";
import { HeroSection } from "@/components/landing/hero-section";
import { LogoCloud } from "@/components/logo-cloud";
import { FeaturesSection } from "@/components/landing/features-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { PricingSection } from "@/components/pricing-section";
import { FaqsSection } from "@/components/faqs-section";
import { CTASection } from "@/components/landing/cta-section";
import { Footer } from "@/components/footer";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground overflow-x-hidden selection:bg-primary/20">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <LogoCloud />
        <FeaturesSection />
        <TestimonialsSection />
        <PricingSection />
        <FaqsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
