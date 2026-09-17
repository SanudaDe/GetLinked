"use client";

import React from "react";
import { useStore } from "@/data/store";
import { Badge } from "@/components/ui/Badge";
import { Sparkles, RotateCcw, ShieldCheck } from "lucide-react";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  title,
  subtitle,
  action,
}) => {
  const { settings, resetDemoData, adminUser } = useStore();

  return (
    <div className="bg-sand-50 border-b border-sand-300 px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="font-serif text-2xl font-bold text-teal-950">{title}</h1>
          <Badge
            variant={settings.platform_phase === "FREE" ? "approved" : "gold"}
            size="sm"
          >
            <Sparkles className="w-3 h-3" />
            <span>
              {settings.platform_phase === "FREE" ? "Phase 1: Free" : "Phase 2: Paid"}
            </span>
          </Badge>
        </div>
        {subtitle && <p className="text-xs text-ink-600 mt-1">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {action}
        <button
          onClick={() => {
            if (confirm("Reset all test data back to initial demo state?")) {
              resetDemoData();
            }
          }}
          className="text-xs text-ink-500 hover:text-teal-900 border border-sand-400/80 px-2.5 py-1.5 rounded-md hover:bg-sand-200 transition-colors flex items-center gap-1.5"
          title="Reset to default demo records"
        >
          <RotateCcw className="w-3 h-3" />
          <span className="hidden sm:inline">Reset Demo Data</span>
        </button>
      </div>
    </div>
  );
};
