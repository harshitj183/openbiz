import dotenv from 'dotenv';
import path from 'path';

// Load .env file
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

export const config = {
  // Environment
  env: process.env.NODE_ENV || 'development',
  isDev: process.env.NODE_ENV !== 'production',
  isProd: process.env.NODE_ENV === 'production',
  
  // Server
  port: parseInt(process.env.PORT || '3001', 10),
  logLevel: process.env.LOG_LEVEL || 'info',
  
  // Database
  database: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/udyam_db',
  },
  
  // Frontend
  frontend: {
    url: process.env.FRONTEND_URL || 'http://localhost:3000',
  },
  
  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret-key-change-in-production',
    expiresIn: '24h',
  },
  
  // Session
  session: {
    secret: process.env.SESSION_SECRET || 'session-secret-key-change-in-production',
  },
  
  // OTP
  otp: {
    expirySeconds: parseInt(process.env.OTP_EXPIRY || '600', 10), // 10 minutes
    maxAttempts: parseInt(process.env.OTP_MAX_ATTEMPTS || '3', 10),
  },
};

// Validate required config
if (!config.database.url) {
  throw new Error('DATABASE_URL environment variable is required');
}
