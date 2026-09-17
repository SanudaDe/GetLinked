import React from "react";
import Link from "next/link";
import { Check, Star, ShieldCheck, ArrowRight, Sparkles, MapPin, Award } from "lucide-react";
import { CREATOR_NICHES } from "@/utils/formatters";

export default function ForCreatorsPage() {
  const requirements = [
    "At least 18 years of age at the time of application",
    "Minimum 5,000 authentic followers on Instagram, TikTok, or YouTube",
    "Clear, high-production aesthetic aligned with luxury, boutique, or eco-travel",
    "Scheduled travel itinerary with confirmed dates in Sri Lanka",
    "Valid government-issued Passport or National Identity Card (NIC)",
    "Commitment to deliver agreed collaboration media promptly",
  ];

  return (
    <div className="py-12 bg-sand-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-900/10 text-teal-900 text-xs font-semibold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5 text-gold-500" />
            Creator Partnership Program
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-teal-950">
            Elevate Your Sri Lanka Journey with Curated Stays
          </h1>
          <p className="text-base sm:text-lg text-ink-700 leading-relaxed">
            Stop sending unread Instagram DMs to hotels. Get Linked connects you directly with boutique hosts who value quality storytelling.
          </p>
          <div className="pt-2">
            <Link
              href="/apply"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-teal-900 hover:bg-teal-800 text-sand-50 text-xs font-semibold uppercase tracking-wider shadow-warm transition-all"
            >
              <span>Apply to Join Get Linked (18+, 5k+ Followers)</span>
              <ArrowRight className="w-4 h-4 text-gold-400" />
            </Link>
          </div>
        </div>

        {/* Requirements & Criteria Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto my-16">
          <div className="bg-sand-50 rounded-2xl border border-sand-300 p-8 shadow-warm space-y-6">
            <div className="flex items-center gap-3 border-b border-sand-200 pb-4">
              <div className="w-10 h-10 rounded-lg bg-teal-900 text-gold-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-teal-950">
                  Eligibility Criteria
                </h3>
                <span className="text-xs text-ink-600">Strictly enforced for all creators</span>
              </div>
            </div>

            <div className="space-y-3">
              {requirements.map((req, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-teal-900/10 text-teal-900 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs sm:text-sm text-ink-800 leading-relaxed">
                    {req}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-sand-50 rounded-2xl border border-sand-300 p-8 shadow-warm space-y-6">
            <div className="flex items-center gap-3 border-b border-sand-200 pb-4">
              <div className="w-10 h-10 rounded-lg bg-gold-500 text-teal-950 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-teal-950">
                  Supported Niches
                </h3>
                <span className="text-xs text-ink-600">Sri Lankan hospitality collaborations</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {CREATOR_NICHES.map((niche, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-sand-100/80 rounded-xl border border-sand-300/80 text-xs font-semibold text-teal-950 flex items-center gap-2"
                >
                  <Star className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                  <span>{niche}</span>
                </div>
              ))}
            </div>

            <div className="p-4 bg-teal-900/10 rounded-xl border border-teal-900/20 text-xs text-ink-700 leading-relaxed">
              <strong className="text-teal-950 block mb-1">Privacy Guarantee:</strong>
              Your passport number and WhatsApp details are never shared publicly. Accommodations submit collaboration requests through our platform, and our concierge facilitates introductions with verified terms.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
