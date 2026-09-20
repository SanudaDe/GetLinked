"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  InfluencerApplication,
  InfluencerProfile,
  AccommodationApplication,
  CreatorRequest,
  Match,
  PlatformSettings,
  Advertisement,
  AdminAuditLog,
  ApplicationStatus,
  MatchStatus,
  RequestStatus,
} from "@/types";
import {
  initialApplications,
  initialProfiles,
  initialAccommodations,
  initialRequests,
  initialMatches,
  initialPlatformSettings,
  initialAds,
  initialAuditLogs,
} from "./mockStore";
import { cleanWhatsAppNumber } from "@/utils/whatsapp";
import { supabaseService } from "@/services/supabaseService";

interface StoreContextType {
  applications: InfluencerApplication[];
  profiles: InfluencerProfile[];
  accommodations: AccommodationApplication[];
  requests: CreatorRequest[];
  matches: Match[];
  settings: PlatformSettings;
  ads: Advertisement[];
  auditLogs: AdminAuditLog[];
  adminUser: { email: string; name: string; role: string } | null;
  isConnectedToSupabase: boolean;
  isLoadingSupabase: boolean;
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
  refreshData: () => Promise<void>;

  // Creator actions
  submitCreatorApplication: (
    data: Omit<InfluencerApplication, "id" | "reference_code" | "status" | "created_at" | "updated_at">
  ) => { success: boolean; reference_code: string; message?: string };
  approveCreator: (id: string, notes?: string) => Promise<void> | void;
  rejectCreator: (id: string, notes?: string) => Promise<void> | void;
  deleteApplication?: (id: string) => Promise<void>;

  // Accommodation actions
  submitAccommodationApplication: (
    data: Omit<AccommodationApplication, "id" | "reference_code" | "status" | "created_at" | "updated_at">
  ) => { success: boolean; reference_code: string; message?: string };
  approveAccommodation: (id: string, notes?: string) => Promise<void> | void;
  rejectAccommodation: (id: string, notes?: string) => Promise<void> | void;
  deleteAccommodation?: (id: string) => Promise<void>;

  // Request actions
  submitCreatorRequest: (data: {
    creator_id: string;
    creator_name: string;
    creator_niche: string;
    creator_city: string;
    accommodation_name: string;
    requester_name: string;
    requester_whatsapp: string;
    message?: string;
  }) => { success: boolean; message: string };
  updateRequestStatus: (id: string, status: RequestStatus) => Promise<void> | void;
  deleteRequest?: (id: string) => Promise<void>;

  // Match actions
  createProactiveMatch: (
    creatorId: string,
    accommodationId: string,
    adminNotes?: string
  ) => { success: boolean; matchId: string };
  updateMatchStatus: (id: string, status: MatchStatus, notes?: string) => Promise<void> | void;
  deleteMatch?: (id: string) => Promise<void>;

  // Settings & Ads actions
  updateSettings: (newSettings: Partial<PlatformSettings>) => Promise<void> | void;
  addAdvertisement: (ad: Omit<Advertisement, "id">) => Promise<void> | void;
  toggleAdStatus: (id: string) => Promise<void> | void;
  deleteAdvertisement?: (id: string) => Promise<void>;

  // Status lookup
  lookupStatus: (
    whatsapp: string,
    refCode: string
  ) => {
    found: boolean;
    type?: "CREATOR" | "ACCOMMODATION";
    name?: string;
    status?: ApplicationStatus;
    submittedAt?: string;
  };

