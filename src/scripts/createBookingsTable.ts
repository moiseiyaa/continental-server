import { pool } from '../config/db';

async function createBookingsTable(): Promise<void> {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Create bookings table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        trip_id INTEGER NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
        number_of_participants INTEGER NOT NULL DEFAULT 1,
        total_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
        status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
        payment_status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
        booking_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        special_requests TEXT,
        participant_details JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created bookings table (if it didn\'t exist)');

    // Create indexes for better query performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id)
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_bookings_trip_id ON bookings(trip_id)
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status)
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON bookings(payment_status)
    `);
    console.log('✅ Created indexes for bookings table');

    await client.query('COMMIT');
    console.log('✅ Bookings table setup completed successfully');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error creating bookings table:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run if called directly
if (require.main === module) {
  createBookingsTable()
    .then(() => {
      console.log('✅ Script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Script failed:', error);
      process.exit(1);
    });
}

export default createBookingsTable;

