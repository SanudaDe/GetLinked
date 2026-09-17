-- ==============================================================================
-- GET LINKED — PRODUCTION POSTGRESQL / SUPABASE DATABASE SCHEMA
-- Domains: getlinkedlk.com | getlinked.today
-- Architecture: Shared database for Public Marketplace & Secure Staff Operations
-- Sri Lanka PDPA Compliant & Air-Gapped Verification Data
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. ADMINS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'STAFF' CHECK (role IN ('SUPER_ADMIN', 'STAFF', 'MODERATOR')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 2. INFLUENCER APPLICATIONS TABLE (Full Private Submission Data)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS influencer_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference_code VARCHAR(50) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 18),
  country VARCHAR(100) NOT NULL,
  whatsapp VARCHAR(50) NOT NULL,
  primary_social_url TEXT NOT NULL,
  follower_count INTEGER NOT NULL CHECK (follower_count >= 5000),
  niche VARCHAR(100) NOT NULL,
  sri_lanka_city VARCHAR(100) NOT NULL,
  visit_start DATE NOT NULL,
  visit_end DATE NOT NULL,
  trip_brief TEXT NOT NULL,
  id_document_type VARCHAR(50) NOT NULL CHECK (id_document_type IN ('PASSPORT', 'NATIONAL_ID')),
  id_document_path TEXT NOT NULL, -- Private object storage path (Never in /public)
  consent_pdpa BOOLEAN NOT NULL DEFAULT TRUE,
  status VARCHAR(50) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
  admin_notes TEXT,
  possible_duplicate BOOLEAN DEFAULT FALSE,
  duplicate_of UUID REFERENCES influencer_applications(id),
  reviewed_at TIMESTAMPTZ,
  reviewed_by VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT check_creator_visit_dates CHECK (visit_end >= visit_start)
);

-- ------------------------------------------------------------------------------
-- 3. INFLUENCER PROFILES TABLE (Public Sanitized Directory — Zero Private Data)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS influencer_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID UNIQUE NOT NULL REFERENCES influencer_applications(id) ON DELETE CASCADE,
  display_name VARCHAR(255) NOT NULL,
  niche VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  visit_start DATE NOT NULL,
  visit_end DATE NOT NULL,
  follower_count INTEGER NOT NULL,
  primary_platform VARCHAR(50) DEFAULT 'Instagram',
  trip_brief TEXT NOT NULL,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  rating NUMERIC(2,1) DEFAULT 9.9,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 4. VERIFICATION DOCUMENTS TABLE (Private Vault Metadata & Retention)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS verification_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID NOT NULL REFERENCES influencer_applications(id) ON DELETE CASCADE,
  document_type VARCHAR(50) NOT NULL,
  storage_bucket VARCHAR(100) NOT NULL DEFAULT 'private-verification-docs',
  file_path TEXT NOT NULL, -- Randomized UUID filename
  mime_type VARCHAR(100) NOT NULL,
  file_size_bytes INTEGER NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ -- For PDPA automated retention purge
);

-- ------------------------------------------------------------------------------
-- 5. ACCOMMODATION APPLICATIONS & LISTINGS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS accommodation_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference_code VARCHAR(50) UNIQUE NOT NULL,
  accommodation_name VARCHAR(255) NOT NULL,
  property_type VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  contact_person VARCHAR(255) NOT NULL,
  whatsapp VARCHAR(50) NOT NULL,
  email VARCHAR(255),
  coverage_start DATE NOT NULL,
  coverage_end DATE NOT NULL,
  offer_type VARCHAR(100) NOT NULL CHECK (offer_type IN ('FREE_STAY', 'FREE_STAY_MEALS', 'PAID_COLLAB', 'FLEXIBLE')),
  minimum_followers INTEGER DEFAULT 5000,
  requirements TEXT NOT NULL,
  image_url TEXT,
  status VARCHAR(50) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT check_stay_coverage_dates CHECK (coverage_end >= coverage_start)
);

