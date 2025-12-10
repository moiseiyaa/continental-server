import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import { JWT_SECRET } from '../config/env';
import { UnauthorizedError } from '../utils/apiError';

// Protect routes
export const protect = async (req: any, res: Response, next: NextFunction) => {
  let token: string | undefined;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    // Set token from cookie
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    return next(new UnauthorizedError('Not authorized to access this route'));
  }

  try {
    // Verify token
    const decoded: any = jwt.verify(token, JWT_SECRET);

    req.user = await User.findById(decoded.id).select('-password');

    next();
  } catch (err) {
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
