import winston from 'winston';
import path from 'path';
import { NODE_ENV } from '../config/env';

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(colors);

// Define format
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// Define transports
const transports = [
  // Console transport
  new winston.transports.Console(),
  
  // Error log file
  new winston.transports.File({
    filename: path.join(__dirname, '../../logs/error.log'),
    level: 'error',
    format: winston.format.uncolorize(),
  }),
  
  // All logs file
  new winston.transports.File({
    filename: path.join(__dirname, '../../logs/all.log'),
    format: winston.format.uncolorize(),
  }),
];

// Create logger
const logger = winston.createLogger({
  level: NODE_ENV === 'production' ? 'warn' : 'debug',
  levels,
  format,
  transports,
});

export default logger;

/**
 * Logger utility functions for common use cases
 */
export const logError = (message: string, error?: any) => {
  logger.error(`${message}${error ? ': ' + error.message : ''}`);
  if (error?.stack && NODE_ENV !== 'production') {
    logger.debug(error.stack);
  }
};

export const logWarn = (message: string) => {
  logger.warn(message);
};

export const logInfo = (message: string) => {
  logger.info(message);
};

export const logDebug = (message: string, data?: any) => {
  if (NODE_ENV !== 'production') {
    if (data) {
      logger.debug(`${message}: ${JSON.stringify(data)}`);
    } else {
      logger.debug(message);
    }
  }
};

export const logHttpRequest = (method: string, url: string, statusCode: number, responseTime: number) => {
  logger.http(`${method} ${url} ${statusCode} - ${responseTime}ms`);
};

export const logSecurityEvent = (event: string, userId?: string, details?: any) => {
  logger.warn(
    `SECURITY: ${event}${userId ? ` | User: ${userId}` : ''}${details ? ` | Details: ${JSON.stringify(details)}` : ''}`
  );
};
