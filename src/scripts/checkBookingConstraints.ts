import { pool } from '../config/db'

async function checkBookingConstraints() {
  try {
    console.log('🔍 Checking booking constraints...')
    
    // Try to insert a simple booking to see what works
    try {
      await pool.query(`
        INSERT INTO bookings (user_id, trip_id, number_of_participants, total_price, status, payment_status, booking_date, created_at, updated_at)
        VALUES (1, 1, 1, 100, 'pending', 'pending', NOW(), NOW(), NOW())
      `)
      console.log('✅ Simple booking insertion worked')
      
      // Remove the test booking
      await pool.query('DELETE FROM bookings WHERE user_id = 1 AND trip_id = 1 AND created_at >= NOW() - INTERVAL \'1 minute\'')
    } catch (error) {
      console.log('❌ Simple booking failed:', error.message)
      
      // Try different payment statuses
      const statuses = ['unpaid', 'paid', 'pending', 'failed']
      for (const status of statuses) {
        try {
          await pool.query(`
            INSERT INTO bookings (user_id, trip_id, number_of_participants, total_price, status, payment_status, booking_date, created_at, updated_at)
            VALUES (999, 999, 1, 100, 'pending', $1, NOW(), NOW(), NOW())
          `, [status])
          console.log(`✅ Payment status '${status}' works`)
          await pool.query('DELETE FROM bookings WHERE user_id = 999')
          break
        } catch (e) {
          console.log(`❌ Payment status '${status}' failed: ${e.message}`)
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await pool.end()
  }
}

checkBookingConstraints()
