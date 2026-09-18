import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ForAccommodationsPage() {
  return (
    <div className="py-24 sm:py-32 bg-[#FAF8F5] text-[#122026] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Editorial Header */}
        <div className="space-y-5 text-center">
          <h1 className="font-serif italic text-4xl sm:text-6xl font-normal text-[#122026] tracking-tight leading-tight">
            For stays worth discovering.
          </h1>
          <p className="text-sm sm:text-base text-[#5E686F] leading-relaxed max-w-xl mx-auto">
            List once. We&apos;ll bring you creators already heading your way — reviewed, verified, and matched by hand.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/list-property"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#16252C] hover:bg-black text-white text-xs font-medium tracking-wide shadow-sm transition-all"
            >
              <span>List Your Property</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/creators"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white hover:bg-[#F4EFEA] text-[#122026] text-xs font-medium tracking-wide border border-[#E7E2DA] transition-all"
            >
              <span>Browse Creators</span>
            </Link>
          </div>
        </div>

        {/* Quiet Info Note */}
        <div className="p-8 sm:p-10 rounded-2xl bg-white border border-[#E7E2DA] shadow-warm space-y-4">
          <h2 className="font-serif text-xl sm:text-2xl font-normal text-[#122026]">
            Considered Collaborations
          </h2>
          <p className="text-xs sm:text-sm text-[#5E686F] leading-relaxed">
            Every introduction is made with care. We confirm creator identities, travel dates, and aesthetic compatibility before initiating conversations on your terms.
          </p>
        </div>
      </div>
    </div>
  );
}
