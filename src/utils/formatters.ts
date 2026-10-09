export function formatFollowerCount(count: number): string {
  if (count >= 1_000_000) {
    return `${(count / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  }
  if (count >= 1_000) {
    return `${(count / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  }
  return count.toLocaleString();
}

export function formatDateRange(start: string, end: string): string {
  if (!start && !end) return "Flexible";
  if (start && !end) {
    try {
      return new Date(start).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch {
      return start;
    }
  }
  try {
    const s = new Date(start);
    const e = new Date(end);
    const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
    // Single visit date (e.g. dining reservation or same-day event)
    if (start === end || s.toDateString() === e.toDateString()) {
      return s.toLocaleDateString("en-US", { ...options, year: "numeric" });
    }
    const sFormatted = s.toLocaleDateString("en-US", options);
    const eFormatted = e.toLocaleDateString("en-US", { ...options, year: "numeric" });
    return `${sFormatted} - ${eFormatted}`;
  } catch {
    return `${start} to ${end}`;
  }
}

import {
  extractGoogleDriveFileId,
  extractGoogleDriveFolderId,
  getGoogleDriveImageUrl,
  getGoogleDrivePreviewUrl,
  isGoogleDriveUrl,
  GETLINKED_DRIVE_FOLDER_ID,
  GETLINKED_DRIVE_FOLDER_URL,
} from "./googleDrive";

export {
  extractGoogleDriveFileId,
  extractGoogleDriveFolderId,
  getGoogleDriveImageUrl,
  getGoogleDrivePreviewUrl,
  isGoogleDriveUrl,
  GETLINKED_DRIVE_FOLDER_ID,
  GETLINKED_DRIVE_FOLDER_URL,
};

/**
 * Resolves a media image reference or URL into a fully-qualified public URL.
 * Handles Google Drive links (converted to high-res Google CDN), full URLs (https://...),
 * and local web paths (/images/...).
 * Note: Media is stored exclusively in Google Drive, not Supabase storage buckets.
 */
export function formatStorageUrl(pathOrUrl?: string, defaultFolder: "avatars" | "properties" = "avatars"): string {
  if (!pathOrUrl) return "";

  // 1. Handle Google Drive file URLs and bare IDs (Primary Media Engine)
  if (isGoogleDriveUrl(pathOrUrl)) {
    const driveFileId = extractGoogleDriveFileId(pathOrUrl);
    if (driveFileId) {
      return getGoogleDriveImageUrl(driveFileId, 1600);
    }
  }

  // 2. Full HTTP/HTTPS URLs or Data URLs
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://") || pathOrUrl.startsWith("data:")) {
    return pathOrUrl;
  }

  // 3. Local relative paths (e.g. /images/galle.jpg)
  if (pathOrUrl.startsWith("/")) {
    return pathOrUrl;
  }

  // 4. Default high-quality fallback placeholders
  return defaultFolder === "avatars"
    ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
    : "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80";
}

export const SRI_LANKA_CITIES = [
  "All Sri Lanka",
  "Adam's Peak / Nallathanniya",
  "Ahangama",
  "Ahungalla",
  "Alankuda",
  "Ambalangoda",
  "Ampara",
  "Anuradhapura",
  "Arugam Bay",
  "Badulla",
  "Balapitiya",
  "Bandarawela",
  "Batticaloa",
  "Bentota",
  "Beruwala",
  "Bundala",
  "Buttala",
  "Chilaw",
  "Colombo",
  "Dambulla",
  "Dehiwala",
  "Delft Island",
  "Deniyaya",
  "Digana",
  "Dikwella",
  "Ella",
  "Embilipitiya",
  "Galle",
  "Gampaha",
  "Gampola",
  "Habarana",
  "Hambantota",
  "Hantana",
  "Haputale",
  "Hatton",
  "Hikkaduwa",
  "Hiriketiya",
  "Horton Plains / Ohiya",
  "Induruwa",
  "Ja-Ela",
  "Jaffna",
  "Kalpitiya",
  "Kalutara",
  "Kandy",
  "Kataragama",
  "Kegalle",
  "Kelaniya",
  "Kilinochchi",
  "Kitulgala",
  "Knuckles / Rangala",
  "Koggala",
  "Kotmale",
  "Kurunegala",
  "Mannar",
  "Marawila",
  "Maskeliya",
  "Matale",
  "Matara",
  "Midigama",
  "Mihintale",
  "Minneriya",
  "Mirissa",
  "Monaragala",
  "Moratuwa",
  "Mount Lavinia",
  "Mullaitivu",
  "Nawalapitiya",
  "Negombo",
  "Nilaveli",
  "Nuwara Eliya",
  "Panadura",
  "Pasikudah",
  "Point Pedro",
  "Polonnaruwa",
  "Pottuvil",
  "Puttalam",
  "Ranna",
  "Ratnapura",
  "Rekawa",
  "Sigiriya",
  "Sinharaja",
  "Talaimannar",
  "Talawakele",
  "Tangalle",
  "Thalpe",
  "Trincomalee",
  "Udawalawe",
  "Unawatuna",
  "Uppuveli",
  "Vavuniya",
  "Wadduwa",
  "Wattala",
  "Weligama",
  "Wellawaya",
  "Wilpattu",
  "Yala / Tissamaharama",
  "Yapahuwa",
] as const;

export const DEFAULT_ALLOWED_LOCATIONS: string[] = SRI_LANKA_CITIES.filter(
  (c) => c !== "All Sri Lanka"
);

export function getAllAvailableLocations(customLocations?: string[]): string[] {
  const base = SRI_LANKA_CITIES.filter((c) => c !== "All Sri Lanka") as string[];
  if (!customLocations || customLocations.length === 0) return base;
  return Array.from(new Set([...base, ...customLocations]));
}

export const CREATOR_NICHES = [
  "Travel",
  "Food",
  "Lifestyle",
  "Fashion & Beauty",
  "Fitness & Wellness",
  "Family & Kids",
  "Other",
] as const;

export const STAY_VENUE_TYPES = [
  "Hotel",
  "Villa",
  "Guesthouse",
  "Resort",
  "Boutique Hotel",
  "Eco Lodge",
] as const;

export const EATS_VENUE_TYPES = [
  "Restaurant",
  "Café",
  "Bar",
  "Bistro",
  "Bakery / Dessert Bar",
  "Beach Club / Sunset Bar",
] as const;

export const PROPERTY_TYPES = [
  ...STAY_VENUE_TYPES,
  ...EATS_VENUE_TYPES,
  "Cafe / Bistro",
] as const;

export const STAY_OFFER_TYPES = [
  "Free accommodation only",
  "Free accommodation + meals",
  "Paid collaboration",
  "Flexible / open to negotiate",
] as const;

export const EATS_OFFER_TYPES = [
  "Chef's Tasting Menu (Complimentary)",
  "Dinner for Two",
  "Lunch for Two",
  "Signature Dining & Drinks Experience",
  "Cocktails & Small Plates",
  "Complimentary Dining + Paid Collaboration",
  "Flexible / open to negotiate",
] as const;

export const OFFER_TYPES = [
  ...STAY_OFFER_TYPES,
  "Chef's Tasting Menu (Complimentary)",
  "Dinner for Two",
  "Lunch for Two",
  "Signature Dining & Drinks Experience",
  "Cocktails & Small Plates",
  "Complimentary Dining + Paid Collaboration",
] as const;

export function isEatVenue(type?: string): boolean {
  if (!type) return false;
  const t = type.toLowerCase();
  return (
    t.includes("restaurant") ||
    t.includes("caf") ||
    t.includes("bar") ||
    t.includes("bistro") ||
    t.includes("bakery") ||
    t.includes("dessert") ||
    t.includes("dining") ||
    t.includes("eats")
  );
}
