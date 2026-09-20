"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/data/store";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Badge } from "@/components/ui/Badge";
import { generateWhatsAppLink } from "@/utils/whatsapp";
import { RequestStatus, CreatorRequest } from "@/types";
import {
  Inbox,
  Send,
  CheckCircle2,
  XCircle,
  MessageCircle,
  Sparkles,
  ArrowRight,
  Eye,
  Clock,
  Trash2,
} from "lucide-react";

export default function AdminRequestsPage() {
  const router = useRouter();
  const { requests, updateRequestStatus, createProactiveMatch, deleteRequest } = useStore();
  const [selectedReq, setSelectedReq] = useState<CreatorRequest | null>(null);

  const counts = {
    PENDING: requests.filter((r) => r.status === "PENDING").length,
    REVIEWING: requests.filter((r) => r.status === "REVIEWING").length,
    MATCHED: requests.filter((r) => r.status === "MATCHED").length,
    DECLINED: requests.filter((r) => r.status === "DECLINED").length,
  };

  const handleConvertToMatch = (req: CreatorRequest) => {
    // If accommodation_id exists, convert
    const targetAccId = req.accommodation_id || "acc-201";
    const res = createProactiveMatch(
      req.creator_id,
      targetAccId,
      `Converted from Stay Request ${req.id} by ${req.requester_name}`
    );
    if (res.success) {
      updateRequestStatus(req.id, "MATCHED");
      router.push(`/admin/matches?matchId=${res.matchId}`);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <AdminHeader
        title="Stay Collaboration Requests"
        subtitle="Incoming requests from hotels and villas requesting specific verified creators."
      />

      <div className="px-6 space-y-6">
        {/* Metric Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-sand-50 rounded-xl p-4 border border-sand-300 shadow-warm">
            <span className="text-xs text-ink-600 font-medium">Pending Review</span>
            <div className="font-serif text-2xl font-bold text-amber-700 mt-1">
              {counts.PENDING}
            </div>
          </div>
          <div className="bg-sand-50 rounded-xl p-4 border border-sand-300 shadow-warm">
            <span className="text-xs text-ink-600 font-medium">Under Review</span>
            <div className="font-serif text-2xl font-bold text-teal-800 mt-1">
              {counts.REVIEWING}
            </div>
          </div>
          <div className="bg-sand-50 rounded-xl p-4 border border-sand-300 shadow-warm">
            <span className="text-xs text-ink-600 font-medium">Converted to Match</span>
            <div className="font-serif text-2xl font-bold text-emerald-700 mt-1">
              {counts.MATCHED}
            </div>
          </div>
          <div className="bg-sand-50 rounded-xl p-4 border border-sand-300 shadow-warm">
            <span className="text-xs text-ink-600 font-medium">Declined</span>
            <div className="font-serif text-2xl font-bold text-ink-500 mt-1">
              {counts.DECLINED}
            </div>
          </div>
        </div>

        {/* Requests Table */}
        <div className="bg-sand-50 rounded-2xl border border-sand-300 shadow-warm overflow-hidden">
          {requests.length === 0 ? (
            <div className="text-center py-12 text-xs text-ink-500">
              No collaboration requests recorded yet.
            </div>
          ) : (
            <div className="divide-y divide-sand-200">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="p-5 hover:bg-sand-100/60 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-grow">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-serif text-base font-bold text-teal-950">
                        {req.accommodation_name}
                      </span>
                      <span className="text-xs text-ink-500 font-semibold">requested</span>
                      <span className="font-serif text-base font-bold text-gold-700">
                        {req.creator_name}
                      </span>
                      <Badge
                        variant={
                          req.status === "MATCHED"
                            ? "approved"
                            : req.status === "DECLINED"
                            ? "rejected"
                            : req.status === "REVIEWING"
                            ? "teal"
                            : "pending"
                        }
                        size="sm"
                      >
                        {req.status}
                      </Badge>
                    </div>

                    <div className="text-xs text-ink-700 flex items-center gap-3 flex-wrap">
                      <span>Requester: <strong>{req.requester_name}</strong></span>
                      <span>•</span>
                      <span className="font-mono">{req.requester_whatsapp}</span>
                      <span>•</span>
                      <span>{req.creator_niche} in {req.creator_city}</span>
                      <span>•</span>
                      <span className="text-ink-500">
                        {new Date(req.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    {req.message && (
                      <p className="text-xs text-ink-600 italic bg-sand-100 p-2.5 rounded-lg border border-sand-200/80 max-w-2xl">
                        &ldquo;{req.message}&rdquo;
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={generateWhatsAppLink(
                        req.requester_whatsapp,
                        `Hi ${req.requester_name}, this is Get Linked regarding your request for ${req.creator_name}.`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg bg-sand-200 hover:bg-emerald-100 text-emerald-800 transition-colors"
                      title="Contact Requester on WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>

                    {req.status === "PENDING" && (
                      <button
                        onClick={() => updateRequestStatus(req.id, "REVIEWING")}
                        className="px-3 py-1.5 rounded-lg bg-sand-200 hover:bg-sand-300 text-xs font-semibold text-teal-950 transition-colors"
                      >
                        Mark Reviewing
                      </button>
                    )}

                    {req.status !== "MATCHED" && req.status !== "DECLINED" && (
                      <>
                        <button
                          onClick={() => handleConvertToMatch(req)}
                          className="px-4 py-1.5 rounded-lg bg-teal-900 hover:bg-teal-800 text-sand-50 text-xs font-semibold shadow-warm transition-all flex items-center gap-1.5"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                          <span>Convert to Match</span>
                        </button>
                        <button
                          onClick={() => updateRequestStatus(req.id, "DECLINED")}
                          className="px-3 py-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800 text-xs font-semibold transition-colors"
                        >
                          Decline
                        </button>
                      </>
                    )}

                    {deleteRequest && (
                      <button
                        onClick={() => {
                          if (confirm(`Permanently delete request from ${req.requester_name} for ${req.creator_name}?`)) {
                            deleteRequest(req.id);
                          }
                        }}
                        className="p-1.5 text-ink-400 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Request"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
