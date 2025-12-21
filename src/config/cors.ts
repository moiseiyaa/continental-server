// src/config/cors.ts
import { CORS_ORIGIN } from './env';

const allowedOrigins = CORS_ORIGIN.split(',').map(o => o.trim());

export const corsOptions = {
  origin: (origin: string | undefined, cb: (err: Error | null, ok?: boolean) => void) => {
    // allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return cb(null, true);
    cb(null, allowedOrigins.includes(origin));
  },
  credentials: true,
  optionsSuccessStatus: 200,
};