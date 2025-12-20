import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { connectDB } from './config/db';
import { errorHandler } from './middlewares/error.middleware';
import { corsOptions } from './config/cors';
import { generateCsrfToken, verifyCsrfToken } from './middlewares/csrf.middleware';
import { apiLimiter } from './middlewares/rateLimiter.middleware';
import { sanitizeInput } from './middlewares/sanitizer.middleware';
import { cacheMiddleware, invalidateCache } from './middlewares/cache.middleware';
import routes from './routes';

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.config();
    this.connectToDatabase();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private config(): void {
    // Middleware
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(cors(corsOptions));

    // CSRF token generation on GET requests
    this.app.use(generateCsrfToken);

    // Rate limiting on API routes
    this.app.use('/api', apiLimiter);

    // Input sanitization on API routes
    this.app.use('/api', sanitizeInput);

    // Response caching on API routes (exclude auth, bookings, notifications - user specific)
    this.app.use('/api', cacheMiddleware({ 
      ttl: 5 * 60, // 5 minutes default
      excludePaths: ['/auth', '/bookings', '/notifications', '/users/profile']
    }));

    // CSRF token verification on state-changing requests (except certain public routes)
    this.app.use('/api', (req: Request, res: Response, next: NextFunction) => {
      // Skip CSRF verification for public routes
      const publicPaths = ['/auth/login', '/auth/register', '/auth/forgot-password', '/auth/reset-password', '/auth/verify-email'];
      const isPublicPath = publicPaths.some(path => req.path.includes(path));
      
      if (isPublicPath && ['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
        return next(); // Skip CSRF for public endpoints
      }
      
      verifyCsrfToken(req, res, next);
    });

    // Logging
    if (process.env.NODE_ENV === 'development') {
      this.app.use(morgan('dev'));
    }
  }

  private connectToDatabase(): void {
    connectDB();
  }

  private initializeRoutes(): void {
    this.app.use('/api', routes);

    // Health check
    this.app.get('/health', (_req: Request, res: Response) => {
      res.status(200).json({ status: 'ok' });
    });

    // 404 handler
    this.app.use((_req: Request, res: Response) => {
      res.status(404).json({ message: 'Not Found' });
    });
  }

  private initializeErrorHandling(): void {
    this.app.use(errorHandler);
  }
}

export default new App().app;
