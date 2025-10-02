import rateLimit from 'express-rate-limit';
import { ResponseHelper } from '@/utils/response';

// Rate limit general para todas las rutas API
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 requests por ventana por IP
  message: 'Demasiadas solicitudes desde esta IP, intenta de nuevo más tarde.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    ResponseHelper.error(res, 'Demasiadas solicitudes, intenta de nuevo más tarde.', 429);
  },
});

// Rate limit más estricto para autenticación
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 intentos de login por ventana por IP
  message: 'Demasiados intentos de autenticación, intenta de nuevo más tarde.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    ResponseHelper.error(res, 'Demasiados intentos de autenticación, intenta de nuevo más tarde.', 429);
  },
});

// Rate limit para contacto
export const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 3, // máximo 3 mensajes por hora por IP
  message: 'Demasiados mensajes enviados, intenta de nuevo más tarde.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    ResponseHelper.error(res, 'Demasiados mensajes enviados, intenta de nuevo más tarde.', 429);
  },
});

// Rate limit para órdenes
export const orderLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 10, // máximo 10 órdenes por hora por IP
  message: 'Demasiadas órdenes creadas, intenta de nuevo más tarde.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    ResponseHelper.error(res, 'Demasiadas órdenes creadas, intenta de nuevo más tarde.', 429);
  },
});
