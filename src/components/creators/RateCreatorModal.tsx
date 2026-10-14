"use client";

import React, { useState } from "react";
import { Star, ShieldCheck, X, Check, Award, Building, Sparkles, Info } from "lucide-react";
import { useStore } from "@/data/store";
import { ReviewerRole } from "@/types";

interface RateCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  creatorId: string;
  creatorName: string;
}

export const RateCreatorModal: React.FC<RateCreatorModalProps> = ({
  isOpen,
  onClose,
  creatorId,
  creatorName,
}) => {
  const { addCreatorRating, adminUser } = useStore();

  const [ratingScore, setRatingScore] = useState<number>(5);
  const [reviewerName, setReviewerName] = useState("");
  const [reviewerRole, setReviewerRole] = useState<ReviewerRole>(
    adminUser ? "Platform Admin" : "Host / Property Owner"
  );
  const [propertyName, setPropertyName] = useState("");
  const [comment, setComment] = useState("");
  const [isAdminEvaluation, setIsAdminEvaluation] = useState<boolean>(!!adminUser);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !comment.trim()) return;

    setIsSubmitting(true);
    await addCreatorRating({
      creator_id: creatorId,
      rating: ratingScore,
      reviewer_name: reviewerName.trim(),
      reviewer_role: reviewerRole,
      property_name: propertyName.trim() || undefined,
      comment: comment.trim(),
      is_admin: isAdminEvaluation,
    });

    setIsSubmitting(false);
    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      onClose();
    }, 1800);
  };

  const getScoreLabel = (score: number) => {
    switch (score) {
      case 5:
        return "Exceptional / Flawless";
      case 4:
        return "Very Good / Reliable";
      case 3:
        return "Satisfactory / As Agreed";
      case 2:
        return "Below Expectations";
      case 1:
        return "Poor Experience";
      default:
        return "Good";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 dark:bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#121212] rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden transition-colors">
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#D7400B] block">
              Verified Rating
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-normal text-neutral-900 dark:text-white">
              Rate {creatorName}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-700 dark:hover:text-white rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedSuccess ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20 shadow-inner">
              <Check className="w-7 h-7" />
            </div>
            <h4 className="font-serif text-2xl font-light text-neutral-900 dark:text-white">
              Rating Logged!
            </h4>
            <p className="text-xs text-neutral-600 dark:text-neutral-300 max-w-sm mx-auto leading-relaxed">
              Thank you for providing honest feedback. Verified ratings contribute to {creatorName}&apos;s collaboration track record.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[82vh] overflow-y-auto">
            {/* Authenticity Threshold Notice */}
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200">
              <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5 leading-relaxed">
                <strong>No Fake Signals:</strong> Public average star scores only display once a creator earns 3+ verified reviews. Until then, ratings build behind the scenes to keep data credible.
              </div>
            </div>

            {/* Score Selector (1 to 5 Stars Airbnb / Uber style) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                  Rating (1-5 Stars) *
                </label>
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#D7400B]">
                  <Star className="w-4 h-4 fill-[#D7400B] text-[#D7400B]" />
                  <span className="text-base font-serif">{ratingScore} / 5</span>
                  <span className="text-neutral-500 dark:text-neutral-400 font-normal text-[11px]">
                    • {getScoreLabel(ratingScore)}
                  </span>
                </div>
              </div>

              {/* 1 to 5 Star Buttons */}
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((score) => {
                  const isSelected = ratingScore === score;
                  return (
                    <button
                      key={score}
                      type="button"
                      onClick={() => setRatingScore(score)}
                      className={`py-3 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                        isSelected
                          ? "bg-amber-500 text-white shadow-md scale-102 border-amber-600"
                          : "bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-800 border border-transparent dark:border-neutral-800"
                      }`}
                    >
                      <Star className={`w-4 h-4 ${score <= ratingScore ? "fill-current" : ""}`} />
                      <span>{score} ⭐</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reviewer Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-1.5">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kasun Silva"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white text-xs placeholder-neutral-400 dark:placeholder-neutral-600 focus:outline-none focus:border-[#D7400B] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-1.5">
                  Your Role *
                </label>
                <select
                  value={reviewerRole}
                  onChange={(e) => {
                    const role = e.target.value as ReviewerRole;
                    setReviewerRole(role);
                    if (role === "Platform Admin") {
                      setIsAdminEvaluation(true);
                    }
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white text-xs focus:outline-none focus:border-[#D7400B] transition-colors"
                >
                  <option value="Host / Property Owner">Host / Property Owner</option>
                  <option value="Fellow Creator">Fellow Creator</option>
                  <option value="Traveler / Guest">Traveler / Guest</option>
                  <option value="Platform Admin">Platform Admin</option>
                </select>
              </div>
            </div>

            {/* Optional Property / Brand */}
            <div>
              <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-1.5">
                Property / Stay / Organization (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Galle Fort Boutique Villa"
                value={propertyName}
                onChange={(e) => setPropertyName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white text-xs placeholder-neutral-400 dark:placeholder-neutral-600 focus:outline-none focus:border-[#D7400B] transition-colors"
              />
            </div>

            {/* Review Comment (One line / concise) */}
            <div>
              <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-1.5">
                Feedback & Experience (One Line) *
              </label>
              <textarea
                required
                rows={3}
                placeholder="e.g. Arrived on time, respected our heritage villa, and produced stunning 4K reels."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-white text-xs placeholder-neutral-400 dark:placeholder-neutral-600 focus:outline-none focus:border-[#D7400B] transition-colors resize-none"
              />
            </div>

            {/* Admin checkbox toggle */}
            {adminUser && (
              <label className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/20 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAdminEvaluation}
                  onChange={(e) => setIsAdminEvaluation(e.target.checked)}
                  className="w-4 h-4 rounded text-[#D7400B] focus:ring-0 cursor-pointer"
                />
                <span className="text-xs text-amber-800 dark:text-amber-400 font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Flag as Official Platform Admin Evaluation</span>
                </span>
              </label>
            )}

            {/* Actions */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs font-semibold uppercase tracking-wider text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !comment.trim()}
                className="w-2/3 py-3 rounded-xl bg-[#D7400B] hover:bg-[#BD3607] text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isSubmitting ? "Publishing..." : "Submit Rating"}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
