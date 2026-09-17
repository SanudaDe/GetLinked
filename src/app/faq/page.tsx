"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  HelpCircle,
  ShieldCheck,
  UserCheck,
  Building2,
  Lock,
  MessageCircle,
  ChevronDown,
  Sparkles,
  ArrowRight,
  Search,
} from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
  category: "creators" | "properties" | "verification" | "matching";
}

const FAQS: FaqItem[] = [
  // For Creators
  {
    category: "creators",
    question: "What are the minimum requirements to apply as a creator?",
    answer:
      "To ensure high content quality and meaningful ROI for our partner accommodations, creators must be at least 18 years of age and hold a minimum of 5,000 authentic followers on their primary platform (Instagram, YouTube, TikTok, etc.). All creators must also submit a valid passport or national ID for one-time identity verification.",
  },
  {
    category: "creators",
    question: "Is Get Linked free for creators?",
    answer:
      "Yes, 100%. Creators never pay a membership fee, application fee, or match commission to Get Linked. Collaborations generally provide complimentary boutique stays, curated experiences, and dining in exchange for authentic content creation.",
  },
  {
    category: "creators",
    question: "What kind of content is expected during a collaboration?",
    answer:
      "Deliverables are tailored to the host's needs and the creator's niche. Common formats include Instagram Reels/Stories, YouTube travel vlogs, high-resolution property photography, and authentic reviews. The exact agreement is clarified during the Get Linked concierge introduction.",
  },
  {
    category: "creators",
    question: "How long does the application verification take?",
    answer:
      "Our Colombo-based team reviews every application manually. Turnaround time is typically within 24 to 48 hours. You can check your application status at any time using your reference code and WhatsApp number on our Status page.",
  },

  // For Accommodations
  {
    category: "properties",
    question: "What types of accommodations qualify for Get Linked?",
    answer:
      "We partner with licensed boutique hotels, colonial villas, luxury tea estates, eco-lodges, surf retreats, and high-quality guesthouses across Sri Lanka that offer memorable, photogenic experiences.",
  },
  {
    category: "properties",
    question: "What does it cost to list a property?",
    answer:
      "During our Phase 1 Launch, property listings and curated creator matchmaking are 100% free. In Phase 2, an affordable per-collaboration or subscription model will be introduced with advance notice.",
  },
  {
    category: "properties",
    question: "How do I request a creator visiting my area?",
    answer:
      "You can browse our Creator Directory, filter by destination (e.g. Galle Fort, Ella, Weligama) and travel dates, and click 'Request this Creator'. Your request is routed directly to our concierge team, who verifies date overlap and compatibility before initiating the introduction.",
  },
  {
    category: "properties",
    question: "Can I specify minimum audience requirements or offer formats?",
    answer:
      "Yes. In your property listing, you define your preferred offer format (complimentary stay, stay + meals, paid collaboration, or flexible) and your minimum follower threshold (e.g. 10k+, 50k+, 100k+).",
  },

  // Verification & Privacy
  {
    category: "verification",
    question: "Why do you require government identification (Passport / NIC)?",
    answer:
      "Unlike unverified open directories or Instagram DMs where impersonation and no-shows are rampant, Get Linked guarantees accountability. We verify that every creator is a real person with a genuine travel itinerary in Sri Lanka before any property hosts them.",
  },
  {
    category: "verification",
    question: "Is my personal data and ID document secure?",
    answer:
      "Strictly. All identification files are stored in an encrypted, air-gapped private vault. They are never published on the website, never shared with properties, and never indexed by search engines. Get Linked complies with Sri Lanka's Personal Data Protection Act (PDPA No. 9 of 2022).",
  },
  {
    category: "verification",
    question: "Can anyone on the public website see my WhatsApp number?",
    answer:
      "Never. Public creator profiles display only sanitized public metadata: first name, niche, follower tier, city, and dates. Private contact details are restricted exclusively to authorized Get Linked staff to conduct personal introductions.",
  },

  // Matching & Process
  {
    category: "matching",
    question: "Why does Get Linked use human matchmaking instead of an algorithm?",
    answer:
      "High-end hospitality requires nuance. An algorithm cannot assess aesthetic compatibility, host house rules, or content tone. Our human concierges evaluate date overlap, visual aesthetic, and host requirements to ensure both parties enjoy a successful collaboration.",
  },
  {
    category: "matching",
    question: "How does the WhatsApp introduction work?",
    answer:
      "Once an admin confirms a match, Get Linked generates a personalized WhatsApp introduction connecting the property host with the creator. We provide mutual collaboration briefs so both parties can finalize arrival dates, check-in logistics, and deliverable schedules seamlessly.",
  },
  {
    category: "matching",
    question: "What happens if a creator changes their travel dates?",
    answer:
      "Creators can inform our team via WhatsApp at any time. Our system updates their travel calendar across our matching engine to avoid incompatible match requests.",
  },
];

