import { Pool } from 'pg';
import { DATABASE_URL } from './env';

export const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: DATABASE_URL.includes('sslmode=require')
    ? { rejectUnauthorized: false }
    : undefined,
});

export const connectDB = async (): Promise<void> => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log(`PostgreSQL connected: ${res.rows[0].now}`);
  } catch (error: any) {
    console.error('PostgreSQL connection error:', error.message);
    process.exit(1);
  }
};
