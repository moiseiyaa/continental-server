// src/config/cors.ts
import { CORS_ORIGIN, NODE_ENV } from './env';
import { Request, Response, NextFunction } from 'express';

// Get allowed origins
const getAllowedOrigins = (): string[] => {
  if (NODE_ENV !== 'production') {
    return ['*'];
  }
  
  if (!CORS_ORIGIN) {
    console.warn('CORS_ORIGIN is not set in environment variables');
    return [];
  }
  
  return CORS_ORIGIN.split(',').map(o => o.trim()).filter(Boolean);
};

const allowedOrigins = getAllowedOrigins();

// CORS middleware
export const corsMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    // Set CORS headers
    const origin = req.headers.origin;
    
    // In development or if origin is in allowedOrigins
    if (NODE_ENV !== 'production' || (origin && allowedOrigins.includes(origin))) {
      res.setHeader('Access-Control-Allow-Origin', origin || '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRF-Token');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    }
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }
    
    // Continue to next middleware
    next();
  } catch (error) {
    console.error('CORS middleware error:', error);
    next(error);
  }
};

// For backward compatibility
export const simpleCors = corsMiddleware;