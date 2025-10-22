import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { config } from './config/config';
import { AppDataSource } from './config/database';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import authRoutes from './routes/auth';
import posRoutes from './routes/pos';
import productRoutes from './routes/products';
import orderRoutes from './routes/orders';
import reportRoutes from './routes/reports';

const app = express();
const server = createServer(app);

// WebSocket para actualizaciones en tiempo real
const io = new SocketIOServer(server, {
  cors: {
    origin: config.cors.origin,
    methods: ['GET', 'POST'],
  },
});

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
    service: 'POS Backend',
  });
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/pos', posRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reports', reportRoutes);

// Ruta por defecto
app.get('/', (req, res) => {
  res.json({
    message: 'CrunchyPaws POS API',
    version: '1.0.0',
    environment: config.server.nodeEnv,
    endpoints: {
      auth: '/api/auth',
      pos: '/api/pos',
      products: '/api/products',
      orders: '/api/orders',
      reports: '/api/reports',
    },
  });
});

// WebSocket events
io.on('connection', (socket) => {
  console.log('Cliente POS conectado:', socket.id);

  socket.on('join-session', (sessionId) => {
    socket.join(`session-${sessionId}`);
    console.log(`Cliente ${socket.id} se unió a la sesión ${sessionId}`);
  });

  socket.on('disconnect', () => {
    console.log('Cliente POS desconectado:', socket.id);
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
    console.log('✅ Base de datos POS conectada exitosamente');

    // Iniciar servidor
    const port = config.server.port;
    server.listen(port, () => {
      console.log(`🚀 Servidor POS ejecutándose en puerto ${port}`);
      console.log(`📊 Entorno: ${config.server.nodeEnv}`);
      console.log(`🌐 Health check: http://localhost:${port}/health`);
      console.log(`🔌 WebSocket: ws://localhost:${port}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor POS:', error);
    process.exit(1);
  }
}

// Manejo de señales de terminación
process.on('SIGTERM', async () => {
  console.log('🛑 Recibida señal SIGTERM, cerrando servidor POS...');
  await AppDataSource.destroy();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🛑 Recibida señal SIGINT, cerrando servidor POS...');
  await AppDataSource.destroy();
  process.exit(0);
});

// Iniciar aplicación
startServer();

export { app, io };
export default app;



