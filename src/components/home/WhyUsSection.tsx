import React from "react";
import { Check, Star, ShieldCheck, HeartHandshake, EyeOff, Zap } from "lucide-react";

export const WhyUsSection: React.FC = () => {
  const creatorPerks = [
    { title: "No spam or cold pitching", desc: "Browse approved stays or let properties request you with clear offerings." },
    { title: "100% Private identity", desc: "Your passport and WhatsApp are locked behind encrypted storage and never exposed." },
    { title: "Vetted boutique accommodations", desc: "From historic Galle Fort villas to coastal surf retreats and highland tea estates." },
    { title: "Concierge WhatsApp introductions", desc: "No endless back-and-forth emails. We handle the direct introduction." },
  ];

  const stayPerks = [
    { title: "5,000+ Verified follower minimum", desc: "No fake accounts, bots, or unverified nano-pitchers wasting your management's time." },
    { title: "Exact Sri Lanka travel dates", desc: "Filter by who is arriving in your exact destination city (Galle, Ella, Kandy, etc.)." },
    { title: "ID & Passport confirmed", desc: "We confirm real identity before any creator ever enters our matchable pool." },
    { title: "Custom collaboration terms", desc: "Offer complimentary stays, stay+meals, or negotiable terms on your own schedule." },
  ];

  return (
    <section className="py-20 bg-sand-100/40 border-b border-sand-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="text-xs uppercase tracking-widest text-gold-600 font-bold">
            Curated For Quality
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-teal-950">
            Why Both Sides Trust Get Linked
          </h2>
          <p className="text-sm sm:text-base text-ink-700">
            Uncontrolled influencer marketing is filled with fake engagement, unanswered DMs, and security risks. Get Linked fixes the marketplace.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Creators Card */}
          <div className="bg-sand-50 rounded-2xl border border-sand-300 p-8 shadow-warm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-teal-900 flex items-center justify-center text-gold-400">
                <Star className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-2xl font-bold text-teal-950">
                  For Creators & Influencers
                </h3>
                <span className="text-xs text-ink-600 font-medium">Free membership for eligible creators</span>
              </div>
            </div>

            <div className="space-y-4">
              {creatorPerks.map((perk, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-teal-900/10 text-teal-900 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-teal-950">{perk.title}</h4>
                    <p className="text-xs text-ink-600 leading-relaxed mt-0.5">{perk.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stays Card */}
          <div className="bg-sand-50 rounded-2xl border border-sand-300 p-8 shadow-warm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gold-500 flex items-center justify-center text-teal-950">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-2xl font-bold text-teal-950">
                  For Hotels, Villas & Stays
                </h3>
                <span className="text-xs text-ink-600 font-medium">Zero listing fee in Phase 1</span>
              </div>
            </div>

            <div className="space-y-4">
              {stayPerks.map((perk, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-gold-500/20 text-gold-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-teal-950">{perk.title}</h4>
                    <p className="text-xs text-ink-600 leading-relaxed mt-0.5">{perk.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
