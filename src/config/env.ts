import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load .env file only in development (Vercel uses environment variables)
try {
  // Try multiple possible paths
  const possiblePaths = [
    path.join(__dirname, '../../.env'),
    path.join(process.cwd(), '.env'),
    '/app/.env',
    '/var/task/.env',
  ];

  let envLoaded = false;
  for (const envPath of possiblePaths) {
    if (fs.existsSync(envPath)) {
      console.log(`📂 Found .env at: ${envPath}`);
      const result = dotenv.config({ path: envPath });
      if (!result.error) {
        console.log('✅ .env file loaded successfully');
        envLoaded = true;
        break;
      }
    }
  }

  if (!envLoaded) {
    console.warn('⚠️  .env file not found in any location');
  }
} catch (err) {
  console.warn('⚠️  Error loading .env:', err instanceof Error ? err.message : String(err));
}

export const NODE_ENV = process.env.NODE_ENV || 'development';
export const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
export const DATABASE_URL = process.env.DATABASE_URL || process.env.MONGODB_URI || '';

// Debug: Log DATABASE_URL status
console.log('🔍 Environment Check:');
console.log(`   NODE_ENV: ${NODE_ENV}`);
console.log(`   PORT: ${PORT}`);
console.log(`   DATABASE_URL set: ${DATABASE_URL ? 'YES ✅' : 'NO ❌'}`);
if (DATABASE_URL) {
  // Show masked URL for security
  const maskedUrl = DATABASE_URL.replace(/:[^:/@]+@/, ':****@');
  console.log(`   DATABASE_URL: ${maskedUrl}`);
} else {
  console.error('❌ DATABASE_URL is empty - server will fail to connect!');
  console.error('   Make sure DATABASE_URL is set in your .env file');
}
// Deprecated alias for backward compatibility
export const MONGODB_URI = DATABASE_URL;
export const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
export const JWT_EXPIRE = process.env.JWT_EXPIRE || '30d';
export const JWT_COOKIE_EXPIRE = process.env.JWT_COOKIE_EXPIRE
  ? parseInt(process.env.JWT_COOKIE_EXPIRE, 10)
  : 30;
export const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';
export const SMTP_SERVICE = process.env.SMTP_SERVICE || 'gmail';
export const SMTP_EMAIL = process.env.SMTP_EMAIL || '';
export const SMTP_PASSWORD = process.env.SMTP_PASSWORD || '';
export const SMTP_FROM_EMAIL = process.env.SMTP_FROM_EMAIL || process.env.SMTP_EMAIL || '';
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || '';
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || '';
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || '';
