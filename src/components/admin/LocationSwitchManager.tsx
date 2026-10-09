"use client";

import React, { useState, useMemo } from "react";
import { useStore } from "@/data/store";
import {
  DEFAULT_ALLOWED_LOCATIONS,
  getAllAvailableLocations,
} from "@/utils/formatters";
import {
  MapPin,
  Users,
  Building2,
  CheckCircle2,
  AlertTriangle,
  Search,
  Plus,
  Trash2,
  SlidersHorizontal,
  Copy,
  ExternalLink,
  ShieldCheck,
  Check,
  ToggleLeft,
  ToggleRight,
  Filter,
  Sparkles,
} from "lucide-react";

interface LocationSwitchManagerProps {
  embedded?: boolean;
}

export const LocationSwitchManager: React.FC<LocationSwitchManagerProps> = ({
  embedded = false,
}) => {
  const { settings, updateSettings, isConnectedToSupabase } = useStore();

  // Local working state
  const customLocations = settings.custom_locations || [];
  const allLocations = useMemo(
    () => getAllAvailableLocations(customLocations),
    [customLocations]
  );

  const [creatorLocs, setCreatorLocs] = useState<string[]>(
    settings.allowed_creator_locations ?? DEFAULT_ALLOWED_LOCATIONS
  );
  const [villaLocs, setVillaLocs] = useState<string[]>(
    settings.allowed_villa_locations ?? DEFAULT_ALLOWED_LOCATIONS
  );
  const [customList, setCustomList] = useState<string[]>(customLocations);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<
    "all" | "creators" | "villas" | "both" | "disabled"
  >("all");
  const [newLocName, setNewLocName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [sqlCopied, setSqlCopied] = useState(false);

  // Synchronize local states with store when settings load or update
  React.useEffect(() => {
    if (Array.isArray(settings.allowed_creator_locations)) {
      setCreatorLocs(settings.allowed_creator_locations);
    }
    if (Array.isArray(settings.allowed_villa_locations)) {
      setVillaLocs(settings.allowed_villa_locations);
    }
    if (Array.isArray(settings.custom_locations)) {
      setCustomList(settings.custom_locations);
    }
  }, [settings.allowed_creator_locations, settings.allowed_villa_locations, settings.custom_locations]);

  // Instant apply & persist helper
  const applyAndSave = async (
    nextCreators: string[],
    nextVillas: string[],
    nextCustom?: string[]
  ) => {
    setCreatorLocs(nextCreators);
    setVillaLocs(nextVillas);
    if (nextCustom !== undefined) {
      setCustomList(nextCustom);
    }

    setIsSaving(true);
    await updateSettings({
      allowed_creator_locations: nextCreators,
      allowed_villa_locations: nextVillas,
      custom_locations: nextCustom !== undefined ? nextCustom : customList,
    });
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  // Filter locations
  const filteredLocations = useMemo(() => {
    return allLocations.filter((loc) => {
      const matchesSearch = loc.toLowerCase().includes(searchQuery.toLowerCase().trim());
      if (!matchesSearch) return false;

      const isCreator = creatorLocs.includes(loc);
      const isVilla = villaLocs.includes(loc);

      if (activeTab === "creators") return isCreator;
      if (activeTab === "villas") return isVilla;
      if (activeTab === "both") return isCreator && isVilla;
      if (activeTab === "disabled") return !isCreator && !isVilla;
      return true;
    });
  }, [allLocations, searchQuery, activeTab, creatorLocs, villaLocs]);

  // Toggle helpers (instant auto-save)
  const toggleCreatorLocation = (loc: string) => {
    const next = creatorLocs.includes(loc)
      ? creatorLocs.filter((l) => l !== loc)
      : [...creatorLocs, loc];
    applyAndSave(next, villaLocs);
  };

  const toggleVillaLocation = (loc: string) => {
    const next = villaLocs.includes(loc)
      ? villaLocs.filter((l) => l !== loc)
      : [...villaLocs, loc];
    applyAndSave(creatorLocs, next);
  };

  const toggleBoth = (loc: string) => {
    const isBothActive = creatorLocs.includes(loc) && villaLocs.includes(loc);
    if (isBothActive) {
      const nextCreators = creatorLocs.filter((l) => l !== loc);
      const nextVillas = villaLocs.filter((l) => l !== loc);
      applyAndSave(nextCreators, nextVillas);
    } else {
      const nextCreators = creatorLocs.includes(loc) ? creatorLocs : [...creatorLocs, loc];
      const nextVillas = villaLocs.includes(loc) ? villaLocs : [...villaLocs, loc];
      applyAndSave(nextCreators, nextVillas);
    }
  };

  // Bulk actions (instant auto-save)
  const enableAllCreators = () => applyAndSave([...allLocations], villaLocs);
  const disableAllCreators = () => applyAndSave([], villaLocs);
  const enableAllVillas = () => applyAndSave(creatorLocs, [...allLocations]);
  const disableAllVillas = () => applyAndSave(creatorLocs, []);

  const enableAllBoth = () => {
    applyAndSave([...allLocations], [...allLocations]);
  };

  const syncCreatorsToVillas = () => applyAndSave(creatorLocs, [...creatorLocs]);
  const syncVillasToCreators = () => applyAndSave([...villaLocs], villaLocs);

  // Add custom location
  const handleAddCustomLocation = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newLocName.trim();
    if (!trimmed) return;
    if (allLocations.some((l) => l.toLowerCase() === trimmed.toLowerCase())) {
      alert("This location already exists.");
      return;
    }
    const updatedCustom = [...customList, trimmed];
    setNewLocName("");
    applyAndSave([...creatorLocs, trimmed], [...villaLocs, trimmed], updatedCustom);
  };

  // Remove custom location
  const handleRemoveCustomLocation = (loc: string) => {
    if (confirm(`Remove custom location "${loc}"?`)) {
      const updatedCustom = customList.filter((l) => l !== loc);
      const nextCreators = creatorLocs.filter((l) => l !== loc);
      const nextVillas = villaLocs.filter((l) => l !== loc);
      applyAndSave(nextCreators, nextVillas, updatedCustom);
    }
  };

  // Explicit Save button
  const handleSave = async () => {
    await applyAndSave(creatorLocs, villaLocs, customList);
  };

  const sqlSnippet = `ALTER TABLE platform_settings ADD COLUMN IF NOT EXISTS allowed_creator_locations JSONB DEFAULT '[]'::jsonb;
ALTER TABLE platform_settings ADD COLUMN IF NOT EXISTS allowed_villa_locations JSONB DEFAULT '[]'::jsonb;
ALTER TABLE platform_settings ADD COLUMN IF NOT EXISTS custom_locations JSONB DEFAULT '[]'::jsonb;`;

  const copySql = () => {
    navigator.clipboard.writeText(sqlSnippet);
    setSqlCopied(true);
    setTimeout(() => setSqlCopied(false), 2500);
  };

  return (
    <div className={`space-y-6 ${embedded ? "" : "max-w-6xl mx-auto"}`}>
      {/* Save Success Alert */}
      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs font-semibold flex items-center gap-2 shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <strong className="block font-bold">Location settings saved successfully!</strong>
            <span>Creators and villas can now only register in the enabled destinations.</span>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="bg-sand-50 rounded-2xl border border-sand-300 p-6 sm:p-8 shadow-warm space-y-6">
        {/* Header Description */}
        <div className="border-b border-sand-200 pb-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-900 text-gold-400 flex items-center justify-center shrink-0 shadow-sm">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-serif text-xl font-bold text-teal-950 flex items-center gap-2">
                  <span>Registration Location Switch</span>
                  <span className="text-[11px] font-sans font-semibold px-2 py-0.5 rounded-full bg-teal-100 text-teal-900 border border-teal-300">
                    Live Control
                  </span>
                  {isSaving ? (
                    <span className="text-[11px] font-sans font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 animate-pulse">
                      Saving...
                    </span>
                  ) : saveSuccess ? (
                    <span className="text-[11px] font-sans font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                      ✓ Auto-saved
                    </span>
                  ) : (
                    <span className="text-[11px] font-sans font-normal px-2 py-0.5 rounded-full bg-sand-200 text-ink-600 border border-sand-300">
                      Instant Auto-Save ON
                    </span>
                  )}
                </h2>
                <p className="text-xs text-ink-600 mt-0.5">
                  Turn locations ON or OFF. Every switch toggle automatically saves and instantly updates the Creator Apply (<code className="text-teal-900 font-semibold">/apply</code>) and Villa List (<code className="text-teal-900 font-semibold">/list-property</code>) registration dropdowns.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-teal-900 hover:bg-teal-800 disabled:opacity-50 text-sand-50 text-xs font-semibold uppercase tracking-wider shadow-warm transition-all flex items-center justify-center gap-2 self-start sm:self-auto cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-gold-400" />
              <span>{isSaving ? "Saving..." : saveSuccess ? "Saved!" : "Save Location Changes"}</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-sand-100 border border-sand-300">
            <div className="flex items-center justify-between">
              <span className="text-xs text-ink-600 font-semibold uppercase tracking-wider">Total Locations</span>
              <MapPin className="w-4 h-4 text-teal-900" />
            </div>
            <div className="mt-2 font-serif text-2xl font-bold text-teal-950">
              {allLocations.length}
            </div>
            <p className="text-[11px] text-ink-500 mt-0.5">
              {customList.length > 0 ? `${customList.length} custom added` : "Standard Sri Lanka destinations"}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-teal-950/5 border border-teal-900/20">
            <div className="flex items-center justify-between">
              <span className="text-xs text-teal-900 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-teal-800" />
                Creators Open
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-teal-900 text-sand-50">
                {creatorLocs.length} / {allLocations.length}
              </span>
            </div>
            <div className="mt-2 font-serif text-2xl font-bold text-teal-950">
              {creatorLocs.length === 0 ? (
                <span className="text-red-700 text-lg">Paused (0)</span>
              ) : (
                `${Math.round((creatorLocs.length / allLocations.length) * 100)}% Active`
              )}
            </div>
            <p className="text-[11px] text-ink-500 mt-0.5">
              {creatorLocs.length === 0
                ? "Creator registration is currently blocked"
                : "Destinations selectable on Creator Apply page"}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gold-500/10 border border-gold-600/30">
            <div className="flex items-center justify-between">
              <span className="text-xs text-ink-900 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-teal-900" />
                Villas Open
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-teal-950 text-sand-50">
                {villaLocs.length} / {allLocations.length}
              </span>
            </div>
            <div className="mt-2 font-serif text-2xl font-bold text-teal-950">
              {villaLocs.length === 0 ? (
                <span className="text-red-700 text-lg">Paused (0)</span>
              ) : (
                `${Math.round((villaLocs.length / allLocations.length) * 100)}% Active`
              )}
            </div>
            <p className="text-[11px] text-ink-500 mt-0.5">
              {villaLocs.length === 0
                ? "Villa registration is currently blocked"
                : "Regions selectable on List Property page"}
            </p>
          </div>
        </div>

        {/* Bulk Action Controls */}
        <div className="p-4 rounded-xl bg-sand-100 border border-sand-300 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="font-bold text-teal-950 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-teal-900" />
              <span>Bulk Quick Toggles:</span>
            </span>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={enableAllBoth}
                className="px-2.5 py-1 rounded bg-teal-900 text-sand-50 hover:bg-teal-800 transition-colors font-medium text-[11px]"
              >
                Enable All Everywhere
              </button>
              <div className="h-4 w-px bg-sand-300" />
              <button
                type="button"
                onClick={enableAllCreators}
                className="px-2.5 py-1 rounded bg-sand-200 hover:bg-sand-300 text-teal-950 border border-sand-300 transition-colors font-medium text-[11px]"
              >
                All Creators ON
              </button>
              <button
                type="button"
                onClick={disableAllCreators}
                className="px-2.5 py-1 rounded bg-sand-200 hover:bg-sand-300 text-ink-700 border border-sand-300 transition-colors font-medium text-[11px]"
              >
                All Creators OFF
              </button>
              <div className="h-4 w-px bg-sand-300" />
              <button
                type="button"
                onClick={enableAllVillas}
                className="px-2.5 py-1 rounded bg-sand-200 hover:bg-sand-300 text-teal-950 border border-sand-300 transition-colors font-medium text-[11px]"
              >
                All Villas ON
              </button>
              <button
                type="button"
                onClick={disableAllVillas}
                className="px-2.5 py-1 rounded bg-sand-200 hover:bg-sand-300 text-ink-700 border border-sand-300 transition-colors font-medium text-[11px]"
              >
                All Villas OFF
              </button>
              <div className="h-4 w-px bg-sand-300" />
              <button
                type="button"
                onClick={syncCreatorsToVillas}
                title="Make Villa locations identical to Creator locations"
                className="px-2.5 py-1 rounded bg-sand-200 hover:bg-sand-300 text-ink-800 border border-sand-300 transition-colors font-medium text-[11px]"
              >
                Sync Creators ➔ Villas
              </button>
            </div>
          </div>
        </div>

        {/* Add Custom Location Bar */}
        <form
          onSubmit={handleAddCustomLocation}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1"
        >
          <div className="relative flex-1">
            <MapPin className="w-4 h-4 text-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Add custom Sri Lanka destination (e.g. Ahungalla, Kalpitiya, Tangalle Bay)..."
              value={newLocName}
              onChange={(e) => setNewLocName(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-sand-300 bg-sand-100 text-ink-900 focus:outline-none focus:ring-2 focus:ring-teal-900"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-teal-950 hover:bg-teal-900 text-sand-50 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Destination</span>
          </button>
        </form>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-sand-200">
          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: "all", label: `All (${allLocations.length})` },
              { id: "both", label: `Both Open (${allLocations.filter((l) => creatorLocs.includes(l) && villaLocs.includes(l)).length})` },
              { id: "creators", label: `Creators Open (${creatorLocs.length})` },
              { id: "villas", label: `Villas Open (${villaLocs.length})` },
              { id: "disabled", label: `Both Closed (${allLocations.filter((l) => !creatorLocs.includes(l) && !villaLocs.includes(l)).length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === tab.id
                    ? "bg-teal-900 text-sand-50 shadow-sm"
                    : "bg-sand-100 text-ink-700 hover:bg-sand-200 border border-sand-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-ink-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search destination..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-sand-300 bg-sand-100 text-ink-900 focus:outline-none focus:ring-1 focus:ring-teal-900"
            />
          </div>
        </div>

        {/* Locations List / Table */}
        <div className="border border-sand-300 rounded-xl overflow-hidden bg-sand-100/50">
          <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-sand-200 border-b border-sand-300 text-[11px] font-bold text-ink-800 uppercase tracking-wider">
            <div className="col-span-5 sm:col-span-4 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-teal-900" />
              <span>Destination</span>
            </div>
            <div className="col-span-3 sm:col-span-3 text-center flex items-center justify-center gap-1">
              <Users className="w-3.5 h-3.5 text-teal-900" />
              <span>Creators</span>
            </div>
            <div className="col-span-3 sm:col-span-3 text-center flex items-center justify-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-teal-900" />
              <span>Villas</span>
            </div>
            <div className="col-span-1 sm:col-span-2 text-right">
              <span className="hidden sm:inline">Actions</span>
            </div>
          </div>

          {filteredLocations.length === 0 ? (
            <div className="p-8 text-center text-xs text-ink-500">
              No locations match your search or filter criteria.
            </div>
          ) : (
            <div className="divide-y divide-sand-200">
              {filteredLocations.map((loc) => {
                const isCreatorActive = creatorLocs.includes(loc);
                const isVillaActive = villaLocs.includes(loc);
                const isCustom = customList.includes(loc);

                return (
                  <div
                    key={loc}
                    className={`grid grid-cols-12 gap-2 px-4 py-3.5 items-center transition-colors ${
                      isCreatorActive || isVillaActive
                        ? "bg-sand-50/80 hover:bg-sand-100/80"
                        : "bg-sand-100/40 opacity-70 hover:opacity-100"
                    }`}
                  >
                    {/* Location Name */}
                    <div className="col-span-5 sm:col-span-4 flex items-center gap-2">
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${
                          isCreatorActive && isVillaActive
                            ? "bg-emerald-500"
                            : isCreatorActive || isVillaActive
                            ? "bg-amber-500"
                            : "bg-sand-400"
                        }`}
                      />
                      <div>
                        <div className="font-serif font-bold text-sm text-teal-950 flex items-center gap-1.5">
                          <span>{loc}</span>
                          {isCustom && (
                            <span className="font-sans text-[9px] uppercase px-1.5 py-0.2 rounded bg-gold-400/30 text-teal-950 font-bold border border-gold-400/50">
                              Custom
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-ink-500">
                          {isCreatorActive && isVillaActive
                            ? "Open for all registrations"
                            : isCreatorActive
                            ? "Creators only"
                            : isVillaActive
                            ? "Villas only"
                            : "Registration paused"}
                        </div>
                      </div>
                    </div>

                    {/* Creator Switch */}
                    <div className="col-span-3 sm:col-span-3 flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => toggleCreatorLocation(loc)}
                        className={`group relative inline-flex h-6 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          isCreatorActive ? "bg-teal-900" : "bg-sand-300"
                        }`}
                        title={isCreatorActive ? "Disable Creator Registration" : "Enable Creator Registration"}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-sand-50 shadow-md ring-0 transition duration-200 ease-in-out ${
                            isCreatorActive ? "translate-x-6" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Villa Switch */}
                    <div className="col-span-3 sm:col-span-3 flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => toggleVillaLocation(loc)}
                        className={`group relative inline-flex h-6 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          isVillaActive ? "bg-teal-900" : "bg-sand-300"
                        }`}
                        title={isVillaActive ? "Disable Villa Registration" : "Enable Villa Registration"}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-sand-50 shadow-md ring-0 transition duration-200 ease-in-out ${
                            isVillaActive ? "translate-x-6" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Actions: Toggle Both or Delete Custom */}
                    <div className="col-span-1 sm:col-span-2 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => toggleBoth(loc)}
                        className="hidden sm:inline-flex px-2 py-1 text-[11px] font-semibold text-teal-900 hover:bg-sand-200 rounded border border-sand-300 transition-colors"
                        title="Toggle both switches simultaneously"
                      >
                        {isCreatorActive && isVillaActive ? "Mute Both" : "Open Both"}
                      </button>

                      {isCustom && (
                        <button
                          type="button"
                          onClick={() => handleRemoveCustomLocation(loc)}
                          className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                          title="Remove custom location"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom Save Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-sand-200">
          <div className="text-xs text-ink-600">
            <span className="font-semibold text-teal-950">Active Summary: </span>
            {creatorLocs.length} creator destinations, {villaLocs.length} villa destinations open.
          </div>

          <button
            type="button"
            onClick={handleSave}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-teal-900 hover:bg-teal-800 text-sand-50 text-xs font-semibold uppercase tracking-wider shadow-warm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4 text-gold-400" />
            <span>Save Location Settings</span>
          </button>
        </div>

        {/* Supabase Schema Notice & Copyable SQL */}
        <div className="p-4 rounded-xl bg-sand-100 border border-sand-300 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-teal-950">
              <Sparkles className="w-3.5 h-3.5 text-gold-600" />
              <span>Database Persistence & Supabase Synchronization</span>
            </div>
            <a
              href="https://supabase.com/dashboard/project/gpkljpnbgnylcekrcluy/sql/new"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-900 hover:underline inline-flex items-center gap-1 text-[11px]"
            >
              <span>Open Supabase SQL Editor</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <p className="text-ink-600 text-[11px] leading-relaxed">
            Location switches sync automatically with local state and audit records. To add dedicated columns to your Supabase PostgreSQL cluster table, run this quick SQL statement:
          </p>
          <div className="relative bg-sand-200/90 rounded-lg p-2.5 font-mono text-[11px] text-teal-950 border border-sand-300">
            <pre className="whitespace-pre-wrap select-all">{sqlSnippet}</pre>
            <button
              type="button"
              onClick={copySql}
              className="absolute top-2 right-2 px-2 py-1 rounded bg-teal-900 text-sand-50 text-[10px] font-sans font-semibold flex items-center gap-1 hover:bg-teal-800 transition-colors"
            >
              {sqlCopied ? <Check className="w-3 h-3 text-gold-400" /> : <Copy className="w-3 h-3" />}
              <span>{sqlCopied ? "Copied" : "Copy SQL"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
