-- ==============================================================================
-- GET LINKED — PRODUCTION POSTGRESQL / SUPABASE DATABASE SCHEMA
-- Domains: getlinkedlk.com | getlinked.today
-- Architecture: Supabase Database for Public Marketplace & Staff Operations
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- 1. INFLUENCER APPLICATIONS TABLE (Full Submission Data)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS influencer_applications (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  reference_code TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  age INTEGER NOT NULL,
  whatsapp TEXT NOT NULL,
  country TEXT NOT NULL,
  document_type TEXT NOT NULL DEFAULT 'PASSPORT',
  document_reference TEXT NOT NULL,
  document_url TEXT,
  document_filename TEXT,
  document_size TEXT,
  social_url TEXT NOT NULL,
  avatar_url TEXT,
  follower_count INTEGER NOT NULL,
  niche TEXT NOT NULL,
  city TEXT NOT NULL,
  visit_start DATE NOT NULL,
  visit_end DATE NOT NULL,
  trip_brief TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
  is_duplicate BOOLEAN DEFAULT FALSE,
  duplicate_reason TEXT,
  admin_notes TEXT,
  reviewed_at TIMESTAMPTZ,
  reviewed_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 2. INFLUENCER PROFILES TABLE (Public Directory)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS influencer_profiles (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  application_id TEXT,
  display_name TEXT NOT NULL,
  niche TEXT NOT NULL,
  city TEXT NOT NULL,
  visit_start DATE NOT NULL,
  visit_end DATE NOT NULL,
  follower_count INTEGER NOT NULL,
  social_url TEXT NOT NULL,
  avatar_url TEXT,
  trip_brief TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 3. ACCOMMODATION APPLICATIONS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS accommodation_applications (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  reference_code TEXT UNIQUE NOT NULL,
  accommodation_name TEXT NOT NULL,
  property_type TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  email TEXT,
  city TEXT NOT NULL,
  coverage_start DATE NOT NULL,
  coverage_end DATE NOT NULL,
  offer_type TEXT NOT NULL,
  minimum_followers INTEGER DEFAULT 5000,
  requirements TEXT NOT NULL,
  image_url TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
  is_duplicate BOOLEAN DEFAULT FALSE,
  admin_notes TEXT,
  reviewed_at TIMESTAMPTZ,
  reviewed_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure columns exist if table was already created earlier
ALTER TABLE accommodation_applications ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE accommodation_applications ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;

-- ------------------------------------------------------------------------------
-- 4. CREATOR REQUESTS TABLE (Accommodation -> Creator Inbound Requests)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS creator_requests (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  creator_id TEXT NOT NULL,
  creator_name TEXT NOT NULL,
  creator_niche TEXT NOT NULL,
  creator_city TEXT NOT NULL,
  accommodation_id TEXT,
  accommodation_name TEXT NOT NULL,
  requester_name TEXT NOT NULL,
  requester_whatsapp TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'REVIEWING', 'MATCHED', 'DECLINED', 'CANCELLED')),
  source TEXT NOT NULL DEFAULT 'DIRECTORY',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by TEXT
);

-- ------------------------------------------------------------------------------
-- 5. MATCHES TABLE (Curated Pairings & Introductions)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS matches (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  creator_id TEXT NOT NULL,
  creator_name TEXT NOT NULL,
  creator_whatsapp TEXT NOT NULL,
  creator_niche TEXT NOT NULL,
  accommodation_id TEXT NOT NULL,
  accommodation_name TEXT NOT NULL,
  accommodation_contact TEXT NOT NULL,
  accommodation_whatsapp TEXT NOT NULL,
  accommodation_city TEXT NOT NULL,
  request_id TEXT,
  match_source TEXT NOT NULL DEFAULT 'ADMIN',
  status TEXT NOT NULL DEFAULT 'CONFIRMED' CHECK (status IN ('PROPOSED', 'CONFIRMED', 'INTRODUCED', 'DECLINED', 'CANCELLED')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ,
  introduced_at TIMESTAMPTZ,
  confirmed_by TEXT
);

-- ------------------------------------------------------------------------------
-- 6. PLATFORM SETTINGS TABLE (Configurable Policies)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS platform_settings (
  id TEXT PRIMARY KEY DEFAULT 'global',
  platform_phase TEXT NOT NULL DEFAULT 'FREE',
  billing_mode TEXT NOT NULL DEFAULT 'none',
  creator_pool_limit INTEGER DEFAULT 1000,
  directory_visibility TEXT NOT NULL DEFAULT 'PUBLIC',
  document_retention_days INTEGER DEFAULT 90,
  allowed_creator_locations JSONB DEFAULT '[]'::jsonb,
  allowed_villa_locations JSONB DEFAULT '[]'::jsonb,
  custom_locations JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure columns exist if table was already created earlier
ALTER TABLE platform_settings ADD COLUMN IF NOT EXISTS allowed_creator_locations JSONB DEFAULT '[]'::jsonb;
ALTER TABLE platform_settings ADD COLUMN IF NOT EXISTS allowed_villa_locations JSONB DEFAULT '[]'::jsonb;
ALTER TABLE platform_settings ADD COLUMN IF NOT EXISTS custom_locations JSONB DEFAULT '[]'::jsonb;

-- ------------------------------------------------------------------------------
-- 7. ADVERTISEMENTS TABLE (Sponsor Banner Campaigns)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS advertisements (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  destination_url TEXT NOT NULL,
  placement TEXT NOT NULL DEFAULT 'HOME',
  is_active BOOLEAN DEFAULT TRUE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  sponsor_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 8. ADMIN AUDIT LOGS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  admin_email TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  previous_status TEXT,
  new_status TEXT,
  details TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- PERFORMANCE INDEXES
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_inf_apps_status ON influencer_applications(status);
CREATE INDEX IF NOT EXISTS idx_inf_apps_ref ON influencer_applications(reference_code);
CREATE INDEX IF NOT EXISTS idx_inf_profs_city ON influencer_profiles(city);
CREATE INDEX IF NOT EXISTS idx_inf_profs_active ON influencer_profiles(is_active);
CREATE INDEX IF NOT EXISTS idx_acc_apps_status ON accommodation_applications(status);
CREATE INDEX IF NOT EXISTS idx_acc_apps_ref ON accommodation_applications(reference_code);
CREATE INDEX IF NOT EXISTS idx_reqs_status ON creator_requests(status);
CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status);
CREATE INDEX IF NOT EXISTS idx_ads_active ON advertisements(is_active);
CREATE INDEX IF NOT EXISTS idx_audit_time ON admin_audit_logs(timestamp DESC);

-- ------------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Enabling RLS with open policies for platform & staff access
-- ------------------------------------------------------------------------------
ALTER TABLE influencer_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE influencer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE accommodation_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE advertisements ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Allow full operational access via anon & service role
DROP POLICY IF EXISTS "Allow public access to influencer_applications" ON influencer_applications;
CREATE POLICY "Allow public access to influencer_applications" ON influencer_applications FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public access to influencer_profiles" ON influencer_profiles;
CREATE POLICY "Allow public access to influencer_profiles" ON influencer_profiles FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public access to accommodation_applications" ON accommodation_applications;
CREATE POLICY "Allow public access to accommodation_applications" ON accommodation_applications FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public access to creator_requests" ON creator_requests;
CREATE POLICY "Allow public access to creator_requests" ON creator_requests FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public access to matches" ON matches;
CREATE POLICY "Allow public access to matches" ON matches FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public access to platform_settings" ON platform_settings;
CREATE POLICY "Allow public access to platform_settings" ON platform_settings FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public access to advertisements" ON advertisements;
CREATE POLICY "Allow public access to advertisements" ON advertisements FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public access to admin_audit_logs" ON admin_audit_logs;
CREATE POLICY "Allow public access to admin_audit_logs" ON admin_audit_logs FOR ALL USING (true) WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- SUPABASE REALTIME REPLICATION
-- ------------------------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'influencer_profiles'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE 
      influencer_applications,
      influencer_profiles,
      accommodation_applications,
      creator_requests,
      matches,
      platform_settings,
      advertisements,
      admin_audit_logs;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    NULL;
END $$;

-- ------------------------------------------------------------------------------
-- SEED INITIAL DATA (Guarantees immediate rich demo data upon creation)
-- ------------------------------------------------------------------------------

-- Platform Settings
INSERT INTO platform_settings (
  id,
  platform_phase,
  billing_mode,
  creator_pool_limit,
  directory_visibility,
  document_retention_days,
  allowed_creator_locations,
  allowed_villa_locations,
  custom_locations
)
VALUES (
  'global',
  'FREE',
  'none',
  1000,
  'PUBLIC',
  90,
  '["Adam''s Peak / Nallathanniya","Ahangama","Ahungalla","Alankuda","Ambalangoda","Ampara","Anuradhapura","Arugam Bay","Badulla","Balapitiya","Bandarawela","Batticaloa","Bentota","Beruwala","Bundala","Buttala","Chilaw","Colombo","Dambulla","Dehiwala","Delft Island","Deniyaya","Digana","Dikwella","Ella","Embilipitiya","Galle","Gampaha","Gampola","Habarana","Hambantota","Hantana","Haputale","Hatton","Hikkaduwa","Hiriketiya","Horton Plains / Ohiya","Induruwa","Ja-Ela","Jaffna","Kalpitiya","Kalutara","Kandy","Kataragama","Kegalle","Kelaniya","Kilinochchi","Kitulgala","Knuckles / Rangala","Koggala","Kotmale","Kurunegala","Mannar","Marawila","Maskeliya","Matale","Matara","Midigama","Mihintale","Minneriya","Mirissa","Monaragala","Moratuwa","Mount Lavinia","Mullaitivu","Nawalapitiya","Negombo","Nilaveli","Nuwara Eliya","Panadura","Pasikudah","Point Pedro","Polonnaruwa","Pottuvil","Puttalam","Ranna","Ratnapura","Rekawa","Sigiriya","Sinharaja","Talaimannar","Talawakele","Tangalle","Thalpe","Trincomalee","Udawalawe","Unawatuna","Uppuveli","Vavuniya","Wadduwa","Wattala","Weligama","Wellawaya","Wilpattu","Yala / Tissamaharama","Yapahuwa"]'::jsonb,
  '["Adam''s Peak / Nallathanniya","Ahangama","Ahungalla","Alankuda","Ambalangoda","Ampara","Anuradhapura","Arugam Bay","Badulla","Balapitiya","Bandarawela","Batticaloa","Bentota","Beruwala","Bundala","Buttala","Chilaw","Colombo","Dambulla","Dehiwala","Delft Island","Deniyaya","Digana","Dikwella","Ella","Embilipitiya","Galle","Gampaha","Gampola","Habarana","Hambantota","Hantana","Haputale","Hatton","Hikkaduwa","Hiriketiya","Horton Plains / Ohiya","Induruwa","Ja-Ela","Jaffna","Kalpitiya","Kalutara","Kandy","Kataragama","Kegalle","Kelaniya","Kilinochchi","Kitulgala","Knuckles / Rangala","Koggala","Kotmale","Kurunegala","Mannar","Marawila","Maskeliya","Matale","Matara","Midigama","Mihintale","Minneriya","Mirissa","Monaragala","Moratuwa","Mount Lavinia","Mullaitivu","Nawalapitiya","Negombo","Nilaveli","Nuwara Eliya","Panadura","Pasikudah","Point Pedro","Polonnaruwa","Pottuvil","Puttalam","Ranna","Ratnapura","Rekawa","Sigiriya","Sinharaja","Talaimannar","Talawakele","Tangalle","Thalpe","Trincomalee","Udawalawe","Unawatuna","Uppuveli","Vavuniya","Wadduwa","Wattala","Weligama","Wellawaya","Wilpattu","Yala / Tissamaharama","Yapahuwa"]'::jsonb,
  '[]'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- Initial Influencer Applications
INSERT INTO influencer_applications (id, reference_code, full_name, age, whatsapp, country, document_type, document_reference, document_filename, document_size, social_url, follower_count, niche, city, visit_start, visit_end, trip_brief, status, created_at)
VALUES
('app-101', 'GL-C-7741', 'Elena Rostova', 26, '+447911123456', 'United Kingdom', 'PASSPORT', 'GB98210344X', 'passport_scan_erostova.pdf', '2.4 MB', 'https://instagram.com/elenatravels', 84200, 'Travel', 'Galle', '2026-10-05', '2026-10-20', 'Creating high-production cinematic reels featuring heritage boutique stays in Galle Fort and coastal villas around Thalpe.', 'APPROVED', NOW() - INTERVAL '10 days'),
('app-102', 'GL-C-8892', 'Marcus Vance', 29, '+61412345678', 'Australia', 'PASSPORT', 'PA88319201L', 'marcus_vance_passport.pdf', '1.8 MB', 'https://instagram.com/marcusvance_surf', 42100, 'Fitness & Wellness', 'Weligama', '2026-10-10', '2026-10-25', 'Focusing on surf retreats, morning yoga, and healthy coastal gastronomy in Weligama & Mirissa.', 'APPROVED', NOW() - INTERVAL '8 days'),
('app-103', 'GL-C-3319', 'Anya & Dev Patel', 31, '+919820123456', 'India', 'PASSPORT', 'Z4920188', 'anya_dev_passports.pdf', '3.1 MB', 'https://instagram.com/couple_wanders', 128000, 'Food', 'Colombo', '2026-10-01', '2026-10-15', 'Exploring modern Ceylon fine dining, street food markets, and luxury hotel tea lounges across Colombo and Kandy.', 'APPROVED', NOW() - INTERVAL '6 days'),
('app-104', 'GL-C-5520', 'Sophie Dubois', 24, '+33612345678', 'France', 'PASSPORT', 'FR77290123', 'sophie_dubois_id.pdf', '1.2 MB', 'https://instagram.com/sophie_in_transit', 63500, 'Fashion & Beauty', 'Ella', '2026-10-15', '2026-10-30', 'Summer editorial lookbook shoot amid tea estates, misty waterfalls, and panoramic view villas in the central highlands.', 'APPROVED', NOW() - INTERVAL '4 days'),
('app-105', 'GL-C-9912', 'Liam & Mia Thorne', 33, '+14155552671', 'United States', 'PASSPORT', 'US910293847', 'thorne_family_docs.pdf', '4.5 MB', 'https://instagram.com/thornefamilytravels', 95400, 'Family & Kids', 'Sigiriya', '2026-11-01', '2026-11-14', 'Cultural triangle exploration with toddlers: wildlife safaris in Minneriya, eco-lodges near Sigiriya Rock, and sustainable stays.', 'APPROVED', NOW() - INTERVAL '2 days'),
('app-106', 'GL-C-6631', 'Chiara Moretti', 27, '+393331234567', 'Italy', 'PASSPORT', 'IT88219034', 'chiara_moretti_passport.pdf', '2.0 MB', 'https://instagram.com/chiaramoretti_ph', 34800, 'Lifestyle', 'Mirissa', '2026-10-12', '2026-10-22', 'Promoting undiscovered southern coves, ethical whale watching, and boutique coastal escapes.', 'PENDING', NOW() - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;

-- Initial Influencer Profiles (Public directory)
INSERT INTO influencer_profiles (id, application_id, display_name, niche, city, visit_start, visit_end, follower_count, social_url, avatar_url, trip_brief, is_active)
VALUES
('prof-101', 'app-101', 'Elena Rostova', 'Travel', 'Galle', '2026-10-05', '2026-10-20', 84200, 'https://instagram.com/elenatravels', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80', 'Creating high-production cinematic reels featuring heritage boutique stays in Galle Fort and coastal villas around Thalpe.', true),
('prof-102', 'app-102', 'Marcus Vance', 'Fitness & Wellness', 'Weligama', '2026-10-10', '2026-10-25', 42100, 'https://instagram.com/marcusvance_surf', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80', 'Focusing on surf retreats, morning yoga, and healthy coastal gastronomy in Weligama & Mirissa.', true),
('prof-103', 'app-103', 'Anya & Dev Patel', 'Food', 'Colombo', '2026-10-01', '2026-10-15', 128000, 'https://instagram.com/couple_wanders', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80', 'Exploring modern Ceylon fine dining, street food markets, and luxury hotel tea lounges across Colombo and Kandy.', true),
('prof-104', 'app-104', 'Sophie Dubois', 'Fashion & Beauty', 'Ella', '2026-10-15', '2026-10-30', 63500, 'https://instagram.com/sophie_in_transit', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80', 'Summer editorial lookbook shoot amid tea estates, misty waterfalls, and panoramic view villas in the central highlands.', true),
('prof-105', 'app-105', 'Liam & Mia Thorne', 'Family & Kids', 'Sigiriya', '2026-11-01', '2026-11-14', 95400, 'https://instagram.com/thornefamilytravels', 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80', 'Cultural triangle exploration with toddlers: wildlife safaris in Minneriya, eco-lodges near Sigiriya Rock, and sustainable stays.', true)
ON CONFLICT (id) DO NOTHING;

-- Initial Accommodation Applications & Listings
INSERT INTO accommodation_applications (id, reference_code, accommodation_name, property_type, contact_person, whatsapp, email, city, coverage_start, coverage_end, offer_type, minimum_followers, requirements, image_url, images, status, created_at)
VALUES
('acc-201', 'GL-A-4102', 'Palm Grove Villa Thalpe', 'Villa', 'Nihal Fernando', '+94771234567', 'stay@palmgrovethalpe.lk', 'Galle', '2026-10-01', '2026-11-15', 'Free accommodation + meals', 30000, '2 Instagram Reels showcasing the private pool & chef dinner experience, plus 1 carousel post tagging property.', 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80', '["https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80"]'::jsonb, 'APPROVED', NOW() - INTERVAL '12 days'),
('acc-202', 'GL-A-5591', 'Ceylon Tea Trails Heritage Bungalow', 'Resort', 'Camilla Senanayake', '+94779876543', 'reservations@ceylonteatrails.lk', 'Hatton', '2026-10-01', '2026-11-30', 'Free accommodation + meals', 50000, 'High-end aesthetic content highlighting colonial tea heritage, morning misty lake views, and afternoon tea service.', 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80', '["https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80"]'::jsonb, 'APPROVED', NOW() - INTERVAL '11 days'),
('acc-203', 'GL-A-8832', 'Weligama Surf House & Suites', 'Boutique Hotel', 'Kasun Jayawardena', '+94712345678', 'hello@weligamasurfhouse.com', 'Weligama', '2026-10-05', '2026-10-25', 'Free accommodation only', 20000, 'Dynamic surf reels, pool lifestyle imagery, and Google Review mentioning the rooftop sunset bar.', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80', '["https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80"]'::jsonb, 'APPROVED', NOW() - INTERVAL '9 days'),
('acc-204', 'GL-A-9921', 'Ella Cloud Edge Sanctuary', 'Eco Lodge', 'Dilan Wickramasinghe', '+94765432109', 'stay@ellacloudedge.com', 'Ella', '2026-10-10', '2026-11-10', 'Paid collaboration', 40000, 'Travel creator willing to shoot 4K drone footage of our cliffside infinity pool overlooking Ella Rock.', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80', '["https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80"]'::jsonb, 'APPROVED', NOW() - INTERVAL '7 days'),
('acc-205', 'GL-A-1102', 'The Colombo Residence 1920', 'Hotel', 'Sunil Perera', '+94701234567', 'gm@colomboresidence.lk', 'Colombo', '2026-10-01', '2026-10-31', 'Flexible / open to negotiate', 15000, 'Coverage of Sunday Brunch and courtyard evening cocktail lounge for young affluent travelers.', 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80', '["https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80"]'::jsonb, 'APPROVED', NOW() - INTERVAL '5 days'),
('acc-206', 'GL-A-7744', 'Sigiriya Water Garden Lodge', 'Resort', 'Anura Dissanayake', '+94781234567', 'info@sigiriyawatergarden.lk', 'Sigiriya', '2026-10-15', '2026-11-20', 'Free accommodation + meals', 25000, 'Nature, eco-luxury, and family friendly stays. 1 dedicated reel on private plunge villa.', 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80', '["https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80"]'::jsonb, 'PENDING', NOW() - INTERVAL '2 days')
ON CONFLICT (id) DO NOTHING;

-- Initial Creator Requests
INSERT INTO creator_requests (id, creator_id, creator_name, creator_niche, creator_city, accommodation_name, requester_name, requester_whatsapp, message, status, source, created_at)
VALUES
('req-501', 'prof-101', 'Elena Rostova', 'Travel', 'Galle', 'Palm Grove Villa Thalpe', 'Nihal Fernando', '+94771234567', 'Hi Elena, we loved your recent work in Bali. We would love to host you for 3 nights in our ocean suite with full board.', 'MATCHED', 'DIRECTORY', NOW() - INTERVAL '4 days'),
('req-502', 'prof-102', 'Marcus Vance', 'Fitness & Wellness', 'Weligama', 'Weligama Surf House & Suites', 'Kasun Jayawardena', '+94712345678', 'Hey Marcus! We have a private surf villa right on the reef break. Free 4 nights stay during your October dates.', 'PENDING', 'DIRECTORY', NOW() - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;

-- Initial Matches
INSERT INTO matches (id, creator_id, creator_name, creator_whatsapp, creator_niche, accommodation_id, accommodation_name, accommodation_contact, accommodation_whatsapp, accommodation_city, request_id, match_source, status, created_at, confirmed_at, introduced_at, confirmed_by)
VALUES
('match-801', 'app-101', 'Elena Rostova', '+447911123456', 'Travel', 'acc-201', 'Palm Grove Villa Thalpe', 'Nihal Fernando', '+94771234567', 'Galle', 'req-501', 'REQUEST', 'INTRODUCED', NOW() - INTERVAL '3 days', NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day', 'admin@getlinked.today')
ON CONFLICT (id) DO NOTHING;

-- Initial Advertisements
INSERT INTO advertisements (id, title, image_url, destination_url, placement, is_active, start_date, end_date, sponsor_name)
VALUES
('ad-001', 'Experience Sri Lanka with Ceylon Tourism — Discover Hidden Gems', 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80', 'https://srilanka.travel', 'HOME', true, '2026-09-01', '2026-12-31', 'Sri Lanka Tourism Promotion Bureau'),
('ad-002', 'Cinnamon Air — Fast Domestic Sea Plane Transfers', 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=1200&q=80', 'https://www.cinnamonair.com', 'ACCOMMODATION_PAGES', true, '2026-09-15', '2026-11-15', 'Cinnamon Air')
ON CONFLICT (id) DO NOTHING;

-- Initial Audit Logs
INSERT INTO admin_audit_logs (id, admin_email, action, entity_type, entity_id, previous_status, new_status, details, timestamp)
VALUES
('log-001', 'admin@getlinked.today', 'APPROVE_CREATOR', 'CREATOR_APPLICATION', 'app-101', 'PENDING', 'APPROVED', 'Verified UK Passport and active Instagram engagement rate (>4.2%).', NOW() - INTERVAL '10 days'),
('log-002', 'admin@getlinked.today', 'APPROVE_ACCOMMODATION', 'ACCOMMODATION_APPLICATION', 'acc-201', 'PENDING', 'APPROVED', 'Verified Thalpe villa registration and host contact on WhatsApp.', NOW() - INTERVAL '9 days'),
('log-003', 'admin@getlinked.today', 'CONFIRM_MATCH', 'MATCH', 'match-801', 'PROPOSED', 'INTRODUCED', 'Curated introduction sent via official WhatsApp Concierge.', NOW() - INTERVAL '1 day')
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------------------------
-- SUPABASE STORAGE: IMAGES BUCKET SETUP & POLICIES
-- ------------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public can upload to images bucket" ON storage.objects;
CREATE POLICY "Public can upload to images bucket" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'images');

DROP POLICY IF EXISTS "Public can view images bucket" ON storage.objects;
CREATE POLICY "Public can view images bucket" ON storage.objects
FOR SELECT USING (bucket_id = 'images');

DROP POLICY IF EXISTS "Public can update images bucket" ON storage.objects;
CREATE POLICY "Public can update images bucket" ON storage.objects
FOR UPDATE USING (bucket_id = 'images') WITH CHECK (bucket_id = 'images');

DROP POLICY IF EXISTS "Public can delete images bucket" ON storage.objects;
CREATE POLICY "Public can delete images bucket" ON storage.objects
FOR DELETE USING (bucket_id = 'images');
