"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronDown, X, CheckCircle2, ArrowRight } from "lucide-react";
import { useStore } from "@/data/store";
import { InfluencerProfile } from "@/types";
import { formatStorageUrl, formatFollowerCount, formatDateRange } from "@/utils/formatters";
import { PhoneInputWithCountry } from "@/components/ui/PhoneInputWithCountry";

const CATEGORIES = [
  "ALL VOICES",
  "GALLE & SOUTH COAST",
  "ELLA & TEA HIGHLANDS",
  "WELIGAMA & SURF COAST",
  "COLOMBO & URBAN CEYLON",
  "KANDY & SACRED CEYLON",
] as const;

type CategoryType = (typeof CATEGORIES)[number];

export const FeaturedCreators: React.FC = () => {
  const { profiles, submitCreatorRequest } = useStore();
  const [selectedCreator, setSelectedCreator] = useState<InfluencerProfile | null>(null);
  const [activeCategory, setActiveCategory] = useState<CategoryType>("ALL VOICES");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Form State for Introduction Request
  const [formData, setFormData] = useState({
    accommodationName: "",
    requesterName: "",
    requesterWhatsApp: "",
    message: "",
  });
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  // Curated sensory lines per copy deck
  const sensoryMap: Record<string, { line: string; dates: string }> = {
    "prof-101": {
      dates: "5–20 October",
      line: "Cinematic stories from heritage courtyards and coastal villas.",
    },
    "prof-102": {
      dates: "10–25 October",
      line: "Salt-weathered surf, coastal light, mornings in the barrel.",
    },
    "prof-103": {
      dates: "2–16 November",
      line: "Quiet tea estate mornings, mountain mist, slow travel essays.",
    },
    "prof-104": {
      dates: "15–28 October",
      line: "Architectural details, street spice light, urban Ceylon stories.",
    },
  };

  const getSensory = (creator: InfluencerProfile) => {
    if (sensoryMap[creator.id]) return sensoryMap[creator.id];
    return {
      dates: formatDateRange(creator.visit_start, creator.visit_end),
      line:
        creator.trip_brief ||
        `Visual narratives exploring heritage architecture and coastal life across ${creator.city || "Sri Lanka"}.`,
    };
  };

  // Filter profiles based on category
  const activeProfiles = profiles.filter((p) => p.is_active !== false);

  const filteredProfiles = activeProfiles.filter((p) => {
    if (activeCategory === "ALL VOICES") return true;
    const city = (p.city || "").toLowerCase();
    const niche = (p.niche || "").toLowerCase();

    if (activeCategory === "GALLE & SOUTH COAST") {
      return (
        city.includes("galle") ||
        city.includes("mirissa") ||
        city.includes("unawatuna") ||
        city.includes("bentota") ||
        city.includes("hiriketiya") ||
        city.includes("tangalle")
      );
    }
    if (activeCategory === "ELLA & TEA HIGHLANDS") {
      return (
        city.includes("ella") ||
        city.includes("nuwara eliya") ||
        city.includes("haputale") ||
        city.includes("badulla") ||
        city.includes("bandarawela")
      );
    }
    if (activeCategory === "WELIGAMA & SURF COAST") {
      return (
        city.includes("weligama") ||
        city.includes("arugam bay") ||
        city.includes("midigama") ||
        city.includes("ahangama") ||
        niche.includes("surf") ||
        niche.includes("wellness")
      );
    }
    if (activeCategory === "COLOMBO & URBAN CEYLON") {
      return (
        city.includes("colombo") ||
        city.includes("negombo") ||
        city.includes("mount lavinia")
      );
    }
    if (activeCategory === "KANDY & SACRED CEYLON") {
      return (
        city.includes("kandy") ||
        city.includes("sigiriya") ||
        city.includes("dambulla") ||
        city.includes("matale")
      );
    }
    return true;
  });

  // Carousel Infinite Loop Setup
  const displayList = filteredProfiles.length > 0 ? filteredProfiles : activeProfiles;
  const N = displayList.length;
  const repeatCount = N >= 2 ? 3 : 1;
  const extendedList = Array.from({ length: repeatCount }, () => displayList).flat();

  const [currentIndex, setCurrentIndex] = useState(N >= 2 ? N : 0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Reset index when category changes
  useEffect(() => {
    setCurrentIndex(N >= 2 ? N : 0);
    setIsTransitioning(false);
  }, [activeCategory, N]);

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

  // Dimensions for center and peek alignment
  const cardWidth = Math.min(containerWidth * 0.84, 680);
  const gap = containerWidth < 640 ? 24 : 48;
  const offset = containerWidth / 2 - (currentIndex * (cardWidth + gap) + cardWidth / 2);

  // Navigation handlers
  const handleNext = useCallback(() => {
    if (N <= 1) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  }, [N]);

  const handlePrev = useCallback(() => {
    if (N <= 1) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  }, [N]);

  // Seamless Wrap Reset
  const handleTransitionEnd = () => {
    if (N < 2) return;
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

  // Close filter dropdown on outside click
  const filterRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Introduction Modal Submit
  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCreator) return;

    const res = submitCreatorRequest({
      creator_id: selectedCreator.id,
      creator_name: selectedCreator.display_name,
      creator_niche: selectedCreator.niche,
      creator_city: selectedCreator.city,
      accommodation_name: formData.accommodationName,
      requester_name: formData.requesterName,
      requester_whatsapp: formData.requesterWhatsApp,
      message: formData.message,
    });

    if (res.success) {
      setSubmittedMessage(res.message);
      setTimeout(() => {
        setSubmittedMessage(null);
        setSelectedCreator(null);
        setFormData({
          accommodationName: "",
          requesterName: "",
          requesterWhatsApp: "",
          message: "",
        });
      }, 2500);
    }
  };

  return (
    <section className="py-24 sm:py-32 bg-white dark:bg-black text-[#1A3739] dark:text-white border-t border-gray-200 dark:border-neutral-800 overflow-hidden select-none transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* COMO Style Top Category Search / Filter */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <span className="text-[11px] sm:text-xs font-normal uppercase tracking-[0.32em] text-[#1A3739]/70 dark:text-neutral-400 block mb-3.5">
            I&apos;M SEARCHING FOR
          </span>

          <div ref={filterRef} className="relative inline-block">
            <button
              type="button"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="group inline-flex items-center gap-3 text-2xl sm:text-4xl lg:text-[46px] font-serif font-light uppercase tracking-[0.08em] sm:tracking-[0.12em] text-[#1A3739] dark:text-white hover:text-[#D7400B] transition-colors cursor-pointer select-none"
            >
              <span>{activeCategory}</span>
              <ChevronDown
                className={`w-5 h-5 sm:w-7 sm:h-7 transition-transform duration-300 text-[#1A3739]/60 dark:text-neutral-400 group-hover:text-[#D7400B] ${
                  isFilterOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Hairline Underline across selector */}
            <div className="w-full max-w-md mx-auto h-px bg-[#1A3739]/20 dark:bg-neutral-700 mt-3 transition-colors group-hover:bg-[#D7400B]" />

            {/* Dropdown Menu */}
            {isFilterOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 sm:w-80 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl shadow-warm-lg z-40 py-2 animate-in fade-in zoom-in-95 duration-200">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setActiveCategory(cat);
                      setIsFilterOpen(false);
                    }}
                    className={`w-full text-left px-5 py-2.5 text-xs uppercase tracking-[0.2em] transition-colors ${
                      activeCategory === cat
                        ? "bg-gray-100 dark:bg-neutral-800 text-[#D7400B] font-semibold"
                        : "text-[#1A3739] dark:text-neutral-200 hover:bg-gray-50 dark:hover:bg-neutral-800/60 font-medium"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Carousel Viewport with Peeking Slides */}
        <div
          ref={containerRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="relative w-full overflow-hidden py-4"
        >
          {/* Thin Left Navigation Arrow (COMO Hotels Signature) */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous creator"
            className="absolute left-1 sm:left-4 lg:left-8 top-[32%] -translate-y-1/2 z-30 p-3 text-[#336467] dark:text-neutral-300 hover:text-[#D7400B] dark:hover:text-[#D7400B] transition-all duration-300 hover:-translate-x-1.5 cursor-pointer bg-white/80 dark:bg-black/80 sm:bg-transparent dark:sm:bg-transparent backdrop-blur-xs sm:backdrop-blur-none rounded-full group"
          >
            <svg
              width="48"
              height="16"
              viewBox="0 0 48 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current transition-transform duration-300 group-hover:-translate-x-1"
            >
              <path
                d="M48 8H2M9 1L2 8L9 15"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Thin Right Navigation Arrow (COMO Hotels Signature) */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next creator"
            className="absolute right-1 sm:right-4 lg:right-8 top-[32%] -translate-y-1/2 z-30 p-3 text-[#336467] dark:text-neutral-300 hover:text-[#D7400B] dark:hover:text-[#D7400B] transition-all duration-300 hover:translate-x-1.5 cursor-pointer bg-white/80 dark:bg-black/80 sm:bg-transparent dark:sm:bg-transparent backdrop-blur-xs sm:backdrop-blur-none rounded-full group"
          >
            <svg
              width="48"
              height="16"
              viewBox="0 0 48 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current transition-transform duration-300 group-hover:translate-x-1"
            >
              <path
                d="M0 8H46M39 1L46 8L39 15"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Sliding Track */}
          <div
            onTransitionEnd={handleTransitionEnd}
            style={{
              transform: `translateX(${offset}px)`,
              transition: isTransitioning
                ? "transform 700ms cubic-bezier(0.16, 1, 0.3, 1)"
                : "none",
              gap: `${gap}px`,
            }}
            className="flex items-start"
          >
            {extendedList.map((creator, idx) => {
              const isActive = idx === currentIndex;
              const isPrev = idx === currentIndex - 1;
              const isNext = idx === currentIndex + 1;
              const isAdjacent = isPrev || isNext;
              const sensory = getSensory(creator);

              return (
                <div
                  key={`${creator.id}-${idx}`}
                  style={{ width: `${cardWidth}px` }}
                  onClick={() => {
                    if (isPrev) handlePrev();
                    if (isNext) handleNext();
                  }}
                  className={`shrink-0 transition-all duration-700 ease-out select-none flex flex-col justify-start ${
                    isActive
                      ? "opacity-100 scale-100 cursor-default"
                      : isAdjacent
                      ? "opacity-35 hover:opacity-70 scale-[0.92] cursor-pointer"
                      : "opacity-15 scale-[0.86] pointer-events-none"
                  }`}
                >
                  {/* Photo Frame (Clickable Redirect to Creator Profile) */}
                  <Link
                    href={`/creators/${creator.id}`}
                    tabIndex={isActive ? 0 : -1}
                    onClick={(e) => {
                      if (!isActive) e.preventDefault();
                    }}
                    className="block relative aspect-[16/10] w-full overflow-hidden rounded-xl sm:rounded-2xl bg-neutral-100 dark:bg-neutral-900 shadow-warm dark:shadow-none cursor-pointer group/photo"
                    title={`View ${creator.display_name}'s profile`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        formatStorageUrl(creator.avatar_url) ||
                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80"
                      }
                      alt={creator.display_name}
                      className={`w-full h-full object-cover object-center transition-transform duration-700 ease-out ${
                        isActive ? "group-hover/photo:scale-105" : ""
                      }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
                  </Link>

                  {/* Editorial Content Below Image (Pure COMO Minimalist Luxury) */}
                  <div className="pt-8 sm:pt-10 px-1 sm:px-2 space-y-3">
                    <Link
                      href={`/creators/${creator.id}`}
                      tabIndex={isActive ? 0 : -1}
                      onClick={(e) => {
                        if (!isActive) e.preventDefault();
                      }}
                      className="block group/title"
                    >
                      <h3 className="font-serif text-3xl sm:text-4xl lg:text-[44px] font-light uppercase tracking-[0.14em] text-[#336467] dark:text-white group-hover/title:text-[#D7400B] transition-colors leading-[1.1]">
                        {creator.display_name}
                      </h3>
                    </Link>

                    <p className="text-[11px] sm:text-xs uppercase tracking-[0.24em] font-semibold text-[#D7400B]">
                      {creator.city || "Sri Lanka"}
                      {sensory.dates ? ` — ${sensory.dates}` : ""}
                    </p>

                    <p className="text-sm sm:text-base text-[#336467]/85 dark:text-neutral-300 font-light leading-relaxed max-w-xl pt-1">
                      {sensory.line}
                    </p>

                    <p className="text-[11px] uppercase tracking-[0.2em] text-[#336467]/60 dark:text-neutral-400 font-medium pt-1">
                      {formatFollowerCount(creator.follower_count)} FOLLOWERS
                      {creator.niche ? ` • ${creator.niche.toUpperCase()}` : ""}
                    </p>

                    {/* Action Links (COMO Signature Tertiary Buttons with Expanding Line) */}
                    <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
                      <button
                        type="button"
                        disabled={!isActive}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCreator(creator);
                        }}
                        className="group inline-flex items-center gap-3.5 text-xs font-semibold uppercase tracking-[0.24em] text-[#336467] dark:text-neutral-200 hover:text-[#D7400B] dark:hover:text-[#D7400B] transition-colors py-1 cursor-pointer disabled:cursor-default"
                      >
                        <span className="w-8 h-[1px] bg-[#336467] dark:bg-neutral-400 group-hover:bg-[#D7400B] group-hover:w-12 transition-all duration-300" />
                        <span>Request An Introduction</span>
                      </button>

                      <Link
                        href={`/creators/${creator.id}`}
                        tabIndex={isActive ? 0 : -1}
                        onClick={(e) => {
                          if (!isActive) e.preventDefault();
                        }}
                        className="group inline-flex items-center gap-3.5 text-xs font-semibold uppercase tracking-[0.24em] text-[#336467] dark:text-neutral-200 hover:text-[#D7400B] dark:hover:text-[#D7400B] transition-colors py-1 disabled:cursor-default"
                      >
                        <span className="w-8 h-[1px] bg-[#336467] dark:bg-neutral-400 group-hover:bg-[#D7400B] group-hover:w-12 transition-all duration-300" />
                        <span>View Profile</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Section: Counter & Directory Link */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 max-w-5xl mx-auto mt-14 sm:mt-18 px-4">
          {/* Counter Indicator: 01 —— 04 */}
          <div className="flex items-center gap-4 text-xs uppercase tracking-[0.25em] text-[#336467]/70 font-light">
            <span className="font-semibold text-[#336467]">
              {String((currentIndex % N) + 1).padStart(2, "0")}
            </span>
            <span className="w-12 h-px bg-[#336467]/30" />
            <span>{String(N).padStart(2, "0")}</span>
          </div>

          {/* Link to Full Directory */}
          <Link
            href="/creators"
            className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#336467] hover:text-[#D7400B] transition-colors"
          >
            <span>See who else is travelling</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* Introduction Request Modal */}
      {selectedCreator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedCreator(null)}
          />

          <div className="relative bg-white dark:bg-neutral-950 rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-200 dark:border-neutral-800 z-10 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedCreator(null)}
              className="absolute top-5 right-5 p-2 text-[#336467]/70 dark:text-neutral-400 hover:text-[#336467] dark:hover:text-white rounded-full cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {!submittedMessage ? (
              <form onSubmit={handleRequestSubmit} className="space-y-4">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#D7400B]">
                    Direct Introduction
                  </span>
                  <h3 className="font-serif text-2xl text-[#336467] dark:text-white mt-1">
                    Connect with {selectedCreator.display_name}
                  </h3>
                  <p className="text-xs text-[#336467]/80 dark:text-neutral-400 mt-1">
                    In {selectedCreator.city || "Sri Lanka"} during upcoming season. Every introduction is reviewed by hand.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#336467] dark:text-neutral-300 mb-1">
                      Your Property Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.accommodationName}
                      onChange={(e) =>
                        setFormData({ ...formData, accommodationName: e.target.value })
                      }
                      placeholder="e.g. Fort Heritage Villa"
                      className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 text-xs text-[#336467] dark:text-white focus:border-[#D7400B] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#336467] dark:text-neutral-300 mb-1">
                      Host Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.requesterName}
                      onChange={(e) =>
                        setFormData({ ...formData, requesterName: e.target.value })
                      }
                      placeholder="Your name"
                      className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 text-xs text-[#336467] dark:text-white focus:border-[#D7400B] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#336467] dark:text-neutral-300 mb-1">
                      WhatsApp Number *
                    </label>
                    <PhoneInputWithCountry
                      value={formData.requesterWhatsApp}
                      onChange={(val) =>
                        setFormData({ ...formData, requesterWhatsApp: val })
                      }
                      placeholder="e.g. 77 123 4567"
                      defaultCountryCode="LK"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#336467] dark:text-neutral-300 mb-1">
                      Collaboration Note
                    </label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="A few lines about your property and proposed dates..."
                      className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 text-xs text-[#336467] dark:text-white focus:border-[#D7400B] focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-full bg-[#D7400B] hover:bg-[#BD3607] text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Send Introduction Request
                </button>
              </form>
            ) : (
              <div className="text-center py-6 space-y-3">
                <CheckCircle2 className="w-10 h-10 text-[#D7400B] mx-auto" />
                <h4 className="font-serif text-xl text-[#336467] dark:text-white">Request received</h4>
                <p className="text-xs text-[#336467]/80 dark:text-neutral-400 leading-relaxed">
                  Our team reviews each request by hand and will reach out to you directly on WhatsApp.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
