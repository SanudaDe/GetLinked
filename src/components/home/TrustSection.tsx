import React from "react";
import { ShieldCheck, Lock, UserCheck, PhoneCall } from "lucide-react";

export const TrustSection: React.FC = () => {
  const trustPillars = [
    {
      icon: ShieldCheck,
      title: "Sri Lanka PDPA Compliant",
      desc: "Identity documents and WhatsApp numbers are collected strictly for verification and stored in encrypted, non-public vaults.",
    },
    {
      icon: UserCheck,
      title: "Zero Auto-Approvals",
      desc: "Every applicant is inspected by our Colombo team. We cross-reference social profiles, engagement authenticity, and valid passports.",
    },
    {
      icon: Lock,
      title: "Air-Gapped Private Data",
      desc: "Directory searches reveal only public talent information. Contact details are never exposed to the internet or public APIs.",
    },
    {
      icon: PhoneCall,
      title: "Human Matchmaking",
      desc: "Introductions are made by Get Linked concierges directly on WhatsApp, establishing verified terms and professional expectations.",
    },
  ];

  return (
    <section className="py-20 bg-teal-950 text-sand-50 border-b border-teal-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/10 text-gold-400 border border-gold-500/30 text-xs font-semibold uppercase tracking-widest">
            Our Core Differentiator
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-sand-50">
            Trust & Human Verification First
          </h2>
          <p className="text-sm sm:text-base text-sand-300 leading-relaxed">
            Get Linked is built on privacy, human discretion, and verified credentials. We stay in the middle to protect both talent and hosts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {trustPillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="bg-teal-900/50 rounded-xl p-6 border border-teal-800/80 space-y-4 hover:border-gold-500/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-teal-800 flex items-center justify-center text-gold-400 border border-teal-700">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-lg font-bold text-sand-50">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-sand-300 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
