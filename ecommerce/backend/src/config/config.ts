import dotenv from 'dotenv';

dotenv.config();

export const config = {
  server: {
    port: parseInt(process.env.PORT || '3001', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
  },
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    username: process.env.DB_USERNAME || 'appuser',
    password: process.env.DB_PASSWORD || 'apppassword',
    database: process.env.DB_DATABASE || 'crunchypaws',
    synchronize: process.env.NODE_ENV === 'development',
    logging: process.env.NODE_ENV === 'development',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'ecommerce-jwt-secret-key-2024',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'ecommerce-refresh-secret-key-2024',
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:4200', 'http://localhost:80'],
  },
  email: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.EMAIL_FROM || 'noreply@crunchypaws.com',
  },
  social: {
    whatsapp: {
      baseUrl: process.env.SOCIAL_WHATSAPP_BASE_URL || 'https://api.whatsapp.com/send?phone=50212345678',
    },
    facebook: {
      messengerDeeplink: process.env.FACEBOOK_MESSENGER_DEEPLINK || 'https://m.me/crunchypaws',
    },
  },
  fel: {
    providerUrl: process.env.FEL_PROVIDER_URL || 'https://api.fel.gt/stub',
    token: process.env.FEL_PROVIDER_TOKEN || 'fel-stub-token',
    username: process.env.FEL_PROVIDER_USERNAME || 'fel-username',
    password: process.env.FEL_PROVIDER_PASSWORD || 'fel-password',
  },
  payment: {
    providerUrl: process.env.PAYMENT_PROVIDER_URL || 'https://api.payments.gt/stub',
    token: process.env.PAYMENT_PROVIDER_TOKEN || 'payment-stub-token',
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
    file: process.env.LOG_FILE || './logs/app.log',
  },
};




