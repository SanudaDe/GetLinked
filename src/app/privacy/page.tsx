import React from "react";
import { ShieldCheck, Lock, FileText } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="py-16 bg-sand-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-900/10 text-teal-900 text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-gold-500" />
            Data Protection
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-teal-950">
            Privacy Policy & Sri Lanka PDPA Notice
          </h1>
          <p className="text-xs sm:text-sm text-ink-600">
            Last Updated: September 2026 • Compliant with Sri Lanka Personal Data Protection Act No. 9 of 2022
          </p>
        </div>

        <div className="bg-sand-50 rounded-2xl border border-sand-300 p-8 sm:p-12 shadow-warm space-y-8 text-ink-800 text-sm leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-teal-950">
              1. Information We Collect
            </h2>
            <p>
              Get Linked (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) operates as a verified two-sided collaboration platform in Sri Lanka. To maintain platform safety, we collect:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-ink-700">
              <li><strong>Creator Applicants:</strong> Full legal name, age (18+ verified), WhatsApp telephone number, country of residence, official identity documents (Passport or National Identity Card), social media links, follower metrics, and travel itineraries.</li>
              <li><strong>Accommodation Hosts:</strong> Property name, business registration details, contact person name, WhatsApp number, email, and collaboration terms.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-teal-950">
              2. Purpose of Processing & Consent
            </h2>
            <p>
              Under the Personal Data Protection Act (PDPA) of Sri Lanka, we process your personal data solely for legitimate business purposes:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-ink-700">
              <li>Verifying the authentic identity and legal age of creators and property hosts.</li>
              <li>Preventing fraudulent representation, duplicate profiles, and bot spam.</li>
              <li>Facilitating authorized collaboration introductions via WhatsApp upon confirmation.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-teal-950">
              3. Private Document Storage & Air-Gapping
            </h2>
            <p>
              <strong>Your government identity documents are NEVER displayed publicly.</strong> All uploaded ID and passport files are encrypted at rest in isolated private storage, inaccessible to public internet endpoints or automated scrapers. They are reviewed exclusively by authorized Get Linked personnel.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-teal-950">
              4. Document Retention & Purging
            </h2>
            <p>
              We adhere to a policy of data minimization. Verification documents are not retained permanently. Identity documents are scheduled for secure deletion based on platform retention policies (default 90 days after verification or upon request) once identity credentials have been confirmed.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-teal-950">
              5. Your Rights Under Sri Lanka PDPA
            </h2>
            <p>
              You possess the right to request access to your personal data, request correction of inaccurate records, withdraw consent, or request complete deletion of your application records by contacting our Data Protection Officer at <span className="font-mono text-teal-900 font-semibold">privacy@getlinked.today</span>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
