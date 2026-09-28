"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Chapter {
  id: string;
  region: string;
  tagline: string;
  description: string;
  image: string;
  details: string;
}

const CHAPTERS: Chapter[] = [
  {
    id: "galle",
    region: "GALLE AND THE SOUTH COAST",
    tagline: "Colonial ramparts, saltwater courtyards, maritime stillness.",
    description:
      "From seventeenth-century Dutch colonial ramparts to quiet saltwater plunge villas tucked into coconut groves, our southern partners celebrate the languid tempo of maritime Ceylon. Slow afternoons, ocean air at dusk, and timeless architecture crafted for quiet contemplation.",
    image: "/images/galle.jpg",
    details: "Restored Dutch manses • Saltwater plunge villas • Thalpe & Fort",
  },
  {
    id: "ella",
    region: "ELLA AND THE TEA HIGHLANDS",
    tagline: "Misty mountain passes, stone fireplaces, emerald tea valleys.",
    description:
      "Century-old planter's bungalows, railway bridges spanning misty ravines, and mornings winding through cloud above emerald tea gardens. High-altitude sanctuaries where stillness, valley mist, and woodsmoke inspire contemplative visual essays.",
    image: "/images/ella.jpg",
    details: "Historic tea estates • Mountain view retreats • Planter's bungalows",
  },
  {
    id: "weligama",
    region: "WELIGAMA AND SURF SANCTUARIES",
    tagline: "First wave at daybreak, open-air pavilions, barefoot ease.",
    description:
      "Open-air pavilions, barefoot mornings, and the southern swells setting the daily rhythm. Surf retreats and coastal sanctuaries where wellness, ocean light, and easy conviviality converge into work worth remembering.",
    image: "/images/weligama.jpg",
    details: "Surf retreats • Rooftop yoga shalas • Coastal boutique hideaways",
  },
  {
    id: "kandy",
    region: "KANDY AND THE SACRED HILLS",
    tagline: "Temple bells, lake mist, gardens older than memory.",
    description:
      "Temple bells echoing across misted waters, royal botanical canopies, and heritage estates older than memory. Sacred hills steeped in artisanal craft, quiet reflection, and noble highland breezes.",
    image: "/images/kandy.jpg",
    details: "Heritage manors • Sacred valley estates • Botanical forest lodges",
  },
  {
    id: "sigiriya",
    region: "SIGIRIYA AND THE CULTURAL TRIANGLE",
    tagline: "A fifth-century citadel rising from the jungle canopy.",
    description:
      "Ancient palaces etched into colossal rock monoliths, lotus-fringed lakes, and wild elephant corridors. Eco-residences where fifth-century history meets understated sustainable luxury under starry jungle skies.",
    image: "/images/sigiriya.jpg",
    details: "Eco-luxury lodges • Jungle pool villas • Ancient cultural gateway",
  },
  {
    id: "colombo",
    region: "COLOMBO AND MODERN CEYLON",
    tagline: "Rooftop light, old spice markets, a capital in motion.",
    description:
      "Colonial verandas set against high-rise light, quiet cinnamon gardens, and contemporary art galleries. A city where historic trading houses transform into private design salons and culinary sanctuaries.",
    image: "/images/colombo.jpg",
    details: "Design boutique hotels • Colonial townhouses • Private city suites",
  },
];

