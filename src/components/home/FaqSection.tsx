"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "What are the minimum requirements to apply as a creator?",
      a: "Creators must be at least 18 years of age, possess a valid government-issued ID or passport, have a minimum of 5,000 authentic followers on a public social media platform (Instagram, TikTok, YouTube), and have confirmed travel dates in Sri Lanka.",
    },
    {
      q: "Will my WhatsApp number or identity document ever be visible to the public or hotels?",
      a: "Never. Your passport or ID is strictly used for internal background verification by the Get Linked team and stored securely in private object storage. Your WhatsApp number is only used by our concierge team to facilitate the direct introduction once both parties agree to collaborate.",
    },
    {
      q: "How does the matching process actually work?",
      a: "Accommodations can browse the verified Creator Directory and submit a 'Request this Creator'. Alternatively, Get Linked's concierge team proactively matches properties with incoming creators based on city, dates, niche, and host offerings. Once confirmed, we introduce both parties via WhatsApp.",
    },
    {
      q: "Is Get Linked free for Sri Lankan hotels and villas?",
      a: "During Phase 1 Launch, listing your accommodation and requesting collaboration matches is 100% free. Any future phase adjustments or fee structures will be communicated with complete transparency.",
    },
    {
      q: "What types of collaboration offers are supported?",
      a: "Hosts can choose from four standard arrangements: Free accommodation only, Free accommodation with meals included, Paid collaboration (host pays creator fee), or Flexible/open to negotiation.",
    },
  ];

  return (
    <section className="py-20 bg-sand-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <div className="text-xs uppercase tracking-widest text-gold-600 font-bold">
            Got Questions?
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-teal-950">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-ink-700">
            Everything you need to know about the Get Linked verification and matching model.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-sand-50 rounded-xl border border-sand-300 overflow-hidden shadow-warm transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 font-serif text-base sm:text-lg font-bold text-teal-950 hover:text-gold-600 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 shrink-0 text-teal-800 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-gold-600" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-sm text-ink-700 leading-relaxed border-t border-sand-200/60 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
