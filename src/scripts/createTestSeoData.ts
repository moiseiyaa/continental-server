import { pool } from '../config/db'

async function createTestData() {
  try {
    console.log('Creating test SEO data...')
  
    const testData = [
      {
        page_url: '/about',
        title: 'About Continental Travels & Tours',
        description: 'Learn about our travel company and our commitment to providing exceptional travel experiences in Rwanda and East Africa.',
        canonical_url: 'https://continental-travels.com/about',
        og_title: 'About Us - Continental Travels & Tours',
        og_description: 'Discover our story and mission to create unforgettable travel experiences.',
        og_image: 'https://continental-travels.com/images/about-og.jpg'
      },
      {
      
        page_url: '/contact',
        title: 'Contact Continental Travels & Tours',
        description: 'Get in touch with Continental Travels & Tours for your next African adventure. Contact us for bookings and inquiries.',
        canonical_url: 'https://continental-travels.com/contact',
        og_title: 'Contact Us - Continental Travels & Tours',
        og_description: 'Reach out to plan your perfect Rwanda and East Africa safari experience.',
        og_image: 'https://continental-travels.com/images/contact-og.jpg'
      },
      {
        page_url: '/tours',
        title: 'Rwanda Tours & Safari Packages - Continental Travels',
        description: 'Explore our curated Rwanda tours and safari packages. From gorilla trekking to wildlife safaris, discover the best of East Africa.',
        canonical_url: 'https://continental-travels.com/tours',
        og_title: 'Rwanda Tours & Safari Packages',
        og_description: 'Book your dream Rwanda safari with expert guides and unforgettable wildlife experiences.',
        og_image: 'https://continental-travels.com/images/tours-og.jpg'
      }
    ]
    
    for (const data of testData) {
      const query = `
        INSERT INTO seo_metadata (page_url, title, description, canonical_url, og_title, og_description, og_image, include_in_sitemap)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (page_url) DO UPDATE SET
          title = EXCLUDED.title,
          description = EXCLUDED.description,
          canonical_url = EXCLUDED.canonical_url,
          og_title = EXCLUDED.og_title,
          og_description = EXCLUDED.og_description,
          og_image = EXCLUDED.og_image,
          updated_at = NOW()
        RETURNING id, page_url
      `
      
      const values = [
        data.page_url,
        data.title,
        data.description,
        data.canonical_url,
        data.og_title,
        data.og_description,
        data.og_image,
        true
      ]
      
      const result = await pool.query(query, values)
      console.log(`✅ Created/updated SEO for: ${result.rows[0].page_url} (ID: ${result.rows[0].id})`)
    }
    
    console.log('🎉 Test SEO data created successfully!')
    
    // Verify the data
    const { rows } = await pool.query('SELECT page_url, title FROM seo_metadata ORDER BY page_url')
    console.log('\n📋 Current SEO data:')
    rows.forEach(row => {
      console.log(`  ${row.page_url}: ${row.title}`)
    })
    
  } catch (error) {
    console.error('❌ Error creating test data:', error)
  } finally {
    await pool.end()
  }
}

createTestData()
