import { pool } from '../config/db'

async function checkDashboardData() {
  try {
    console.log('🔍 Checking dashboard data sources...')
    
    // Check each table that feeds the dashboard
    const checks = [
      { name: 'Active Users', query: 'SELECT COUNT(*) as count FROM users WHERE is_active = true' },
      { name: 'Total Trips', query: 'SELECT COUNT(*) as count FROM trips' },
      { name: 'Active Trips', query: "SELECT COUNT(*) as count FROM trips WHERE status = 'active'" },
      { name: 'Total Bookings', query: 'SELECT COUNT(*) as count FROM bookings' },
      { name: 'Confirmed Bookings', query: "SELECT COUNT(*) as count FROM bookings WHERE status = 'confirmed'" },
      { name: 'Pending Bookings', query: "SELECT COUNT(*) as count FROM bookings WHERE status = 'pending'" },
      { name: 'Total Blogs', query: 'SELECT COUNT(*) as count FROM blogs' },
      { name: 'Published Blogs', query: "SELECT COUNT(*) as count FROM blogs WHERE published = true" },
      { name: 'Blog Views', query: 'SELECT COALESCE(SUM(views), 0) as total FROM blogs' },
      { name: 'SEO Pages', query: 'SELECT COUNT(*) as count FROM seo_metadata' },
      { name: 'Sitemap Pages', query: 'SELECT COUNT(*) as count FROM seo_metadata WHERE include_in_sitemap = true' },
      { name: 'Crawl Issues', query: 'SELECT COUNT(*) as count FROM crawl_issues' },
      { name: 'Unread Notifications', query: 'SELECT COUNT(*) as count FROM notifications WHERE is_read = false' },
    ]
    
    console.log('\n📊 Dashboard Data Sources:')
    console.log('=' .repeat(50))
    
    for (const check of checks) {
      try {
        const result = await pool.query(check.query)
        const count = result.rows[0].count || result.rows[0].total || 0
        console.log(`${check.name.padEnd(20)}: ${count}`)
      } catch (error) {
        console.log(`${check.name.padEnd(20)}: ERROR - ${error.message}`)
      }
    }
    
    // Check recent data
    console.log('\n📋 Recent Data Samples:')
    console.log('=' .repeat(50))
    
    try {
      const recentBookings = await pool.query(`
        SELECT b.id, b.customer_name, t.title as trip_title, b.status, b.total_price
        FROM bookings b
        LEFT JOIN trips t ON b.trip_id = t.id
        ORDER BY b.created_at DESC
        LIMIT 3
      `)
      console.log(`Recent Bookings (${recentBookings.rows.length}):`)
      recentBookings.rows.forEach(row => {
        console.log(`  - ${row.customer_name} → ${row.trip_title || 'Unknown'} ($${row.total_price})`)
      })
    } catch (error) {
      console.log(`Recent Bookings: ERROR - ${error.message}`)
    }
    
    try {
      const recentTrips = await pool.query(`
        SELECT id, title, destination, price, rating
        FROM trips
        ORDER BY created_at DESC
        LIMIT 3
      `)
      console.log(`\nRecent Trips (${recentTrips.rows.length}):`)
      recentTrips.rows.forEach(row => {
        console.log(`  - ${row.title} → ${row.destination} ($${row.price})`)
      })
    } catch (error) {
      console.log(`Recent Trips: ERROR - ${error.message}`)
    }
    
  } catch (error) {
    console.error('❌ Error checking dashboard data:', error)
  } finally {
    await pool.end()
  }
}

checkDashboardData()
