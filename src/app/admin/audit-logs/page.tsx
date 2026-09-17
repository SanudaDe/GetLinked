"use client";

import React, { useState } from "react";
import { useStore } from "@/data/store";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { History, Search, ShieldCheck } from "lucide-react";

export default function AdminAuditLogsPage() {
  const { auditLogs } = useStore();
  const [search, setSearch] = useState("");

  const filtered = auditLogs.filter((log) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      log.action.toLowerCase().includes(q) ||
      log.details.toLowerCase().includes(q) ||
      log.admin_email.toLowerCase().includes(q) ||
      log.entity_id.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 pb-12">
      <AdminHeader
        title="Admin Audit Trail"
        subtitle="Complete chronological record of verification decisions, match approvals, and platform setting changes."
      />

      <div className="px-6 space-y-6">
        <div className="bg-sand-50 rounded-xl p-4 border border-sand-300 shadow-warm max-w-sm">
          <div className="relative">
            <Search className="w-4 h-4 text-ink-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search audit actions, emails, IDs..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-sand-400 bg-sand-50 text-xs focus:outline-none focus:ring-2 focus:ring-teal-900"
            />
          </div>
        </div>

        <div className="bg-sand-50 rounded-2xl border border-sand-300 shadow-warm overflow-hidden">
          <div className="divide-y divide-sand-200 text-xs">
            {filtered.map((log) => (
              <div key={log.id} className="p-4 hover:bg-sand-100/50 transition-colors space-y-1">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-teal-900 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {log.action}
                    </span>
                    <span className="text-ink-600 font-medium">
                      on {log.entity_type} ({log.entity_id})
                    </span>
                    {log.previous_status && log.new_status && (
                      <span className="text-[11px] text-ink-500 font-mono">
                        [{log.previous_status} → {log.new_status}]
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-ink-400 font-mono">
                    {new Date(log.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-ink-700 leading-relaxed pl-1">
                  {log.details}
                </p>
                <div className="text-[10px] text-ink-400 pl-1">
                  By: {log.admin_email}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
