import { pool } from '../config/db'

async function createSimpleTestData() {
  try {
    console.log('Creating simple dashboard test data...')

    // Create sample blogs
    await pool.query(`
      INSERT INTO blogs (title, content, excerpt, slug, is_published, author_id, created_at, updated_at)
      VALUES 
        ('Top 10 Safari Destinations in Rwanda', 'Rwanda offers some of the most incredible safari experiences in Africa...', 'Discover the best safari destinations in Rwanda for your next adventure.', 'top-10-safari-destinations', true, 1, NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days'),
        ('Gorilla Trekking Guide', 'A comprehensive guide to gorilla trekking in Volcanoes National Park...', 'Everything you need to know about gorilla trekking in Rwanda.', 'gorilla-trekking-guide', true, 1, NOW() - INTERVAL '14 days', NOW() - INTERVAL '14 days'),
        ('Cultural Experiences in Kigali', 'Explore the rich culture and history of Rwanda\'s capital city...', 'Discover the cultural attractions and experiences in Kigali.', 'cultural-experiences-kigali', true, 1, NOW() - INTERVAL '21 days', NOW() - INTERVAL '21 days')
      ON CONFLICT (slug) DO NOTHING
    `)

    // Create sample blog views
    await pool.query(`
      INSERT INTO blog_views (blog_id, viewed_at, ip_address)
      SELECT 
        b.id,
        NOW() - (random() * 90 || ' days')::INTERVAL,
        '192.168.1.' || (floor(random() * 254) + 1)::text
      FROM blogs b
      CROSS JOIN generate_series(1, floor(random() * 30 + 10)::int) g
      ON CONFLICT DO NOTHING
    `)

    // Create sample blog comments
    await pool.query(`
      INSERT INTO blog_comments (blog_id, user_id, content, is_approved, created_at)
      VALUES 
        (1, 1, 'This article is amazing! I can\'t wait to visit Rwanda.', true, NOW() - INTERVAL '6 days'),
        (1, 2, 'Great information about the safari destinations. Thank you!', true, NOW() - INTERVAL '5 days'),
        (2, 3, 'The gorilla trekking guide was very helpful for our trip planning.', true, NOW() - INTERVAL '13 days'),
        (3, 1, 'Kigali is such a beautiful and clean city. Loved the cultural sites!', true, NOW() - INTERVAL '20 days')
      ON CONFLICT DO NOTHING
    `)

    // Create sample users
    await pool.query(`
      INSERT INTO users (first_name, last_name, email, phone, is_active, created_at, updated_at)
      VALUES 
        ('John', 'Doe', 'john.doe@example.com', '+250788123456', true, NOW() - INTERVAL '30 days', NOW()),
        ('Jane', 'Smith', 'jane.smith@example.com', '+250787654321', true, NOW() - INTERVAL '60 days', NOW()),
        ('Mike', 'Johnson', 'mike.johnson@example.com', '+250786987654', true, NOW() - INTERVAL '90 days', NOW())
      ON CONFLICT (email) DO NOTHING
    `)

    // Create sample reviews
    await pool.query(`
      INSERT INTO reviews (trip_id, user_id, rating, comment, is_approved, created_at)
      VALUES 
        (1, 1, 5, 'Amazing experience! The guide was knowledgeable and the scenery was breathtaking.', true, NOW() - INTERVAL '10 days'),
        (2, 2, 4, 'Great trip overall. The accommodations were excellent.', true, NOW() - INTERVAL '20 days'),
        (1, 3, 5, 'Life-changing experience! Seeing the gorillas up close was incredible.', true, NOW() - INTERVAL '30 days')
      ON CONFLICT DO NOTHING
    `)

    // Create sample contacts
    await pool.query(`
      INSERT INTO contacts (name, email, subject, message, status, created_at)
      VALUES 
        ('Alice Cooper', 'alice@example.com', 'Trip Inquiry', 'I am interested in the 7-day safari package. Can you provide more details?', 'new', NOW() - INTERVAL '2 days'),
        ('Bob Martin', 'bob@example.com', 'Booking Question', 'What is the cancellation policy for the gorilla trekking tour?', 'new', NOW() - INTERVAL '5 days'),
        ('Carol White', 'carol@example.com', 'General Information', 'Do you offer custom tour packages for families?', 'replied', NOW() - INTERVAL '7 days')
      ON CONFLICT DO NOTHING
    `)

    // Update newsletter subscribers
    await pool.query(`
      INSERT INTO newsletter (email, is_active, created_at)
      VALUES 
        ('newsletter@example.com', true, NOW() - INTERVAL '30 days'),
        ('updates@example.com', true, NOW() - INTERVAL '45 days'),
        ('travel@example.com', true, NOW() - INTERVAL '60 days'),
        ('contact@example.com', true, NOW() - INTERVAL '90 days')
      ON CONFLICT (email) DO NOTHING
    `)

    // Create sample bookings
    await pool.query(`
      INSERT INTO bookings (user_id, trip_id, customer_name, customer_email, customer_phone, total_price, status, booking_date, created_at, updated_at)
      VALUES 
        (1, 1, 'John Doe', 'john.doe@example.com', '+250788123456', 2500, 'confirmed', NOW() + INTERVAL '30 days', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
        (2, 2, 'Jane Smith', 'jane.smith@example.com', '+250787654321', 3200, 'confirmed', NOW() + INTERVAL '45 days', NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),
        (3, 1, 'Mike Johnson', 'mike.johnson@example.com', '+250786987654', 2500, 'pending', NOW() + INTERVAL '60 days', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days')
      ON CONFLICT DO NOTHING
    `)

    console.log('✅ Simple dashboard test data created successfully!')

    // Show summary
    const results = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM blogs) as blogs,
        (SELECT COUNT(*) FROM blogs WHERE is_published = true) as published_blogs,
        (SELECT COUNT(*) FROM blog_views) as blog_views,
        (SELECT COUNT(*) FROM blog_comments WHERE is_approved = true) as blog_comments,
        (SELECT COUNT(*) FROM users WHERE is_active = true) as active_users,
        (SELECT COUNT(*) FROM bookings) as total_bookings,
        (SELECT COUNT(*) FROM bookings WHERE status = 'confirmed') as confirmed_bookings,
        (SELECT COUNT(*) FROM bookings WHERE status = 'pending') as pending_bookings,
        (SELECT COALESCE(SUM(total_price), 0) FROM bookings WHERE status = 'confirmed') as total_revenue,
        (SELECT COUNT(*) FROM reviews) as reviews,
        (SELECT COUNT(*) FROM contacts) as contacts,
        (SELECT COUNT(*) FROM newsletter WHERE is_active = true) as newsletter_subscribers
    `)

    const stats = results.rows[0]
    console.log('\n📊 Dashboard Summary:')
    console.log(`  Blogs: ${stats.blogs} (${stats.published_blogs} published)`)
    console.log(`  Blog Views: ${stats.blog_views}`)
    console.log(`  Blog Comments: ${stats.blog_comments}`)
    console.log(`  Active Users: ${stats.active_users}`)
    console.log(`  Total Bookings: ${stats.total_bookings} (${stats.confirmed_bookings} confirmed, ${stats.pending_bookings} pending)`)
    console.log(`  Total Revenue: $${stats.total_revenue}`)
    console.log(`  Reviews: ${stats.reviews}`)
    console.log(`  Contacts: ${stats.contacts}`)
    console.log(`  Newsletter Subscribers: ${stats.newsletter_subscribers}`)

  } catch (error) {
    console.error('❌ Error creating test data:', error)
  } finally {
    await pool.end()
  }
}

createSimpleTestData()
