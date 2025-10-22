import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/database';
import { User, UserRole } from '../entities/User';
import { CustomError, asyncHandler } from '../middleware/errorHandler';
import { config } from '../config/config';

export class AuthController {
  private userRepository = AppDataSource.getRepository(User);

  login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    // Buscar usuario (solo empleados y admins)
    const user = await this.userRepository.findOne({
      where: { 
        email, 
        is_active: true,
        role: UserRole.EMPLOYEE || UserRole.ADMIN
      },
    });

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      throw new CustomError('Credenciales inválidas', 401);
    }

    // Verificar que sea empleado o admin
    if (user.role !== UserRole.EMPLOYEE && user.role !== UserRole.ADMIN) {
      throw new CustomError('Acceso denegado. Solo empleados pueden acceder al POS', 403);
    }

    // Generar tokens
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      config.jwt.refreshSecret,
      { expiresIn: config.jwt.refreshExpiresIn }
    );

    res.json({
      message: 'Login exitoso',
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    });
  });

  refreshToken = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new CustomError('Refresh token requerido', 401);
    }

    try {
      const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as any;
      
      const user = await this.userRepository.findOne({
        where: { id: decoded.userId, is_active: true },
      });

      if (!user) {
        throw new CustomError('Usuario no encontrado', 401);
      }

      // Generar nuevo access token
      const accessToken = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
      );

      res.json({
        message: 'Token renovado exitosamente',
        accessToken,
      });
    } catch (error) {
      throw new CustomError('Refresh token inválido', 401);
    }
  });

  logout = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // En una implementación real, aquí se invalidaría el refresh token
    res.json({
      message: 'Logout exitoso',
    });
  });
}



