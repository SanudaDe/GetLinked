import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="py-24 sm:py-32 bg-[#E0DDAE] text-[#336467] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Page Header */}
        <div className="space-y-4 text-center">
          <h1 className="font-serif italic text-4xl sm:text-6xl font-normal text-[#336467] tracking-tight leading-tight">
            An island told with care.
          </h1>
          <p className="text-sm sm:text-base text-[#336467]/85 max-w-xl mx-auto leading-relaxed">
            We bring Sri Lanka&apos;s finest stays together with the voices worth trusting with them.
          </p>
        </div>

        {/* Narrative Section */}
        <div className="p-8 sm:p-12 rounded-2xl bg-[#ECE9C4] border border-[#C8C488] shadow-warm space-y-8 text-xs sm:text-sm text-[#336467]/85 leading-relaxed font-normal">
          <div className="space-y-4">
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#336467]">
              Why We Began
            </h2>
            <p>
              Sri Lanka holds some of the world&apos;s most evocative places to stay — from stone courtyards in Galle Fort to misty tea bungalows in the central hills and wooden pavilions above southern surf breaks.
            </p>
            <p>
              Yet bringing the right creators and stays together often feels hurried and transactional. Inboxes get crowded with automated inquiries, while creators with real depth struggle to connect directly with hosts who share their sensibility.
            </p>
            <p>
              Get Linked exists to slow that process down. We review each creator and stay by hand, verify identities, confirm travel dates, and introduce both sides when there is a genuine fit.
            </p>
          </div>

          <div className="p-8 bg-[#E0DDAE] rounded-xl border border-[#C8C488] space-y-4 text-[#336467]">
            <h3 className="font-serif text-xl font-normal">
              How We Operate
            </h3>
            <div className="space-y-3 text-xs sm:text-sm text-[#336467]/80">
              <p>
                <strong className="text-[#336467] font-semibold">Every introduction made by hand.</strong> We do not use algorithms or auto-approvals. A member of our team reviews every profile.
              </p>
              <p>
                <strong className="text-[#336467] font-semibold">Quiet by default.</strong> Passports, identification documents, and personal contact numbers are never published or shared publicly.
              </p>
              <p>
                <strong className="text-[#336467] font-semibold">Sri Lanka focused.</strong> Dedicated entirely to celebrating distinctive properties and thoughtful travel across the island.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-[#C8C488] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#336467]/70">
            <p>Operating across Colombo, Galle, Weligama, Ella, and Kandy.</p>
            <p className="font-mono text-[11px]">getlinked.today</p>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex items-center justify-center gap-4 pt-4">
          <Link
            href="/creators"
            className="px-8 py-3.5 rounded-full bg-[#D7400B] hover:bg-[#BD3607] text-white text-xs font-semibold tracking-wide shadow-sm transition-all"
          >
            Find Creators
          </Link>
          <Link
            href="/list-property"
            className="px-8 py-3.5 rounded-full bg-[#336467] hover:bg-[#254F52] text-white text-xs font-semibold tracking-wide border border-[#336467] shadow-sm transition-all"
          >
            List Your Stay
          </Link>
        </div>
      </div>
    </div>
  );
}
