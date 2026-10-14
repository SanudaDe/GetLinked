"use client";

import React, { useState } from "react";
import { Match, MatchReview, CollabRatingSubmission } from "@/types";
import { useStore } from "@/data/store";
import { generateWhatsAppLink } from "@/utils/whatsapp";
import {
  Star,
  Lock,
  Unlock,
  MessageSquareShare,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Building2,
  UserCheck,
  AlertCircle,
  Eye,
  Check,
  Award,
} from "lucide-react";

interface DoubleBlindMatchReviewProps {
  match: Match;
}

const PROPERTY_CRITERIA_OPTIONS = [
  "Reliability",
  "Content Quality",
  "Showed up as agreed",
  "Respectful of property",
];

const CREATOR_CRITERIA_OPTIONS = [
  "As described",
  "Hospitality",
  "Smooth experience",
  "Generous host",
];

export const DoubleBlindMatchReview: React.FC<DoubleBlindMatchReviewProps> = ({ match }) => {
  const {
    matchReviews,
    logMatchRating,
    revealMatchReview,
    getCreatorRatingStats,
    getPropertyRatingStats,
  } = useStore();

  const reviewRecord = matchReviews.find((r) => r.match_id === match.id);
  const status = reviewRecord?.status || "PENDING";

  const creatorStats = getCreatorRatingStats(match.creator_id);
  const propertyStats = getPropertyRatingStats(match.accommodation_id);

  // Host reviewing creator form state
  const existingPropRev = reviewRecord?.property_review_of_creator;
  const [propScore, setPropScore] = useState<number>(existingPropRev?.score || 5);
  const [propFeedback, setPropFeedback] = useState<string>(existingPropRev?.feedback || "");
  const [propCriteria, setPropCriteria] = useState<string[]>(
    existingPropRev?.criteria || ["Reliability", "Content Quality", "Showed up as agreed"]
  );
  const [isEditingProp, setIsEditingProp] = useState<boolean>(!existingPropRev);

  // Creator reviewing property form state
  const existingCreatorRev = reviewRecord?.creator_review_of_property;
  const [creatorScore, setCreatorScore] = useState<number>(existingCreatorRev?.score || 5);
  const [creatorFeedback, setCreatorFeedback] = useState<string>(existingCreatorRev?.feedback || "");
  const [creatorCriteria, setCreatorCriteria] = useState<string[]>(
    existingCreatorRev?.criteria || ["As described", "Hospitality", "Smooth experience"]
  );
  const [isEditingCreator, setIsEditingCreator] = useState<boolean>(!existingCreatorRev);

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Pre-formatted WhatsApp follow-up messages for admin follow up a few days post-stay
  const hostFollowUpMsg = `Hi ${match.accommodation_contact || "Host"}, checking in from Get Linked after your collaboration with ${match.creator_name} at ${match.accommodation_name}! Could you share a quick 1-5 rating and a one-line comment on how it went (reliability, content quality, showed up as agreed)? Double-blind active: neither side sees the other's rating until both submit.`;
  const hostFollowUpLink = generateWhatsAppLink(match.accommodation_whatsapp, hostFollowUpMsg);

  const creatorFollowUpMsg = `Hi ${match.creator_name}, checking in from Get Linked after your stay at ${match.accommodation_name}! Could you share a quick 1-5 rating and a one-line comment on how your experience was (as described, hospitality, smooth experience)? Double-blind active: neither side sees the other's rating until both submit.`;
  const creatorFollowUpLink = generateWhatsAppLink(match.creator_whatsapp, creatorFollowUpMsg);

  const handleSavePropertyReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!propFeedback.trim()) return;

    setIsSaving(true);
    await logMatchRating(match.id, "property", {
      score: propScore,
      feedback: propFeedback.trim(),
      criteria: propCriteria,
      submittedBy: `${match.accommodation_contact || "Host"} (${match.accommodation_name})`,
    });
    setIsSaving(false);
    setIsEditingProp(false);
    setSaveSuccessMsg("Host post-stay rating saved!");
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const handleSaveCreatorReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!creatorFeedback.trim()) return;

    setIsSaving(true);
    await logMatchRating(match.id, "creator", {
      score: creatorScore,
      feedback: creatorFeedback.trim(),
      criteria: creatorCriteria,
      submittedBy: match.creator_name,
    });
    setIsSaving(false);
    setIsEditingCreator(false);
    setSaveSuccessMsg("Creator post-stay rating saved!");
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const togglePropCriterion = (crit: string) => {
    setPropCriteria((prev) =>
      prev.includes(crit) ? prev.filter((c) => c !== crit) : [...prev, crit]
    );
  };

  const toggleCreatorCriterion = (crit: string) => {
    setCreatorCriteria((prev) =>
      prev.includes(crit) ? prev.filter((c) => c !== crit) : [...prev, crit]
    );
  };

  return (
    <div className="mt-4 pt-4 border-t border-sand-200 dark:border-neutral-800 space-y-4">
      {/* Header & Double-Blind Status Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-serif text-sm font-bold text-teal-950 dark:text-white">
              Double-Blind Post-Collaboration Reviews
            </span>

            {status === "REVEALED" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Unlocked & Revealed (Both Submitted)</span>
              </span>
            )}

            {status === "PROPERTY_ONLY" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                <span>Sealed: Host Submitted • Creator Pending</span>
              </span>
            )}

            {status === "CREATOR_ONLY" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                <span>Sealed: Creator Submitted • Host Pending</span>
              </span>
            )}

            {status === "PENDING" && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-sand-200 text-ink-700 dark:bg-neutral-800 dark:text-neutral-300 border border-sand-300 dark:border-neutral-700">
                <Clock className="w-3.5 h-3.5 text-ink-500" />
                <span>Awaiting Follow-Up (No Reviews Yet)</span>
              </span>
            )}
          </div>

          <p className="text-[11px] text-ink-600 dark:text-neutral-400">
            Airbnb/Uber model: neither party sees the other&apos;s score until both submit, preventing tit-for-tat reviews.
          </p>
        </div>

        {/* Force Reveal Override for Admin */}
        {status !== "REVEALED" && (existingPropRev || existingCreatorRev) && (
          <button
            type="button"
            onClick={() => revealMatchReview(match.id)}
            className="px-3 py-1.5 rounded-lg border border-sand-400 dark:border-neutral-700 hover:bg-sand-200 dark:hover:bg-neutral-800 text-teal-950 dark:text-white text-[11px] font-semibold transition-colors flex items-center gap-1.5 self-start cursor-pointer"
            title="Override double-blind secrecy and publish submitted ratings immediately"
          >
            <Eye className="w-3.5 h-3.5 text-amber-600" />
            <span>Force Reveal Now (Admin Override)</span>
          </button>
        )}
      </div>

      {saveSuccessMsg && (
        <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-emerald-900 dark:text-emerald-200 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Credibility Threshold Status Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-sand-100/70 dark:bg-neutral-900/60 border border-sand-300 dark:border-neutral-800 text-xs">
        {/* Creator Threshold Status */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-teal-950 dark:text-white flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-gold-600" />
              <span>{match.creator_name}</span>
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                creatorStats.meetsThreshold
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                  : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
              }`}
            >
              {creatorStats.meetsThreshold
                ? `★ ${creatorStats.average} / 5.0 (Threshold Met)`
                : `${creatorStats.count} / 3 Reviews (Score Hidden)`}
            </span>
          </div>
          <p className="text-[11px] text-ink-500 dark:text-neutral-400">
            {creatorStats.meetsThreshold
              ? `Public average is live (${creatorStats.count} verified collaborations).`
              : `Needs ${3 - creatorStats.count} more verified reviews before average score is shown publicly.`}
          </p>
        </div>

        {/* Accommodation Threshold Status */}
        <div className="space-y-1 sm:border-l sm:border-sand-300 sm:dark:border-neutral-800 sm:pl-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-teal-950 dark:text-white flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-teal-700" />
              <span>{match.accommodation_name}</span>
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                propertyStats.meetsThreshold
                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                  : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
              }`}
            >
              {propertyStats.meetsThreshold
                ? `★ ${propertyStats.average} / 5.0 (Threshold Met)`
                : `${propertyStats.count} / 3 Reviews (Score Hidden)`}
            </span>
          </div>
          <p className="text-[11px] text-ink-500 dark:text-neutral-400">
            {propertyStats.meetsThreshold
              ? `Public average is live (${propertyStats.count} verified collaborations).`
              : `Needs ${3 - propertyStats.count} more verified reviews before average score is shown publicly.`}
          </p>
        </div>
      </div>

      {/* WhatsApp Follow-Up Launchers */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-semibold text-ink-600 dark:text-neutral-400">
          Concierge WhatsApp Follow-Up:
        </span>
        <a
          href={hostFollowUpLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-[11px] font-semibold shadow-xs transition-colors"
        >
          <MessageSquareShare className="w-3.5 h-3.5" />
          <span>Ask Host for 1-5 ⭐ Feedback</span>
        </a>
        <a
          href={creatorFollowUpLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-900 hover:bg-teal-800 text-sand-50 text-[11px] font-semibold shadow-xs transition-colors"
        >
          <MessageSquareShare className="w-3.5 h-3.5 text-gold-400" />
          <span>Ask Creator for 1-5 ⭐ Feedback</span>
        </a>
      </div>

      {/* Review Cards Grid: Side A (Host on Creator) vs Side B (Creator on Host) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* SIDE 1: Property Rates Creator */}
        <div className="p-4 rounded-xl border border-sand-300 dark:border-neutral-800 bg-sand-50 dark:bg-neutral-900/40 space-y-3">
          <div className="flex items-center justify-between border-b border-sand-200 dark:border-neutral-800 pb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-teal-950 dark:text-white">
              <Building2 className="w-4 h-4 text-teal-800" />
              <span>Host Evaluation of Creator</span>
            </div>
            {existingPropRev && (
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                <Check className="w-3 h-3" />
                <span>Logged</span>
              </span>
            )}
          </div>

          {existingPropRev && !isEditingProp ? (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-500">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= existingPropRev.score ? "fill-amber-500 text-amber-500" : "text-sand-300"
                      }`}
                    />
                  ))}
                  <span className="ml-1.5 font-bold text-teal-950 dark:text-white text-xs">
                    {existingPropRev.score} / 5.0
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditingProp(true)}
                  className="text-[11px] font-semibold text-sinopia hover:underline cursor-pointer"
                >
                  Edit Rating
                </button>
              </div>

              <p className="text-xs text-ink-800 dark:text-neutral-200 italic bg-sand-100/50 dark:bg-neutral-950 p-2.5 rounded-lg border border-sand-200 dark:border-neutral-800">
                &ldquo;{existingPropRev.feedback}&rdquo;
              </p>

              {existingPropRev.criteria && existingPropRev.criteria.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {existingPropRev.criteria.map((c) => (
                    <span
                      key={c}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              )}

              <div className="text-[10px] text-ink-500 dark:text-neutral-500 flex items-center justify-between pt-1">
                <span>By: {existingPropRev.submitted_by || "Host"}</span>
                <span>{new Date(existingPropRev.submitted_at).toLocaleDateString()}</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSavePropertyReview} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-ink-800 dark:text-neutral-300 uppercase tracking-wider mb-1">
                  1-5 Star Rating *
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setPropScore(s)}
                      className={`p-2 rounded-lg border text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                        propScore === s
                          ? "bg-amber-500 text-white border-amber-600 shadow-xs"
                          : "bg-white dark:bg-neutral-800 border-sand-300 dark:border-neutral-700 text-ink-700 dark:text-neutral-300 hover:border-amber-400"
                      }`}
                    >
                      <Star className={`w-3.5 h-3.5 ${propScore >= s ? "fill-current" : ""}`} />
                      <span>{s}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-ink-800 dark:text-neutral-300 uppercase tracking-wider mb-1">
                  One-Line Feedback from Host *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Arrived on time, respected house rules, delivered 2 high-quality reels."
                  value={propFeedback}
                  onChange={(e) => setPropFeedback(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-sand-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-xs focus:outline-none focus:ring-2 focus:ring-teal-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-ink-800 dark:text-neutral-300 uppercase tracking-wider mb-1">
                  Confirmed Highlights (Tap to Toggle)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {PROPERTY_CRITERIA_OPTIONS.map((c) => {
                    const isSelected = propCriteria.includes(c);
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => togglePropCriterion(c)}
                        className={`text-[10px] font-semibold px-2 py-1 rounded-md transition-colors cursor-pointer border ${
                          isSelected
                            ? "bg-teal-900 text-white border-teal-900 shadow-xs"
                            : "bg-white dark:bg-neutral-800 text-ink-600 dark:text-neutral-400 border-sand-300 dark:border-neutral-700 hover:border-teal-700"
                        }`}
                      >
                        {isSelected ? `✓ ${c}` : `+ ${c}`}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="submit"
                  disabled={isSaving || !propFeedback.trim()}
                  className="px-4 py-2 rounded-lg bg-teal-900 hover:bg-teal-800 text-white text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save Host Rating"}
                </button>
                {existingPropRev && (
                  <button
                    type="button"
                    onClick={() => setIsEditingProp(false)}
                    className="px-3 py-2 rounded-lg border border-sand-300 dark:border-neutral-700 text-xs text-ink-600 hover:text-ink-900"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          )}
        </div>

        {/* SIDE 2: Creator Rates Property */}
        <div className="p-4 rounded-xl border border-sand-300 dark:border-neutral-800 bg-sand-50 dark:bg-neutral-900/40 space-y-3">
          <div className="flex items-center justify-between border-b border-sand-200 dark:border-neutral-800 pb-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-teal-950 dark:text-white">
              <UserCheck className="w-4 h-4 text-gold-600" />
              <span>Creator Evaluation of Property</span>
            </div>
            {existingCreatorRev && (
              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                <Check className="w-3 h-3" />
                <span>Logged</span>
              </span>
            )}
          </div>

          {existingCreatorRev && !isEditingCreator ? (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-500">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= existingCreatorRev.score ? "fill-amber-500 text-amber-500" : "text-sand-300"
                      }`}
                    />
                  ))}
                  <span className="ml-1.5 font-bold text-teal-950 dark:text-white text-xs">
                    {existingCreatorRev.score} / 5.0
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditingCreator(true)}
                  className="text-[11px] font-semibold text-sinopia hover:underline cursor-pointer"
                >
                  Edit Rating
                </button>
              </div>

              <p className="text-xs text-ink-800 dark:text-neutral-200 italic bg-sand-100/50 dark:bg-neutral-950 p-2.5 rounded-lg border border-sand-200 dark:border-neutral-800">
                &ldquo;{existingCreatorRev.feedback}&rdquo;
              </p>

              {existingCreatorRev.criteria && existingCreatorRev.criteria.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {existingCreatorRev.criteria.map((c) => (
                    <span
                      key={c}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              )}

              <div className="text-[10px] text-ink-500 dark:text-neutral-500 flex items-center justify-between pt-1">
                <span>By: {existingCreatorRev.submitted_by || match.creator_name}</span>
                <span>{new Date(existingCreatorRev.submitted_at).toLocaleDateString()}</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSaveCreatorReview} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-ink-800 dark:text-neutral-300 uppercase tracking-wider mb-1">
                  1-5 Star Rating *
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setCreatorScore(s)}
                      className={`p-2 rounded-lg border text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                        creatorScore === s
                          ? "bg-amber-500 text-white border-amber-600 shadow-xs"
                          : "bg-white dark:bg-neutral-800 border-sand-300 dark:border-neutral-700 text-ink-700 dark:text-neutral-300 hover:border-amber-400"
                      }`}
                    >
                      <Star className={`w-3.5 h-3.5 ${creatorScore >= s ? "fill-current" : ""}`} />
                      <span>{s}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-ink-800 dark:text-neutral-300 uppercase tracking-wider mb-1">
                  One-Line Feedback from Creator *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gorgeous property, warm hospitality, and the staff made shooting effortless."
                  value={creatorFeedback}
                  onChange={(e) => setCreatorFeedback(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-sand-300 dark:border-neutral-700 bg-white dark:bg-neutral-950 text-xs focus:outline-none focus:ring-2 focus:ring-teal-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-ink-800 dark:text-neutral-300 uppercase tracking-wider mb-1">
                  Confirmed Highlights (Tap to Toggle)
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {CREATOR_CRITERIA_OPTIONS.map((c) => {
                    const isSelected = creatorCriteria.includes(c);
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => toggleCreatorCriterion(c)}
                        className={`text-[10px] font-semibold px-2 py-1 rounded-md transition-colors cursor-pointer border ${
                          isSelected
                            ? "bg-amber-600 text-white border-amber-600 shadow-xs"
                            : "bg-white dark:bg-neutral-800 text-ink-600 dark:text-neutral-400 border-sand-300 dark:border-neutral-700 hover:border-amber-600"
                        }`}
                      >
                        {isSelected ? `✓ ${c}` : `+ ${c}`}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="submit"
                  disabled={isSaving || !creatorFeedback.trim()}
                  className="px-4 py-2 rounded-lg bg-[#D7400B] hover:bg-[#BD3607] text-white text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save Creator Rating"}
                </button>
                {existingCreatorRev && (
                  <button
                    type="button"
                    onClick={() => setIsEditingCreator(false)}
                    className="px-3 py-2 rounded-lg border border-sand-300 dark:border-neutral-700 text-xs text-ink-600 hover:text-ink-900"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
