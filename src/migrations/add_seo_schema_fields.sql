-- Add missing fields to seo_metadata table
ALTER TABLE seo_metadata 
ADD COLUMN IF NOT EXISTS include_in_sitemap BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS schema_ld JSONB;

-- Add index on path for faster lookups if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_seo_metadata_path ON seo_metadata(path);

-- Add index on include_in_sitemap for sitemap generation
CREATE INDEX IF NOT EXISTS idx_seo_metadata_include_in_sitemap ON seo_metadata(include_in_sitemap) WHERE include_in_sitemap = true;
