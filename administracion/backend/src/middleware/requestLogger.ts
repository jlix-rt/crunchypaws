import { Request, Response, NextFunction } from 'express';

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();
  
  // Log de la solicitud
  console.log(`[ADMIN] ${req.method} ${req.url} - ${req.ip} - ${new Date().toISOString()}`);
  
  // Interceptar el método end para loggear la respuesta
  const originalEnd = res.end;
  res.end = function(chunk?: any, encoding?: any): Response {
    const duration = Date.now() - start;
    console.log(`[ADMIN] ${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`);
    return originalEnd.call(this, chunk, encoding);
  };
  
  next();
};
