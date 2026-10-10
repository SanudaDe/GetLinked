export type PlatformPhase = "FREE" | "PAID";
export type BillingMode = "none" | "per_match" | "subscription";
export type DirectoryVisibility = "PUBLIC" | "RESTRICTED";

export type ApplicationStatus = "PENDING" | "APPROVED" | "REJECTED";
export type RequestStatus = "PENDING" | "REVIEWING" | "MATCHED" | "DECLINED" | "CANCELLED";
export type MatchStatus = "PROPOSED" | "CONFIRMED" | "INTRODUCED" | "DECLINED" | "CANCELLED";
export type MatchSource = "REQUEST" | "ADMIN";

export type DocumentType = "NATIONAL_ID" | "PASSPORT";

export type NicheType = 
  | "Travel"
  | "Food"
  | "Lifestyle"
  | "Fashion & Beauty"
  | "Fitness & Wellness"
  | "Family & Kids"
  | "Other";

export type VenueCategory = "STAYS" | "EATS";

export type PropertyType =
  | "Hotel"
  | "Villa"
  | "Guesthouse"
  | "Resort"
  | "Boutique Hotel"
  | "Eco Lodge"
  | "Restaurant"
  | "Café"
  | "Bar"
  | "Bistro"
  | "Bakery / Dessert Bar"
  | "Beach Club / Sunset Bar"
  | "Cafe / Bistro";

export type OfferType =
  | "Free accommodation only"
  | "Free accommodation + meals"
  | "Paid collaboration"
  | "Flexible / open to negotiate"
  | "Chef's Tasting Menu (Complimentary)"
  | "Dinner for Two"
  | "Lunch for Two"
  | "Signature Dining & Drinks Experience"
  | "Cocktails & Small Plates"
  | "Complimentary Dining + Paid Collaboration";

export type AdPlacement = "HOME" | "ACCOMMODATION_PAGES";

export interface InfluencerApplication {
  id: string;
  reference_code: string; // e.g. GL-C-8921
  full_name: string;
  age: number; // >= 18
  whatsapp: string; // private, never public
  country: string;
  document_type: DocumentType;
  document_reference: string; // ID/Passport number - private
  document_url?: string; // Private storage reference
  document_filename?: string;
  document_size?: string;
  social_url: string;
  avatar_url?: string; // Creator public profile photo
  follower_count: number; // >= 5,000
  niche: NicheType;
  city: string; // Sri Lankan city
  visit_start: string; // YYYY-MM-DD
  visit_end: string;   // YYYY-MM-DD
  trip_brief: string;
  status: ApplicationStatus;
  is_duplicate?: boolean;
  duplicate_reason?: string;
  admin_notes?: string;
  reviewed_at?: string;
  reviewed_by?: string;
  created_at: string;
  updated_at: string;
}

export interface InfluencerProfile {
  id: string;
  application_id: string;
  display_name: string;
  niche: NicheType;
  city: string;
  visit_start: string;
  visit_end: string;
  follower_count: number;
  social_url: string;
  avatar_url?: string;
  trip_brief: string;
  is_active: boolean;
  created_at: string;
}

export interface AccommodationApplication {
  id: string;
  reference_code: string; // e.g. GL-A-4102
  accommodation_name: string;
  property_type: PropertyType;
  contact_person: string;
  whatsapp: string; // private
  email?: string;
  city: string; // Sri Lankan city
  coverage_start: string;
  coverage_end: string;
  offer_type: OfferType;
  minimum_followers: number; // e.g. 5000, 10000, 50000
  requirements: string;
  image_url?: string; // Primary cover photo URL
  images?: string[];  // Additional property gallery photos
  video_url?: string; // Google Drive video reel or MP4 tour URL
  drive_folder_url?: string; // Connected Google Drive folder link
  status: ApplicationStatus;
  is_duplicate?: boolean;
  admin_notes?: string;
  reviewed_at?: string;
  reviewed_by?: string;
  created_at: string;
  updated_at: string;
}

export interface AccommodationListing {
  id: string;
  application_id: string;
  accommodation_name: string;
  property_type: PropertyType;
  contact_person: string;
  whatsapp: string;
  city: string;
  coverage_start: string;
  coverage_end: string;
  offer_type: OfferType;
  minimum_followers: number;
  requirements: string;
  image_url?: string;
  images?: string[];
  video_url?: string;
  drive_folder_url?: string;
  is_active: boolean;
  created_at: string;
}

export interface CreatorRequest {
  id: string;
  creator_id: string;
  creator_name: string;
  creator_niche: string;
  creator_city: string;
  accommodation_id?: string;
  accommodation_name: string;
  requester_name: string;
  requester_whatsapp: string;
  message?: string;
  status: RequestStatus;
  source: "DIRECTORY" | "DIRECT";
  created_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
}

export interface Match {
  id: string;
  creator_id: string;
  creator_name: string;
  creator_whatsapp: string;
  creator_niche: string;
  accommodation_id: string;
  accommodation_name: string;
  accommodation_contact: string;
  accommodation_whatsapp: string;
  accommodation_city: string;
  request_id?: string;
  match_source: MatchSource;
  status: MatchStatus;
  admin_notes?: string;
  created_at: string;
  confirmed_at?: string;
  introduced_at?: string;
  confirmed_by?: string;
}

export interface PlatformSettings {
  id: "global";
  platform_phase: PlatformPhase;
  billing_mode: BillingMode;
  creator_pool_limit: number;
  directory_visibility: DirectoryVisibility;
  document_retention_days: number;
  allowed_creator_locations?: string[];
  allowed_villa_locations?: string[];
  custom_locations?: string[];
  updated_at: string;
}

export interface Advertisement {
  id: string;
  title: string;
  image_url: string;
  destination_url: string;
  placement: AdPlacement;
  is_active: boolean;
  start_date: string;
  end_date: string;
  sponsor_name: string;
}

export interface AdminAuditLog {
  id: string;
  admin_email: string;
  action: string;
  entity_type: string;
  entity_id: string;
  previous_status?: string;
  new_status?: string;
  details: string;
  timestamp: string;
}

export type MediaCategory = "PHOTO" | "VIDEO" | "DOCUMENT" | "AVATAR" | "OTHER";
export type MediaVisibility = "PRIVATE" | "PUBLIC";
export type UploadStatus = "PENDING" | "COMPLETED" | "FAILED";

export interface UserMedia {
  id: string;
  owner_user_id: string;
  title: string;
  original_filename: string;
  storage_filename: string;
  category: MediaCategory;
  mime_type: string;
  file_size: number;
  drive_file_id: string;
  drive_parent_folder_id: string;
  visibility: MediaVisibility;
  upload_status: UploadStatus;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}
