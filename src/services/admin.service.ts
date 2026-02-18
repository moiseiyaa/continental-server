import { pool } from '../config/db';

export const getDashboardStats = async () => {
  try {
    const results = await Promise.all([
      pool.query('SELECT COUNT(*) FROM users WHERE is_active = true'),
      pool.query('SELECT COUNT(*) FROM trips'),
      pool.query("SELECT COUNT(*) FROM trips WHERE status = 'active'"),
      pool.query('SELECT COUNT(*) FROM bookings'),
      pool.query("SELECT COUNT(*) FROM bookings WHERE status = 'confirmed'"),
      pool.query("SELECT COUNT(*) FROM bookings WHERE status = 'pending'"),
      pool.query('SELECT COUNT(*) FROM blogs'),
      pool.query("SELECT COUNT(*) FROM blogs WHERE published = true"),
      pool.query('SELECT COALESCE(SUM(views), 0) FROM blogs'),
      pool.query('SELECT COUNT(*) FROM seo_metadata'),
      pool.query('SELECT COUNT(*) FROM seo_metadata WHERE include_in_sitemap = true'),
      pool.query('SELECT AVG(LENGTH(title)) as avg_title_length FROM seo_metadata WHERE title IS NOT NULL'),
      pool.query('SELECT AVG(LENGTH(description)) as avg_desc_length FROM seo_metadata WHERE description IS NOT NULL'),
      pool.query('SELECT COUNT(*) FROM crawl_issues'),
      pool.query('SELECT COUNT(*) FROM notifications WHERE is_read = false'),
      // Recent bookings
      pool.query(`
        SELECT b.id, u.name as customer_name, t.title as trip_title, b.booking_date, b.status, b.total_price
        FROM bookings b
        LEFT JOIN users u ON b.user_id = u.id
        LEFT JOIN trips t ON b.trip_id = t.id
        ORDER BY b.created_at DESC
        LIMIT 5
      `),
      // Recent trips
      pool.query(`
        SELECT id, title, destination, price, rating, created_at
        FROM trips
        ORDER BY created_at DESC
        LIMIT 5
      `),
    ]);
    
    const dashboardData = {
      stats: {
        activeUsers: Number(results[0].rows[0].count),
        totalTrips: Number(results[1].rows[0].count),
        activeTrips: Number(results[2].rows[0].count),
        totalBookings: Number(results[3].rows[0].count),
        confirmedBookings: Number(results[4].rows[0].count),
        pendingBookings: Number(results[5].rows[0].count),
        totalBlogs: Number(results[6].rows[0].count),
        publishedBlogs: Number(results[7].rows[0].count),
        totalBlogViews: Number(results[8].rows[0].sum || 0),
        totalSeoPages: Number(results[9].rows[0].count),
        sitemapPages: Number(results[10].rows[0].count),
        avgTitleLength: Math.round(Number(results[11].rows[0].avg_title_length) || 0),
        avgDescriptionLength: Math.round(Number(results[12].rows[0].avg_desc_length) || 0),
        crawlIssues: Number(results[13].rows[0].count),
        unreadNotifications: Number(results[14].rows[0].count),
      },
      recentBookings: results[15].rows.map(row => ({
        id: row.id.toString(),
        customerName: row.customer_name,
        tripTitle: row.trip_title || 'Unknown Trip',
        bookingDate: row.booking_date,
        status: row.status,
        totalAmount: Number(row.total_price),
      })),
      recentTrips: results[16].rows.map(row => ({
        id: row.id.toString(),
        title: row.title,
        destination: row.destination,
        price: Number(row.price),
        rating: Number(row.rating),
        createdAt: row.created_at,
      })),
    };
    
    return dashboardData;
  } catch (error) {
    console.error('Error in getDashboardStats:', error);
    throw error;
  }
};

export const getUserStats = async (period?: string) => {
  const { rows } = await pool.query(
    `SELECT DATE_TRUNC('month', created_at) AS month, COUNT(*) AS count
     FROM users GROUP BY month ORDER BY month DESC LIMIT 12`
  );
  return rows;
};

export const getBookingStats = async (period?: string) => {
  const { rows } = await pool.query(
    `SELECT DATE_TRUNC('month', created_at) AS month, COUNT(*) AS count
     FROM bookings GROUP BY month ORDER BY month DESC LIMIT 12`
  );
  return rows;
};

export const getTripStats = async (period?: string) => {
  const { rows } = await pool.query(
    `SELECT DATE_TRUNC('month', created_at) AS month, COUNT(*) AS count
     FROM trips GROUP BY month ORDER BY month DESC LIMIT 12`
  );
  return rows;
};

export const getRevenueReports = async (period?: string) => {
  const { rows } = await pool.query(
    `SELECT DATE_TRUNC('month', created_at) AS month, SUM(total_price)::float AS revenue
     FROM bookings WHERE status = 'confirmed' GROUP BY month ORDER BY month DESC LIMIT 12`
  );
  return rows;
};

export const getSystemHealth = async () => {
  // Simple DB health check
  const { rows } = await pool.query('SELECT NOW()');
  return { time: rows[0].now };
};
