import { Request, Response, NextFunction } from 'express';
import { logger } from '@/utils/logger';
import { ResponseHelper } from '@/utils/response';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Error interno del servidor';

  // Log del error
  logger.error('Error en la aplicación', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });

  // En desarrollo, incluir stack trace
  if (process.env.NODE_ENV === 'development') {
    ResponseHelper.error(res, message, statusCode);
    return;
  }

  // En producción, no exponer detalles internos
  if (statusCode >= 500) {
    ResponseHelper.serverError(res);
    return;
  }

  ResponseHelper.error(res, message, statusCode);
};

export const notFoundHandler = (req: Request, res: Response): void => {
  ResponseHelper.notFound(res, `Ruta ${req.originalUrl} no encontrada`);
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
