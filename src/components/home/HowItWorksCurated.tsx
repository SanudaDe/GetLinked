"use client";

import React from "react";

export const HowItWorksCurated: React.FC = () => {
  const steps = [
    {
      number: "01",
      title: "Discover",
      description: "Creators and stays find relevant opportunities.",
    },
    {
      number: "02",
      title: "Curate",
      description: "We review both sides before they join.",
    },
    {
      number: "03",
      title: "Connect",
      description: "When there's mutual interest, we make the introduction.",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 sm:py-32 bg-[#FAF8F5] text-[#122026] overflow-hidden border-t border-[#E7E2DA]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Top-Right Circular Seal Stamp (Matching Reference Image) */}
        <div className="hidden lg:block absolute top-0 right-8 w-36 h-36 select-none opacity-80 hover:opacity-100 transition-opacity">
          <div className="relative w-full h-full flex items-center justify-center animate-[spin_40s_linear_infinite]">
            {/* SVG Circular Text Path */}
            <svg viewBox="0 0 160 160" className="w-full h-full">
              <path
                id="circlePath"
                d="M 80, 80 m -62, 0 a 62,62 0 1,1 124,0 a 62,62 0 1,1 -124,0"
                fill="none"
              />
              <text className="text-[10px] font-mono tracking-[0.26em] fill-[#5E686F] uppercase">
                <textPath href="#circlePath" startOffset="0%">
                  PLACES • POSSIBILITIES • GET LINKED •
                </textPath>
              </text>
            </svg>

            {/* Center Fine-Line Palm Tree Illustration */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <svg
                width="34"
                height="34"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#25aca9"
                strokeWidth="1.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Minimalist Palm Tree */}
                <path d="M12 22V8" />
                <path d="M12 8c-3-3-8-2-9 2" />
                <path d="M12 8c3-3 8-2 9 2" />
                <path d="M12 8c-2-4-5-6-9-5" />
                <path d="M12 8c2-4 5-6 9-5" />
                <path d="M12 8c0-5-2-7-6-7" />
                <path d="M12 8c0-5 2-7 6-7" />
                {/* Gentle soil curve */}
                <path d="M8 22c2-.8 6-.8 8 0" />
              </svg>
            </div>
          </div>
        </div>

        {/* Section Header (Centered) */}
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-24 space-y-4">
          <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-[#8A949C]">
            HOW IT WORKS
          </span>

          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-[#122026] tracking-tight leading-[1.1]">
            Curated, not crowded.
          </h2>

          <p className="text-sm sm:text-base text-[#5E686F] leading-relaxed max-w-xl mx-auto pt-1">
            Every creator and stay on Get Linked is reviewed before joining the platform. We keep it personal, relevant and genuine — so the right connections can happen.
          </p>
        </div>

        {/* 3 Steps Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 sm:gap-12 lg:gap-16 relative">
          {steps.map((step, idx) => (
            <div
              key={step.number}
              className="relative space-y-3 pt-6 border-t border-[#E7E2DA] md:border-t-0 md:pt-0"
            >
              {/* Subtle Step Number */}
              <span className="font-mono text-xs sm:text-sm text-[#8A949C] tracking-widest font-normal block">
                {step.number}
              </span>

              {/* Step Title */}
              <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#122026] tracking-tight">
                {step.title}
              </h3>

              {/* Step Description */}
              <p className="text-xs sm:text-sm text-[#5E686F] leading-relaxed max-w-xs">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
