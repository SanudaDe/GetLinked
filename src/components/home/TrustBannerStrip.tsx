import React from "react";
import { ShieldCheck, Lock, UserCheck, HeartHandshake } from "lucide-react";

export const TrustBannerStrip: React.FC = () => {
  const pillars = [
    {
      icon: ShieldCheck,
      title: "100% Human Verified",
      desc: "Every passport & stay manually authenticated",
    },
    {
      icon: Lock,
      title: "Air-Gapped Privacy",
      desc: "WhatsApp & ID documents never exposed publicly",
    },
    {
      icon: HeartHandshake,
      title: "Concierge WhatsApp Intros",
      desc: "Curated terms with human introductions",
    },
    {
      icon: UserCheck,
      title: "Sri Lanka PDPA Compliant",
      desc: "Protected under Personal Data Protection Act",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-10">
      <div className="bg-white rounded-2xl border border-sand-300 p-5 sm:p-6 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-sand-200">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className={`flex items-center gap-3.5 ${
                  idx !== 0 ? "pt-4 sm:pt-0 sm:pl-6" : ""
                }`}
              >
                <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 border border-teal-100">
                  <Icon className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-bold text-teal-950">
                    {p.title}
                  </h4>
                  <p className="text-[11px] text-ink-600 leading-snug mt-0.5">
                    {p.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
