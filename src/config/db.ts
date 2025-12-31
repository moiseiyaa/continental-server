import { Pool } from 'pg';
import { DATABASE_URL } from './env';

// Neon PostgreSQL requires SSL connections
export const pool = new Pool({
  connectionString: DATABASE_URL,
  // Neon always requires SSL
  ssl: DATABASE_URL && (DATABASE_URL.includes('neon.tech') || DATABASE_URL.includes('sslmode=require'))
    ? { rejectUnauthorized: false }
    : process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : undefined,
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection cannot be established
});

export const connectDB = async (): Promise<void> => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log(`✅ PostgreSQL (Neon) connected: ${res.rows[0].now}`);
    console.log(`📊 Database URL: ${DATABASE_URL ? DATABASE_URL.replace(/:[^:@]+@/, ':****@') : 'Not configured'}`);
  } catch (error: any) {
    console.error('❌ PostgreSQL connection error:', error.message);
    console.error('💡 Make sure DATABASE_URL is set in your .env file');
    console.error('💡 For Neon DB, format: postgresql://user:password@host.neon.tech/dbname?sslmode=require');
    process.exit(1);
  }
};
