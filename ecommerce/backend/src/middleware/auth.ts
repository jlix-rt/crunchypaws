import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { JwtHelper } from '@/utils/jwt';
import { ResponseHelper } from '@/utils/response';
import { AuthenticatedRequest } from '@/types';

const prisma = new PrismaClient();

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = JwtHelper.extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      ResponseHelper.unauthorized(res, 'Token de acceso requerido');
      return;
    }

    const payload = JwtHelper.verifyToken(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user) {
      ResponseHelper.unauthorized(res, 'Usuario no encontrado');
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    ResponseHelper.unauthorized(res, 'Token inválido');
  }
};

export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = JwtHelper.extractTokenFromHeader(req.headers.authorization);

    if (token) {
      const payload = JwtHelper.verifyToken(token);
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
      });

      if (user) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    // Ignore auth errors for optional auth
    next();
  }
};
