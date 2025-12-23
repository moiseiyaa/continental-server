import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import { JWT_SECRET } from '../config/env';
import { UnauthorizedError } from '../utils/apiError';

// Protect routes
export const protect = async (req: any, res: Response, next: NextFunction) => {
  let token: string | undefined;

  console.log('Auth middleware: Checking authentication...');

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
    console.log('Auth middleware: Token found in Authorization header');
  } else if (req.cookies.token) {
    // Set token from cookie
    token = req.cookies.token;
    console.log('Auth middleware: Token found in cookies');
  }

  // Make sure token exists
  if (!token) {
    console.log('Auth middleware: No token found');
    return next(new UnauthorizedError('Not authorized to access this route'));
  }

  console.log('Auth middleware: Token found, verifying...');

  try {
    // Verify token
    const decoded: any = jwt.verify(token, JWT_SECRET);
    console.log('Auth middleware: Token verified for user ID:', decoded.id);

    req.user = await User.findById(decoded.id).select('-password');
    
    if (!req.user) {
      console.log('Auth middleware: User not found in database');
      return next(new UnauthorizedError('User not found'));
    }
    
    console.log('Auth middleware: User authenticated:', req.user.email);
    next();
  } catch (err) {
    console.log('Auth middleware: Token verification failed:', err);
    return next(new UnauthorizedError('Not authorized to access this route'));
  }
};

// Grant access to specific roles
export const authorize = (...roles: string[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new UnauthorizedError(
          `User role ${req.user.role} is not authorized to access this route`
        )
      );
    }
    next();
  };
};
