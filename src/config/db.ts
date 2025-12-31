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
  connectionTimeoutMillis: 10000, // Increased from 2000ms to 10000ms for Neon
  statement_timeout: 10000,
  query_timeout: 10000,
});

export const connectDB = async (): Promise<void> => {
  try {
    console.log('🔄 Attempting to connect to PostgreSQL...');
    console.log(`📊 DATABASE_URL configured: ${DATABASE_URL ? 'YES ✅' : 'NO ❌'}`);
    
    const res = await pool.query('SELECT NOW()');
    console.log(`✅ PostgreSQL (Neon) connected: ${res.rows[0].now}`);
    console.log(`📊 Database URL: ${DATABASE_URL ? DATABASE_URL.replace(/:[^:@]+@/, ':****@') : 'Not configured'}`);
  } catch (error: any) {
    console.error('❌ PostgreSQL connection error:', error.message);
    console.error('❌ Error code:', error.code);
    console.error('💡 Troubleshooting:');
    console.error('   1. Verify DATABASE_URL is correct in .env');
    console.error('   2. Check if database server is running');
    console.error('   3. Check if firewall allows connection');
    console.error('   4. Verify credentials (user, password, host)');
    console.error('   5. Format: postgresql://user:password@host.neon.tech/dbname?sslmode=require');
    process.exit(1);
  }
};
