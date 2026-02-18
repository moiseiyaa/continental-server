import { pool } from '../config/db'

async function checkTable() {
  try {
    console.log('Checking seo_metadata table structure...')
    
    // Check if table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'seo_metadata'
      );
    `)
    
    const tableExists = tableCheck.rows[0].exists
    console.log(`Table exists: ${tableExists}`)
    
    if (tableExists) {
      // Get table structure
      const structure = await pool.query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = 'seo_metadata' 
        ORDER BY ordinal_position;
      `)
      
      console.log('\nTable structure:')
      structure.rows.forEach(row => {
        console.log(`  ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable}, default: ${row.column_default})`)
      })
    } else {
      console.log('Creating seo_metadata table...')
      
      // Create the table
      await pool.query(`
        CREATE TABLE seo_metadata (
          id SERIAL PRIMARY KEY,
          path VARCHAR(255) UNIQUE NOT NULL,
          title_tag VARCHAR(255),
          meta_description TEXT,
          canonical_url VARCHAR(500),
          og_title VARCHAR(255),
          og_description TEXT,
          og_image VARCHAR(500),
          noindex BOOLEAN DEFAULT false,
          include_in_sitemap BOOLEAN DEFAULT true,
          schema_ld JSONB,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `)
      
      console.log('✅ Created seo_metadata table')
      
      // Create indexes
      await pool.query(`CREATE INDEX idx_seo_metadata_path ON seo_metadata(path);`)
      await pool.query(`CREATE INDEX idx_seo_metadata_include_in_sitemap ON seo_metadata(include_in_sitemap) WHERE include_in_sitemap = true;`)
      
      console.log('✅ Created indexes')
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await pool.end()
  }
}

checkTable()
