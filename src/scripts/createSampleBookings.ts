import { pool } from '../config/db'

async function createSampleBookings() {
  try {
    console.log('🎫 Creating sample bookings for dashboard...')
    
    // Get existing users and trips
    const users = await pool.query('SELECT id, name FROM users WHERE is_active = true LIMIT 5')
    const trips = await pool.query('SELECT id, title, price FROM trips WHERE status = \'active\' LIMIT 10')
    
    if (users.rows.length === 0) {
      console.log('❌ No active users found. Please create some users first.')
      return
    }
    
    if (trips.rows.length === 0) {
      console.log('❌ No active trips found. Please create some trips first.')
      return
    }
    
    console.log(`Found ${users.rows.length} users and ${trips.rows.length} trips`)
    
    // Create sample bookings
    const sampleBookings = [
      {
        user_id: users.rows[0]?.id,
        trip_id: trips.rows[0]?.id,
        number_of_participants: 2,
        total_price: Number(trips.rows[0]?.price || 0) * 2,
        status: 'confirmed',
        payment_status: 'PAID',
        booking_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        special_requests: 'Vegetarian meals please'
      },
      {
        user_id: users.rows[1]?.id,
        trip_id: trips.rows[1]?.id,
        number_of_participants: 1,
        total_price: Number(trips.rows[1]?.price || 0),
        status: 'confirmed',
        payment_status: 'PAID',
        booking_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        special_requests: 'Window seat preferred'
      },
      {
        user_id: users.rows[2]?.id,
        trip_id: trips.rows[2]?.id,
        number_of_participants: 4,
        total_price: Number(trips.rows[2]?.price || 0) * 4,
        status: 'pending',
        payment_status: 'PENDING',
        booking_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
        special_requests: 'Allergic to nuts'
      },
      {
        user_id: users.rows[0]?.id,
        trip_id: trips.rows[3]?.id,
        number_of_participants: 3,
        total_price: Number(trips.rows[3]?.price || 0) * 3,
        status: 'confirmed',
        payment_status: 'PAID',
        booking_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        special_requests: null
      },
      {
        user_id: users.rows[3]?.id,
        trip_id: trips.rows[4]?.id,
        number_of_participants: 2,
        total_price: Number(trips.rows[4]?.price || 0) * 2,
        status: 'pending',
        payment_status: 'PENDING',
        booking_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        special_requests: 'Early check-in requested'
      }
    ]
    
    // Insert bookings
    for (const booking of sampleBookings) {
      await pool.query(`
        INSERT INTO bookings (user_id, trip_id, number_of_participants, total_price, status, payment_status, booking_date, special_requests, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
        ON CONFLICT DO NOTHING
      `, [
        booking.user_id,
        booking.trip_id,
        booking.number_of_participants,
        booking.total_price,
        booking.status,
        booking.payment_status,
        booking.booking_date,
        booking.special_requests
      ])
    }
    
    console.log('✅ Sample bookings created successfully!')
    
    // Show summary
    const results = await pool.query(`
      SELECT 
        COUNT(*) as total_bookings,
        COUNT(*) FILTER (WHERE status = 'confirmed') as confirmed_bookings,
        COUNT(*) FILTER (WHERE status = 'pending') as pending_bookings,
        COALESCE(SUM(total_price), 0) as total_revenue
      FROM bookings
    `)
    
    const stats = results.rows[0]
    console.log('\n📊 Booking Summary:')
    console.log(`  Total Bookings: ${stats.total_bookings}`)
    console.log(`  Confirmed: ${stats.confirmed_bookings}`)
    console.log(`  Pending: ${stats.pending_bookings}`)
    console.log(`  Total Revenue: $${stats.total_revenue}`)
    
  } catch (error) {
    console.error('❌ Error creating sample bookings:', error)
  } finally {
    await pool.end()
  }
}

createSampleBookings()
