import { pool } from '../config/db';

export const getDashboardStats = async () => {
  const results = await Promise.all([
    pool.query('SELECT COUNT(*) FROM users'),
    pool.query('SELECT COUNT(*) FROM users WHERE is_active = true'),
    pool.query('SELECT COUNT(*) FROM trips'),
    pool.query("SELECT COUNT(*) FROM trips WHERE status = 'active'"),
    pool.query('SELECT COUNT(*) FROM bookings'),
    pool.query("SELECT COUNT(*) FROM bookings WHERE status = 'confirmed'"),
    pool.query('SELECT COUNT(*) FROM reviews'),
    pool.query('SELECT COUNT(*) FROM contacts'),
    pool.query('SELECT COUNT(*) FROM newsletter WHERE is_active = true'),
  ]);
  return {
    totalUsers: Number(results[0].rows[0].count),
    activeUsers: Number(results[1].rows[0].count),
    totalTrips: Number(results[2].rows[0].count),
    activeTrips: Number(results[3].rows[0].count),
    totalBookings: Number(results[4].rows[0].count),
    confirmedBookings: Number(results[5].rows[0].count),
    totalReviews: Number(results[6].rows[0].count),
    totalContacts: Number(results[7].rows[0].count),
    activeSubscribers: Number(results[8].rows[0].count),
  };
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
