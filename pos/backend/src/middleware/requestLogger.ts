import { Request, Response, NextFunction } from 'express';

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();
  
  // Log de la solicitud
  console.log(`[POS] ${req.method} ${req.url} - ${req.ip} - ${new Date().toISOString()}`);
  
  // Interceptar el método end para loggear la respuesta
  const originalEnd = res.end;
  res.end = function(chunk?: any, encoding?: any) {
    const duration = Date.now() - start;
    console.log(`[POS] ${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`);
    originalEnd.call(this, chunk, encoding);
  };
  
  next();
};



