import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

/**
 * Simple in-memory cache for responses
 * Can be upgraded to Redis for distributed caching
 */
interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number; // Time to live in seconds
}

class ResponseCache {
  private cache: Map<string, CacheEntry> = new Map();
  private readonly defaultTTL = 5 * 60; // 5 minutes default

  /**
   * Generate cache key from request
   */
  private generateKey(req: Request): string {
    const { method, path, query } = req;
    const queryString = Object.keys(query)
      .sort()
      .map(key => `${key}=${query[key]}`)
      .join('&');
    
    return crypto
      .createHash('md5')
      .update(`${method}:${path}?${queryString}`)
      .digest('hex');
  }

  /**
   * Check if cache entry is valid
   */
  private isValid(entry: CacheEntry): boolean {
    const now = Date.now();
    const ageInSeconds = (now - entry.timestamp) / 1000;
    return ageInSeconds < entry.ttl;
  }

  /**
   * Get cached response
   */
  get(req: Request): any {
    const key = this.generateKey(req);
    const entry = this.cache.get(key);

    if (!entry) return null;

    if (!this.isValid(entry)) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Set cache response
   */
  set(req: Request, data: any, ttl: number = this.defaultTTL): void {
    const key = this.generateKey(req);
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  /**
   * Clear specific cache entry
   */
  clear(req: Request): void {
    const key = this.generateKey(req);
    this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clearAll(): void {
    this.cache.clear();
  }

  /**
   * Clear cache entries matching pattern
   */
  clearByPattern(pattern: string): void {
    const keys = Array.from(this.cache.keys());
    keys.forEach(key => {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    });
  }

  /**
   * Get cache size
   */
  getSize(): number {
    return this.cache.size;
  }
}

// Global cache instance
const cache = new ResponseCache();

/**
 * Cache middleware - caches GET requests
 */
export const cacheMiddleware = (options?: { ttl?: number; excludePaths?: string[] }) => {
  const ttl = options?.ttl || 5 * 60; // 5 minutes default
  const excludePaths = options?.excludePaths || [];

  return (req: Request, res: Response, next: NextFunction) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Skip if path is excluded
    if (excludePaths.some(path => req.path.includes(path))) {
      return next();
    }

    // Check cache
    const cachedResponse = cache.get(req);
    if (cachedResponse) {
      res.set('X-Cache', 'HIT');
      return res.status(200).json(cachedResponse);
    }

    res.set('X-Cache', 'MISS');

    // Override res.json to cache response
    const originalJson = res.json;
    res.json = function(data: any) {
      cache.set(req, data, ttl);
      return originalJson.call(this, data);
    };

    next();
  };
};

/**
 * Cache invalidation middleware - clears cache on modifications
 */
export const invalidateCache = (patterns: string[] = []) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Only invalidate on state-changing requests
    if (!['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
      return next();
    }

    // Clear cache patterns
    patterns.forEach(pattern => {
      cache.clearByPattern(pattern);
    });

    next();
  };
};

/**
 * Export cache instance for manual control
 */
export { cache };

/**
 * Utility function to get cache stats
 */
export const getCacheStats = () => {
  return {
    size: cache.getSize(),
  };
};
