const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_VKmGDI80quwF@ep-polished-mud-ahusl0i8-pooler.c-3.us-east-1.aws.neon.tech/Continentaldb?sslmode=require&channel_binding=require',
});

async function check() {
  try {
    const result = await pool.query('SELECT id, title, images FROM trips WHERE id = $1', [2]);
    console.log('Trip 2 from database:');
    console.log(JSON.stringify(result.rows[0], null, 2));
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}

check();
