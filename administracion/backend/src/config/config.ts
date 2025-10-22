import * as dotenv from 'dotenv';

dotenv.config();

export const config = {
  server: {
    port: parseInt(process.env.PORT || '3003', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
  },
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    username: process.env.DB_USERNAME || 'appuser',
    password: process.env.DB_PASSWORD || 'apppassword',
    database: process.env.DB_DATABASE || 'crunchypaws',
    synchronize: false, // Deshabilitado - la DB debe existir previamente
    logging: process.env.NODE_ENV === 'development',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'admin-jwt-secret-key-2024',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'admin-refresh-secret-key-2024',
    expiresIn: process.env.JWT_EXPIRES_IN || '8h',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:4200', 'http://localhost:80'],
  },
  fel: {
    provider: {
      url: process.env.FEL_PROVIDER_URL || 'https://api.fel.gt/stub',
      token: process.env.FEL_PROVIDER_TOKEN || 'fel-stub-token',
      username: process.env.FEL_PROVIDER_USERNAME || 'fel-username',
      password: process.env.FEL_PROVIDER_PASSWORD || 'fel-password',
    },
  },
  email: {
    smtp: {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      user: process.env.SMTP_USER || 'admin@crunchypaws.com',
      pass: process.env.SMTP_PASS || 'admin-app-password',
    },
    from: process.env.EMAIL_FROM || 'noreply@crunchypaws.com',
  },
  upload: {
    path: process.env.UPLOAD_PATH || './uploads',
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10), // 5MB
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || './logs/admin.log',
  },
};
