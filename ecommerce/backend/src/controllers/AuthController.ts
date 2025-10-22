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

    // Buscar usuario
    const user = await this.userRepository.findOne({
      where: { email, is_active: true },
    });

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      throw new CustomError('Credenciales inválidas', 401);
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

  register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { full_name, email, password, phone, nit } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new CustomError('El email ya está registrado', 400);
    }

    // Hash de la contraseña
    const password_hash = await bcrypt.hash(password, 12);

    // Generar código de referido único
    const referral_code = `CLI${Date.now()}`;

    // Crear usuario
    const user = this.userRepository.create({
      full_name,
      email,
      password_hash,
      phone,
      nit,
      role: UserRole.CLIENT,
      referral_code,
    });

    const savedUser = await this.userRepository.save(user);

    // Generar tokens
    const accessToken = jwt.sign(
      { userId: savedUser.id, email: savedUser.email, role: savedUser.role },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    const refreshToken = jwt.sign(
      { userId: savedUser.id },
      config.jwt.refreshSecret,
      { expiresIn: config.jwt.refreshExpiresIn }
    );

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: {
        id: savedUser.id,
        full_name: savedUser.full_name,
        email: savedUser.email,
        role: savedUser.role,
        referral_code: savedUser.referral_code,
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

  forgotPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    const user = await this.userRepository.findOne({
      where: { email, is_active: true },
    });

    if (!user) {
      // Por seguridad, no revelamos si el email existe o no
      res.json({
        message: 'Si el email existe, se enviará un enlace de recuperación',
      });
      return;
    }

    // Aquí se implementaría el envío de email con token de recuperación
    // Por ahora, solo retornamos un mensaje
    res.json({
      message: 'Si el email existe, se enviará un enlace de recuperación',
    });
  });

  resetPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { token, newPassword } = req.body;

    // Aquí se validaría el token y se actualizaría la contraseña
    // Por ahora, solo retornamos un mensaje
    res.json({
      message: 'Contraseña restablecida exitosamente',
    });
  });
}


