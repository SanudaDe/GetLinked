"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
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
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
  // Creator actions
  submitCreatorApplication: (
    data: Omit<InfluencerApplication, "id" | "reference_code" | "status" | "created_at" | "updated_at">
  ) => { success: boolean; reference_code: string; message?: string };
  approveCreator: (id: string, notes?: string) => void;
  rejectCreator: (id: string, notes?: string) => void;
  // Accommodation actions
  submitAccommodationApplication: (
    data: Omit<AccommodationApplication, "id" | "reference_code" | "status" | "created_at" | "updated_at">
  ) => { success: boolean; reference_code: string; message?: string };
  approveAccommodation: (id: string, notes?: string) => void;
  rejectAccommodation: (id: string, notes?: string) => void;
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
  updateRequestStatus: (id: string, status: RequestStatus) => void;
  // Match actions
  createProactiveMatch: (
    creatorId: string,
    accommodationId: string,
    adminNotes?: string
  ) => { success: boolean; matchId: string };
  updateMatchStatus: (id: string, status: MatchStatus, notes?: string) => void;
  // Settings & Ads actions
  updateSettings: (newSettings: Partial<PlatformSettings>) => void;
  addAdvertisement: (ad: Omit<Advertisement, "id">) => void;
  toggleAdStatus: (id: string) => void;
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
  const [applications, setApplications] = useState<InfluencerApplication[]>(initialApplications);
  const [profiles, setProfiles] = useState<InfluencerProfile[]>(initialProfiles);
  const [accommodations, setAccommodations] = useState<AccommodationApplication[]>(initialAccommodations);
  const [requests, setRequests] = useState<CreatorRequest[]>(initialRequests);
  const [matches, setMatches] = useState<Match[]>(initialMatches);
  const [settings, setSettings] = useState<PlatformSettings>(initialPlatformSettings);
  const [ads, setAds] = useState<Advertisement[]>(initialAds);
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>(initialAuditLogs);
  const [adminUser, setAdminUser] = useState<{ email: string; name: string; role: string } | null>(null);

  // Load from localStorage if present
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.applications) setApplications(parsed.applications);
        if (parsed.profiles) setProfiles(parsed.profiles);
        if (parsed.accommodations) setAccommodations(parsed.accommodations);
        if (parsed.requests) setRequests(parsed.requests);
        if (parsed.matches) setMatches(parsed.matches);
        if (parsed.settings) setSettings(parsed.settings);
        if (parsed.ads) setAds(parsed.ads);
        if (parsed.auditLogs) setAuditLogs(parsed.auditLogs);
      }
      // Check admin session
      const savedAdmin = localStorage.getItem("getlinked_admin_session");
      if (savedAdmin) {
        setAdminUser(JSON.parse(savedAdmin));
      }
    } catch {
      // ignore
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Sync to localStorage
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
    // Standard mock admin credentials for prototype demonstration
    if (password === "admin123" || password === "getlinked2026") {
      const admin = {
        email: "admin@getlinked.today",
        name: "Get Linked Admin",
        role: "SUPER_ADMIN",
      };
      setAdminUser(admin);
      localStorage.setItem("getlinked_admin_session", JSON.stringify(admin));
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setAdminUser(null);
    localStorage.removeItem("getlinked_admin_session");
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
  };

  const submitCreatorApplication = (
    data: Omit<InfluencerApplication, "id" | "reference_code" | "status" | "created_at" | "updated_at">
  ) => {
    const cleanedPhone = cleanWhatsAppNumber(data.whatsapp);
    // Duplicate detection check
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

    return {
      success: true,
      reference_code: refCode,
      message: "Application submitted successfully for manual verification.",
    };
  };

  const approveCreator = (id: string, notes?: string) => {
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
    if (!existingProf) {
      const newProf: InfluencerProfile = {
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
      setProfiles((prev) => [newProf, ...prev]);
    } else {
      setProfiles((prev) =>
        prev.map((p) => (p.application_id === id ? { ...p, is_active: true } : p))
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
  };

  const rejectCreator = (id: string, notes?: string) => {
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

    // Deactivate or remove from active profiles
    setProfiles((prev) => prev.filter((p) => p.application_id !== id));

    addAuditLog(
      "CREATOR_REJECTED",
      "InfluencerApplication",
      id,
      target.status,
      "REJECTED",
      `Rejected application ${target.full_name} (${target.reference_code}). Reason: ${notes || "General criteria"}`
    );
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

    return {
      success: true,
      reference_code: refCode,
      message: "Listing submitted successfully. A Get Linked concierge will review your property within 24 hours.",
    };
  };

  const approveAccommodation = (id: string, notes?: string) => {
    const target = accommodations.find((a) => a.id === id);
    if (!target) return;

    const updated = {
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
  };

  const rejectAccommodation = (id: string, notes?: string) => {
    const target = accommodations.find((a) => a.id === id);
    if (!target) return;

    const updated = {
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

    return {
      success: true,
      message: "Request received! Our concierge team will review this collaboration and initiate WhatsApp introductions.",
    };
  };

  const updateRequestStatus = (id: string, status: RequestStatus) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status,
              reviewed_at: new Date().toISOString(),
              reviewed_by: adminUser?.email || "admin@getlinked.today",
            }
          : r
      )
    );
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

    return { success: true, matchId };
  };

  const updateMatchStatus = (id: string, status: MatchStatus, notes?: string) => {
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
  };

  const updateSettings = (newSettings: Partial<PlatformSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings, updated_at: new Date().toISOString() };
      addAuditLog(
        "SETTINGS_UPDATED",
        "PlatformSettings",
        "global",
        prev.platform_phase,
        updated.platform_phase,
        `Updated settings: Phase=${updated.platform_phase}, BillingMode=${updated.billing_mode}, PoolLimit=${updated.creator_pool_limit}`
      );
      return updated;
    });
  };

  const addAdvertisement = (ad: Omit<Advertisement, "id">) => {
    const newAd: Advertisement = {
      ...ad,
      id: `ad-${Date.now()}`,
    };
    setAds((prev) => [newAd, ...prev]);
  };

  const toggleAdStatus = (id: string) => {
    setAds((prev) =>
      prev.map((ad) => (ad.id === id ? { ...ad, is_active: !ad.is_active } : ad))
    );
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
    localStorage.removeItem(STORAGE_KEY);
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
        loginAdmin,
        logoutAdmin,
        submitCreatorApplication,
        approveCreator,
        rejectCreator,
        submitAccommodationApplication,
        approveAccommodation,
        rejectAccommodation,
        submitCreatorRequest,
        updateRequestStatus,
        createProactiveMatch,
        updateMatchStatus,
        updateSettings,
        addAdvertisement,
        toggleAdStatus,
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
