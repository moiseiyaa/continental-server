import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { connectDB } from './config/db';
import { errorHandler } from './middlewares/error.middleware';
import { corsOptions } from './config/cors';
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
