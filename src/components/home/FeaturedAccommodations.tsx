"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronDown, ArrowRight } from "lucide-react";
import { useStore } from "@/data/store";
import { AccommodationApplication } from "@/types";
import { formatStorageUrl, formatFollowerCount, isEatVenue } from "@/utils/formatters";

const ACCOMMODATION_CATEGORIES = [
  "ALL DISTINCTIVE STAYS & EATS",
  "EATS, CAFÉS & BARS",
  "GALLE & SOUTH COAST",
  "ELLA & TEA HIGHLANDS",
  "SIGIRIYA & CULTURAL TRIANGLE",
  "YALA & WILDLIFE LODGES",
  "COLOMBO & URBAN ESCAPES",
] as const;

type CategoryType = (typeof ACCOMMODATION_CATEGORIES)[number];

export const FeaturedAccommodations: React.FC = () => {
  const { accommodations } = useStore();
  const [activeCategory, setActiveCategory] = useState<CategoryType>("ALL DISTINCTIVE STAYS & EATS");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Fallback high-res imagery for demo stays
  const stayPhotos: Record<string, string> = {
    "acc-201": "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80",
    "acc-202": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
    "acc-203": "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    "acc-204": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
  };

  const sensoryMap: Record<string, { line: string; offer: string }> = {
    "acc-201": {
      line: "A restored Dutch courtyard, a private chef, low light in every room.",
      offer: "Complimentary Stay & Dining",
    },
    "acc-202": {
      line: "Century-old timber, valley mist, Ceylon tea by the stone fireplace.",
      offer: "Complimentary Stay",
    },
    "acc-203": {
      line: "Open-air pavilions, saltwater plunge, first wave at daybreak.",
      offer: "Complimentary Stay & Meals",
    },
    "acc-204": {
      line: "Riverfront gardens, barefoot dining beneath palms, silence after dark.",
      offer: "Collaborative Residency",
    },
  };

  const getSensory = (stay: AccommodationApplication) => {
    if (sensoryMap[stay.id]) return sensoryMap[stay.id];
    return {
      line:
        stay.requirements ||
        "Private verandahs, coastal breezes, and thoughtful hospitality across distinctive Sri Lankan landscapes.",
      offer: stay.offer_type || "Complimentary Stay",
    };
  };

  const getPhotoUrl = (stay: AccommodationApplication) => {
    if (stay.image_url) return formatStorageUrl(stay.image_url, "properties");
    if (stay.images && stay.images.length > 0 && stay.images[0]) {
      return formatStorageUrl(stay.images[0], "properties");
    }
    if (stayPhotos[stay.id]) return stayPhotos[stay.id];
    return "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80";
  };

  // Filter approved or active stays
  const approvedStays = accommodations.filter((a) => a.status === "APPROVED" || !a.status);
  const baseStays = approvedStays.length > 0 ? approvedStays : accommodations;

  const filteredStays = baseStays.filter((stay) => {
    if (activeCategory === "ALL DISTINCTIVE STAYS & EATS") return true;
    if (activeCategory === "EATS, CAFÉS & BARS") {
      return isEatVenue(stay.property_type);
    }
    const city = (stay.city || "").toLowerCase();
    const name = (stay.accommodation_name || "").toLowerCase();
    const type = (stay.property_type || "").toLowerCase();

    if (activeCategory === "GALLE & SOUTH COAST") {
      return (
        city.includes("galle") ||
        city.includes("mirissa") ||
        city.includes("weligama") ||
        city.includes("unawatuna") ||
        city.includes("bentota") ||
        city.includes("tangalle") ||
        city.includes("hiriketiya") ||
        name.includes("ocean") ||
        name.includes("beach") ||
        name.includes("coast")
      );
    }
    if (activeCategory === "ELLA & TEA HIGHLANDS") {
      return (
        city.includes("ella") ||
        city.includes("nuwara eliya") ||
        city.includes("kandy") ||
        city.includes("haputale") ||
        city.includes("hatton") ||
        type.includes("bungalow") ||
        name.includes("mist") ||
        name.includes("tea")
      );
    }
    if (activeCategory === "SIGIRIYA & CULTURAL TRIANGLE") {
      return (
        city.includes("sigiriya") ||
        city.includes("dambulla") ||
        city.includes("anuradhapura") ||
        city.includes("polonnaruwa") ||
        name.includes("sigiriya") ||
        name.includes("water garden")
      );
    }
    if (activeCategory === "YALA & WILDLIFE LODGES") {
      return (
        city.includes("yala") ||
        city.includes("tissamaharama") ||
        city.includes("udawalawe") ||
        city.includes("wilpattu") ||
        name.includes("elephant") ||
        type.includes("lodge") ||
        type.includes("eco")
      );
    }
    if (activeCategory === "COLOMBO & URBAN ESCAPES") {
      return (
        city.includes("colombo") ||
        city.includes("negombo") ||
        city.includes("mount lavinia")
      );
    }
    return true;
  });

  // Carousel Infinite Loop Setup
  const displayList = filteredStays.length > 0 ? filteredStays : baseStays;
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

  return (
    <section className="py-24 sm:py-32 bg-white dark:bg-black text-[#1A3739] dark:text-white border-t border-gray-200 dark:border-neutral-800 overflow-hidden select-none transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* COMO Style Top Category Search / Filter */}
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20">
          <span className="text-[11px] sm:text-xs font-normal uppercase tracking-[0.32em] text-[#1A3739]/70 dark:text-neutral-400 block mb-3.5">
            PLACES WORTH THE STORY
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
                {ACCOMMODATION_CATEGORIES.map((cat) => (
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
            aria-label="Previous stay"
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
            aria-label="Next stay"
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
            {extendedList.map((stay, idx) => {
              const isActive = idx === currentIndex;
              const isPrev = idx === currentIndex - 1;
              const isNext = idx === currentIndex + 1;
              const isAdjacent = isPrev || isNext;
              const sensory = getSensory(stay);
              const photo = getPhotoUrl(stay);

              return (
                <div
                  key={`${stay.id}-${idx}`}
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
                  {/* Photo Frame (Clickable) */}
                  <Link
                    href={`/apply?stay=${encodeURIComponent(stay.accommodation_name)}`}
                    tabIndex={isActive ? 0 : -1}
                    onClick={(e) => {
                      if (!isActive) e.preventDefault();
                    }}
                    className="block relative aspect-[16/10] w-full overflow-hidden rounded-xl sm:rounded-2xl bg-neutral-100 dark:bg-neutral-900 shadow-warm dark:shadow-none cursor-pointer group/photo"
                    title={`Propose collaboration with ${stay.accommodation_name}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo}
                      alt={stay.accommodation_name}
                      className={`w-full h-full object-cover object-center transition-transform duration-700 ease-out ${
                        isActive ? "group-hover/photo:scale-105" : ""
                      }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
                  </Link>

                  {/* Editorial Content Below Image (Pure COMO Minimalist Luxury) */}
                  <div className="pt-8 sm:pt-10 px-1 sm:px-2 space-y-3">
                    <Link
                      href={`/apply?stay=${encodeURIComponent(stay.accommodation_name)}`}
                      tabIndex={isActive ? 0 : -1}
                      onClick={(e) => {
                        if (!isActive) e.preventDefault();
                      }}
                      className="block group/title"
                    >
                      <h3 className="font-serif text-3xl sm:text-4xl lg:text-[44px] font-light uppercase tracking-[0.14em] text-[#336467] dark:text-white group-hover/title:text-[#D7400B] transition-colors leading-[1.1]">
                        {stay.accommodation_name}
                      </h3>
                    </Link>

                    <p className="text-[11px] sm:text-xs uppercase tracking-[0.24em] font-semibold text-[#D7400B]">
                      {stay.city || "Sri Lanka"}
                      {stay.property_type ? ` — ${stay.property_type}` : ""}
                    </p>

                    <p className="text-sm sm:text-base text-[#336467]/85 dark:text-neutral-300 font-light leading-relaxed max-w-xl pt-1">
                      {sensory.line}
                    </p>

                    <p className="text-[11px] uppercase tracking-[0.2em] text-[#336467]/60 dark:text-neutral-400 font-medium pt-1">
                      {sensory.offer.toUpperCase()}
                      {stay.minimum_followers
                        ? ` • MIN. ${formatFollowerCount(stay.minimum_followers)} FOLLOWERS`
                        : ""}
                    </p>

                    {/* Action Links (COMO Signature Tertiary Buttons with Expanding Line) */}
                    <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
                      <Link
                        href={`/apply?stay=${encodeURIComponent(stay.accommodation_name)}`}
                        tabIndex={isActive ? 0 : -1}
                        onClick={(e) => {
                          if (!isActive) e.preventDefault();
                        }}
                        className="group inline-flex items-center gap-3.5 text-xs font-semibold uppercase tracking-[0.24em] text-[#336467] dark:text-neutral-200 hover:text-[#D7400B] dark:hover:text-[#D7400B] transition-colors py-1 cursor-pointer disabled:cursor-default"
                      >
                        <span className="w-8 h-[1px] bg-[#336467] dark:bg-neutral-400 group-hover:bg-[#D7400B] group-hover:w-12 transition-all duration-300" />
                        <span>Propose Collaboration</span>
                      </Link>

                      <Link
                        href="/list-property"
                        tabIndex={isActive ? 0 : -1}
                        onClick={(e) => {
                          if (!isActive) e.preventDefault();
                        }}
                        className="group inline-flex items-center gap-3.5 text-xs font-semibold uppercase tracking-[0.24em] text-[#336467] dark:text-neutral-200 hover:text-[#D7400B] dark:hover:text-[#D7400B] transition-colors py-1 disabled:cursor-default"
                      >
                        <span className="w-8 h-[1px] bg-[#336467] dark:bg-neutral-400 group-hover:bg-[#D7400B] group-hover:w-12 transition-all duration-300" />
                        <span>List Your Stay</span>
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
          <div className="flex items-center gap-4 text-xs uppercase tracking-[0.25em] text-[#336467]/70 dark:text-neutral-400 font-light">
            <span className="font-semibold text-[#336467] dark:text-white">
              {String((currentIndex % N) + 1).padStart(2, "0")}
            </span>
            <span className="w-12 h-px bg-[#336467]/30 dark:bg-neutral-700" />
            <span>{String(N).padStart(2, "0")}</span>
          </div>

          {/* Link to List Stays & Eats */}
          <Link
            href="/list-property"
            className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#336467] dark:text-neutral-300 hover:text-[#D7400B] dark:hover:text-[#D7400B] transition-colors"
          >
            <span>List your stay or eatery, free during launch</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};
