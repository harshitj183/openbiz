import { config } from '@/config';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const levels: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const currentLevel = levels[config.logLevel as LogLevel] || levels.info;

export const logger = {
  debug: (msg: string, data?: any) => {
    if (levels.debug >= currentLevel) {
      console.log(`[DEBUG] ${msg}`, data ? JSON.stringify(data, null, 2) : '');
    }
  },
  
  info: (msg: string, data?: any) => {
    if (levels.info >= currentLevel) {
      console.log(`[INFO] ${msg}`, data ? JSON.stringify(data, null, 2) : '');
    }
  },
  
  warn: (msg: string, data?: any) => {
    if (levels.warn >= currentLevel) {
      console.warn(`[WARN] ${msg}`, data ? JSON.stringify(data, null, 2) : '');
    }
  },
  
  error: (msg: string, err?: any) => {
    if (levels.error >= currentLevel) {
      if (err instanceof Error) {
        console.error(`[ERROR] ${msg}`, {
          message: err.message,
          stack: err.stack,
        });
      } else {
        console.error(`[ERROR] ${msg}`, err ? JSON.stringify(err, null, 2) : '');
      }
    }
  },
};
