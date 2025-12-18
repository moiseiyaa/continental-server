import { Request, Response, NextFunction } from 'express';

/**
 * XSS Protection Sanitization
 * Removes potentially dangerous characters and patterns from inputs
 */

// Characters that should be escaped in strings
const DANGEROUS_CHARS = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
};

/**
 * Escape HTML special characters to prevent XSS
 */
export const escapeHtml = (text: string): string => {
  if (typeof text !== 'string') return text;
  return text.replace(/[&<>"'\/]/g, (char) => DANGEROUS_CHARS[char as keyof typeof DANGEROUS_CHARS]);
};

/**
 * Trim and sanitize string input
 */
export const sanitizeString = (input: any): string => {
  if (typeof input !== 'string') return '';
  return escapeHtml(input.trim());
};

/**
 * Sanitize object recursively
 */
export const sanitizeObject = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }

  if (obj !== null && typeof obj === 'object') {
    const sanitized: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const sanitizedKey = sanitizeString(key);
        sanitized[sanitizedKey] = sanitizeObject(obj[key]);
      }
    }
    return sanitized;
  }

  if (typeof obj === 'string') {
    return sanitizeString(obj);
  }

  return obj;
};

/**
 * Middleware to sanitize request body, query, and params
 */
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  // Sanitize body
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }

  // Sanitize query parameters
  if (req.query && typeof req.query === 'object') {
    const sanitizedQuery: any = {};
    for (const key in req.query) {
      if (Object.prototype.hasOwnProperty.call(req.query, key)) {
        const sanitizedKey = sanitizeString(key);
        sanitizedQuery[sanitizedKey] = sanitizeString(String(req.query[key]));
      }
    }
    req.query = sanitizedQuery;
  }

  // Sanitize URL parameters
  if (req.params && typeof req.params === 'object') {
    const sanitizedParams: any = {};
    for (const key in req.params) {
      if (Object.prototype.hasOwnProperty.call(req.params, key)) {
        const sanitizedKey = sanitizeString(key);
        sanitizedParams[sanitizedKey] = sanitizeString(req.params[key]);
      }
    }
    req.params = sanitizedParams;
  }

  next();
};

/**
 * Validate email format more strictly
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

/**
 * Validate password strength
 */
export const isStrongPassword = (password: string): boolean => {
  return (
    password.length >= 8 &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[!@#$%^&*]/.test(password)
  );
};

/**
 * Validate URL format
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Remove null bytes and other dangerous patterns
 */
export const sanitizeForDatabase = (input: string): string => {
  if (typeof input !== 'string') return '';
  
  // Remove null bytes
  let sanitized = input.replace(/\0/g, '');
  
  // Remove control characters
  sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, '');
  
  // Trim whitespace
  sanitized = sanitized.trim();
  
  return sanitized;
};
