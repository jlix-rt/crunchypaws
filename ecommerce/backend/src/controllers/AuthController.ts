import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { UserRepository } from '@/repositories/UserRepository';
import { JwtHelper } from '@/utils/jwt';
import { ResponseHelper } from '@/utils/response';
import { AuthenticatedRequest } from '@/types';
import { RegisterData, LoginData, UpdateProfileData } from '@/utils/validation';

const userRepository = new UserRepository();

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const data: RegisterData = req.body;

      // Verificar si el email ya existe
      const existingUser = await userRepository.findByEmail(data.email);
      if (existingUser) {
        ResponseHelper.error(res, 'El email ya está registrado', 409);
        return;
      }

      // Hash de la contraseña
      const passwordHash = await bcrypt.hash(data.password, 10);

      // Crear usuario
      const user = await userRepository.create({
        ...data,
        passwordHash,
      });

      // Generar token
      const token = JwtHelper.generateToken(user);

      // Respuesta sin la contraseña
      const { passwordHash: _, ...userResponse } = user;

      ResponseHelper.success(res, {
        user: userResponse,
        token,
      }, 'Usuario registrado exitosamente', 201);
    } catch (error) {
      console.error('Error en registro:', error);
      ResponseHelper.serverError(res);
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password }: LoginData = req.body;

      // Buscar usuario
      const user = await userRepository.findByEmail(email);
      if (!user) {
        ResponseHelper.error(res, 'Credenciales inválidas', 401);
        return;
      }

      // Verificar contraseña
      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        ResponseHelper.error(res, 'Credenciales inválidas', 401);
        return;
      }

      // Generar token
      const token = JwtHelper.generateToken(user);

      // Respuesta sin la contraseña
      const { passwordHash: _, ...userResponse } = user;

      ResponseHelper.success(res, {
        user: userResponse,
        token,
      }, 'Inicio de sesión exitoso');
    } catch (error) {
      console.error('Error en login:', error);
      ResponseHelper.serverError(res);
    }
  }

  async getProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseHelper.unauthorized(res);
        return;
      }

      const { passwordHash: _, ...userResponse } = req.user;
      ResponseHelper.success(res, userResponse);
    } catch (error) {
      console.error('Error obteniendo perfil:', error);
      ResponseHelper.serverError(res);
    }
  }

  async updateProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseHelper.unauthorized(res);
        return;
      }

      const data: UpdateProfileData = req.body;

      // Si se está actualizando el email, verificar que no exista
      if (data.email && data.email !== req.user.email) {
        const existingUser = await userRepository.findByEmail(data.email);
        if (existingUser) {
          ResponseHelper.error(res, 'El email ya está en uso', 409);
          return;
        }
      }

      const updatedUser = await userRepository.update(req.user.id, data);
      const { passwordHash: _, ...userResponse } = updatedUser;

      ResponseHelper.success(res, userResponse, 'Perfil actualizado exitosamente');
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      ResponseHelper.serverError(res);
    }
  }

  async changePassword(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        ResponseHelper.unauthorized(res);
        return;
      }

      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        ResponseHelper.error(res, 'Contraseña actual y nueva son requeridas');
        return;
      }

      // Verificar contraseña actual
      const isValidPassword = await bcrypt.compare(currentPassword, req.user.passwordHash);
      if (!isValidPassword) {
        ResponseHelper.error(res, 'Contraseña actual incorrecta', 401);
        return;
      }

      // Hash de la nueva contraseña
      const passwordHash = await bcrypt.hash(newPassword, 10);

      // Actualizar contraseña
      await userRepository.update(req.user.id, { passwordHash } as any);

      ResponseHelper.success(res, null, 'Contraseña actualizada exitosamente');
    } catch (error) {
      console.error('Error cambiando contraseña:', error);
      ResponseHelper.serverError(res);
    }
  }
}
