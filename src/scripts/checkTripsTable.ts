import { pool } from '../config/db'

async function checkTripsTable() {
  try {
    console.log('🗺️ Checking trips table structure...')
    
    // Get sample trips
    const trips = await pool.query('SELECT id, title, price FROM trips WHERE status = \'active\' LIMIT 5')
    console.log(`\n📄 Active Trips (${trips.rows.length}):`)
    trips.rows.forEach((trip, index) => {
      console.log(`  ${index + 1}. ${trip.title} - $${trip.price}`)
    })
    
    if (trips.rows.length === 0) {
      console.log('No active trips found. Checking all trips...')
      const allTrips = await pool.query('SELECT id, title, price, status FROM trips LIMIT 5')
      console.log(`\n📄 All Trips (${allTrips.rows.length}):`)
      allTrips.rows.forEach((trip, index) => {
        console.log(`  ${index + 1}. ${trip.title} - $${trip.price} (${trip.status})`)
      })
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await pool.end()
  }
}

checkTripsTable()
