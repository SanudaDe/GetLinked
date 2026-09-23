import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ForAccommodationsPage() {
  return (
    <div className="py-24 sm:py-32 bg-[#E0DDAE] text-[#336467] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Editorial Header */}
        <div className="space-y-5 text-center">
          <h1 className="font-serif italic text-4xl sm:text-6xl font-normal text-[#336467] tracking-tight leading-tight">
            For stays worth discovering.
          </h1>
          <p className="text-sm sm:text-base text-[#336467]/85 leading-relaxed max-w-xl mx-auto">
            List once. We&apos;ll bring you creators already heading your way — reviewed, verified, and matched by hand.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/list-property"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#D7400B] hover:bg-[#BD3607] text-white text-xs font-semibold tracking-wide shadow-sm transition-all"
            >
              <span>List Your Property</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/creators"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#ECE9C4] hover:bg-[#D0CD96] text-[#336467] text-xs font-semibold tracking-wide border border-[#C8C488] transition-all"
            >
              <span>Browse Creators</span>
            </Link>
          </div>
        </div>

        {/* Quiet Info Note */}
        <div className="p-8 sm:p-10 rounded-2xl bg-[#ECE9C4] border border-[#C8C488] shadow-warm space-y-4">
          <h2 className="font-serif text-xl sm:text-2xl font-normal text-[#336467]">
            Considered Collaborations
          </h2>
          <p className="text-xs sm:text-sm text-[#336467]/85 leading-relaxed">
            Every introduction is made with care. We confirm creator identities, travel dates, and aesthetic compatibility before initiating conversations on your terms.
          </p>
        </div>
      </div>
    </div>
  );
}
