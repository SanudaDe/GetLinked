import React from "react";
import { Hero } from "@/components/home/Hero";
import { EditorialStorySection } from "@/components/home/EditorialStorySection";
import { DestinationsGrid } from "@/components/home/DestinationsGrid";
import { FeaturedCreators } from "@/components/home/FeaturedCreators";
import { FeaturedAccommodations } from "@/components/home/FeaturedAccommodations";
import { VideoReelsSection } from "@/components/home/VideoReelsSection";
import { SriLankaAwaitsBanner } from "@/components/home/SriLankaAwaitsBanner";

export default function HomePage() {
  return (
    <main className="bg-[#E0DDAE] text-[#336467] selection:bg-[#D7400B] selection:text-white">
      {/* 1. Hero: An island tells its story best through the people who stay */}
      <Hero />

      {/* 2. Influencers / Creators First: A few of the voices heading to Sri Lanka this season */}
      <FeaturedCreators />

      {/* 3. Editorial Story: People. Places. Possibilities */}
      <EditorialStorySection />

      {/* 4. Destinations: Six places, each holding its own quiet */}
      <DestinationsGrid />

      {/* 5. Stays: Stays chosen with the same care as the work they inspire */}
      <FeaturedAccommodations />

      {/* 6. Stories in Motion: User Video Reels Showcase (public/videos) */}
      <VideoReelsSection />

      {/* 7. Bottom Hero: Sri Lanka Awaits — Extraordinary stays. Incredible stories */}
      <SriLankaAwaitsBanner />
    </main>
  );
}
