"use client";

import React from "react";
import { useStore } from "@/data/store";
import { Badge } from "@/components/ui/Badge";
import { Sparkles, Database, RefreshCw } from "lucide-react";

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
  const { settings, isConnectedToSupabase, isLoadingSupabase, refreshData } = useStore();

  return (
    <div className="bg-sand-50 border-b border-sand-300 px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div className="flex flex-wrap items-center gap-3">
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

          {/* Supabase Status Indicator */}
          {isConnectedToSupabase ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <Database className="w-3 h-3" />
              <span>Supabase Connected</span>
            </span>
          ) : (
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-900 border border-amber-300"
              title="Supabase tables not detected yet. Run supabase/schema.sql in your Supabase SQL editor to enable live database sync."
            >
              <Database className="w-3 h-3" />
              <span>Local / Offline DB</span>
            </span>
          )}
        </div>
        {subtitle && <p className="text-xs text-ink-600 mt-1">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {action}
        <button
          onClick={() => refreshData()}
          disabled={isLoadingSupabase}
          className="text-xs text-ink-600 hover:text-teal-900 border border-sand-400/80 px-2.5 py-1.5 rounded-md hover:bg-sand-200 transition-colors flex items-center gap-1.5 disabled:opacity-50"
          title="Reload data from Supabase"
        >
          <RefreshCw className={`w-3 h-3 ${isLoadingSupabase ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">Sync DB</span>
        </button>
      </div>
    </div>
  );
};
