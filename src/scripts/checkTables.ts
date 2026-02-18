import { pool } from '../config/db'

interface TableColumn {
  table_name: string;
  column_name: string;
  data_type: string;
}

async function checkTables() {
  try {
    console.log('Checking database tables...')
    
    const result = await pool.query(`
      SELECT table_name, column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      ORDER BY table_name, ordinal_position
    `)
    
    const tables: Record<string, string[]> = {}
    result.rows.forEach((row: TableColumn) => {
      if (!tables[row.table_name]) {
        tables[row.table_name] = []
      }
      tables[row.table_name].push(`${row.column_name}: ${row.data_type}`)
    })
    
    console.log('\n📋 Available tables and their columns:')
    Object.keys(tables).forEach((table: string) => {
      console.log(`\n${table}:`)
      tables[table].forEach((col: string) => console.log(`  - ${col}`))
    })
    
  } catch (error) {
    console.error('❌ Error checking tables:', error)
  } finally {
    await pool.end()
  }
}

checkTables()
