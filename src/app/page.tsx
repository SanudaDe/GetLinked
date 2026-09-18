import React from "react";
import { Hero } from "@/components/home/Hero";
import { EditorialStorySection } from "@/components/home/EditorialStorySection";
import { ForCreatorsSection } from "@/components/home/ForCreatorsSection";
import { ForStaysSection } from "@/components/home/ForStaysSection";
import { VideoReelsSection } from "@/components/home/VideoReelsSection";
import { HowItWorksCurated } from "@/components/home/HowItWorksCurated";
import { SriLankaAwaitsBanner } from "@/components/home/SriLankaAwaitsBanner";

export default function HomePage() {
  return (
    <main className="bg-[#FAF8F5] text-[#122026] selection:bg-[#16252C] selection:text-white">
      {/* 1. Hero: Where good stays meet good stories */}
      <Hero />

      {/* 2. Editorial Story: People. Places. Possibilities. */}
      <EditorialStorySection />

      {/* 3. For Creators: Be discovered by places worth telling stories about */}
      <ForCreatorsSection />

      {/* 4. For Stays: Find creators who fit your world */}
      <ForStaysSection />

      {/* 5. Stories in Motion: User Video Reels Showcase (public/videos) */}
      <VideoReelsSection />

      {/* 6. How It Works: Curated, not crowded (with circular palm tree seal badge) */}
      <HowItWorksCurated />

      {/* 7. Bottom Hero: Sri Lanka Awaits — Extraordinary stays. Incredible stories. */}
      <SriLankaAwaitsBanner />
    </main>
  );
}
