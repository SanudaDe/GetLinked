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
  CreatorRating,
  MatchReview,
  RatingStatsResult,
  DoubleBlindReviewStatus,
  CollabRatingSubmission,
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
  initialRatings,
  initialMatchReviews,
} from "./mockStore";
import { cleanWhatsAppNumber } from "@/utils/whatsapp";
import { DEFAULT_ALLOWED_LOCATIONS, isEatVenue } from "@/utils/formatters";
import { supabaseService } from "@/services/supabaseService";
import { supabase } from "@/lib/supabaseClient";

export const LOCATION_STORAGE_KEY = "getlinked_location_settings_v1";

export interface SavedLocationSettings {
  allowed_creator_locations: string[];
  allowed_villa_locations: string[];
  custom_locations: string[];
  updated_at?: string;
}

export function readLocationSettingsFromStorage(): SavedLocationSettings | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LOCATION_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.allowed_creator_locations) || Array.isArray(parsed.allowed_villa_locations)) {
        return {
          allowed_creator_locations: Array.isArray(parsed.allowed_creator_locations)
            ? parsed.allowed_creator_locations
            : DEFAULT_ALLOWED_LOCATIONS,
          allowed_villa_locations: Array.isArray(parsed.allowed_villa_locations)
            ? parsed.allowed_villa_locations
            : DEFAULT_ALLOWED_LOCATIONS,
          custom_locations: Array.isArray(parsed.custom_locations) ? parsed.custom_locations : [],
          updated_at: parsed.updated_at,
        };
      }
    }
    const mainRaw = localStorage.getItem(STORAGE_KEY);
    if (mainRaw) {
      const parsedMain = JSON.parse(mainRaw);
      if (
        parsedMain?.settings &&
        (Array.isArray(parsedMain.settings.allowed_creator_locations) ||
          Array.isArray(parsedMain.settings.allowed_villa_locations))
      ) {
        return {
          allowed_creator_locations: Array.isArray(parsedMain.settings.allowed_creator_locations)
            ? parsedMain.settings.allowed_creator_locations
            : DEFAULT_ALLOWED_LOCATIONS,
          allowed_villa_locations: Array.isArray(parsedMain.settings.allowed_villa_locations)
            ? parsedMain.settings.allowed_villa_locations
            : DEFAULT_ALLOWED_LOCATIONS,
          custom_locations: Array.isArray(parsedMain.settings.custom_locations)
            ? parsedMain.settings.custom_locations
            : [],
          updated_at: parsedMain.settings.updated_at,
        };
      }
    }
  } catch (e) {
    console.warn("Error reading location settings from localStorage:", e);
  }
  return null;
}

export function writeLocationSettingsToStorage(locations: {
  allowed_creator_locations: string[];
  allowed_villa_locations: string[];
  custom_locations?: string[];
}) {
  if (typeof window === "undefined") return;
  try {
    const payload: SavedLocationSettings = {
      allowed_creator_locations: locations.allowed_creator_locations,
      allowed_villa_locations: locations.allowed_villa_locations,
      custom_locations: locations.custom_locations ?? [],
      updated_at: new Date().toISOString(),
    };
    localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(payload));
    window.dispatchEvent(new CustomEvent("getlinked_locations_changed", { detail: payload }));
  } catch (e) {
    console.warn("Error saving location settings to localStorage:", e);
  }
}