  // Reset demo data
  resetDemoData: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEY = "getlinked_store_v1";

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isConnectedToSupabase, setIsConnectedToSupabase] = useState(false);
  const [isLoadingSupabase, setIsLoadingSupabase] = useState(true);

  const [applications, setApplications] = useState<InfluencerApplication[]>(initialApplications);
  const [profiles, setProfiles] = useState<InfluencerProfile[]>(initialProfiles);
  const [accommodations, setAccommodations] = useState<AccommodationApplication[]>(initialAccommodations);
  const [requests, setRequests] = useState<CreatorRequest[]>(initialRequests);
  const [matches, setMatches] = useState<Match[]>(initialMatches);
  const [settings, setSettings] = useState<PlatformSettings>(initialPlatformSettings);
  const [ads, setAds] = useState<Advertisement[]>(initialAds);
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>(initialAuditLogs);
  const [adminUser, setAdminUser] = useState<{ email: string; name: string; role: string } | null>(null);

  // Load data from Supabase, with graceful fallback to localStorage / mockStore
  const loadData = useCallback(async () => {
    try {
      setIsLoadingSupabase(true);
      const data = await supabaseService.fetchInitialData();

      // Check if Supabase returned valid data
      const hasApps = data.applications && data.applications.length > 0;
      const hasProfs = data.profiles && data.profiles.length > 0;
      const hasAccs = data.accommodations && data.accommodations.length > 0;
      const hasSettings = !!data.settings;

      if (hasApps || hasProfs || hasAccs || hasSettings) {
        setIsConnectedToSupabase(true);
        if (data.applications) setApplications(data.applications);
        if (data.profiles) setProfiles(data.profiles);
        if (data.accommodations) setAccommodations(data.accommodations);
        if (data.requests) setRequests(data.requests);
        if (data.matches) setMatches(data.matches);
        if (data.settings) setSettings(data.settings);
        if (data.ads) setAds(data.ads);
        if (data.auditLogs) setAuditLogs(data.auditLogs);
      } else {
        // Fall back to localStorage if available
        const saved = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.applications?.length) setApplications(parsed.applications);
          if (parsed.profiles?.length) setProfiles(parsed.profiles);
          if (parsed.accommodations?.length) setAccommodations(parsed.accommodations);
          if (parsed.requests?.length) setRequests(parsed.requests);
          if (parsed.matches?.length) setMatches(parsed.matches);
          if (parsed.settings) setSettings(parsed.settings);
          if (parsed.ads?.length) setAds(parsed.ads);
          if (parsed.auditLogs?.length) setAuditLogs(parsed.auditLogs);
        }
      }
    } catch (err) {
      console.warn("Could not sync with Supabase on load, using local cache:", err);
    } finally {
      setIsLoadingSupabase(false);
      setIsInitialized(true);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadData();

    // Check admin session
    if (typeof window !== "undefined") {
      const savedAdmin = localStorage.getItem("getlinked_admin_session");
      if (savedAdmin) {
        try {
          setAdminUser(JSON.parse(savedAdmin));
        } catch {
          // ignore
        }
      }
    }

    // Subscribe to live Supabase changes
    const unsubscribe = supabaseService.subscribeToChanges(() => {
      loadData();
    });

    return () => {
      unsubscribe();
    };
  }, [loadData]);

  // Sync to localStorage as offline cache
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          applications,
          profiles,
          accommodations,
          requests,
          matches,
          settings,
          ads,
          auditLogs,
        })
      );
    } catch {
      // ignore
    }
  }, [
    isInitialized,
    applications,
    profiles,
    accommodations,
    requests,
    matches,
    settings,
    ads,
    auditLogs,
  ]);

  const loginAdmin = (password: string): boolean => {
    if (password === "admin123" || password === "getlinked2026") {
      const admin = {
        email: "admin@getlinked.today",
        name: "Get Linked Admin",
        role: "SUPER_ADMIN",
      };
      setAdminUser(admin);
      if (typeof window !== "undefined") {
        localStorage.setItem("getlinked_admin_session", JSON.stringify(admin));
      }
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setAdminUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("getlinked_admin_session");
    }
  };

  const addAuditLog = (
    action: string,
    entityType: string,
    entityId: string,
    prevStatus: string | undefined,
    newStatus: string | undefined,
    details: string
  ) => {
    const log: AdminAuditLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      admin_email: adminUser?.email || "admin@getlinked.today",
      action,
      entity_type: entityType,
      entity_id: entityId,
      previous_status: prevStatus,
      new_status: newStatus,
      details,
      timestamp: new Date().toISOString(),
    };
    setAuditLogs((prev) => [log, ...prev]);
    // Supabase persist
    supabaseService.insertAuditLog(log).catch(() => {});
  };

  const submitCreatorApplication = (
    data: Omit<InfluencerApplication, "id" | "reference_code" | "status" | "created_at" | "updated_at">
  ) => {
    const cleanedPhone = cleanWhatsAppNumber(data.whatsapp);
    const duplicateByPhone = applications.find(
      (a) => cleanWhatsAppNumber(a.whatsapp) === cleanedPhone
    );
    const duplicateBySocial = applications.find(
      (a) => a.social_url.toLowerCase().trim() === data.social_url.toLowerCase().trim()
    );
    const duplicateByDoc = applications.find(
      (a) =>
        a.document_reference.toLowerCase().trim() ===
        data.document_reference.toLowerCase().trim()
    );

    let is_duplicate = false;
    let duplicate_reason: string | undefined;

    if (duplicateByPhone) {
      is_duplicate = true;
      duplicate_reason = `Matches WhatsApp of ${duplicateByPhone.full_name} (${duplicateByPhone.reference_code})`;
    } else if (duplicateBySocial) {
      is_duplicate = true;
      duplicate_reason = `Matches social handle of ${duplicateBySocial.full_name} (${duplicateBySocial.reference_code})`;
    } else if (duplicateByDoc) {
      is_duplicate = true;
      duplicate_reason = `Matches document number of ${duplicateByDoc.full_name} (${duplicateByDoc.reference_code})`;
    }

    const refCode = `GL-C-${Math.floor(1000 + Math.random() * 9000)}`;
    const newApp: InfluencerApplication = {
      ...data,
      id: `app-${Date.now()}`,
      reference_code: refCode,
      status: "PENDING",
      is_duplicate,
      duplicate_reason,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setApplications((prev) => [newApp, ...prev]);

    // Supabase persist
    supabaseService.insertApplication(newApp).catch((err) => {
      console.warn("Supabase insertApplication error:", err);
    });

    return {
      success: true,
      reference_code: refCode,
      message: "Application submitted successfully for manual verification.",
    };
  };

  const approveCreator = async (id: string, notes?: string) => {
    const target = applications.find((a) => a.id === id);
    if (!target) return;

    const updatedApp: InfluencerApplication = {
      ...target,
      status: "APPROVED",
      admin_notes: notes || target.admin_notes,
      reviewed_at: new Date().toISOString(),
      reviewed_by: adminUser?.email || "admin@getlinked.today",
      updated_at: new Date().toISOString(),
    };

    setApplications((prev) => prev.map((a) => (a.id === id ? updatedApp : a)));

    // Create or activate profile in directory
    const existingProf = profiles.find((p) => p.application_id === id);
    let targetProfile: InfluencerProfile;

    if (!existingProf) {
      targetProfile = {
        id: `prof-${Date.now()}`,
        application_id: id,
        display_name: target.full_name,
        niche: target.niche,
        city: target.city,
        visit_start: target.visit_start,
        visit_end: target.visit_end,
        follower_count: target.follower_count,
        social_url: target.social_url,
        trip_brief: target.trip_brief,
        is_active: true,
        created_at: new Date().toISOString(),
      };
      setProfiles((prev) => [targetProfile, ...prev]);
    } else {
      targetProfile = { ...existingProf, is_active: true };
      setProfiles((prev) =>
        prev.map((p) => (p.application_id === id ? targetProfile : p))
      );
    }

    addAuditLog(
      "CREATOR_APPROVED",
      "InfluencerApplication",
      id,
      target.status,
      "APPROVED",
      `Approved ${target.full_name} (${target.reference_code}). Creator is now matchable and visible in directory.`
    );

    // Supabase persist
    await Promise.all([
      supabaseService.updateApplication(id, {
        status: "APPROVED",
        admin_notes: updatedApp.admin_notes,
        reviewed_at: updatedApp.reviewed_at,
        reviewed_by: updatedApp.reviewed_by,
        updated_at: updatedApp.updated_at,
      }),
      supabaseService.upsertProfile(targetProfile),
    ]);
  };

  const rejectCreator = async (id: string, notes?: string) => {
    const target = applications.find((a) => a.id === id);
    if (!target) return;

    const updatedApp: InfluencerApplication = {
      ...target,
      status: "REJECTED",
      admin_notes: notes || "Did not meet platform criteria.",
      reviewed_at: new Date().toISOString(),
      reviewed_by: adminUser?.email || "admin@getlinked.today",
      updated_at: new Date().toISOString(),
    };

    setApplications((prev) => prev.map((a) => (a.id === id ? updatedApp : a)));
    setProfiles((prev) => prev.filter((p) => p.application_id !== id));

    addAuditLog(
      "CREATOR_REJECTED",
      "InfluencerApplication",
      id,
      target.status,
      "REJECTED",
      `Rejected application ${target.full_name} (${target.reference_code}). Reason: ${notes || "General criteria"}`
    );

    // Supabase persist
    await Promise.all([
      supabaseService.updateApplication(id, {
        status: "REJECTED",
        admin_notes: updatedApp.admin_notes,
        reviewed_at: updatedApp.reviewed_at,
        reviewed_by: updatedApp.reviewed_by,
        updated_at: updatedApp.updated_at,
      }),
      supabaseService.deleteProfileByApplicationId(id),
    ]);
  };

  const deleteApplication = async (id: string) => {
    setApplications((prev) => prev.filter((a) => a.id !== id));
    setProfiles((prev) => prev.filter((p) => p.application_id !== id));
    await Promise.all([
      supabaseService.deleteApplication(id),
      supabaseService.deleteProfileByApplicationId(id),
    ]);
  };

  const submitAccommodationApplication = (
    data: Omit<AccommodationApplication, "id" | "reference_code" | "status" | "created_at" | "updated_at">
  ) => {
    const refCode = `GL-A-${Math.floor(1000 + Math.random() * 9000)}`;
    const newApp: AccommodationApplication = {
      ...data,
      id: `acc-${Date.now()}`,
      reference_code: refCode,
      status: "PENDING",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setAccommodations((prev) => [newApp, ...prev]);

    // Supabase persist
    supabaseService.insertAccommodation(newApp).catch((err) => {
      console.warn("Supabase insertAccommodation error:", err);
    });

    return {
      success: true,
      reference_code: refCode,
      message: "Listing submitted successfully. A Get Linked concierge will review your property within 24 hours.",
    };
  };

  const approveAccommodation = async (id: string, notes?: string) => {
    const target = accommodations.find((a) => a.id === id);
    if (!target) return;

    const updated: AccommodationApplication = {
      ...target,
      status: "APPROVED" as ApplicationStatus,
      admin_notes: notes || target.admin_notes,
      reviewed_at: new Date().toISOString(),
      reviewed_by: adminUser?.email || "admin@getlinked.today",
      updated_at: new Date().toISOString(),
    };

    setAccommodations((prev) => prev.map((a) => (a.id === id ? updated : a)));

    addAuditLog(
      "ACCOMMODATION_APPROVED",
      "AccommodationApplication",
      id,
      target.status,
      "APPROVED",
      `Approved property ${target.accommodation_name} (${target.reference_code}). Property is now eligible for matching.`
    );

    await supabaseService.updateAccommodation(id, {
      status: "APPROVED",
      admin_notes: updated.admin_notes,
      reviewed_at: updated.reviewed_at,
      reviewed_by: updated.reviewed_by,
      updated_at: updated.updated_at,
    });
  };

  const rejectAccommodation = async (id: string, notes?: string) => {
    const target = accommodations.find((a) => a.id === id);
    if (!target) return;

    const updated: AccommodationApplication = {
      ...target,
      status: "REJECTED" as ApplicationStatus,
      admin_notes: notes || "Did not meet host requirements",
      reviewed_at: new Date().toISOString(),
      reviewed_by: adminUser?.email || "admin@getlinked.today",
      updated_at: new Date().toISOString(),
    };

    setAccommodations((prev) => prev.map((a) => (a.id === id ? updated : a)));

    addAuditLog(
      "ACCOMMODATION_REJECTED",
      "AccommodationApplication",
      id,
      target.status,
      "REJECTED",
      `Rejected property ${target.accommodation_name} (${target.reference_code}). Reason: ${notes || "Standard criteria"}`
    );

    await supabaseService.updateAccommodation(id, {
      status: "REJECTED",
      admin_notes: updated.admin_notes,
      reviewed_at: updated.reviewed_at,
      reviewed_by: updated.reviewed_by,
      updated_at: updated.updated_at,
    });
  };

  const deleteAccommodation = async (id: string) => {
    setAccommodations((prev) => prev.filter((a) => a.id !== id));
    await supabaseService.deleteAccommodation(id);
  };

  const submitCreatorRequest = (data: {
    creator_id: string;
    creator_name: string;
    creator_niche: string;
    creator_city: string;
    accommodation_name: string;
    requester_name: string;
    requester_whatsapp: string;
    message?: string;
  }) => {
    const newReq: CreatorRequest = {
      id: `req-${Date.now()}`,
      creator_id: data.creator_id,
      creator_name: data.creator_name,
      creator_niche: data.creator_niche,
      creator_city: data.creator_city,
      accommodation_name: data.accommodation_name,
      requester_name: data.requester_name,
      requester_whatsapp: data.requester_whatsapp,
      message: data.message,
      status: "PENDING",
      source: "DIRECTORY",
      created_at: new Date().toISOString(),
    };

    setRequests((prev) => [newReq, ...prev]);

    // Supabase persist
    supabaseService.insertRequest(newReq).catch((err) => {
      console.warn("Supabase insertRequest error:", err);
    });

    return {
      success: true,
      message: "Request received! Our concierge team will review this collaboration and initiate WhatsApp introductions.",
    };
  };

  const updateRequestStatus = async (id: string, status: RequestStatus) => {
    const reviewed_at = new Date().toISOString();
    const reviewed_by = adminUser?.email || "admin@getlinked.today";

    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status,
              reviewed_at,
              reviewed_by,
            }
          : r
      )
    );

    await supabaseService.updateRequest(id, {
      status,
      reviewed_at,
      reviewed_by,
    });
  };

  const deleteRequest = async (id: string) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
    await supabaseService.deleteRequest(id);
  };

  const createProactiveMatch = (
    creatorId: string,
    accommodationId: string,
    adminNotes?: string
  ) => {
    const profile = profiles.find((p) => p.id === creatorId);
    const creatorApp = applications.find((a) => a.id === profile?.application_id);
    const acc = accommodations.find((a) => a.id === accommodationId);

    if (!profile || !creatorApp || !acc) {
      return { success: false, matchId: "" };
    }

    const matchId = `match-${Date.now()}`;
    const newMatch: Match = {
      id: matchId,
      creator_id: profile.id,
      creator_name: profile.display_name,
      creator_whatsapp: creatorApp.whatsapp,
      creator_niche: profile.niche,
      accommodation_id: acc.id,
      accommodation_name: acc.accommodation_name,
      accommodation_contact: acc.contact_person,
      accommodation_whatsapp: acc.whatsapp,
      accommodation_city: acc.city,
      match_source: "ADMIN",
      status: "CONFIRMED",
      admin_notes: adminNotes || "Proactive match created by Get Linked concierge team.",
      created_at: new Date().toISOString(),
      confirmed_at: new Date().toISOString(),
      confirmed_by: adminUser?.email || "admin@getlinked.today",
    };

    setMatches((prev) => [newMatch, ...prev]);

    addAuditLog(
      "PROACTIVE_MATCH_CREATED",
      "Match",
      matchId,
      undefined,
      "CONFIRMED",
      `Admin created match between ${profile.display_name} and ${acc.accommodation_name} in ${acc.city}.`
    );

    // Supabase persist
    supabaseService.insertMatch(newMatch).catch((err) => {
      console.warn("Supabase insertMatch error:", err);
    });

    return { success: true, matchId };
  };

  const updateMatchStatus = async (id: string, status: MatchStatus, notes?: string) => {
    const target = matches.find((m) => m.id === id);
    if (!target) return;

    const isIntroduced = status === "INTRODUCED";
    const updated: Match = {
      ...target,
      status,
      admin_notes: notes || target.admin_notes,
      introduced_at: isIntroduced ? new Date().toISOString() : target.introduced_at,
    };

    setMatches((prev) => prev.map((m) => (m.id === id ? updated : m)));

    addAuditLog(
      "MATCH_STATUS_UPDATED",
      "Match",
      id,
      target.status,
      status,
      `Match status changed from ${target.status} to ${status}.`
    );

    await supabaseService.updateMatch(id, {
      status,
      admin_notes: updated.admin_notes,
      introduced_at: updated.introduced_at,
    });
  };

  const deleteMatch = async (id: string) => {
    setMatches((prev) => prev.filter((m) => m.id !== id));
    await supabaseService.deleteMatch(id);
  };

  const updateSettings = async (newSettings: Partial<PlatformSettings>) => {
    let updatedObj: PlatformSettings;
    setSettings((prev) => {
      updatedObj = { ...prev, ...newSettings, updated_at: new Date().toISOString() };
      addAuditLog(
        "SETTINGS_UPDATED",
        "PlatformSettings",
        "global",
        prev.platform_phase,
        updatedObj.platform_phase,
        `Updated settings: Phase=${updatedObj.platform_phase}, BillingMode=${updatedObj.billing_mode}, PoolLimit=${updatedObj.creator_pool_limit}`
      );
      return updatedObj;
    });

    // Supabase persist
    await supabaseService.upsertSettings({
      ...settings,
      ...newSettings,
      id: "global",
      updated_at: new Date().toISOString(),
    });
  };

  const addAdvertisement = async (ad: Omit<Advertisement, "id">) => {
    const newAd: Advertisement = {
      ...ad,
      id: `ad-${Date.now()}`,
    };
    setAds((prev) => [newAd, ...prev]);
    await supabaseService.insertAdvertisement(newAd);
  };

  const toggleAdStatus = async (id: string) => {
    const target = ads.find((a) => a.id === id);
    if (!target) return;

    const updated = !target.is_active;
    setAds((prev) =>
      prev.map((ad) => (ad.id === id ? { ...ad, is_active: updated } : ad))
    );
    await supabaseService.updateAdvertisement(id, { is_active: updated });
  };

  const deleteAdvertisement = async (id: string) => {
    setAds((prev) => prev.filter((a) => a.id !== id));
    await supabaseService.deleteAdvertisement(id);
  };

  const lookupStatus = (whatsapp: string, refCode: string) => {
    const cleanQuery = cleanWhatsAppNumber(whatsapp);
    const upperRef = refCode.trim().toUpperCase();

    // Look up creator applications
    const creator = applications.find(
      (a) =>
        a.reference_code.toUpperCase() === upperRef &&
        cleanWhatsAppNumber(a.whatsapp) === cleanQuery
    );

    if (creator) {
      return {
        found: true,
        type: "CREATOR" as const,
        name: creator.full_name,
        status: creator.status,
        submittedAt: creator.created_at,
      };
    }

    // Look up accommodation applications
    const acc = accommodations.find(
      (a) =>
        a.reference_code.toUpperCase() === upperRef &&
        cleanWhatsAppNumber(a.whatsapp) === cleanQuery
    );

    if (acc) {
      return {
        found: true,
        type: "ACCOMMODATION" as const,
        name: acc.accommodation_name,
        status: acc.status,
        submittedAt: acc.created_at,
      };
    }

    return { found: false };
  };

  const resetDemoData = () => {
    setApplications(initialApplications);
    setProfiles(initialProfiles);
    setAccommodations(initialAccommodations);
    setRequests(initialRequests);
    setMatches(initialMatches);
    setSettings(initialPlatformSettings);
    setAds(initialAds);
    setAuditLogs(initialAuditLogs);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <StoreContext.Provider
      value={{
        applications,
        profiles,
        accommodations,
        requests,
        matches,
        settings,
        ads,
        auditLogs,
        adminUser,
        isConnectedToSupabase,
        isLoadingSupabase,
        refreshData: loadData,
        loginAdmin,
        logoutAdmin,
        submitCreatorApplication,
        approveCreator,
        rejectCreator,
        deleteApplication,
        submitAccommodationApplication,
        approveAccommodation,
        rejectAccommodation,
        deleteAccommodation,
        submitCreatorRequest,
        updateRequestStatus,
        deleteRequest,
        createProactiveMatch,
        updateMatchStatus,
        deleteMatch,
        updateSettings,
        addAdvertisement,
        toggleAdStatus,
        deleteAdvertisement,
        lookupStatus,
        resetDemoData,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};
