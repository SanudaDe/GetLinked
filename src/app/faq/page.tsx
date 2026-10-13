"use client";

import React, { useState } from "react";
import { ChevronDown, Search } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
  category: "creators" | "stays" | "process" | "privacy";
}

const FAQS: FaqItem[] = [
  {
    category: "creators",
    question: "What are the requirements to join as a creator?",
    answer:
      "Creators must be 18 years or older, hold at least 5,000 followers on a public social platform, and have confirmed travel dates in Sri Lanka. A valid national ID or passport is required for verification.",
  },
  {
    category: "creators",
    question: "Is Get Linked free for creators?",
    answer:
      "Yes. Creators do not pay membership fees, application fees, or introduction fees.",
  },
  {
    category: "creators",
    question: "What kind of content is expected during a stay?",
    answer:
      "Deliverables are tailored to the host's needs and the creator's style, commonly including photography, reels, or stories. Agreed terms are confirmed before the stay begins.",
  },
  {
    category: "creators",
    question: "How long does verification take?",
    answer:
      "Each application is reviewed by hand, typically within 24 to 48 hours.",
  },
  {
    category: "stays",
    question: "What types of stays qualify for Get Linked?",
    answer:
      "We work with boutique hotels, private villas, heritage estates, eco-lodges, and guesthouses across Sri Lanka.",
  },
  {
    category: "stays",
    question: "What does it cost to list a property?",
    answer:
      "Listing your stay and receiving creator introductions is currently free during launch.",
  },
  {
    category: "stays",
    question: "How do I connect with a creator travelling to my area?",
    answer:
      "You can view creators scheduled for your destination and request an introduction. Our team confirms date overlap and compatibility before connecting both sides.",
  },
  {
    category: "process",
    question: "How does the introduction work?",
    answer:
      "When there is mutual interest, we introduce the host and creator directly on WhatsApp with confirmed dates and agreed deliverables.",
  },
  {
    category: "privacy",
    question: "How is personal data and identification handled?",
    answer:
      "Identity documents are used solely for one-time verification. They are never published, never shared with hosts, and never indexed publicly.",
  },
  {
    category: "privacy",
    question: "Are contact details visible on public profiles?",
    answer:
      "No. Phone numbers and private details are never visible on public profiles.",
  },
];

export default function FaqPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState<string>("all");

  const filteredFaqs = FAQS.filter((faq) => {
    const matchesCategory = activeTab === "all" || faq.category === activeTab;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="py-24 sm:py-32 bg-white dark:bg-black text-[#1A3739] dark:text-white min-h-screen transition-colors duration-300">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Functional Plain Header */}
        <div className="text-center space-y-4">
          <h1 className="font-serif text-5xl sm:text-6xl font-normal text-[#1A3739] dark:text-white tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-[19px] sm:text-[22px] text-[#1A3739]/90 dark:text-neutral-200 leading-relaxed max-w-xl mx-auto font-normal pt-1">
            Direct answers regarding creator verification, property listings, and how introductions work.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative max-w-md mx-auto">
          <Search className="w-4 h-4 text-[#1A3739]/50 dark:text-neutral-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-900 text-xs text-[#1A3739] dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 focus:outline-none focus:border-[#D7400B]"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-center gap-2 flex-wrap text-xs">
          {[
            { id: "all", label: "All" },
            { id: "creators", label: "Creators" },
            { id: "stays", label: "Stays" },
            { id: "process", label: "Introductions" },
            { id: "privacy", label: "Privacy" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setOpenIndex(null);
              }}
              className={`px-4 py-1.5 rounded-full transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? "bg-[#D7400B] text-white font-semibold"
                  : "bg-gray-100 dark:bg-neutral-900 text-[#1A3739] dark:text-neutral-300 border border-gray-200 dark:border-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-neutral-950 rounded-xl border border-gray-200 dark:border-neutral-800 overflow-hidden transition-all shadow-xs"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-gray-50/70 dark:hover:bg-neutral-900/50 transition-colors cursor-pointer"
                >
                  <span className="font-serif text-base sm:text-lg font-normal text-[#1A3739] dark:text-white">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#1A3739]/70 dark:text-neutral-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-[#D7400B]" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-[#1A3739]/85 dark:text-neutral-300 leading-relaxed border-t border-gray-100 dark:border-neutral-900 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
