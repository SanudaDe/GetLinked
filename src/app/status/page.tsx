"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useStore } from "@/data/store";
import { Badge } from "@/components/ui/Badge";
import { Search, ShieldCheck, Clock, CheckCircle2, XCircle, AlertCircle, UserCheck } from "lucide-react";
import { formatStorageUrl } from "@/utils/formatters";

export default function StatusLookupPage() {
  const { lookupStatus, authUser, signOutUser } = useStore();

  const [whatsapp, setWhatsapp] = useState("");
  const [refCode, setRefCode] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [result, setResult] = useState<{
    found: boolean;
    type?: "CREATOR" | "ACCOMMODATION";
    name?: string;
    status?: "PENDING" | "APPROVED" | "REJECTED";
    submittedAt?: string;
  } | null>(null);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!whatsapp.trim() || !refCode.trim()) return;

    const res = lookupStatus(whatsapp, refCode);
    setResult(res);
    setHasSearched(true);
  };

  return (
    <div className="py-16 bg-sand-50 min-h-screen">
      <div className="max-w-xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-900/10 text-teal-900 text-xs font-semibold uppercase tracking-wider">
            <Clock className="w-3.5 h-3.5 text-gold-500" />
            Application Tracker
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-teal-950">
            Check Application Status
          </h1>
          <p className="text-xs sm:text-sm text-ink-700 leading-relaxed">
            Enter the WhatsApp number used during application and your secure reference code (e.g. <span className="font-mono text-teal-900">GL-C-7741</span> or <span className="font-mono text-teal-900">GL-A-4102</span>).
          </p>
        </div>

        {/* Logged-in Influencer Account Card */}
        {authUser && (
          <div className="bg-[#ECE9C4] rounded-2xl border border-[#C8C488] p-5 sm:p-6 mb-8 shadow-warm flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in">
            <div className="flex items-center gap-4 text-left w-full sm:w-auto">
              {authUser.avatar_url ? (
                <img
                  src={formatStorageUrl(authUser.avatar_url)}
                  alt={authUser.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-[#336467] shadow-sm shrink-0"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-[#336467] text-white flex items-center justify-center font-serif font-bold text-xl shrink-0">
                  {authUser.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] uppercase font-bold tracking-wider text-[#D7400B]">
                    Authenticated
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                </div>
                <h3 className="font-serif text-lg font-bold text-[#336467] truncate">
                  {authUser.name}
                </h3>
                <p className="text-xs text-[#336467]/80 font-mono truncate">
                  {authUser.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
              <Link
                href="/apply"
                className="px-4 py-2 rounded-xl bg-[#336467] hover:bg-[#254d50] text-white text-xs font-semibold transition-colors"
              >
                Apply as Creator
              </Link>
              <button
                onClick={signOutUser}
                className="px-3.5 py-2 rounded-xl bg-white/70 hover:bg-rose-50 text-rose-700 text-xs font-semibold border border-[#C8C488] transition-colors"
              >
                Log out
              </button>
            </div>
          </div>
        )}

        {/* Search Card */}
        <form
          onSubmit={handleLookup}
          className="bg-sand-50 rounded-2xl border border-sand-300 p-6 sm:p-8 shadow-warm space-y-5"
        >
          <div>
            <label className="block text-xs font-semibold text-ink-800 uppercase tracking-wider mb-1">
              Your WhatsApp Number *
            </label>
            <input
              type="tel"
              required
              placeholder="e.g. +447911123456 or +94771234567"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-sand-400 bg-sand-50 text-sm focus:outline-none focus:ring-2 focus:ring-teal-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink-800 uppercase tracking-wider mb-1">
              Secure Reference Code *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. GL-C-7741"
              value={refCode}
              onChange={(e) => setRefCode(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-sand-400 bg-sand-50 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-900 uppercase"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-lg bg-teal-900 hover:bg-teal-800 text-sand-50 text-xs font-semibold uppercase tracking-wider shadow-warm transition-all flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4 text-gold-400" />
            <span>Lookup Status</span>
          </button>
        </form>

        {/* Result Container */}
        {hasSearched && (
          <div className="mt-8 animate-in fade-in">
            {result?.found ? (
              <div className="bg-sand-50 rounded-2xl border border-sand-300 p-6 shadow-warm space-y-4">
                <div className="flex items-center justify-between border-b border-sand-200 pb-3">
                  <div>
                    <span className="text-xs uppercase font-bold tracking-wider text-ink-500 block">
                      {result.type === "CREATOR" ? "Creator Application" : "Stay Listing"}
                    </span>
                    <h3 className="font-serif text-xl font-bold text-teal-950">
                      {result.name}
                    </h3>
                  </div>
                  <div>
                    {result.status === "PENDING" && (
                      <Badge variant="pending" size="md">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Under Verification</span>
                      </Badge>
                    )}
                    {result.status === "APPROVED" && (
                      <Badge variant="approved" size="md">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verified & Approved</span>
                      </Badge>
                    )}
                    {result.status === "REJECTED" && (
                      <Badge variant="rejected" size="md">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Not Accepted</span>
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="text-xs text-ink-700 space-y-2 leading-relaxed">
                  {result.status === "PENDING" && (
                    <p>
                      Your submission is currently in the manual review queue. A Get Linked concierge is reviewing your credentials. You will receive an introduction notification via WhatsApp upon completion.
                    </p>
                  )}
                  {result.status === "APPROVED" && (
                    <p className="text-emerald-900 font-medium">
                      Congratulations! Your profile has been verified and is active for collaboration matching across Sri Lanka.
                    </p>
                  )}
                  {result.status === "REJECTED" && (
                    <p className="text-ink-600">
                      Thank you for your interest. Regrettably, this application did not meet our verification or audience criteria at this time.
                    </p>
                  )}
                </div>

                {result.submittedAt && (
                  <div className="text-[11px] text-ink-400 border-t border-sand-200 pt-2">
                    Submitted on: {new Date(result.submittedAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-sand-50 rounded-2xl border border-sand-300 p-6 text-center shadow-warm space-y-2">
                <AlertCircle className="w-8 h-8 text-amber-600 mx-auto" />
                <h4 className="font-serif text-lg font-bold text-teal-950">
                  No Record Found
                </h4>
                <p className="text-xs text-ink-600 max-w-sm mx-auto">
                  We could not find an application matching that WhatsApp number and reference code. Please verify the spelling and try again.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Demo Reference Helper */}
        <div className="mt-8 p-4 bg-sand-200/50 rounded-xl border border-sand-300/80 text-xs text-ink-700 space-y-1">
          <span className="font-semibold text-teal-950 block">Quick Demo References:</span>
          <div>Creator (Approved): WhatsApp <code className="bg-sand-100 px-1.5 py-0.5 rounded text-teal-900 font-mono">+447911123456</code>, Code <code className="bg-sand-100 px-1.5 py-0.5 rounded text-teal-900 font-mono">GL-C-7741</code></div>
          <div>Stay (Approved): WhatsApp <code className="bg-sand-100 px-1.5 py-0.5 rounded text-teal-900 font-mono">+94773829102</code>, Code <code className="bg-sand-100 px-1.5 py-0.5 rounded text-teal-900 font-mono">GL-A-4102</code></div>
          <div>Pending: WhatsApp <code className="bg-sand-100 px-1.5 py-0.5 rounded text-teal-900 font-mono">+94771234567</code>, Code <code className="bg-sand-100 px-1.5 py-0.5 rounded text-teal-900 font-mono">GL-C-1094</code></div>
        </div>
      </div>
    </div>
  );
}
