import React from "react";
import { Hero } from "@/components/home/Hero";
import { DestinationsGrid } from "@/components/home/DestinationsGrid";
import { FeaturedCreators } from "@/components/home/FeaturedCreators";
import { FeaturedAccommodations } from "@/components/home/FeaturedAccommodations";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { WhyUsSection } from "@/components/home/WhyUsSection";
import { TrustSection } from "@/components/home/TrustSection";
import { AdBanner } from "@/components/home/AdBanner";
import { FaqSection } from "@/components/home/FaqSection";

export default function HomePage() {
  return (
    <div>
      <Hero />
      <DestinationsGrid />
      <FeaturedCreators />
      <FeaturedAccommodations />
      <HowItWorksSection />
      <AdBanner placement="HOME" />
      <WhyUsSection />
      <TrustSection />
      <FaqSection />
    </div>
  );
}
