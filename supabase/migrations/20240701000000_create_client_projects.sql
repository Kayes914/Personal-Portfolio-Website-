-- Create client_projects table
CREATE TABLE IF NOT EXISTS client_projects (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  client TEXT NOT NULL,
  industry TEXT NOT NULL,
  challenge TEXT,
  solution TEXT,
  outcome TEXT,
  image TEXT,
  logo TEXT,
  tech JSONB DEFAULT '[]'::jsonb,
  live_url TEXT,
  case_study_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ
);

-- Remove existing policies (if any)
DROP POLICY IF EXISTS "allow_all_operations_client_projects" ON "public"."client_projects";

-- Create a policy to allow all operations
CREATE POLICY "allow_all_operations_client_projects"
ON "public"."client_projects"
AS PERMISSIVE FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Create storage bucket for client logos if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('client-logos', 'client-logos', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for client logos
CREATE POLICY "allow_public_read_client_logos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'client-logos');

CREATE POLICY "allow_public_upload_client_logos"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'client-logos');

-- Alter the existing projects table to add client project fields
ALTER TABLE IF EXISTS projects 
ADD COLUMN IF NOT EXISTS is_client_project BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS client TEXT,
ADD COLUMN IF NOT EXISTS industry TEXT,
ADD COLUMN IF NOT EXISTS github_url TEXT,
ADD COLUMN IF NOT EXISTS case_study_url TEXT;

-- Make sure the tech column is JSONB (it might be TEXT[] in older tables)
DO $$
BEGIN
  -- Check if the column exists and is of type TEXT[]
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'projects' 
    AND column_name = 'tech' 
    AND data_type = 'ARRAY'
  ) THEN
    -- Convert TEXT[] to JSONB
    ALTER TABLE projects 
    ALTER COLUMN tech TYPE JSONB USING COALESCE(to_jsonb(tech), '[]'::jsonb);
  END IF;
END $$;

-- Make sure we have an updated_at column
ALTER TABLE IF EXISTS projects 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ; 