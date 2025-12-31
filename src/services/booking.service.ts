import { pool } from '../config/db';
import { IBooking, IBookingInput } from '../interfaces/booking.interface';

// CREATE a booking - transactional (handles booking + participant count)
export const createBooking = async (data: IBookingInput, userId: string): Promise<IBooking | null> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // 1. Fetch trip to ensure participant limits
    const tripRes = await client.query('SELECT * FROM trips WHERE id = $1 FOR UPDATE', [data.trip]);
    if (!tripRes.rows.length) throw new Error('Trip not found');
    const trip = tripRes.rows[0];
    if (trip.current_participants + data.numberOfParticipants > trip.max_participants) {
      throw new Error('Not enough spots available for this trip');
    }
    // 2. Insert into bookings
    const totalPrice = parseFloat(trip.price) * data.numberOfParticipants;
    const insertRes = await client.query(
      `INSERT INTO bookings (user_id, trip_id, number_of_participants, total_price, status, payment_status, booking_date, special_requests, participant_details)
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7, $8)
      RETURNING *`,
      [userId, data.trip, data.numberOfParticipants, totalPrice, 'pending', 'pending', data.specialRequests || null, JSON.stringify(data.participantDetails || [])]
    );
    // 3. Update trip participant count
    await client.query(
      'UPDATE trips SET current_participants = current_participants + $1 WHERE id = $2',
      [data.numberOfParticipants, data.trip]
    );
    await client.query('COMMIT');
    return insertRes.rows[0] as IBooking;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

// GET all bookings for a specific user
export const getUserBookings = async (userId: string): Promise<IBooking[]> => {
  const { rows } = await pool.query(
    `SELECT b.*, t.title as trip_title, t.destination, t.start_date, t.end_date
     FROM bookings b
     JOIN trips t ON b.trip_id = t.id
     WHERE b.user_id = $1
     ORDER BY b.created_at DESC`,
    [userId]
  );
  return rows as IBooking[];
};

// GET booking by ID (with trip and user info join)
export const getBookingById = async (id: string): Promise<IBooking | null> => {
  const { rows } = await pool.query(
    `SELECT b.*, t.title as trip_title, t.destination, t.start_date, t.end_date, u.name as user_name, u.email as user_email
     FROM bookings b
     JOIN trips t ON b.trip_id = t.id
     JOIN users u ON b.user_id = u.id
     WHERE b.id = $1`,
    [id]
  );
  return rows.length ? (rows[0] as IBooking) : null;
};

// GET all bookings (admin, paginated)
export const getAllBookings = async (page = 1, limit = 10, filters: any = {}): Promise<{ bookings: IBooking[]; total: number; pages: number }> => {
  const offset = (page - 1) * limit;
  let whereClause = '';
  const params: any[] = [];
  if (filters.status) {
    params.push(filters.status);
    whereClause += `b.status = $${params.length}`;
  }
  if (filters.tripId) {
    params.push(filters.tripId);
    whereClause += (whereClause ? ' AND ' : '') + `b.trip_id = $${params.length}`;
  }
  if (filters.userId) {
    params.push(filters.userId);
    whereClause += (whereClause ? ' AND ' : '') + `b.user_id = $${params.length}`;
  }
  const whereSQL = whereClause ? `WHERE ${whereClause}` : '';
  // Booking with trip and user summary
  const { rows } = await pool.query(
    `SELECT b.*, t.title as trip_title, u.name as user_name, t.destination
      , COUNT(*) OVER() as total_count
     FROM bookings b
     JOIN trips t ON b.trip_id = t.id
     JOIN users u ON b.user_id = u.id
     ${whereSQL}
     ORDER BY b.created_at DESC
     LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
    [...params, limit, offset]
  );
  const total = rows.length > 0 ? Number(rows[0].total_count) : 0;
  const bookings = rows.map(({ total_count, ...bk }) => bk as IBooking);
  return {
    bookings,
    total,
    pages: Math.ceil(total / limit)
  };
};

// UPDATE only booking status
export const updateBookingStatus = async (
  id: string,
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
): Promise<IBooking | null> => {
  const { rows } = await pool.query(
    `UPDATE bookings SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
    [status, id]
  );
  return rows.length ? (rows[0] as IBooking) : null;
};

// UPDATE only payment status
export const updatePaymentStatus = async (
  id: string,
  status: 'pending' | 'paid' | 'refunded'
): Promise<IBooking | null> => {
  const { rows } = await pool.query(
    `UPDATE bookings SET payment_status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
    [status, id]
  );
  return rows.length ? (rows[0] as IBooking) : null;
};

// CANCEL booking (update status to cancelled & optionally update participants count)
export const cancelBooking = async (id: string): Promise<IBooking | null> => {
  // Optionally, you could reduce trip's participant count here if desired
  const { rows } = await pool.query(
    `UPDATE bookings SET status = 'cancelled', updated_at = NOW() WHERE id = $1 RETURNING *`,
    [id]
  );
  return rows.length ? (rows[0] as IBooking) : null;
};

// HARD DELETE booking (admin only!)
export const deleteBooking = async (id: string): Promise<IBooking | null> => {
  const { rows } = await pool.query(
    `DELETE FROM bookings WHERE id = $1 RETURNING *`,
    [id]
  );
  return rows.length ? (rows[0] as IBooking) : null;
};
