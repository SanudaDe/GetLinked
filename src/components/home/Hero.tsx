"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronRight, ChevronLeft } from "lucide-react";

export const Hero: React.FC = () => {
  const slides = [
    {
      id: "01",
      image:
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=2400&q=85",
      alt: "Luxury oceanfront infinity pool villa in Sri Lanka at sunset",
      location: "Thalpe, Southern Coast",
    },
    {
      id: "02",
      image:
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=2400&q=85",
      alt: "Boutique hillside retreat overlooking lush tea valleys",
      location: "Ella Highlands",
    },
    {
      id: "03",
      image:
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=2400&q=85",
      alt: "Colonial courtyard villa with serene pool",
      location: "Galle Fort",
    },
  ];

  const [activeSlide, setActiveSlide] = useState(0);

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative min-h-[92vh] sm:min-h-screen flex flex-col justify-between overflow-hidden bg-[#E9E4DC]">
      {/* Background Photography Slides with smooth fade */}
      {slides.map((slide, idx) => (
        <div
          key={slide.id}
          className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${
            idx === activeSlide ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
          }`}
          style={{ transitionProperty: "opacity, transform", transitionDuration: "1000ms" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={slide.image}
            alt={slide.alt}
            className="w-full h-full object-cover object-center"
          />
          {/* Subtle Warm Gradient Overlay matching the reference editorial lighting */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF8F5]/90 via-[#FAF8F5]/40 to-transparent sm:max-w-3xl" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
        </div>
      ))}

      {/* Top Spacer for the Fixed Transparent Navbar */}
      <div className="h-24 sm:h-28" />

      {/* Center Hero Content (faithfully matching reference image) */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto py-12">
        <div className="max-w-2xl">
          {/* Tag / Kicker */}
          <div className="flex items-center gap-3 mb-5">
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-[#122026]">
              SRI LANKA. REAL CONNECTIONS.
            </span>
          </div>

          {/* Editorial Display Headline */}
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-[68px] font-normal tracking-tight text-[#122026] leading-[1.08]">
            Where good stays <br className="hidden sm:block" />
            meet good stories.
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-sm sm:text-base text-[#122026]/85 max-w-xl font-normal leading-relaxed">
            Get Linked connects verified creators with distinctive stays across Sri Lanka.
          </p>

          {/* Dual CTAs matching reference pill buttons */}
          <div className="flex items-center gap-4 mt-8 flex-wrap">
            <Link
              href="/apply"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#16252C] hover:bg-black text-white text-xs font-medium tracking-wider shadow-md hover:shadow-lg transition-all duration-200 group"
            >
              <span>For Creators</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/list-property"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-white/40 hover:bg-white/60 text-[#122026] text-xs font-medium tracking-wider border border-black/15 backdrop-blur-md shadow-xs hover:shadow-sm transition-all duration-200 group"
            >
              <span>For Stays</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Editorial Anchors & Slide Indicator */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-8 pt-4 flex items-end justify-between text-xs text-[#122026]">
        {/* Left: 01 — 03 with clickable slide controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={prevSlide}
            aria-label="Previous slide"
            className="p-1 hover:text-black hover:scale-110 transition-transform opacity-75 hover:opacity-100"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-mono text-xs tracking-widest font-medium text-[#122026]">
            {slides[activeSlide].id} — 03
          </span>
          <button
            onClick={nextSlide}
            aria-label="Next slide"
            className="p-1 hover:text-black hover:scale-110 transition-transform opacity-75 hover:opacity-100"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <span className="hidden sm:inline-block text-[11px] tracking-wider text-[#122026]/70 ml-2 font-serif italic">
            — {slides[activeSlide].location}
          </span>
        </div>

        {/* Right: Slogan from design */}
        <div className="text-right">
          <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.25em] text-[#122026] drop-shadow-xs">
            A BRIGHTER WAY TO TRAVEL TOGETHER
          </span>
        </div>
      </div>
    </section>
  );
};
