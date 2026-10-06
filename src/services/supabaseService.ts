import { supabase } from "@/lib/supabaseClient";
import {
  InfluencerApplication,
  InfluencerProfile,
  AccommodationApplication,
  CreatorRequest,
  Match,
  PlatformSettings,
  Advertisement,
  AdminAuditLog,
} from "@/types";

export interface FetchedData {
  applications: InfluencerApplication[] | null;
  profiles: InfluencerProfile[] | null;
  accommodations: AccommodationApplication[] | null;
  requests: CreatorRequest[] | null;
  matches: Match[] | null;
  settings: PlatformSettings | null;
  ads: Advertisement[] | null;
  auditLogs: AdminAuditLog[] | null;
}

export const supabaseService = {
  /**
   * Fetch all platform data from Supabase.
   * Returns null for collections that failed or tables that don't exist yet.
   */
  async fetchInitialData(): Promise<FetchedData> {
    try {
      const [
        appsRes,
        profsRes,
        accsRes,
        reqsRes,
        matchesRes,
        settingsRes,
        adsRes,
        auditRes,
      ] = await Promise.all([
        supabase
          .from("influencer_applications")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("influencer_profiles")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("accommodation_applications")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("creator_requests")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("matches")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("platform_settings")
          .select("*")
          .eq("id", "global")
          .maybeSingle(),
        supabase
          .from("advertisements")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("admin_audit_logs")
          .select("*")
          .order("timestamp", { ascending: false })
          .limit(100),
      ]);

      let loadedSettings: PlatformSettings | null =
        settingsRes.error || !settingsRes.data ? null : (settingsRes.data as PlatformSettings);

      // If platform_settings table in Supabase hasn't had the location columns added yet,
      // recover the latest saved location settings snapshot from audit logs
      if (loadedSettings && (!loadedSettings.allowed_creator_locations || !loadedSettings.allowed_villa_locations) && auditRes.data) {
        const snapshotLog = (auditRes.data as AdminAuditLog[]).find(
          (log) => log.action === "LOCATION_SETTINGS_SNAPSHOT"
        );
        if (snapshotLog?.details) {
          try {
            const parsed = JSON.parse(snapshotLog.details);
            if (Array.isArray(parsed.allowed_creator_locations)) {
              loadedSettings.allowed_creator_locations = parsed.allowed_creator_locations;
            }
            if (Array.isArray(parsed.allowed_villa_locations)) {
              loadedSettings.allowed_villa_locations = parsed.allowed_villa_locations;
            }
            if (Array.isArray(parsed.custom_locations)) {
              loadedSettings.custom_locations = parsed.custom_locations;
            }

            // Also ensure this snapshot is cached in client localStorage
            if (typeof window !== "undefined") {
              try {
                localStorage.setItem("getlinked_location_settings_v1", JSON.stringify({
                  allowed_creator_locations: loadedSettings.allowed_creator_locations,
                  allowed_villa_locations: loadedSettings.allowed_villa_locations,
                  custom_locations: loadedSettings.custom_locations ?? [],
                  updated_at: new Date().toISOString(),
                }));
              } catch {
                // ignore
              }
            }
          } catch {
            // ignore JSON parse error
          }
        }
      }

      // If still missing and running in browser, check localStorage cache
      if (loadedSettings && !loadedSettings.allowed_creator_locations && typeof window !== "undefined") {
        try {
          const cached = localStorage.getItem("getlinked_location_settings_v1");
          if (cached) {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed.allowed_creator_locations)) {
              loadedSettings.allowed_creator_locations = parsed.allowed_creator_locations;
            }
            if (Array.isArray(parsed.allowed_villa_locations)) {
              loadedSettings.allowed_villa_locations = parsed.allowed_villa_locations;
            }
            if (Array.isArray(parsed.custom_locations)) {
              loadedSettings.custom_locations = parsed.custom_locations;
            }
          }
        } catch {
          // ignore
        }
      }

      return {
        applications: appsRes.error ? null : (appsRes.data as InfluencerApplication[]),
        profiles: profsRes.error ? null : (profsRes.data as InfluencerProfile[]),
        accommodations: accsRes.error ? null : (accsRes.data as AccommodationApplication[]),
        requests: reqsRes.error ? null : (reqsRes.data as CreatorRequest[]),
        matches: matchesRes.error ? null : (matchesRes.data as Match[]),
        settings: loadedSettings,
        ads: adsRes.error ? null : (adsRes.data as Advertisement[]),
        auditLogs: auditRes.error ? null : (auditRes.data as AdminAuditLog[]),
      };
    } catch (err) {
      console.warn("Error fetching data from Supabase:", err);
      return {
        applications: null,
        profiles: null,
        accommodations: null,
        requests: null,
        matches: null,
        settings: null,
        ads: null,
        auditLogs: null,
      };
    }
  },

  // ---------------------------------------------------------------------------
  // 1. INFLUENCER APPLICATIONS
  // ---------------------------------------------------------------------------
  async insertApplication(app: InfluencerApplication): Promise<boolean> {
    try {
      const { error } = await supabase.from("influencer_applications").insert(app);
      if (error) {
        // If column avatar_url does not exist yet in legacy table schema, retry without it
        if (error.message?.includes("avatar_url")) {
          const { avatar_url, ...rest } = app;
          const { error: retryError } = await supabase.from("influencer_applications").insert(rest);
          if (retryError) {
            console.error("Supabase insertApplication retry error:", retryError);
            return false;
          }
          return true;
        }
        console.error("Supabase insertApplication error:", error);
        return false;
      }
      return true;
    } catch (err) {
      console.error("Supabase insertApplication exception:", err);
      return false;
    }
  },

  async updateApplication(id: string, updates: Partial<InfluencerApplication>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("influencer_applications")
        .update(updates)
        .eq("id", id);
      if (error) {
        console.error("Supabase updateApplication error:", error);
        return false;
      }
      return true;
    } catch (err) {
      console.error("Supabase updateApplication exception:", err);
      return false;
    }
  },

  async deleteApplication(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("influencer_applications")
        .delete()
        .eq("id", id);
      if (error) {
        console.error("Supabase deleteApplication error:", error);
        return false;
      }
      return true;
    } catch (err) {
      console.error("Supabase deleteApplication exception:", err);
      return false;
    }
  },

  // ---------------------------------------------------------------------------
  // 2. INFLUENCER PROFILES
  // ---------------------------------------------------------------------------
  async upsertProfile(profile: InfluencerProfile): Promise<boolean> {
    try {
      const { error } = await supabase.from("influencer_profiles").upsert(profile);
      if (error) {
        console.error("Supabase upsertProfile error:", error);
        return false;
      }
      return true;
    } catch (err) {
      console.error("Supabase upsertProfile exception:", err);
      return false;
    }
  },

  async deleteProfileByApplicationId(applicationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("influencer_profiles")
        .delete()
        .eq("application_id", applicationId);
      if (error) {
        console.error("Supabase deleteProfileByApplicationId error:", error);
        return false;
      }
      return true;
    } catch (err) {
      console.error("Supabase deleteProfileByApplicationId exception:", err);
      return false;
    }
  },

  async deleteProfile(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("influencer_profiles")
        .delete()
        .eq("id", id);
      if (error) {
        console.error("Supabase deleteProfile error:", error);
        return false;
      }
      return true;
    } catch (err) {
      console.error("Supabase deleteProfile exception:", err);
      return false;
    }
  },

  // ---------------------------------------------------------------------------
  // 3. ACCOMMODATION APPLICATIONS
  // ---------------------------------------------------------------------------
  async insertAccommodation(acc: AccommodationApplication): Promise<boolean> {
    try {
      const { error } = await supabase.from("accommodation_applications").insert(acc);
      if (error) {
        console.error("Supabase insertAccommodation error:", error);
        return false;
      }
      return true;
    } catch (err) {
      console.error("Supabase insertAccommodation exception:", err);
      return false;
    }
  },

  async updateAccommodation(id: string, updates: Partial<AccommodationApplication>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("accommodation_applications")
        .update(updates)
        .eq("id", id);
      if (error) {
        console.error("Supabase updateAccommodation error:", error);
        return false;
      }
      return true;
    } catch (err) {
      console.error("Supabase updateAccommodation exception:", err);
      return false;
    }
  },

  async deleteAccommodation(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("accommodation_applications")
        .delete()
        .eq("id", id);
      if (error) {
        console.error("Supabase deleteAccommodation error:", error);
        return false;
      }
      return true;
    } catch (err) {
      console.error("Supabase deleteAccommodation exception:", err);
      return false;
    }
  },

  // ---------------------------------------------------------------------------
  // 4. CREATOR REQUESTS
  // ---------------------------------------------------------------------------
  async insertRequest(req: CreatorRequest): Promise<boolean> {
    try {
      const { error } = await supabase.from("creator_requests").insert(req);
      if (error) {
        console.error("Supabase insertRequest error:", error);
        return false;
      }
      return true;
    } catch (err) {
      console.error("Supabase insertRequest exception:", err);
      return false;
    }
  },

  async updateRequest(id: string, updates: Partial<CreatorRequest>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("creator_requests")
        .update(updates)
        .eq("id", id);
      if (error) {
        console.error("Supabase updateRequest error:", error);
        return false;
      }
      return true;
    } catch (err) {
      console.error("Supabase updateRequest exception:", err);
      return false;
    }
  },

  async deleteRequest(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("creator_requests")
        .delete()
        .eq("id", id);
      if (error) {
        console.error("Supabase deleteRequest error:", error);
        return false;
      }
      return true;
    } catch (err) {
      console.error("Supabase deleteRequest exception:", err);
      return false;
    }
  },

  // ---------------------------------------------------------------------------
  // 5. MATCHES
  // ---------------------------------------------------------------------------
  async insertMatch(match: Match): Promise<boolean> {
    try {
      const { error } = await supabase.from("matches").insert(match);
      if (error) {
        console.error("Supabase insertMatch error:", error);
        return false;
      }
      return true;
    } catch (err) {
      console.error("Supabase insertMatch exception:", err);
      return false;
    }
  },

  async updateMatch(id: string, updates: Partial<Match>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("matches")
        .update(updates)
        .eq("id", id);
      if (error) {
        console.error("Supabase updateMatch error:", error);
        return false;
      }
      return true;
    } catch (err) {
      console.error("Supabase updateMatch exception:", err);
      return false;
    }
  },

  async deleteMatch(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("matches")
        .delete()
        .eq("id", id);
      if (error) {
        console.error("Supabase deleteMatch error:", error);
        return false;
      }
      return true;
    } catch (err) {
      console.error("Supabase deleteMatch exception:", err);
      return false;
    }
  },

  // ---------------------------------------------------------------------------
  // 6. PLATFORM SETTINGS
  // ---------------------------------------------------------------------------
  async upsertSettings(settings: PlatformSettings): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("platform_settings")
        .upsert({ ...settings, id: "global" });
      if (error) {
        // If columns do not exist in Supabase schema cache yet, strip location fields and upsert core fields
        if (error.code === "PGRST204" || error.message?.includes("column")) {
          console.warn(
            "Supabase platform_settings table lacks location columns. Please run migration in supabase/schema.sql. Retrying with core fields."
          );
          const {
            allowed_creator_locations,
            allowed_villa_locations,
            custom_locations,
            ...coreSettings
          } = settings;
          const { error: retryError } = await supabase
            .from("platform_settings")
            .upsert({ ...coreSettings, id: "global" });
          if (retryError) {
            console.error("Supabase upsertSettings core fallback error:", retryError);
            return false;
          }
          return true;
        }
        console.error("Supabase upsertSettings error:", error);
        return false;
      }
      return true;
    } catch (err) {
      console.error("Supabase upsertSettings exception:", err);
      return false;
    }
  },

  // ---------------------------------------------------------------------------
  // 7. ADVERTISEMENTS
  // ---------------------------------------------------------------------------
  async insertAdvertisement(ad: Advertisement): Promise<boolean> {
    try {
      const { error } = await supabase.from("advertisements").insert(ad);
      if (error) {
        console.error("Supabase insertAdvertisement error:", error);
        return false;
      }
      return true;
    } catch (err) {
      console.error("Supabase insertAdvertisement exception:", err);
      return false;
    }
  },

  async updateAdvertisement(id: string, updates: Partial<Advertisement>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("advertisements")
        .update(updates)
        .eq("id", id);
      if (error) {
        console.error("Supabase updateAdvertisement error:", error);
        return false;
      }
      return true;
    } catch (err) {
      console.error("Supabase updateAdvertisement exception:", err);
      return false;
    }
  },

  async deleteAdvertisement(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("advertisements")
        .delete()
        .eq("id", id);
      if (error) {
        console.error("Supabase deleteAdvertisement error:", error);
        return false;
      }
      return true;
    } catch (err) {
      console.error("Supabase deleteAdvertisement exception:", err);
      return false;
    }
  },

  // ---------------------------------------------------------------------------
  // 8. ADMIN AUDIT LOGS
  // ---------------------------------------------------------------------------
  async insertAuditLog(log: AdminAuditLog): Promise<boolean> {
    try {
      const { error } = await supabase.from("admin_audit_logs").insert(log);
      if (error) {
        console.error("Supabase insertAuditLog error:", error);
        return false;
      }
      return true;
    } catch (err) {
      console.error("Supabase insertAuditLog exception:", err);
      return false;
    }
  },

  // ---------------------------------------------------------------------------
  // 9. REALTIME SUBSCRIPTION
  // ---------------------------------------------------------------------------
  subscribeToChanges(onChange: () => void) {
    const channel = supabase
      .channel("getlinked-db-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public" },
        () => {
          onChange();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  // ---------------------------------------------------------------------------
  // 10. SUPABASE STORAGE (Bucket: images)
  // ---------------------------------------------------------------------------
  /**
   * Generic upload helper for images and assets into Supabase 'images' bucket.
   */
  async uploadImage(
    file: File,
    folder: "properties" | "avatars" | "documents" = "properties"
  ): Promise<{ url: string | null; error?: string }> {
    try {
      const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const cleanFileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;

      const { error } = await supabase.storage
        .from("images")
        .upload(cleanFileName, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (error) {
        console.warn(`Supabase Storage upload error in ${folder}:`, error);
        return { url: null, error: error.message };
      }

      const { data: publicData } = supabase.storage
        .from("images")
        .getPublicUrl(cleanFileName);

      return { url: publicData.publicUrl };
    } catch (err: any) {
      console.warn(`Supabase Storage upload exception in ${folder}:`, err);
      return { url: null, error: err?.message || "Storage upload failed" };
    }
  },

  async uploadPropertyImage(file: File): Promise<{ url: string | null; error?: string }> {
    return this.uploadImage(file, "properties");
  },

  async uploadAvatar(file: File): Promise<{ url: string | null; error?: string }> {
    return this.uploadImage(file, "avatars");
  },

  async uploadDocument(file: File): Promise<{ url: string | null; error?: string }> {
    return this.uploadImage(file, "documents");
  },
};
