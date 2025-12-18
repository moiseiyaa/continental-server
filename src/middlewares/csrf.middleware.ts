import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { BadRequestError } from '../utils/apiError';

const CSRF_TOKEN_HEADER = 'x-csrf-token';
const CSRF_COOKIE_NAME = '__csrf_token__';

/**
 * CSRF token generation middleware
 * Generates and stores CSRF token in secure cookie
 */
export const generateCsrfToken = (req: any, res: Response, next: NextFunction) => {
  // Generate token if not already present
  if (!req.csrfToken) {
    req.csrfToken = crypto.randomBytes(32).toString('hex');
    
    // Set secure, httpOnly cookie
    res.cookie(CSRF_COOKIE_NAME, req.csrfToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });
  }

  // Make token available to templates/responses
  res.locals.csrfToken = req.csrfToken;
  next();
};

/**
 * CSRF token verification middleware
 * Verifies CSRF token on state-changing requests
 */
export const verifyCsrfToken = (req: Request, res: Response, next: NextFunction) => {
  // Only verify on state-changing requests
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  const tokenFromCookie = req.cookies[CSRF_COOKIE_NAME];
  const tokenFromHeader = req.headers[CSRF_TOKEN_HEADER] as string;

  if (!tokenFromCookie) {
    return next(new BadRequestError('CSRF token not found in cookie'));
  }

  if (!tokenFromHeader) {
    return next(new BadRequestError('CSRF token not found in request header'));
  }

  // Verify tokens match
  if (tokenFromCookie !== tokenFromHeader) {
    return next(new BadRequestError('Invalid CSRF token'));
  }

  next();
};

/**
 * Middleware to exclude certain routes from CSRF check
 * Useful for public APIs or third-party integrations
 */
export const csrfExclude = (paths: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const isExcluded = paths.some(path => req.path.startsWith(path));
    
    if (isExcluded) {
      // Skip CSRF verification for these paths
      return next();
    }

    verifyCsrfToken(req, res, next);
  };
};
