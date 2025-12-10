import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

export const NODE_ENV = process.env.NODE_ENV || 'development';
export const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
export const MONGODB_URI = process.env.MONGODB_URI || '';
export const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
export const JWT_EXPIRE = process.env.JWT_EXPIRE || '30d';
export const JWT_COOKIE_EXPIRE = process.env.JWT_COOKIE_EXPIRE
  ? parseInt(process.env.JWT_COOKIE_EXPIRE, 10)
  : 30;
export const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';
