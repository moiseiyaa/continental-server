import { pool } from '../config/db'

async function runMigration() {
  try {
    console.log('Running SEO schema migration...')
    
    // Add missing fields to seo_metadata table
    await pool.query(`
      ALTER TABLE seo_metadata 
      ADD COLUMN IF NOT EXISTS include_in_sitemap BOOLEAN DEFAULT true,
      ADD COLUMN IF NOT EXISTS schema_ld JSONB
    `)
    
    console.log('✅ Added include_in_sitemap and schema_ld columns')
    
    // Add index on path for faster lookups if it doesn't exist
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_seo_metadata_path ON seo_metadata(path)
    `)
    
    console.log('✅ Added path index')
    
    // Add index on include_in_sitemap for sitemap generation
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_seo_metadata_include_in_sitemap ON seo_metadata(include_in_sitemap) WHERE include_in_sitemap = true
    `)
    
    console.log('✅ Added include_in_sitemap index')
    
    console.log('🎉 SEO migration completed successfully!')
    
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

runMigration()
