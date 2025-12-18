import { Request, Response, NextFunction } from 'express';

interface RateLimitStore {
  [key: string]: { count: number; resetTime: number };
}

const store: RateLimitStore = {};

/**
 * Rate limiter middleware
 * Limits requests per IP address within a time window
 */
export const rateLimiter = (options?: {
  windowMs?: number; // Time window in milliseconds (default: 15 minutes)
  maxRequests?: number; // Max requests per window (default: 100)
  message?: string; // Custom message
  keyGenerator?: (req: Request) => string; // Custom key generator
}) => {
  const windowMs = options?.windowMs || 15 * 60 * 1000; // 15 minutes
  const maxRequests = options?.maxRequests || 100;
  const message = options?.message || 'Too many requests from this IP, please try again later.';
  const keyGenerator = options?.keyGenerator || ((req: Request) => req.ip || '127.0.0.1');

  return (req: Request, res: Response, next: NextFunction) => {
    const key = keyGenerator(req);
    const now = Date.now();

    // Clean up old entries
    if (store[key] && store[key].resetTime < now) {
      delete store[key];
    }

    // Initialize or update entry
    if (!store[key]) {
      store[key] = {
        count: 1,
        resetTime: now + windowMs,
      };
    } else {
      store[key].count++;
    }

    // Check if limit exceeded
    if (store[key].count > maxRequests) {
      res.set('Retry-After', String(Math.ceil((store[key].resetTime - now) / 1000)));
      return res.status(429).json({
        success: false,
        error: message,
      });
    }

    // Add rate limit info to response headers
    res.set({
      'X-RateLimit-Limit': String(maxRequests),
      'X-RateLimit-Remaining': String(Math.max(0, maxRequests - store[key].count)),
      'X-RateLimit-Reset': String(store[key].resetTime),
    });

    next();
  };
};

/**
 * Specific rate limiter for login/register attempts
 */
export const authRateLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 attempts per 15 minutes
  message: 'Too many login/registration attempts, please try again after 15 minutes.',
  keyGenerator: (req: Request) => `${req.ip}-${req.path}`,
});

/**
 * Specific rate limiter for password reset
 */
export const passwordResetLimiter = rateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 3, // 3 attempts per hour
  message: 'Too many password reset requests, please try again later.',
  keyGenerator: (req: Request) => `${req.ip}-password-reset`,
});

/**
 * Specific rate limiter for general API endpoints
 */
export const apiLimiter = rateLimiter({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 100, // 100 requests per minute
  keyGenerator: (req: Request) => req.ip || '127.0.0.1',
});
