import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HowItWorksPage() {
  const steps = [
    {
      number: "01",
      title: "Introduce yourself",
      body: "Share your dates, your work, and where you're headed. A photo ID, and a few honest lines about what you do.",
    },
    {
      number: "02",
      title: "We take the time to know you",
      body: "A member of our team reviews every application by hand. No automation, no shortcuts.",
    },
    {
      number: "03",
      title: "Discover a stay worth writing about",
      body: "Once approved, your dates become visible to the stays we've chosen with equal care.",
    },
    {
      number: "04",
      title: "We make the introduction",
      body: "When there's a fit, we bring both sides together directly — and step back.",
    },
  ];

  return (
    <div className="py-24 sm:py-32 bg-[#FAF8F5] text-[#122026] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Page Header */}
        <div className="space-y-4 text-center max-w-2xl mx-auto">
          <h1 className="font-serif italic text-4xl sm:text-6xl font-normal text-[#122026] tracking-tight leading-tight">
            How an introduction is made.
          </h1>
          <p className="text-sm sm:text-base text-[#5E686F] leading-relaxed pt-2">
            We don&apos;t run an app. We run a quiet, considered process — the same for every creator, every stay.
          </p>
        </div>

        {/* The 4 Steps */}
        <div className="space-y-12">
          {steps.map((step) => (
            <div
              key={step.number}
              className="p-8 sm:p-10 rounded-2xl bg-white border border-[#E7E2DA] shadow-warm flex flex-col md:flex-row gap-6 md:gap-10 items-start"
            >
              <span className="font-mono text-xs sm:text-sm text-[#8A949C] tracking-widest pt-1 shrink-0">
                {step.number} —
              </span>

              <div className="space-y-2 flex-1">
                <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#122026]">
                  {step.title}
                </h2>
                <p className="text-xs sm:text-sm text-[#5E686F] leading-relaxed max-w-xl">
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Functional Clean CTAs */}
        <div className="pt-8 border-t border-[#E7E2DA] flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/apply"
            className="px-8 py-3.5 rounded-full bg-[#25aca9] hover:bg-[#1e9693] text-white text-xs font-medium tracking-wide transition-all shadow-sm"
          >
            Apply as a Creator
          </Link>
          <Link
            href="/list-property"
            className="px-8 py-3.5 rounded-full bg-white hover:bg-[#F4EFEA] text-[#122026] text-xs font-medium tracking-wide border border-[#E7E2DA] transition-all"
          >
            List Your Stay
          </Link>
        </div>
      </div>
    </div>
  );
}