const normalizeSettings = (
  s: PlatformSettings,
  existingSettings?: PlatformSettings
): PlatformSettings => {
  const localSaved = readLocationSettingsFromStorage();

  const allowed_creator_locations = Array.isArray(s.allowed_creator_locations)
    ? s.allowed_creator_locations
    : localSaved?.allowed_creator_locations !== undefined && Array.isArray(localSaved.allowed_creator_locations)
    ? localSaved.allowed_creator_locations
    : existingSettings?.allowed_creator_locations !== undefined && Array.isArray(existingSettings.allowed_creator_locations)
    ? existingSettings.allowed_creator_locations
    : DEFAULT_ALLOWED_LOCATIONS;

  const allowed_villa_locations = Array.isArray(s.allowed_villa_locations)
    ? s.allowed_villa_locations
    : localSaved?.allowed_villa_locations !== undefined && Array.isArray(localSaved.allowed_villa_locations)
    ? localSaved.allowed_villa_locations
    : existingSettings?.allowed_villa_locations !== undefined && Array.isArray(existingSettings.allowed_villa_locations)
    ? existingSettings.allowed_villa_locations
    : DEFAULT_ALLOWED_LOCATIONS;

  const custom_locations = Array.isArray(s.custom_locations)
    ? s.custom_locations
    : localSaved?.custom_locations !== undefined && Array.isArray(localSaved.custom_locations)
    ? localSaved.custom_locations
    : existingSettings?.custom_locations !== undefined && Array.isArray(existingSettings.custom_locations)
    ? existingSettings.custom_locations
    : [];

  return {
    ...s,
    allowed_creator_locations,
    allowed_villa_locations,
    custom_locations,
  };
};

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  role?: "creator" | "stay" | "admin";
}

interface StoreContextType {
  applications: InfluencerApplication[];
  profiles: InfluencerProfile[];
  accommodations: AccommodationApplication[];
  requests: CreatorRequest[];
  matches: Match[];
  settings: PlatformSettings;
  ads: Advertisement[];
  auditLogs: AdminAuditLog[];
  ratings: CreatorRating[];
  matchReviews: MatchReview[];
  adminUser: { email: string; name: string; role: string } | null;
  authUser: AuthUser | null;
  isAuthLoading: boolean;
  isConnectedToSupabase: boolean;
  isLoadingSupabase: boolean;
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
  signOutUser: () => Promise<void>;
  updateUserProfilePhoto: (photoUrl: string) => Promise<boolean>;
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

  // Direct Community & Admin Ratings actions
  addCreatorRating: (
    rating: Omit<CreatorRating, "id" | "created_at">
  ) => Promise<CreatorRating>;
  deleteCreatorRating: (ratingId: string) => Promise<void>;

  // Double-Blind Post-Collaboration Ratings actions
  logMatchRating: (
    matchId: string,
    side: "property" | "creator",
    rating: {
      score: number;
      feedback: string;
      criteria?: string[];
      submittedBy?: string;
    }
  ) => Promise<void>;
  revealMatchReview: (matchId: string) => Promise<void>;
  deleteMatchReview?: (reviewId: string) => Promise<void>;

  // Rating Statistics with 3+ Minimum Credibility Threshold
  getCreatorRatingStats: (creatorId: string) => RatingStatsResult;
  getPropertyRatingStats: (accommodationId: string) => RatingStatsResult;

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
  const [ratings, setRatings] = useState<CreatorRating[]>(initialRatings);
  const [matchReviews, setMatchReviews] = useState<MatchReview[]>(initialMatchReviews);
  const [adminUser, setAdminUser] = useState<{ email: string; name: string; role: string } | null>(null);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Immediate client hydration of location settings to avoid any uninitialized flash
  useEffect(() => {
    const saved = readLocationSettingsFromStorage();
    if (saved) {
      setSettings((prev) => ({
        ...prev,
        allowed_creator_locations: saved.allowed_creator_locations,
        allowed_villa_locations: saved.allowed_villa_locations,
        custom_locations: saved.custom_locations ?? prev.custom_locations,
      }));
    }
  }, []);

