import { CORS_ORIGIN } from './env';

export const corsOptions = {
  origin: CORS_ORIGIN,
  credentials: true,
  optionsSuccessStatus: 200,
};
