import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { config } from './config/config';
import { AppDataSource } from './config/database';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import authRoutes from './routes/auth';
import catalogRoutes from './routes/catalog';
import cartRoutes from './routes/cart';
import orderRoutes from './routes/orders';
import paymentRoutes from './routes/payments';
import reviewRoutes from './routes/reviews';
import loyaltyRoutes from './routes/loyalty';
import shippingRoutes from './routes/shipping';

const app = express();

// Middleware de seguridad
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
}));

// Compresión
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    error: 'Demasiadas solicitudes desde esta IP, intenta de nuevo más tarde.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// Rate limiting más estricto para auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // 5 intentos por IP
  message: {
    error: 'Demasiados intentos de login, intenta de nuevo en 15 minutos.',
  },
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
app.use(requestLogger);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.server.nodeEnv,
  });
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/catalog', catalogRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/loyalty', loyaltyRoutes);
app.use('/api/shipping', shippingRoutes);

// Ruta por defecto
app.get('/', (req, res) => {
  res.json({
    message: 'CrunchyPaws Ecommerce API',
    version: '1.0.0',
    environment: config.server.nodeEnv,
    endpoints: {
      auth: '/api/auth',
      catalog: '/api/catalog',
      cart: '/api/cart',
      orders: '/api/orders',
      payments: '/api/payments',
      reviews: '/api/reviews',
      loyalty: '/api/loyalty',
      shipping: '/api/shipping',
    },
  });
});

// Manejo de errores
app.use(errorHandler);

// Ruta 404
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint no encontrado',
    path: req.originalUrl,
    method: req.method,
  });
});

// Inicializar base de datos y servidor
async function startServer() {
  try {
    // Conectar a la base de datos
    await AppDataSource.initialize();
    console.log('✅ Base de datos conectada exitosamente');

    // Iniciar servidor
    const port = config.server.port;
    app.listen(port, () => {
      console.log(`🚀 Servidor ejecutándose en puerto ${port}`);
      console.log(`📊 Entorno: ${config.server.nodeEnv}`);
      console.log(`🌐 Health check: http://localhost:${port}/health`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

// Manejo de señales de terminación
process.on('SIGTERM', async () => {
  console.log('🛑 Recibida señal SIGTERM, cerrando servidor...');
  await AppDataSource.destroy();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🛑 Recibida señal SIGINT, cerrando servidor...');
  await AppDataSource.destroy();
  process.exit(0);
});

// Iniciar aplicación
startServer();

export default app;

