import React from "react";
import { FileText, ShieldAlert, Search, MessageSquareShare } from "lucide-react";

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      number: "01",
      icon: FileText,
      title: "Apply with Verified Details",
      description:
        "Creators submit trip dates, follower metrics (5,000+ min), and official government ID. Stays list their property, location, and collaboration offer.",
    },
    {
      number: "02",
      icon: ShieldAlert,
      title: "100% Human Verification",
      description:
        "No bots or auto-approvals. Our Colombo-based team manually reviews passport IDs, engagement metrics, and property authenticity.",
    },
    {
      number: "03",
      icon: Search,
      title: "Discover & Request",
      description:
        "Browse verified creators visiting your city on matching dates. Accommodations click 'Request this Creator' without seeing private contact details.",
    },
    {
      number: "04",
      icon: MessageSquareShare,
      title: "Curated Introduction",
      description:
        "Get Linked acts as the trusted middleman. Once confirmed, we introduce both parties directly on WhatsApp with pre-arranged terms.",
    },
  ];

  return (
    <section className="py-20 bg-sand-100/50 border-b border-sand-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="text-xs uppercase tracking-widest text-gold-600 font-bold">
            The Marketplace Model
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-teal-950">
            How Get Linked Works
          </h2>
          <p className="text-sm sm:text-base text-ink-700 leading-relaxed">
            We are not a passive directory or automated bot platform. Human review and human introductions protect both creators and hospitality hosts.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative bg-sand-50 rounded-xl p-6 border border-sand-300 shadow-warm hover:shadow-warm-lg transition-shadow flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-2xl font-bold text-gold-500">
                      {step.number}
                    </span>
                    <div className="w-10 h-10 rounded-lg bg-teal-900/10 flex items-center justify-center text-teal-900">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-teal-950">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-ink-700 leading-relaxed">
                    {step.description}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-sand-200">
                  <span className="text-[11px] font-semibold text-teal-800 uppercase tracking-wider">
                    Step {step.number} • Manual Review
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