export default function AboutPage() {
  const N = CHAPTERS.length;
  const extendedList = [...CHAPTERS, ...CHAPTERS, ...CHAPTERS];
  const [currentIndex, setCurrentIndex] = useState(N);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Viewport Container Measurement
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(1200);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Responsive dimensions for centered active slide and side peeking
  const cardWidth = Math.min(containerWidth * 0.88, 980);
  const gap = containerWidth < 768 ? 24 : 56;
  const offset = containerWidth / 2 - (currentIndex * (cardWidth + gap) + cardWidth / 2);

  // Navigation handlers
  const handleNext = useCallback(() => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  }, []);

  const handlePrev = useCallback(() => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  }, []);

  // Seamless wrap-around reset
  const handleTransitionEnd = () => {
    if (currentIndex >= 2 * N) {
      setIsTransitioning(false);
      setCurrentIndex(currentIndex - N);
    } else if (currentIndex < N) {
      setIsTransitioning(false);
      setCurrentIndex(currentIndex + N);
    }
  };

  // Touch Swipe Gesture Support
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const deltaX = touchStartX - e.changedTouches[0].clientX;
    if (deltaX > 45) {
      handleNext();
    } else if (deltaX < -45) {
      handlePrev();
    }
    setTouchStartX(null);
  };

  return (
    <div className="bg-[#E0DDAE] text-[#336467] min-h-screen">
      {/* 1. Top Editorial Header (COMO Hotels Style) */}
      <section className="pt-24 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <span className="text-[11px] sm:text-xs font-normal uppercase tracking-[0.32em] text-[#336467]/70 block mb-4">
          ABOUT GET LINKED
        </span>

        <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light uppercase tracking-[0.08em] sm:tracking-[0.12em] text-[#336467] leading-[1.08] mb-8">
          An island told with care.
        </h1>

        {/* Narrative Manifesto Paragraphs */}
        <div className="max-w-3xl mx-auto space-y-6 text-sm sm:text-base lg:text-lg text-[#336467]/85 font-light leading-relaxed">
          <p>
            Get Linked is a handpicked collective of distinctive boutique hotels, historic tea
            bungalows, and private coastal villas across Sri Lanka, thoughtfully paired with verified
            creators worth trusting with their story.
          </p>
          <p>
            All our partnerships share the same values — a commitment to thoughtful design, genuine
            hospitality, and an unwavering sense of place. We celebrate how each property honours its
            location, reflecting Ceylon culture, craftsmanship, and dramatic landscapes through a
            contemporary lens.
          </p>
          <p className="text-xs sm:text-sm uppercase tracking-[0.22em] text-[#D7400B] font-medium pt-2">
            Private island pavilions &bull; Highland tea bungalows &bull; Heritage fort manses &bull;
            Wild nature sanctuaries
          </p>
        </div>

        {/* Subtle Hairline Underline */}
        <div className="w-24 h-px bg-[#336467]/30 mx-auto mt-12" />
      </section>

      {/* 2. COMO-Style Split Showcase Carousel (Image 2 Reference) */}
      <section className="py-12 sm:py-20 overflow-hidden border-t border-[#C8C488] select-none">
        <div
          ref={containerRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative w-full overflow-hidden py-4"
        >
          {/* Sliding Track with Peeking Sides */}
          <div
            onTransitionEnd={handleTransitionEnd}
            style={{
              transform: `translateX(${offset}px)`,
              transition: isTransitioning
                ? "transform 750ms cubic-bezier(0.16, 1, 0.3, 1)"
                : "none",
              gap: `${gap}px`,
            }}
            className="flex items-center"
          >
            {extendedList.map((chapter, idx) => {
              const isActive = idx === currentIndex;
              const isPrev = idx === currentIndex - 1;
              const isNext = idx === currentIndex + 1;
              const isAdjacent = isPrev || isNext;

              return (
                <div
                  key={`${chapter.id}-${idx}`}
                  style={{ width: `${cardWidth}px` }}
                  onClick={() => {
                    if (isPrev) handlePrev();
                    if (isNext) handleNext();
                  }}
                  className={`shrink-0 transition-all duration-700 ease-out select-none ${
                    isActive
                      ? "opacity-100 scale-100 cursor-default"
                      : isAdjacent
                      ? "opacity-35 hover:opacity-75 scale-[0.93] cursor-pointer"
                      : "opacity-15 scale-[0.88] pointer-events-none"
                  }`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-14 items-center">
                    {/* Left: Vertical / Portrait Image (COMO Style) */}
                    <div className="md:col-span-5 lg:col-span-5 relative">
                      <div className="relative aspect-[3/4] sm:aspect-[4/5] md:aspect-[3/4] w-full overflow-hidden rounded-xl sm:rounded-2xl bg-[#D0CD96] shadow-warm-lg">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={chapter.image}
                          alt={chapter.region}
                          className={`w-full h-full object-cover object-center transition-transform duration-700 ease-out ${
                            isActive ? "hover:scale-103" : ""
                          }`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
                      </div>
                    </div>

                    {/* Right: Typography & Storytelling Content */}
                    <div className="md:col-span-7 lg:col-span-7 flex flex-col justify-between space-y-6">
                      {/* Top Hairline Navigation Arrows */}
                      <div className="hidden sm:flex items-center gap-6">
                        <button
                          type="button"
                          disabled={!isActive}
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePrev();
                          }}
                          aria-label="Previous chapter"
                          className="text-[#336467] hover:text-[#D7400B] transition-all duration-300 hover:-translate-x-1 cursor-pointer disabled:cursor-default group p-1"
                        >
                          <svg
                            width="48"
                            height="16"
                            viewBox="0 0 48 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="stroke-current"
                          >
                            <path
                              d="M48 8H2M9 1L2 8L9 15"
                              strokeWidth="1.2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                        <button
                          type="button"
                          disabled={!isActive}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleNext();
                          }}
                          aria-label="Next chapter"
                          className="text-[#336467] hover:text-[#D7400B] transition-all duration-300 hover:translate-x-1 cursor-pointer disabled:cursor-default group p-1"
                        >
                          <svg
                            width="48"
                            height="16"
                            viewBox="0 0 48 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="stroke-current"
                          >
                            <path
                              d="M0 8H46M39 1L46 8L39 15"
                              strokeWidth="1.2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>

                      {/* Region Title (Thin Uppercase Serif) */}
                      <div className="space-y-2">
                        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light uppercase tracking-[0.14em] text-[#336467] leading-[1.12]">
                          {chapter.region}
                        </h2>
                        <p className="text-[11px] sm:text-xs uppercase tracking-[0.24em] font-semibold text-[#D7400B]">
                          {chapter.tagline}
                        </p>
                      </div>

                      {/* Body Paragraph */}
                      <p className="text-sm sm:text-base text-[#336467]/85 font-light leading-relaxed max-w-xl">
                        {chapter.description}
                      </p>

                      {/* Region Stays Tag */}
                      <p className="text-[11px] uppercase tracking-[0.2em] text-[#336467]/60 font-medium pt-1">
                        {chapter.details}
                      </p>

                      {/* Bottom Hairline Navigation Arrows & Action Link */}
                      <div className="flex items-center justify-between pt-4 sm:pt-6 border-t border-[#C8C488]/60">
                        <Link
                          href={`/creators?city=${encodeURIComponent(chapter.id)}`}
                          tabIndex={isActive ? 0 : -1}
                          onClick={(e) => {
                            if (!isActive) e.preventDefault();
                          }}
                          className="group inline-flex items-center gap-3.5 text-xs font-semibold uppercase tracking-[0.24em] text-[#336467] hover:text-[#D7400B] transition-colors py-1"
                        >
                          <span className="w-8 h-[1px] bg-[#336467] group-hover:bg-[#D7400B] group-hover:w-12 transition-all duration-300" />
                          <span>Explore {chapter.id} Stays</span>
                        </Link>

                        {/* Bottom Hairline Arrows (COMO Style) */}
                        <div className="flex items-center gap-6">
                          <button
                            type="button"
                            disabled={!isActive}
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePrev();
                            }}
                            aria-label="Previous chapter"
                            className="text-[#336467] hover:text-[#D7400B] transition-all duration-300 hover:-translate-x-1 cursor-pointer disabled:cursor-default group p-1"
                          >
                            <svg
                              width="44"
                              height="14"
                              viewBox="0 0 44 14"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="stroke-current"
                            >
                              <path
                                d="M44 7H2M8 1L2 7L8 13"
                                strokeWidth="1.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                          <button
                            type="button"
                            disabled={!isActive}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNext();
                            }}
                            aria-label="Next chapter"
                            className="text-[#336467] hover:text-[#D7400B] transition-all duration-300 hover:translate-x-1 cursor-pointer disabled:cursor-default group p-1"
                          >
                            <svg
                              width="44"
                              height="14"
                              viewBox="0 0 44 14"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="stroke-current"
                            >
                              <path
                                d="M0 7H42M36 1L42 7L36 13"
                                strokeWidth="1.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Counter Indicator: 01 —— 06 */}
        <div className="flex items-center justify-center gap-4 text-xs uppercase tracking-[0.25em] text-[#336467]/70 font-light mt-10">
          <span className="font-semibold text-[#336467]">
            {String((currentIndex % N) + 1).padStart(2, "0")}
          </span>
          <span className="w-12 h-px bg-[#336467]/30" />
          <span>{String(N).padStart(2, "0")}</span>
        </div>
      </section>

      {/* 3. Why We Began & Ethos Narrative */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-t border-[#C8C488] bg-[#E0DDAE]">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.28em] text-[#D7400B] block">
              OUR FOUNDING ETHOS
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-light uppercase tracking-[0.1em] text-[#336467]">
              Why We Began
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 text-sm sm:text-base text-[#336467]/85 font-light leading-relaxed">
            <p>
              Sri Lanka holds some of the world&apos;s most evocative places to stay — from stone
              courtyards in Galle Fort to misty tea bungalows in the central hills and wooden
              pavilions above southern surf breaks.
            </p>
            <p>
              Yet bringing the right creators and stays together often feels hurried and
              transactional. Inboxes get crowded with automated inquiries, while creators with real
              depth struggle to connect directly with hosts who share their sensibility.
            </p>
          </div>

          <div className="p-8 sm:p-10 rounded-2xl bg-[#ECE9C4] border border-[#C8C488] shadow-warm text-center max-w-2xl mx-auto">
            <p className="font-serif text-xl sm:text-2xl font-normal text-[#336467] leading-relaxed italic">
              &ldquo;Get Linked exists to slow that process down. We review each creator and stay by
              hand, verify identities, confirm travel dates, and introduce both sides when there is a
              genuine fit.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* 4. How We Operate: The 3 Core Pillars */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-t border-[#C8C488] bg-[#ECE9C4]">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-3">
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.28em] text-[#D7400B] block">
              OPERATIONAL STANDARDS
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-light uppercase tracking-[0.1em] text-[#336467]">
              How We Operate
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {/* Pillar 01 */}
            <div className="p-8 rounded-2xl bg-[#E0DDAE] border border-[#C8C488] space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-xs font-mono font-semibold tracking-widest text-[#D7400B] block">
                  01 / CURATION
                </span>
                <h3 className="font-serif text-2xl font-light uppercase tracking-wider text-[#336467]">
                  Every introduction made by hand
                </h3>
                <p className="text-xs sm:text-sm text-[#336467]/80 leading-relaxed font-light">
                  We do not use automated algorithms or auto-approvals. A member of our team reviews
                  every profile and application by hand to guarantee mutual alignment.
                </p>
              </div>
            </div>

            {/* Pillar 02 */}
            <div className="p-8 rounded-2xl bg-[#E0DDAE] border border-[#C8C488] space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-xs font-mono font-semibold tracking-widest text-[#D7400B] block">
                  02 / PRIVACY
                </span>
                <h3 className="font-serif text-2xl font-light uppercase tracking-wider text-[#336467]">
                  Quiet by default
                </h3>
                <p className="text-xs sm:text-sm text-[#336467]/80 leading-relaxed font-light">
                  Passports, identification documents, and direct personal numbers are never published
                  or shared publicly. All conversations begin through curated private handoffs.
                </p>
              </div>
            </div>

            {/* Pillar 03 */}
            <div className="p-8 rounded-2xl bg-[#E0DDAE] border border-[#C8C488] space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-xs font-mono font-semibold tracking-widest text-[#D7400B] block">
                  03 / INTEGRITY
                </span>
                <h3 className="font-serif text-2xl font-light uppercase tracking-wider text-[#336467]">
                  Sri Lanka focused
                </h3>
                <p className="text-xs sm:text-sm text-[#336467]/80 leading-relaxed font-light">
                  Dedicated entirely to celebrating distinctive properties, authentic local culture,
                  and thoughtful travel across the island&apos;s unique micro-regions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Footer Strip & Actions */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-t border-[#C8C488] bg-[#E0DDAE]">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="space-y-1 text-center sm:text-left">
            <p className="text-xs sm:text-sm text-[#336467]/85 font-medium tracking-wide">
              Operating across Colombo, Galle, Weligama, Ella, Kandy, and Sigiriya.
            </p>
            <p className="font-mono text-xs text-[#336467]/60">getlinked.today</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Link
              href="/creators"
              className="group inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-[#336467] hover:text-[#D7400B] transition-colors py-2"
            >
              <span className="w-8 h-[1px] bg-[#336467] group-hover:bg-[#D7400B] group-hover:w-12 transition-all duration-300" />
              <span>Find Creators</span>
            </Link>

            <Link
              href="/list-property"
              className="group inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-[#336467] hover:text-[#D7400B] transition-colors py-2"
            >
              <span className="w-8 h-[1px] bg-[#336467] group-hover:bg-[#D7400B] group-hover:w-12 transition-all duration-300" />
              <span>List Your Stay</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