-- ------------------------------------------------------------------------------
-- 6. CREATOR REQUESTS TABLE (Accommodation -> Creator Inbound Requests)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS creator_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference_code VARCHAR(50) UNIQUE NOT NULL,
  creator_id UUID NOT NULL REFERENCES influencer_applications(id),
  accommodation_name VARCHAR(255) NOT NULL,
  requester_name VARCHAR(255) NOT NULL,
  requester_whatsapp VARCHAR(50) NOT NULL,
  message TEXT,
  status VARCHAR(50) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'REVIEWING', 'MATCHED', 'DECLINED', 'CANCELLED')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 7. MATCHES TABLE (Curated Pairings & Introductions)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID NOT NULL REFERENCES influencer_applications(id),
  accommodation_id UUID NOT NULL REFERENCES accommodation_applications(id),
  request_id UUID REFERENCES creator_requests(id),
  source VARCHAR(50) NOT NULL CHECK (source IN ('REQUEST', 'ADMIN_PROACTIVE')),
  status VARCHAR(50) DEFAULT 'CONFIRMED' CHECK (status IN ('PENDING', 'CONFIRMED', 'INTRODUCED', 'COMPLETED', 'CANCELLED')),
  introduced_at TIMESTAMPTZ,
  admin_email VARCHAR(255),
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 8. ADVERTISEMENTS TABLE (Phase 1 Banner Campaigns)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS advertisements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  image_url TEXT NOT NULL,
  mobile_image_url TEXT,
  destination_url TEXT NOT NULL,
  placement VARCHAR(50) NOT NULL CHECK (placement IN ('HOME', 'ACCOMMODATION_PAGES', 'CREATOR_DIRECTORY')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  clicks_count INTEGER DEFAULT 0,
  impressions_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 9. PLATFORM SETTINGS TABLE (Configurable Business Model & Policies)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS platform_settings (
  id VARCHAR(50) PRIMARY KEY DEFAULT 'current',
  platform_phase VARCHAR(50) DEFAULT 'FREE' CHECK (platform_phase IN ('FREE', 'PAID')),
  billing_mode VARCHAR(50) DEFAULT 'NONE' CHECK (billing_mode IN ('NONE', 'PER_MATCH', 'SUBSCRIPTION')),
  creator_pool_limit INTEGER DEFAULT 1000,
  document_retention_days INTEGER DEFAULT 90,
  directory_visibility VARCHAR(50) DEFAULT 'PUBLIC' CHECK (directory_visibility IN ('PUBLIC', 'RESTRICTED')),
  whatsapp_creator_template TEXT NOT NULL,
  whatsapp_host_template TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 10. ADMIN AUDIT LOGS TABLE (Immutable Staff Audit Trail)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_email VARCHAR(255) NOT NULL,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id VARCHAR(100) NOT NULL,
  previous_status VARCHAR(50),
  new_status VARCHAR(50),
  details TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- INDEXES FOR PERFORMANCE & SEARCH
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_inf_status ON influencer_applications(status);
CREATE INDEX IF NOT EXISTS idx_inf_city_dates ON influencer_applications(sri_lanka_city, visit_start, visit_end);
CREATE INDEX IF NOT EXISTS idx_inf_whatsapp ON influencer_applications(whatsapp);
CREATE INDEX IF NOT EXISTS idx_prof_city ON influencer_profiles(city);
CREATE INDEX IF NOT EXISTS idx_prof_niche ON influencer_profiles(niche);
CREATE INDEX IF NOT EXISTS idx_prof_active ON influencer_profiles(is_active);
CREATE INDEX IF NOT EXISTS idx_acc_status ON accommodation_applications(status);
CREATE INDEX IF NOT EXISTS idx_acc_city_dates ON accommodation_applications(city, coverage_start, coverage_end);
CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status);
CREATE INDEX IF NOT EXISTS idx_requests_status ON creator_requests(status);
CREATE INDEX IF NOT EXISTS idx_audit_created ON admin_audit_logs(created_at DESC);

-- ------------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE influencer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE advertisements ENABLE ROW LEVEL SECURITY;
ALTER TABLE influencer_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE accommodation_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. Public can read active profiles in the directory
CREATE POLICY "Public profiles are readable by everyone"
  ON influencer_profiles FOR SELECT
  USING (is_active = TRUE);

-- 2. Public can read active advertisements
CREATE POLICY "Active ads are readable by everyone"
  ON advertisements FOR SELECT
  USING (is_active = TRUE AND start_date <= CURRENT_DATE AND end_date >= CURRENT_DATE);

-- 3. Public can submit applications (INSERT only)
CREATE POLICY "Anyone can submit creator application"
  ON influencer_applications FOR INSERT
  WITH CHECK (status = 'PENDING');

CREATE POLICY "Anyone can submit accommodation application"
  ON accommodation_applications FOR INSERT
  WITH CHECK (status = 'PENDING');

CREATE POLICY "Anyone can submit collaboration request"
  ON creator_requests FOR INSERT
  WITH CHECK (status = 'PENDING');

-- 4. Authenticated Staff have full operational access
CREATE POLICY "Staff full access on applications"
  ON influencer_applications FOR ALL
  TO authenticated
  USING (TRUE);

CREATE POLICY "Staff full access on verification documents"
  ON verification_documents FOR ALL
  TO authenticated
  USING (TRUE);

CREATE POLICY "Staff full access on accommodations"
  ON accommodation_applications FOR ALL
  TO authenticated
  USING (TRUE);

CREATE POLICY "Staff full access on requests"
  ON creator_requests FOR ALL
  TO authenticated
  USING (TRUE);

CREATE POLICY "Staff full access on matches"
  ON matches FOR ALL
  TO authenticated
  USING (TRUE);

CREATE POLICY "Staff full access on settings"
  ON platform_settings FOR ALL
  TO authenticated
  USING (TRUE);

CREATE POLICY "Staff full access on audit logs"
  ON admin_audit_logs FOR ALL
  TO authenticated
  USING (TRUE);

-- ------------------------------------------------------------------------------
-- INITIAL SEED SETTINGS (Phase 1 FREE)
-- ------------------------------------------------------------------------------
INSERT INTO platform_settings (
  id,
  platform_phase,
  billing_mode,
  creator_pool_limit,
  document_retention_days,
  directory_visibility,
  whatsapp_creator_template,
  whatsapp_host_template
) VALUES (
  'current',
  'FREE',
  'NONE',
  1000,
  90,
  'PUBLIC',
  'Hi [Creator Name], this is Get Linked. We have confirmed a potential collaboration for your upcoming visit to [City] with [Accommodation Name]. Are you available to review the brief?',
  'Hi [Contact Name], this is Get Linked. We have confirmed an authentic collaboration match for [Accommodation Name] with verified creator [Creator Name] ([Follower Count] followers, [Niche]). Here are the details:'
) ON CONFLICT (id) DO NOTHING;
