import { pool } from '../config/db';
import { IBooking, IBookingInput } from '../interfaces/booking.interface';

// Ensure bookings table exists
const ensureBookingsTable = async () => {
  try {
    // Create table if it doesn't exist (includes all latest columns)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        trip_id INTEGER NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
        number_of_participants INTEGER NOT NULL DEFAULT 1,
        total_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
        status VARCHAR(50) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING','RESERVED','CONFIRMED','CANCELLED')),
        payment_status VARCHAR(50) NOT NULL DEFAULT 'PENDING' CHECK (payment_status IN ('PENDING','PAID','REFUNDED')),
        booking_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        special_requests TEXT,
        participant_details JSONB DEFAULT '[]'::jsonb,
        add_accommodation BOOLEAN NOT NULL DEFAULT false,
        reservation_expiry TIMESTAMP NULL,
        payment_id VARCHAR(255) NULL,
        idempotency_key VARCHAR(255) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Back-fill: add new columns to legacy tables if they are missing (safe idempotent)
    const addColumnIfMissing = async (col: string, type: string) => {
      const existsRes = await pool.query(
        `SELECT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'bookings' AND column_name = $1
        ) AS exists`,
        [col],
      );
      if (!existsRes.rows[0].exists) {
        await pool.query(`ALTER TABLE bookings ADD COLUMN ${col} ${type};`);
        console.log(`Added missing column bookings.${col}`);
      }
    };
    await addColumnIfMissing('add_accommodation', 'BOOLEAN NOT NULL DEFAULT false');
    await addColumnIfMissing('reservation_expiry', 'TIMESTAMP NULL');
    await addColumnIfMissing('payment_id', 'VARCHAR(255) NULL');
    await addColumnIfMissing('idempotency_key', 'VARCHAR(255) NULL');

    // Ensure index for idempotency checks exists
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_bookings_idempotency ON bookings(user_id, trip_id, idempotency_key);
    `);
  } catch (error) {
    // Table might already exist, ignore error
    console.log('Bookings table check:', error instanceof Error ? error.message : 'unknown error');
  }
};

// Initialize table on module load
let tableInitialized = false;
const initializeTable = async () => {
  if (!tableInitialized) {
    await ensureBookingsTable();
    tableInitialized = true;
  }
};

// CREATE a booking - transactional (handles booking + participant count)
export const createBooking = async (data: IBookingInput, userId: string): Promise<IBooking | null> => {
  await initializeTable();
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // 1. Fetch trip to ensure participant limits
    const tripId = (data as any).tripId || (data as any).trip;
    const numberOfParticipants = (data as any).guests || (data as any).numberOfParticipants || 1;
    const tripRes = await client.query('SELECT * FROM trips WHERE id = $1 FOR UPDATE', [tripId]);
    if (!tripRes.rows.length) throw new Error('Trip not found');
    const trip = tripRes.rows[0];
    if (trip.current_participants + numberOfParticipants > trip.max_participants) {
      throw new Error('Not enough spots available for this trip');
    }
    // 2. Insert into bookings
    const totalPrice = parseFloat(trip.price) * numberOfParticipants;

    // Normalize and validate paymentStatus
    const rawPaymentStatus = (data as any).paymentStatus || 'PENDING';
    const paymentStatus = String(rawPaymentStatus).trim().toUpperCase(); // DB CHECK expects uppercase

    // support new columns: add_accommodation, reservation_expiry, payment_id
    const insertRes = await client.query(
      `INSERT INTO bookings (user_id, trip_id, number_of_participants, total_price, status, payment_status, booking_date, special_requests, participant_details, add_accommodation, reservation_expiry, payment_id, idempotency_key)
      VALUES ($1, $2, $3, $4, $5, $6, NOW(), $7, $8, $9, $10, $11, $12)
      RETURNING *`,
      [userId, tripId, numberOfParticipants, totalPrice, (data as any).status || 'PENDING', paymentStatus, (data as any).specialRequests || null, JSON.stringify((data as any).participantDetails || []), (data as any).addAccommodation || false, (data as any).reservationExpiry || null, (data as any).paymentId || null, (data as any).idempotencyKey || null]
    );
    // 3. Update trip participant count
    await client.query(
      'UPDATE trips SET current_participants = current_participants + $1 WHERE id = $2',
      [numberOfParticipants, tripId]
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
// Check for duplicate booking using idempotency key within a time window (24 hours)
export const checkDuplicateBooking = async (userId: string, tripId: string, idempotencyKey: string): Promise<{ exists: boolean; bookingId?: string }> => {
  try {
    const { rows } = await pool.query(
      `SELECT id FROM bookings WHERE user_id = $1 AND trip_id = $2 AND idempotency_key = $3 AND created_at > NOW() - INTERVAL '24 hours' LIMIT 1`,
      [userId, tripId, idempotencyKey]
    );
    if (rows.length > 0) return { exists: true, bookingId: String(rows[0].id) };
    return { exists: false };
  } catch (error) {
    console.error('checkDuplicateBooking error:', error instanceof Error ? error.message : error);
    return { exists: false };
  }
};