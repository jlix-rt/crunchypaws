import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import { User, UserRole } from '../entities/User';
import { AppDataSource } from '../config/database';
import { CustomError } from './errorHandler';

export interface AuthRequest extends Request {
  user?: User;
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      throw new CustomError('Token de acceso requerido', 401);
    }

    const decoded = jwt.verify(token, config.jwt.secret) as any;
    
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id: decoded.userId, is_active: true },
    });

    if (!user) {
      throw new CustomError('Usuario no encontrado o inactivo', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new CustomError('Token inválido', 401));
    } else {
      next(error);
    }
  }
};

export const requireRole = (roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new CustomError('Autenticación requerida', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new CustomError('Permisos insuficientes', 403));
    }

    next();
  };
};

export const requireEmployee = requireRole([UserRole.EMPLOYEE, UserRole.ADMIN]);
export const requireAdmin = requireRole([UserRole.ADMIN]);