export default function FaqPage() {
  const [activeTab, setActiveTab] = useState<"all" | "creators" | "properties" | "verification" | "matching">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFaqs = FAQS.filter((item) => {
    const matchesTab = activeTab === "all" || item.category === activeTab;
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="bg-sand-50 min-h-screen py-12 lg:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Editorial Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-900/10 text-teal-900 text-xs font-semibold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-gold-600" />
            <span>Got Questions? We Have Answers</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-teal-950">
            Frequently Asked Questions
          </h1>
          <p className="text-sm sm:text-base text-ink-700 max-w-2xl mx-auto">
            Everything you need to know about the Get Linked verification model, human matchmaking, data protection, and Sri Lankan collaborations.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto">
          <Search className="w-5 h-5 text-ink-400 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Search questions (e.g., passport, free stays, WhatsApp)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-sand-400 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-900 shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-3.5 text-xs text-ink-500 hover:text-ink-800"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Tabs */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {[
            { id: "all", label: "All Questions" },
            { id: "creators", label: "For Creators" },
            { id: "properties", label: "For Properties" },
            { id: "verification", label: "Verification & Privacy" },
            { id: "matching", label: "Matching & WhatsApp" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setOpenIndex(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-teal-900 text-gold-400 shadow-sm"
                  : "bg-white text-ink-700 hover:bg-sand-200/70 border border-sand-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-sand-300 p-8 space-y-3">
              <p className="text-sm font-medium text-ink-700">
                No questions found matching &ldquo;{searchQuery}&rdquo;.
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="text-xs text-teal-900 hover:underline font-semibold"
              >
                Reset search
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-sand-300 overflow-hidden shadow-xs transition-all"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-sand-50/50 transition-colors"
                  >
                    <span className="font-serif text-base sm:text-lg font-bold text-teal-950">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-teal-900 shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-gold-600" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-sm text-ink-700 leading-relaxed border-t border-sand-100 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Bottom CTA Card */}
        <div className="bg-gradient-to-br from-teal-950 to-teal-900 text-sand-50 rounded-2xl p-8 sm:p-10 text-center space-y-5 shadow-warm">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/20 text-gold-400 text-xs font-bold uppercase tracking-wider border border-gold-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ready to Get Linked?</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-sand-50 max-w-xl mx-auto">
            Join Sri Lanka&apos;s Most Trusted Hospitality × Creator Community
          </h2>
          <p className="text-xs sm:text-sm text-sand-200 max-w-lg mx-auto">
            Whether you are a boutique stay seeking high-converting visual media or a verified creator travelling to Sri Lanka, we curate the right connection.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2 flex-wrap">
            <Link
              href="/apply"
              className="px-6 py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-ink-950 font-bold text-xs uppercase tracking-wider shadow-warm transition-all flex items-center gap-2"
            >
              <UserCheck className="w-4 h-4" />
              <span>Apply as Creator</span>
            </Link>
            <Link
              href="/list-property"
              className="px-6 py-3 rounded-xl bg-teal-800 hover:bg-teal-700 text-sand-50 font-semibold text-xs uppercase tracking-wider border border-teal-700 transition-colors flex items-center gap-2"
            >
              <Building2 className="w-4 h-4" />
              <span>List Your Property</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
