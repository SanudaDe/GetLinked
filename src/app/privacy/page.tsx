import React from "react";
import Link from "next/link";
import { ShieldCheck, Lock, FileText, ArrowLeft, Mail, MessageCircle, Globe } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="py-20 bg-white dark:bg-black text-[#1A3739] dark:text-white min-h-screen transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 hover:text-[#D7400B] dark:hover:text-[#D7400B] transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Homepage</span>
          </Link>

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D7400B]/10 text-[#D7400B] text-xs font-bold uppercase tracking-widest block mx-auto w-fit">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Data Protection & Privacy</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-neutral-900 dark:text-white">
            Privacy Policy
          </h1>

          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto leading-relaxed">
            Effective Date: October 2026 • Compliant with Sri Lanka Personal Data Protection Act No. 9 of 2022 (PDPA)
          </p>
        </div>

        {/* Policy Body */}
        <div className="bg-neutral-50 dark:bg-[#121212] rounded-3xl border border-neutral-200 dark:border-neutral-800 p-8 sm:p-14 shadow-sm space-y-10 text-neutral-800 dark:text-neutral-200 text-sm leading-relaxed transition-colors">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-normal text-neutral-900 dark:text-white">
              1. Who we are
            </h2>
            <p>
              Get Linked (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) operates <strong className="text-neutral-900 dark:text-white font-mono text-xs">getlinkedlk.com</strong> and <strong className="text-neutral-900 dark:text-white font-mono text-xs">getlinked.today</strong>, a verified hospitality and creator introduction platform connecting social media creators with hotels, villas, guesthouses, restaurants, cafés, and other venues across Sri Lanka.
            </p>
            <p>
              For the purposes of applicable data protection law, including the Sri Lanka Personal Data Protection Act No. 9 of 2022 (PDPA), Get Linked operates as the <strong>data controller</strong> of the personal data described in this policy.
            </p>
            <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-300 space-y-1">
              <span className="font-bold text-neutral-900 dark:text-white block uppercase tracking-wider text-[11px]">
                Controller Entity Details:
              </span>
              <p>Registered Entity: Get Linked Concierge Platform • Colombo / Galle, Sri Lanka</p>
              <p>Email: <a href="mailto:privacy@getlinked.today" className="text-[#D7400B] hover:underline">privacy@getlinked.today</a></p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-normal text-neutral-900 dark:text-white">
              2. What we collect
            </h2>
            <p className="font-medium text-neutral-900 dark:text-white">
              From creators applying to join:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-neutral-700 dark:text-neutral-300">
              <li>Full legal name, age (18+ required), and country of residence</li>
              <li>WhatsApp contact telephone number</li>
              <li>A copy of your national identity card (NIC) or international passport, used strictly for manual identity verification</li>
              <li>Your verified social media channel handles and follower counts</li>
              <li>Your content niche, destination cities in Sri Lanka, and travel/visit dates</li>
              <li>A short written trip brief and content focus provided by you</li>
            </ul>

            <p className="font-medium text-neutral-900 dark:text-white pt-2">
              From hotels, villas, restaurants, and other venues listing with us:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-neutral-700 dark:text-neutral-300">
              <li>Business or property name, venue category, and primary contact person</li>
              <li>WhatsApp telephone number and business email</li>
              <li>City/region in Sri Lanka, availability dates or single-visit windows, and collaboration offerings</li>
              <li>Minimum follower tier requirements and creative expectations</li>
            </ul>

            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-neutral-700 dark:text-neutral-300">
              <strong>Special Category Data:</strong> We do not knowingly collect any special categories of sensitive personal data (such as health information, biometric data, religious, or political beliefs) beyond what may incidentally appear on a physical government ID or passport scan.
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-normal text-neutral-900 dark:text-white">
              3. Why we collect it
            </h2>
            <p>
              We process personal information exclusively for specific, explicit, and legitimate purposes:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-neutral-700 dark:text-neutral-300">
              <li><strong>Manual Verification:</strong> Verifying that creators, properties, and restaurant venues are genuine before any listing or pairing occurs.</li>
              <li><strong>Curation & Matching:</strong> Matching creators with venues based on destination overlap, travel dates, niche compatibility, and collaboration offers.</li>
              <li><strong>Concierge Introductions:</strong> Initiating authorized introductions via WhatsApp between matched parties upon mutual agreement.</li>
              <li><strong>Platform Operations & Integrity:</strong> Maintaining platform safety, preventing bot spam, and upholding service quality.</li>
            </ul>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              The legal basis for this processing under the PDPA is your <strong>explicit consent</strong>, given when submitting an application or venue listing, and—once matched—the <strong>performance of the introduction</strong> you have requested.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-normal text-neutral-900 dark:text-white">
              4. How we use and share your information
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-neutral-700 dark:text-neutral-300">
              <li>
                <strong>ID and passport copies are strictly air-gapped:</strong> They are used solely to confirm identity during manual verification. They are never shown publicly, are never shared with venues, creators, or external partners, and cannot be accessed via public endpoints.
              </li>
              <li>
                <strong>Public Directory Display:</strong> Once approved, a creator&apos;s display name, destination city, travel dates, content niche, verified social profiles, and follower count (presented at reduced prominence, not as a headline figure) appear in the curated directory.
              </li>
              <li>
                <strong>WhatsApp Numbers:</strong> Direct phone numbers are used solely by our internal concierge team to facilitate introductions and are never published on the public website.
              </li>
              <li>
                <strong>No Data Selling or Advertising Profiling:</strong> We do not sell personal data to third parties, and we do not engage in behavioral advertising profiling or third-party ad network tracking.
              </li>
              <li>
                <strong>Staff Access Controls:</strong> Access to identity documents and private contact credentials is strictly restricted to vetted admin verification staff on a need-to-know basis.
              </li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-normal text-neutral-900 dark:text-white">
              5. International data transfer
            </h2>
            <p>
              To maintain high uptime, global media streaming, and secure data storage, Get Linked utilizes industry-standard cloud infrastructure:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-neutral-700 dark:text-neutral-300">
              <li><strong>Application & Media Storage:</strong> Google Cloud Platform / Google Drive Enterprise (encrypted at rest using AES-256).</li>
              <li><strong>Database Services:</strong> Supabase Cloud with PostgreSQL Row-Level Security (RLS) enforcement.</li>
              <li><strong>Edge Delivery:</strong> Vercel Global Edge Network with TLS 1.3 in-transit encryption.</li>
            </ul>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              Cross-border data transfers adhere to the requirements of the Sri Lanka Personal Data Protection Act (PDPA), relying on appropriate technical safeguards, encrypted storage protocols, and strict contractual data processing agreements.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-normal text-neutral-900 dark:text-white">
              6. How long we keep your information
            </h2>
            <p>
              We practice strict data minimization. We do not store identity verification documents indefinitely:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-neutral-700 dark:text-neutral-300">
              <li><strong>Verification ID / Passport Copies:</strong> Retained during the active verification period and scheduled for automated purging ninety (90) days following application review or upon creator request.</li>
              <li><strong>Application & Directory Profiles:</strong> Retained while the creator or venue remains active on the platform. If an applicant requests deletion or withdraws their application, all related records are promptly purged.</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-normal text-neutral-900 dark:text-white">
              7. How we protect your information
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-neutral-700 dark:text-neutral-300">
              <li>Government ID and passport documents are stored encrypted at rest in isolated vaults, separate from general application metadata.</li>
              <li>The internal management dashboard is secured behind multi-layered authentication and is not linked from public pages.</li>
              <li>Strict role-based access limits data visibility to vetted personnel directly responsible for creator verification and concierge introductions.</li>
            </ul>
          </section>

          {/* Section 8 */}
          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-normal text-neutral-900 dark:text-white">
              8. Your rights under Sri Lanka PDPA
            </h2>
            <p>
              Subject to the Personal Data Protection Act No. 9 of 2022, you hold the following rights regarding your personal information:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-neutral-700 dark:text-neutral-300">
              <li><strong>Access:</strong> The right to request a copy of the personal data we hold about you.</li>
              <li><strong>Correction:</strong> The right to update inaccurate or incomplete information.</li>
              <li><strong>Erasure:</strong> The right to request deletion of your personal data, including the cancellation of a pending application.</li>
              <li><strong>Consent Withdrawal:</strong> The right to withdraw your consent at any time without affecting lawful processing carried out prior to withdrawal.</li>
              <li><strong>Objection:</strong> The right to object to further processing of your personal information.</li>
            </ul>
            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              To exercise any of these rights, please contact our privacy desk at <a href="mailto:privacy@getlinked.today" className="text-[#D7400B] font-semibold hover:underline">privacy@getlinked.today</a>.
            </p>
          </section>

          {/* Section 9 */}
          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-normal text-neutral-900 dark:text-white">
              9. Cookies and analytics
            </h2>
            <p>
              We prioritize user privacy. We do not use intrusive cross-site tracking cookies or marketing pixels:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-neutral-700 dark:text-neutral-300">
              <li><strong>Essential Session Storage:</strong> Local storage is used strictly to retain your theme preferences (Dark/Light mode) and secure authenticated sessions.</li>
              <li><strong>Privacy-Friendly Analytics:</strong> We use privacy-preserving, cookieless metrics (Vercel Web Analytics) that do not track personal identifying information (PII) or build user advertising profiles.</li>
            </ul>
          </section>

          {/* Section 10 */}
          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-normal text-neutral-900 dark:text-white">
              10. Age restriction
            </h2>
            <p>
              Get Linked is strictly intended for individuals <strong>18 years of age or older</strong>. We verify age via government documents and do not knowingly collect personal data from anyone under the age of 18. Any submission by a minor will be immediately deleted upon discovery.
            </p>
          </section>

          {/* Section 11 */}
          <section className="space-y-3">
            <h2 className="font-serif text-xl sm:text-2xl font-normal text-neutral-900 dark:text-white">
              11. Changes to this policy
            </h2>
            <p>
              We may update this Privacy Policy periodically to reflect platform developments or legal requirements. Any material changes will be published on this page with an updated effective date.
            </p>
          </section>

          {/* Section 12 */}
          <section className="space-y-3 border-t border-neutral-200 dark:border-neutral-800 pt-6">
            <h2 className="font-serif text-xl sm:text-2xl font-normal text-neutral-900 dark:text-white">
              12. Contact us
            </h2>
            <p>
              For privacy-specific inquiries, data access requests, or to exercise your rights under the PDPA, please contact our data team through any of the following channels:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <a
                href="mailto:privacy@getlinked.today"
                className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center gap-3 text-xs font-semibold hover:border-[#D7400B] transition-colors"
              >
                <Mail className="w-4 h-4 text-[#D7400B]" />
                <div>
                  <span className="block text-neutral-900 dark:text-white">Email Privacy Desk</span>
                  <span className="text-neutral-500 font-normal">privacy@getlinked.today</span>
                </div>
              </a>

              <a
                href="https://wa.me/94773829102"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center gap-3 text-xs font-semibold hover:border-emerald-500 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-500" />
                <div>
                  <span className="block text-neutral-900 dark:text-white">WhatsApp Concierge</span>
                  <span className="text-neutral-500 font-normal">+94 77 382 9102</span>
                </div>
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
