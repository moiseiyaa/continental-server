import { IUser } from '../interfaces';
import User from '../models/user.model';
import { pool } from '../config/db';

export const getUserById = async (userId: string): Promise<IUser | null> => {
  const user = await User.findById(userId);
  if (!user) return null;
  const { password, ...userWithoutPassword } = user as any;
  return userWithoutPassword as IUser;
};

export const updateUser = async (userId: string, userData: Partial<IUser>): Promise<IUser | null> => {
  const updates: string[] = [];
  const values: any[] = [];
  let paramCount = 1;

  const allowedFields = ['name', 'email', 'role', 'isActive'];
  for (const [key, value] of Object.entries(userData)) {
    if (allowedFields.includes(key) && value !== undefined) {
      const dbKey = key === 'isActive' ? 'is_active' : key;
      updates.push(`${dbKey} = $${paramCount}`);
      values.push(value);
      paramCount++;
    }
  }

  if (updates.length === 0) {
    return getUserById(userId);
  }

  values.push(userId);
  const { rows } = await pool.query(
    `UPDATE users SET ${updates.join(', ')}, updated_at = NOW() WHERE id = $${paramCount} RETURNING *`,
    values
  );

  if (rows.length === 0) return null;
  const user = new User(rows[0]);
  const { password, ...userWithoutPassword } = user as any;
  return userWithoutPassword as IUser;
};

export const deleteUser = async (userId: string): Promise<IUser | null> => {
  // Soft delete by setting is_active to false
  const { rows } = await pool.query(
    `UPDATE users SET is_active = false, updated_at = NOW() WHERE id = $1 RETURNING *`,
    [userId]
  );
  if (rows.length === 0) return null;
  const user = new User(rows[0]);
  const { password, ...userWithoutPassword } = user as any;
  return userWithoutPassword as IUser;
};

export const getAllUsers = async (
  page: number = 1,
  limit: number = 10
): Promise<{ users: IUser[]; total: number; pages: number }> => {
  const offset = (page - 1) * limit;

  // Get total count and users in a single query using window function
  const { rows } = await pool.query(
    `SELECT 
      *,
      COUNT(*) OVER() as total_count
    FROM users 
    ORDER BY created_at DESC 
    LIMIT $1 OFFSET $2`,
    [limit, offset]
  );

  const total = rows.length > 0 ? Number(rows[0].total_count) : 0;
  const users = rows.map((row: any) => {
    const { total_count, password, ...userWithoutPassword } = row;
    return userWithoutPassword as IUser;
  });

  return {
    users,
    total,
    pages: Math.ceil(total / limit),
  };
};

export const updateUserRole = async (userId: string, role: 'user' | 'admin'): Promise<IUser | null> => {
  const { rows } = await pool.query(
    `UPDATE users SET role = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
    [role, userId]
  );
  if (rows.length === 0) return null;
  const user = new User(rows[0]);
  const { password, ...userWithoutPassword } = user as any;
  return userWithoutPassword as IUser;
};

export const deactivateUser = async (userId: string): Promise<IUser | null> => {
  const { rows } = await pool.query(
    `UPDATE users SET is_active = false, updated_at = NOW() WHERE id = $1 RETURNING *`,
    [userId]
  );
  if (rows.length === 0) return null;
  const user = new User(rows[0]);
  const { password, ...userWithoutPassword } = user as any;
  return userWithoutPassword as IUser;
};

export const reactivateUser = async (userId: string): Promise<IUser | null> => {
  const { rows } = await pool.query(
    `UPDATE users SET is_active = true, updated_at = NOW() WHERE id = $1 RETURNING *`,
    [userId]
  );
  if (rows.length === 0) return null;
  const user = new User(rows[0]);
  const { password, ...userWithoutPassword } = user as any;
  return userWithoutPassword as IUser;
};

export const getUserDashboard = async (userId: string): Promise<any> => {
  try {
    // Get user info
    const user = await getUserById(userId);
    if (!user) throw new Error('User not found');

    // Get user's bookings with trip details
    const bookingsQuery = `
      SELECT
        b.id,
        b.trip_id,
        b.number_of_participants,
        b.total_price,
        b.status,
        b.booking_date,
        t.title as trip_title,
        t.destination,
        t.start_date,
        t.end_date,
        t.images[1] as image
      FROM bookings b
      JOIN trips t ON b.trip_id = t.id
      WHERE b.user_id = $1
      ORDER BY b.created_at DESC
    `;

    const bookingsResult = await pool.query(bookingsQuery, [userId]);

    // Calculate stats
    const allBookings = bookingsResult.rows;
    const upcomingBookings = allBookings.filter(b => b.status === 'confirmed' || b.status === 'pending');
    const completedBookings = allBookings.filter(b => b.status === 'completed');

    // Get unique countries visited from completed bookings
    const countriesVisited = [...new Set(completedBookings.map(b => b.destination.split(',')[0].trim()))].length;

    // Format upcoming trips
    const upcomingTrips = upcomingBookings.slice(0, 3).map(booking => ({
      id: booking.id,
      destination: booking.trip_title,
      date: booking.start_date || booking.booking_date,
      status: booking.status,
      amount: parseFloat(booking.total_price),
      travelers: booking.number_of_participants,
      startDate: booking.start_date,
      endDate: booking.end_date,
      image: booking.image || '/images/placeholder.jpg'
    }));

    // Format recent bookings
    const recentBookings = allBookings.slice(0, 3).map(booking => ({
      id: booking.id,
      trip: booking.trip_title,
      date: booking.booking_date,
      status: booking.status,
      amount: parseFloat(booking.total_price)
    }));

    // Calculate loyalty points (simplified: 10 points per completed trip)
    const loyaltyPoints = completedBookings.length * 10;

    const dashboardData = {
      user: {
        name: user.name,
        email: user.email,
        memberSince: user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
      },
      stats: {
        totalTrips: completedBookings.length,
        countriesVisited,
        loyaltyPoints,
        upcomingBookings: upcomingBookings.length
      },
      upcomingTrips,
      recentBookings
    };

    return dashboardData;
  } catch (error) {
    console.error('Error fetching user dashboard:', error);
    throw error;
  }
};
