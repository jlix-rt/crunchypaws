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
import supplyRoutes from './routes/supplies';
import productRoutes from './routes/products';
import categoryRoutes from './routes/categories';
import promotionRoutes from './routes/promotions';
import userRoutes from './routes/users';
import reviewRoutes from './routes/reviews';
import dashboardRoutes from './routes/dashboard';
import costBreakdownRoutes from './routes/costBreakdown.routes';
import costTypeRoutes from './routes/costType.routes';
import unitRoutes from './routes/units';

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
    service: 'Administración Backend',
  });
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/supplies', supplyRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/promotions', promotionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/cost-breakdowns', costBreakdownRoutes);
app.use('/api/cost-types', costTypeRoutes);
app.use('/api/units', unitRoutes);

// Ruta por defecto
app.get('/', (req, res) => {
  res.json({
    message: 'CrunchyPaws Administración API',
    version: '1.0.0',
    environment: config.server.nodeEnv,
    endpoints: {
      auth: '/api/auth',
      supplies: '/api/supplies',
      products: '/api/products',
      categories: '/api/categories',
      promotions: '/api/promotions',
      users: '/api/users',
      reviews: '/api/reviews',
      dashboard: '/api/dashboard',
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
    console.log('✅ Base de datos Administración conectada exitosamente');

    // Iniciar servidor
    const port = config.server.port;
    app.listen(port, () => {
      console.log(`🚀 Servidor Administración ejecutándose en puerto ${port}`);
      console.log(`📊 Entorno: ${config.server.nodeEnv}`);
      console.log(`🌐 Health check: http://localhost:${port}/health`);
      console.log('✅ Base de datos habilitada y funcionando');
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor Administración:', error);
    process.exit(1);
  }
}

// Manejo de señales de terminación
process.on('SIGTERM', async () => {
  console.log('🛑 Recibida señal SIGTERM, cerrando servidor Administración...');
  await AppDataSource.destroy();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🛑 Recibida señal SIGINT, cerrando servidor Administración...');
  await AppDataSource.destroy();
  process.exit(0);
});

// Iniciar aplicación
startServer();

export default app;
