import { pool } from '../config/db'

async function checkTableDefinition() {
  try {
    console.log('🔍 Checking bookings table definition...')
    
    // Get table definition
    const definition = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'bookings' 
      ORDER BY ordinal_position
    `)
    
    console.log('\n📋 Bookings Table Columns:')
    definition.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`)
    })
    
    // Check check constraints more specifically
    const checkConstraints = await pool.query(`
      SELECT conname, pg_get_constraintdef(oid) as definition
      FROM pg_constraint 
      WHERE conrelid = 'bookings'::regclass AND contype = 'c'
    `)
    
    console.log('\n📋 Check Constraints:')
    checkConstraints.rows.forEach(constraint => {
      console.log(`  - ${constraint.conname}: ${constraint.definition}`)
    })
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await pool.end()
  }
}

checkTableDefinition()
