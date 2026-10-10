-- ==============================================================================
-- GET LINKED — MEDIA STORAGE SCHEMA & ROW LEVEL SECURITY
-- Module: Google Drive Media Management
-- ==============================================================================

-- 1. Create user_media table
CREATE TABLE IF NOT EXISTS public.user_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  storage_filename TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('PHOTO', 'VIDEO', 'DOCUMENT', 'AVATAR', 'OTHER')),
  mime_type TEXT NOT NULL,
  file_size BIGINT NOT NULL DEFAULT 0,
  drive_file_id TEXT NOT NULL,
  drive_parent_folder_id TEXT NOT NULL DEFAULT '1F2xh_ii87HDSCW3PHFHLXY7DpN_qfkOX',
  visibility TEXT NOT NULL DEFAULT 'PRIVATE' CHECK (visibility IN ('PRIVATE', 'PUBLIC')),
  upload_status TEXT NOT NULL DEFAULT 'COMPLETED' CHECK (upload_status IN ('PENDING', 'COMPLETED', 'FAILED')),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_user_media_owner ON public.user_media(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_user_media_drive_id ON public.user_media(drive_file_id);
CREATE INDEX IF NOT EXISTS idx_user_media_category ON public.user_media(category);
CREATE INDEX IF NOT EXISTS idx_user_media_visibility ON public.user_media(visibility);
CREATE INDEX IF NOT EXISTS idx_user_media_created ON public.user_media(created_at DESC);

-- 3. Row Level Security (RLS)
ALTER TABLE public.user_media ENABLE ROW LEVEL SECURITY;

-- Policy: Owners can read their own media
DROP POLICY IF EXISTS "Users can view their own media" ON public.user_media;
CREATE POLICY "Users can view their own media"
ON public.user_media
FOR SELECT
USING (auth.uid() = owner_user_id);

-- Policy: Public visitors can view media explicitly marked as PUBLIC
DROP POLICY IF EXISTS "Public can view public media" ON public.user_media;
CREATE POLICY "Public can view public media"
ON public.user_media
FOR SELECT
USING (visibility = 'PUBLIC');

-- Policy: Owners can insert records matching their auth.uid()
DROP POLICY IF EXISTS "Users can insert their own media metadata" ON public.user_media;
CREATE POLICY "Users can insert their own media metadata"
ON public.user_media
FOR INSERT
WITH CHECK (auth.uid() = owner_user_id);

-- Policy: Owners can update their own media metadata
DROP POLICY IF EXISTS "Users can update their own media" ON public.user_media;
CREATE POLICY "Users can update their own media"
ON public.user_media
FOR UPDATE
USING (auth.uid() = owner_user_id)
WITH CHECK (auth.uid() = owner_user_id);

-- Policy: Owners can delete their own media records
DROP POLICY IF EXISTS "Users can delete their own media" ON public.user_media;
CREATE POLICY "Users can delete their own media"
ON public.user_media
FOR DELETE
USING (auth.uid() = owner_user_id);

-- 4. Enable Supabase Realtime Replication for user_media
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'user_media'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.user_media;
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    NULL;
END $$;

-- 5. Helper function to compute user storage usage
CREATE OR REPLACE FUNCTION public.get_user_storage_usage(user_id UUID)
RETURNS BIGINT
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT COALESCE(SUM(file_size), 0)::BIGINT
  FROM public.user_media
  WHERE owner_user_id = user_id AND upload_status = 'COMPLETED';
$$;
