import dotenv from 'dotenv';
import path from 'path';

// Load .env file only in development (Vercel uses environment variables)
try {
  dotenv.config({ path: path.join(__dirname, '../../.env') });
} catch (err) {
  // Silently ignore if .env doesn't exist (e.g., on Vercel)
}

export const NODE_ENV = process.env.NODE_ENV || 'development';
export const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
export const MONGODB_URI = process.env.MONGODB_URI || process.env.DATABASE_URL || '';
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