  // Listen for storage events across browser tabs/windows and custom events within the same window
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === LOCATION_STORAGE_KEY && e.newValue) {
        try {
          const parsed: SavedLocationSettings = JSON.parse(e.newValue);
          setSettings((prev) => ({
            ...prev,
            allowed_creator_locations: parsed.allowed_creator_locations,
            allowed_villa_locations: parsed.allowed_villa_locations,
            custom_locations: parsed.custom_locations ?? prev.custom_locations,
          }));
        } catch {
          // ignore
        }
      }
    };

    const handleCustomChange = (e: Event) => {
      const customEvent = e as CustomEvent<SavedLocationSettings>;
      if (customEvent.detail) {
        setSettings((prev) => ({
          ...prev,
          allowed_creator_locations: customEvent.detail.allowed_creator_locations,
          allowed_villa_locations: customEvent.detail.allowed_villa_locations,
          custom_locations: customEvent.detail.custom_locations ?? prev.custom_locations,
        }));
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("getlinked_locations_changed", handleCustomChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("getlinked_locations_changed", handleCustomChange);
    };
  }, []);

  // Listen to Supabase Auth State for Google / User login
  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!mounted) return;
        if (session?.user) {
          const u = session.user;
          const meta = u.user_metadata || {};
          setAuthUser({
            id: u.id,
            email: u.email || "",
            name: meta.full_name || meta.name || u.email?.split("@")[0] || "Influencer",
            avatar_url: meta.avatar_url || meta.picture || undefined,
          });
        } else {
          setAuthUser(null);
        }
      } catch (err) {
        console.warn("Auth check failed:", err);
      } finally {
        if (mounted) setIsAuthLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      if (session?.user) {
        const u = session.user;
        const meta = u.user_metadata || {};
        setAuthUser({
          id: u.id,
          email: u.email || "",
          name: meta.full_name || meta.name || u.email?.split("@")[0] || "Influencer",
          avatar_url: meta.avatar_url || meta.picture || undefined,
        });
      } else {
        setAuthUser(null);
      }
      setIsAuthLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOutUser = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn("Sign out exception:", err);
    }
    setAuthUser(null);
  };

  const updateUserProfilePhoto = async (photoUrl: string): Promise<boolean> => {
    if (!authUser) return false;

    // 1. Update authUser in local React state
    setAuthUser((prev) => (prev ? { ...prev, avatar_url: photoUrl } : null));

    // 2. Update Supabase Auth user_metadata
    try {
      await supabase.auth.updateUser({
        data: {
          avatar_url: photoUrl,
          picture: photoUrl,
        },
      });
    } catch (authErr) {
      console.warn("Supabase auth updateUser metadata notice:", authErr);
    }

    // 3. Update in applications state & Supabase influencer_applications
    const matchedApp = applications.find(
      (a) => a.full_name.toLowerCase().trim() === authUser.name.toLowerCase().trim()
    );
    if (matchedApp) {
      setApplications((prev) =>
        prev.map((a) => (a.id === matchedApp.id ? { ...a, avatar_url: photoUrl } : a))
      );
      supabaseService.updateApplication(matchedApp.id, { avatar_url: photoUrl }).catch(console.warn);

      // 4. Update in profiles state & Supabase influencer_profiles
      const matchedProf = profiles.find((p) => p.application_id === matchedApp.id);
      if (matchedProf) {
        setProfiles((prev) =>
          prev.map((p) => (p.id === matchedProf.id ? { ...p, avatar_url: photoUrl } : p))
        );
        supabaseService.upsertProfile({ ...matchedProf, avatar_url: photoUrl }).catch(console.warn);
      }
    }

    return true;
  };

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
        if (data.settings) setSettings((prev) => normalizeSettings(data.settings!, prev));
        if (data.ads) setAds(data.ads);
        if (data.auditLogs) setAuditLogs(data.auditLogs);
        if (data.ratings && data.ratings.length > 0) setRatings(data.ratings);
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
          if (parsed.settings) setSettings((prev) => normalizeSettings(parsed.settings, prev));
          if (parsed.ads?.length) setAds(parsed.ads);
          if (parsed.auditLogs?.length) setAuditLogs(parsed.auditLogs);
          if (parsed.ratings?.length) setRatings(parsed.ratings);
          if (parsed.matchReviews?.length) setMatchReviews(parsed.matchReviews);
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
          ratings,
          matchReviews,
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
    ratings,
    matchReviews,
  ]);

  const loginAdmin = (password: string): boolean => {
    const validPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "getlinked@admin26";
    if (password === validPassword) {
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
    const allowedCreatorLocs = settings.allowed_creator_locations ?? DEFAULT_ALLOWED_LOCATIONS;
    if (allowedCreatorLocs.length > 0 && !allowedCreatorLocs.includes(data.city)) {
      return {
        success: false,
        reference_code: "",
        message: `Registration for ${data.city} is currently closed. Please select an active location.`,
      };
    }
    if (allowedCreatorLocs.length === 0) {
      return {
        success: false,
        reference_code: "",
        message: "Creator registration is currently paused across all locations.",
      };
    }

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
        avatar_url: target.avatar_url,
        trip_brief: target.trip_brief,
        is_active: true,
        created_at: new Date().toISOString(),
      };
      setProfiles((prev) => [targetProfile, ...prev]);
    } else {
      targetProfile = {
        ...existingProf,
        is_active: true,
        avatar_url: target.avatar_url || existingProf.avatar_url,
      };
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
    const allowedVillaLocs = settings.allowed_villa_locations ?? DEFAULT_ALLOWED_LOCATIONS;
    if (allowedVillaLocs.length > 0 && !allowedVillaLocs.includes(data.city)) {
      return {
        success: false,
        reference_code: "",
        message: `Registration for ${data.city} is currently closed. Please select an active location.`,
      };
    }
    if (allowedVillaLocs.length === 0) {
      return {
        success: false,
        reference_code: "",
        message: "Villa and stay registration is currently closed across all locations.",
      };
    }

    const isEat = isEatVenue(data.property_type);
    const prefix = isEat ? "GL-E-" : "GL-A-";
    const refCode = `${prefix}${Math.floor(1000 + Math.random() * 9000)}`;
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
      message: isEat
        ? "Eats listing submitted successfully. A Get Linked concierge will review your venue within 24 hours."
        : "Listing submitted successfully. A Get Linked concierge will review your property within 24 hours.",
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
    let updatedObj: PlatformSettings | undefined;
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
      if (
        newSettings.allowed_creator_locations !== undefined ||
        newSettings.allowed_villa_locations !== undefined ||
        newSettings.custom_locations !== undefined
      ) {
        writeLocationSettingsToStorage({
          allowed_creator_locations: updatedObj.allowed_creator_locations ?? DEFAULT_ALLOWED_LOCATIONS,
          allowed_villa_locations: updatedObj.allowed_villa_locations ?? DEFAULT_ALLOWED_LOCATIONS,
          custom_locations: updatedObj.custom_locations,
        });

        addAuditLog(
          "LOCATION_SETTINGS_SNAPSHOT",
          "PlatformSettings",
          "global",
          undefined,
          undefined,
          JSON.stringify({
            allowed_creator_locations: updatedObj.allowed_creator_locations,
            allowed_villa_locations: updatedObj.allowed_villa_locations,
            custom_locations: updatedObj.custom_locations,
          })
        );
      }
      return updatedObj;
    });

    const payloadToUpsert = updatedObj || {
      ...settings,
      ...newSettings,
      id: "global",
      updated_at: new Date().toISOString(),
    };

    // Supabase persist
    await supabaseService.upsertSettings(payloadToUpsert);
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
    setRatings(initialRatings);
    setMatchReviews(initialMatchReviews);
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  /**
   * Double-Blind Post-Collaboration Reviews
   * Property rates Creator (reliability, content quality, showed up as agreed)
   * Creator rates Property (as described, hospitality, smooth experience)
   * Neither sees the other's review until both have submitted (Airbnb / Uber model)
   */
  const logMatchRating = async (
    matchId: string,
    side: "property" | "creator",
    ratingData: {
      score: number;
      feedback: string;
      criteria?: string[];
      submittedBy?: string;
    }
  ) => {
    const targetMatch = matches.find((m) => m.id === matchId);
    const existingRev = matchReviews.find((r) => r.match_id === matchId);

    const submission: CollabRatingSubmission = {
      score: Math.min(5, Math.max(1, Number(ratingData.score))),
      feedback: ratingData.feedback.trim(),
      criteria: ratingData.criteria || [],
      submitted_at: new Date().toISOString(),
      submitted_by: ratingData.submittedBy,
    };

    let updatedReviews: MatchReview[];

    if (existingRev) {
      let newStatus: DoubleBlindReviewStatus = existingRev.status;
      let newPropRev = existingRev.property_review_of_creator;
      let newCreatorRev = existingRev.creator_review_of_property;
      let revealedAt = existingRev.revealed_at;

      if (side === "property") {
        newPropRev = submission;
        if (newCreatorRev) {
          // Both submitted! Double-blind unlocks and reveals both
          newStatus = "REVEALED";
          revealedAt = revealedAt || new Date().toISOString();
        } else {
          newStatus = "PROPERTY_ONLY";
        }
      } else {
        newCreatorRev = submission;
        if (newPropRev) {
          // Both submitted! Double-blind unlocks and reveals both
          newStatus = "REVEALED";
          revealedAt = revealedAt || new Date().toISOString();
        } else {
          newStatus = "CREATOR_ONLY";
        }
      }

      const updatedRecord: MatchReview = {
        ...existingRev,
        property_review_of_creator: newPropRev,
        creator_review_of_property: newCreatorRev,
        status: newStatus,
        revealed_at: revealedAt,
        updated_at: new Date().toISOString(),
      };

      updatedReviews = matchReviews.map((r) => (r.id === existingRev.id ? updatedRecord : r));
    } else {
      const isProp = side === "property";
      const newRecord: MatchReview = {
        id: `mrev-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        match_id: matchId,
        creator_id: targetMatch?.creator_id || "",
        creator_name: targetMatch?.creator_name || "Creator",
        accommodation_id: targetMatch?.accommodation_id || "",
        accommodation_name: targetMatch?.accommodation_name || "Property",
        property_review_of_creator: isProp ? submission : undefined,
        creator_review_of_property: !isProp ? submission : undefined,
        status: isProp ? "PROPERTY_ONLY" : "CREATOR_ONLY",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      updatedReviews = [newRecord, ...matchReviews];
    }

    setMatchReviews(updatedReviews);

    addAuditLog(
      side === "property" ? "COLLAB_PROPERTY_REVIEW_LOGGED" : "COLLAB_CREATOR_REVIEW_LOGGED",
      "MatchReview",
      matchId,
      undefined,
      `${ratingData.score}/5 ⭐`,
      `Logged post-collaboration rating (${side}): ${ratingData.score}⭐ - "${ratingData.feedback.slice(0, 45)}"`
    );
  };

  const revealMatchReview = async (matchId: string) => {
    setMatchReviews((prev) =>
      prev.map((r) =>
        r.match_id === matchId
          ? {
              ...r,
              status: "REVEALED",
              revealed_at: r.revealed_at || new Date().toISOString(),
              updated_at: new Date().toISOString(),
            }
          : r
      )
    );
    addAuditLog(
      "COLLAB_REVIEW_REVEALED_MANUALLY",
      "MatchReview",
      matchId,
      undefined,
      "REVEALED",
      `Admin unsealed double-blind reviews for match ${matchId}`
    );
  };

  const deleteMatchReview = async (reviewId: string) => {
    setMatchReviews((prev) => prev.filter((r) => r.id !== reviewId && r.match_id !== reviewId));
  };

  /**
   * Creator Rating Stats with Credibility Threshold (3+ Rule)
   * Enforces: No public average score is displayed until a creator has 3+ verified ratings.
   * Below 3 ratings: score is hidden (average = 0, meetsThreshold = false) to prevent fake signals.
   */
  const getCreatorRatingStats = useCallback(
    (creatorId: string): RatingStatsResult => {
      const THRESHOLD = 3;
      const matchedProfile = profiles.find((p) => p.id === creatorId || p.application_id === creatorId);
      const validIds = new Set<string>([creatorId]);
      if (matchedProfile) {
        validIds.add(matchedProfile.id);
        validIds.add(matchedProfile.application_id);
      }

      // 1. Direct verified ratings
      const matchedDirectRatings = ratings.filter((r) => validIds.has(r.creator_id));

      // 2. Revealed double-blind post-collab reviews
      const revealedMatchCollabs = matchReviews
        .filter(
          (m) =>
            m.status === "REVEALED" &&
            (validIds.has(m.creator_id) || (matchedProfile && m.creator_name === matchedProfile.display_name)) &&
            !!m.property_review_of_creator
        )
        .map((m) => ({
          id: m.id,
          match_id: m.match_id,
          partner_name: m.accommodation_name,
          score: m.property_review_of_creator!.score,
          feedback: m.property_review_of_creator!.feedback,
          criteria: m.property_review_of_creator!.criteria,
          submitted_at: m.property_review_of_creator!.submitted_at,
          target_type: "creator" as const,
        }));

      const totalCount = matchedDirectRatings.length + revealedMatchCollabs.length;
      const meetsThreshold = totalCount >= THRESHOLD;

      // Calculate criteria breakdowns
      const criteriaSums: Record<string, { sum: number; count: number }> = {};
      revealedMatchCollabs.forEach((item) => {
        if (item.criteria && item.criteria.length > 0) {
          item.criteria.forEach((crit) => {
            if (!criteriaSums[crit]) criteriaSums[crit] = { sum: 0, count: 0 };
            criteriaSums[crit].sum += item.score;
            criteriaSums[crit].count += 1;
          });
        }
      });

      const criteriaAverages: Record<string, number> = {};
      Object.keys(criteriaSums).forEach((k) => {
        criteriaAverages[k] = Number((criteriaSums[k].sum / criteriaSums[k].count).toFixed(1));
      });

      if (totalCount === 0) {
        return {
          average: 0,
          count: 0,
          meetsThreshold: false,
          threshold: THRESHOLD,
          ratings: [],
          revealedCollabs: [],
          criteriaAverages: {},
        };
      }

      const totalSum =
        matchedDirectRatings.reduce((acc, curr) => acc + curr.rating, 0) +
        revealedMatchCollabs.reduce((acc, curr) => acc + curr.score, 0);

      // Average score is ONLY exposed if the 3+ reviews threshold is met!
      const average = meetsThreshold ? Number((totalSum / totalCount).toFixed(1)) : 0;
      const adminRating = matchedDirectRatings.find((r) => r.is_admin);

      return {
        average,
        count: totalCount,
        meetsThreshold,
        threshold: THRESHOLD,
        adminRating,
        ratings: matchedDirectRatings,
        revealedCollabs: revealedMatchCollabs,
        criteriaAverages,
      };
    },
    [ratings, matchReviews, profiles]
  );

  /**
   * Property Rating Stats with Credibility Threshold (3+ Rule)
   * Same Airbnb/Uber style double-blind aggregation for stays and restaurants.
   */
  const getPropertyRatingStats = useCallback(
    (propertyIdOrName: string): RatingStatsResult => {
      const THRESHOLD = 3;
      const targetAcc = accommodations.find(
        (a) => a.id === propertyIdOrName || a.accommodation_name.toLowerCase() === propertyIdOrName.toLowerCase()
      );
      const validNames = new Set<string>([propertyIdOrName.toLowerCase()]);
      const validIds = new Set<string>([propertyIdOrName]);
      if (targetAcc) {
        validNames.add(targetAcc.accommodation_name.toLowerCase());
        validIds.add(targetAcc.id);
      }

      // Creator reviews of property from revealed double-blind matches
      const revealedCollabs = matchReviews
        .filter(
          (m) =>
            m.status === "REVEALED" &&
            (validIds.has(m.accommodation_id) || validNames.has(m.accommodation_name.toLowerCase())) &&
            !!m.creator_review_of_property
        )
        .map((m) => ({
          id: m.id,
          match_id: m.match_id,
          partner_name: m.creator_name,
          score: m.creator_review_of_property!.score,
          feedback: m.creator_review_of_property!.feedback,
          criteria: m.creator_review_of_property!.criteria,
          submitted_at: m.creator_review_of_property!.submitted_at,
          target_type: "property" as const,
        }));

      const totalCount = revealedCollabs.length;
      const meetsThreshold = totalCount >= THRESHOLD;

      const criteriaSums: Record<string, { sum: number; count: number }> = {};
      revealedCollabs.forEach((item) => {
        if (item.criteria && item.criteria.length > 0) {
          item.criteria.forEach((crit) => {
            if (!criteriaSums[crit]) criteriaSums[crit] = { sum: 0, count: 0 };
            criteriaSums[crit].sum += item.score;
            criteriaSums[crit].count += 1;
          });
        }
      });

      const criteriaAverages: Record<string, number> = {};
      Object.keys(criteriaSums).forEach((k) => {
        criteriaAverages[k] = Number((criteriaSums[k].sum / criteriaSums[k].count).toFixed(1));
      });

      const totalSum = revealedCollabs.reduce((acc, curr) => acc + curr.score, 0);
      const average = meetsThreshold && totalCount > 0 ? Number((totalSum / totalCount).toFixed(1)) : 0;

      return {
        average,
        count: totalCount,
        meetsThreshold,
        threshold: THRESHOLD,
        ratings: [],
        revealedCollabs,
        criteriaAverages,
      };
    },
    [matchReviews, accommodations]
  );

  const addCreatorRating = async (
    ratingData: Omit<CreatorRating, "id" | "created_at">
  ): Promise<CreatorRating> => {
    const newRating: CreatorRating = {
      ...ratingData,
      rating: Math.min(5, Math.max(1, Number(ratingData.rating))),
      id: `rate-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      created_at: new Date().toISOString(),
    };

    setRatings((prev) => [newRating, ...prev]);

    // Persist to Supabase
    supabaseService.upsertRating(newRating).catch(console.warn);

    addAuditLog(
      newRating.is_admin ? "ADMIN_CREATOR_RATED" : "CREATOR_RATED",
      "CreatorRating",
      newRating.id,
      undefined,
      `${newRating.rating}/5 ⭐`,
      `${newRating.reviewer_name} (${newRating.reviewer_role}) rated creator ${newRating.creator_id}: ${newRating.rating}/5 ⭐`
    );

    return newRating;
  };

  const deleteCreatorRating = async (ratingId: string) => {
    setRatings((prev) => prev.filter((r) => r.id !== ratingId));
    supabaseService.deleteRating(ratingId).catch(console.warn);

    addAuditLog(
      "CREATOR_RATING_DELETED",
      "CreatorRating",
      ratingId,
      undefined,
      undefined,
      `Removed rating ${ratingId}`
    );
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
        ratings,
        matchReviews,
        adminUser,
        authUser,
        isAuthLoading,
        signOutUser,
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
        updateUserProfilePhoto,
        resetDemoData,
        addCreatorRating,
        deleteCreatorRating,
        logMatchRating,
        revealMatchReview,
        deleteMatchReview,
        getCreatorRatingStats,
        getPropertyRatingStats,
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
