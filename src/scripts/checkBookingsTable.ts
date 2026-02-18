import { pool } from '../config/db'

async function checkBookingsTable() {
  try {
    console.log('📋 Checking bookings table structure...')
    
    // Get table structure
    const structure = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'bookings' 
      ORDER BY ordinal_position
    `)
    
    console.log('\n📋 Bookings Table Columns:')
    structure.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type}`)
    })
    
    // Get sample data
    const sample = await pool.query('SELECT * FROM bookings LIMIT 3')
    console.log(`\n📄 Sample Bookings (${sample.rows.length}):`)
    if (sample.rows.length > 0) {
      console.log(JSON.stringify(sample.rows, null, 2))
    } else {
      console.log('No bookings found in table')
    }
    
    // Check if we need to create some test bookings
    const count = await pool.query('SELECT COUNT(*) as count FROM bookings')
    console.log(`\n📊 Total Bookings: ${count.rows[0].count}`)
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await pool.end()
  }
}

checkBookingsTable()
