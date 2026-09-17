import React from "react";
import Link from "next/link";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { TrustSection } from "@/components/home/TrustSection";
import { ArrowRight, ShieldCheck, UserCheck, MessageSquareShare, FileSearch, Sparkles } from "lucide-react";

export default function HowItWorksPage() {
  return (
    <div className="py-12 bg-sand-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-900/10 text-teal-900 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-gold-500" />
            The Get Linked Operating Philosophy
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-teal-950">
            How We Curate Collaborations Across Sri Lanka
          </h1>
          <p className="text-base sm:text-lg text-ink-700 leading-relaxed">
            Get Linked is built on a fundamental principle: <strong>Human review and human introductions create better collaborations than automated algorithms.</strong>
          </p>
        </div>

        {/* Detailed Workflow Walkthrough */}
        <div className="space-y-16 max-w-4xl mx-auto my-16">
          {/* Step 1 */}
          <div className="bg-sand-50 rounded-2xl border border-sand-300 p-8 shadow-warm flex flex-col md:flex-row gap-8 items-start">
            <div className="w-14 h-14 rounded-xl bg-teal-900 text-gold-400 font-serif font-bold text-2xl flex items-center justify-center shrink-0">
              1
            </div>
            <div className="space-y-3">
              <h2 className="font-serif text-2xl font-bold text-teal-950">
                Application & Credential Ingestion
              </h2>
              <p className="text-sm text-ink-700 leading-relaxed">
                Creators and accommodation hosts submit their formal profiles. Influencers provide government-issued identification (National ID or Passport), verified social media channels, and firm travel itineraries in Sri Lanka. Accommodations define their location, room tier, host offerings, and minimum audience criteria.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-teal-800">
                <ShieldCheck className="w-4 h-4 text-gold-600" />
                <span>Private storage isolation: ID documents are never visible in the public directory.</span>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-sand-50 rounded-2xl border border-sand-300 p-8 shadow-warm flex flex-col md:flex-row gap-8 items-start">
            <div className="w-14 h-14 rounded-xl bg-teal-900 text-gold-400 font-serif font-bold text-2xl flex items-center justify-center shrink-0">
              2
            </div>
            <div className="space-y-3">
              <h2 className="font-serif text-2xl font-bold text-teal-950">
                Manual Human Verification (Zero Auto-Approval)
              </h2>
              <p className="text-sm text-ink-700 leading-relaxed">
                Our verification officers manually review every applicant. We check that the creator is 18+, has at least 5,000 authentic followers with organic engagement, and possesses valid travel documents. We check properties for legitimate hospitality operations and verified manager contact details.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-teal-800">
                <UserCheck className="w-4 h-4 text-gold-600" />
                <span>Zero bot approvals. Only vetted talent and stays enter the active ecosystem.</span>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-sand-50 rounded-2xl border border-sand-300 p-8 shadow-warm flex flex-col md:flex-row gap-8 items-start">
            <div className="w-14 h-14 rounded-xl bg-teal-900 text-gold-400 font-serif font-bold text-2xl flex items-center justify-center shrink-0">
              3
            </div>
            <div className="space-y-3">
              <h2 className="font-serif text-2xl font-bold text-teal-950">
                Curated Discovery & Request Queue
              </h2>
              <p className="text-sm text-ink-700 leading-relaxed">
                Verified creators are featured in our Sri Lankan creator directory, searchable by destination city, niche, and overlapping travel dates. Accommodations can click &ldquo;Request this Creator&rdquo; without exposing private personal details. Simultaneously, the Get Linked concierge team proactively pairs complementary stays and creators.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-teal-800">
                <FileSearch className="w-4 h-4 text-gold-600" />
                <span>Date overlap formulas ensure creators are actually in your city during stay dates.</span>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-sand-50 rounded-2xl border border-sand-300 p-8 shadow-warm flex flex-col md:flex-row gap-8 items-start">
            <div className="w-14 h-14 rounded-xl bg-teal-900 text-gold-400 font-serif font-bold text-2xl flex items-center justify-center shrink-0">
              4
            </div>
            <div className="space-y-3">
              <h2 className="font-serif text-2xl font-bold text-teal-950">
                Concierge WhatsApp Introduction
              </h2>
              <p className="text-sm text-ink-700 leading-relaxed">
                When a match is reviewed and confirmed, Get Linked initiates communication on WhatsApp. Pre-filled briefing messages are generated with confirmed terms, agreed deliverables, and dates. Both parties are introduced with high trust and clear expectations.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-teal-800">
                <MessageSquareShare className="w-4 h-4 text-gold-600" />
                <span>Personalized, human-facilitated communication. No automated chat bots.</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA section */}
        <div className="bg-teal-900 text-sand-50 rounded-3xl p-10 sm:p-14 text-center max-w-4xl mx-auto shadow-elevated space-y-6">
          <h3 className="font-serif text-3xl font-bold">
            Ready to Join Get Linked?
          </h3>
          <p className="text-sm sm:text-base text-sand-200 max-w-lg mx-auto">
            Whether you are a creator planning your Ceylon expedition or a property seeking genuine media exposure, apply today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/apply"
              className="px-8 py-3.5 rounded-lg bg-gold-500 hover:bg-gold-400 text-ink-950 text-xs font-semibold uppercase tracking-wider shadow-warm transition-colors"
            >
              Apply as Creator
            </Link>
            <Link
              href="/list-property"
              className="px-8 py-3.5 rounded-lg bg-teal-800 hover:bg-teal-700 text-sand-50 text-xs font-semibold uppercase tracking-wider border border-teal-700 transition-colors"
            >
              List Your Stay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
