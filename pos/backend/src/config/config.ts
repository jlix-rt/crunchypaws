import dotenv from 'dotenv';

dotenv.config();

export const config = {
  server: {
    port: parseInt(process.env.PORT || '3002', 10),
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
    secret: process.env.JWT_SECRET || 'pos-jwt-secret-key-2024',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'pos-refresh-secret-key-2024',
    expiresIn: process.env.JWT_EXPIRES_IN || '8h',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:4201', 'http://localhost:80'],
  },
  websocket: {
    port: parseInt(process.env.WS_PORT || '3002', 10),
  },
  social: {
    whatsapp: {
      baseUrl: process.env.SOCIAL_WHATSAPP_BASE_URL || 'https://api.whatsapp.com/send?phone=50212345678',
    },
    facebook: {
      messengerDeeplink: process.env.FACEBOOK_MESSENGER_DEEPLINK || 'https://m.me/crunchypaws',
    },
  },
  printer: {
    thermal: {
      url: process.env.PRINTER_THERMAL_URL || 'http://localhost:9100',
      enabled: process.env.PRINTER_THERMAL_ENABLED === 'true',
    },
  },
  barcode: {
    scanner: {
      enabled: process.env.BARCODE_SCANNER_ENABLED === 'true',
      port: process.env.BARCODE_SCANNER_PORT || 'COM3',
    },
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || './logs/pos.log',
  },
};



