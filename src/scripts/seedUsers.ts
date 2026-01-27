import { pool } from '../config/db';
import { config } from 'dotenv';
import bcrypt from 'bcryptjs';

config();

interface UserSeed {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  email_verified?: boolean;
  is_active?: boolean;
}

const USERS: UserSeed[] = [
  {
    name: 'Admin User',
    email: 'admin@continental.com',
    password: 'Admin@123', // Will be hashed before insertion
    role: 'admin',
    email_verified: true,
    is_active: true,
  },
  {
    name: 'Test Admin',
    email: 'testadmin@continental.com',
    password: 'TestAdmin@123',
    role: 'admin',
    email_verified: true,
    is_active: true,
  },
];

async function seed(): Promise<void> {
  const client = await pool.connect();
  let success = false;

  try {
    await client.query('BEGIN');

    // Create users table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'guest')),
        reset_password_token VARCHAR(255),
        reset_password_expire TIMESTAMP,
        email_verified BOOLEAN DEFAULT FALSE,
        email_verification_token VARCHAR(255),
        email_verification_expire TIMESTAMP,
        refresh_token_hash VARCHAR(255),
        refresh_token_expire TIMESTAMP,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created users table (if it didn\'t exist)');

    // Check if admin users already exist
    for (const user of USERS) {
      const existingUser = await client.query(
        'SELECT id FROM users WHERE email = $1',
        [user.email]
      );

      if (existingUser.rows.length > 0) {
        console.log(`⚠️  User with email ${user.email} already exists. Skipping...`);
        continue;
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);

      // Insert user
      await client.query(
        `INSERT INTO users (
          name, email, password, role, email_verified, is_active, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
        [
          user.name,
          user.email,
          hashedPassword,
          user.role,
          user.email_verified ?? true,
          user.is_active ?? true,
        ]
      );

      console.log(`✅ Created ${user.role} user: ${user.email}`);
    }

    await client.query('COMMIT');
    console.log(`🚀 Seeded ${USERS.length} users`);
    console.log('✅ Database seeding completed successfully!');
    console.log('\n📋 Admin Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    USERS.forEach((user) => {
      console.log(`Email: ${user.email}`);
      console.log(`Password: ${user.password}`);
      console.log(`Role: ${user.role}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    });
    success = true;
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('❌ Failed to seed users:', error.message);
    if (error.code) {
      console.error(`   Error code: ${error.code}`);
    }
    if (error.detail) {
      console.error(`   Detail: ${error.detail}`);
    }
    success = false;
  } finally {
    client.release();
    await pool.end();
    process.exit(success ? 0 : 1);
  }
}

seed();

