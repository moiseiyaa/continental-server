import { pool } from '../config/db'

async function createCorrectTestData() {
  try {
    console.log('Creating dashboard test data with correct schema...')

    // Create sample blogs
    await pool.query(`
      INSERT INTO blogs (title, content, excerpt, slug, author, published, published_at, views, created_at, updated_at)
      VALUES 
        ('Top 10 Safari Destinations in Rwanda', 'Rwanda offers some of the most incredible safari experiences in Africa...', 'Discover the best safari destinations in Rwanda for your next adventure.', 'top-10-safari-destinations', 'Admin', true, NOW() - INTERVAL '7 days', 245, NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days'),
        ('Gorilla Trekking Guide', 'A comprehensive guide to gorilla trekking in Volcanoes National Park...', 'Everything you need to know about gorilla trekking in Rwanda.', 'gorilla-trekking-guide', 'Admin', true, NOW() - INTERVAL '14 days', 189, NOW() - INTERVAL '14 days', NOW() - INTERVAL '14 days'),
        ('Cultural Experiences in Kigali', 'Explore the rich culture and history of Rwanda\'s capital city...', 'Discover the cultural attractions and experiences in Kigali.', 'cultural-experiences-kigali', 'Admin', true, NOW() - INTERVAL '21 days', 156, NOW() - INTERVAL '21 days', NOW() - INTERVAL '21 days'),
        ('Best Time to Visit Rwanda', 'Learn about the different seasons and when to plan your visit...', 'Planning your trip to Rwanda? Here\'s when you should visit.', 'best-time-to-visit-rwanda', 'Admin', false, NOW() - INTERVAL '30 days', 89, NOW() - INTERVAL '30 days', NOW() - INTERVAL '30 days'),
        ('Rwanda Conservation Success Story', 'How Rwanda became a leader in conservation efforts...', 'The inspiring story of Rwanda\'s conservation success.', 'rwanda-conservation-story', 'Admin', true, NOW() - INTERVAL '45 days', 312, NOW() - INTERVAL '45 days', NOW() - INTERVAL '45 days')
      ON CONFLICT (slug) DO NOTHING
    `)

    // Create sample users
    await pool.query(`
      INSERT INTO users (name, email, password, role, is_active, created_at, updated_at)
      VALUES 
        ('John Doe', 'john.doe@example.com', 'hashed_password', 'user', true, NOW() - INTERVAL '30 days', NOW()),
        ('Jane Smith', 'jane.smith@example.com', 'hashed_password', 'user', true, NOW() - INTERVAL '60 days', NOW()),
        ('Mike Johnson', 'mike.johnson@example.com', 'hashed_password', 'user', true, NOW() - INTERVAL '90 days', NOW()),
        ('Sarah Williams', 'sarah.williams@example.com', 'hashed_password', 'user', false, NOW() - INTERVAL '15 days', NOW()),
        ('David Brown', 'david.brown@example.com', 'hashed_password', 'user', true, NOW() - INTERVAL '120 days', NOW())
      ON CONFLICT (email) DO NOTHING
    `)

    // Create sample trips if they don't exist
    await pool.query(`
      INSERT INTO trips (title, description, destination, duration, price, max_participants, current_participants, rating, reviews, status, created_by, created_at, updated_at, slug)
      VALUES 
        ('Gorilla Trekking Adventure', 'Experience the thrill of encountering mountain gorillas in their natural habitat...', 'Volcanoes National Park', 3, 2500, 8, 6, 4.8, 124, 'active', 1, NOW() - INTERVAL '60 days', NOW(), 'gorilla-trekking-adventure'),
        ('Safari Experience', 'Classic African safari with wildlife viewing and cultural experiences...', 'Akagera National Park', 5, 3200, 12, 8, 4.6, 89, 'active', 1, NOW() - INTERVAL '90 days', NOW(), 'safari-experience'),
        ('Cultural Heritage Tour', 'Discover Rwanda''s rich cultural heritage and historical sites...', 'Various Locations', 4, 1800, 15, 12, 4.7, 67, 'active', 1, NOW() - INTERVAL '45 days', NOW(), 'cultural-heritage-tour')
      ON CONFLICT (slug) DO NOTHING
    `)

    // Create sample bookings
    await pool.query(`
      INSERT INTO bookings (user_id, trip_id, number_of_participants, total_price, status, payment_status, booking_date, created_at, updated_at)
      VALUES 
        (1, 1, 2, 5000, 'confirmed', 'paid', NOW() + INTERVAL '30 days', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
        (2, 2, 4, 12800, 'confirmed', 'paid', NOW() + INTERVAL '45 days', NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),
        (3, 1, 3, 7500, 'pending', 'pending', NOW() + INTERVAL '60 days', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
        (1, 3, 2, 3600, 'confirmed', 'paid', NOW() + INTERVAL '20 days', NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days'),
        (5, 2, 6, 19200, 'confirmed', 'paid', NOW() + INTERVAL '90 days', NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days')
      ON CONFLICT DO NOTHING
    `)

    // Create sample crawl issues for SEO testing
    await pool.query(`
      INSERT INTO crawl_issues (path, type, detail, created_at)
      VALUES 
        ('/old-page', '404', 'Page not found - potential broken link', NOW() - INTERVAL '5 days'),
        ('/missing-meta', 'missing-meta', 'Missing meta description for better SEO', NOW() - INTERVAL '3 days'),
        ('/slow-page', 'performance', 'Page load time exceeds recommended threshold', NOW() - INTERVAL '1 day')
      ON CONFLICT DO NOTHING
    `)

    // Create some Core Web Vitals data
    await pool.query(`
      INSERT INTO vitals (date, lcp, fid, cls)
      VALUES 
        (NOW() - INTERVAL '30 days', 2.1, 45, 0.15),
        (NOW() - INTERVAL '20 days', 1.8, 38, 0.12),
        (NOW() - INTERVAL '10 days', 1.5, 32, 0.08),
        (NOW() - INTERVAL '5 days', 1.3, 28, 0.05),
        (NOW() - INTERVAL '1 day', 1.2, 25, 0.03)
      ON CONFLICT (date) DO NOTHING
    `)

    console.log('✅ Dashboard test data created successfully!')

    // Show summary
    const results = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM blogs) as blogs,
        (SELECT COUNT(*) FROM blogs WHERE published = true) as published_blogs,
        (SELECT COALESCE(SUM(views), 0) FROM blogs) as total_blog_views,
        (SELECT COUNT(*) FROM users WHERE is_active = true) as active_users,
        (SELECT COUNT(*) FROM trips) as total_trips,
        (SELECT COUNT(*) FROM trips WHERE status = 'active') as active_trips,
        (SELECT COUNT(*) FROM bookings) as total_bookings,
        (SELECT COUNT(*) FROM bookings WHERE status = 'confirmed') as confirmed_bookings,
        (SELECT COUNT(*) FROM bookings WHERE status = 'pending') as pending_bookings,
        (SELECT COALESCE(SUM(total_price), 0) FROM bookings WHERE status = 'confirmed') as total_revenue,
        (SELECT COUNT(*) FROM crawl_issues) as crawl_issues,
        (SELECT COUNT(*) FROM seo_metadata) as seo_pages,
        (SELECT COUNT(*) FROM seo_metadata WHERE include_in_sitemap = true) as sitemap_pages
    `)

    const stats = results.rows[0]
    console.log('\n📊 Dashboard Summary:')
    console.log(`  Blogs: ${stats.blogs} (${stats.published_blogs} published)`)
    console.log(`  Total Blog Views: ${stats.total_blog_views}`)
    console.log(`  Active Users: ${stats.active_users}`)
    console.log(`  Trips: ${stats.total_trips} (${stats.active_trips} active)`)
    console.log(`  Total Bookings: ${stats.total_bookings} (${stats.confirmed_bookings} confirmed, ${stats.pending_bookings} pending)`)
    console.log(`  Total Revenue: $${stats.total_revenue}`)
    console.log(`  Crawl Issues: ${stats.crawl_issues}`)
    console.log(`  SEO Pages: ${stats.seo_pages} (${stats.sitemap_pages} in sitemap)`)

  } catch (error) {
    console.error('❌ Error creating test data:', error)
  } finally {
    await pool.end()
  }
}

createCorrectTestData()
