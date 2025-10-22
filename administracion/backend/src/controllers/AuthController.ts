import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';

export class AuthController {
  // Login
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({
          success: false,
          message: 'Email y contraseña son requeridos'
        });
        return;
      }

      // Simular verificación de usuario (en producción esto vendría de la base de datos)
      const mockUser = {
        id: 1,
        email: 'admin@crunchypaws.com',
        password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
        firstName: 'Juan',
        lastName: 'Administrador',
        role: 'ADMIN',
        status: 'active'
      };

      // Verificar si el usuario existe
      if (email !== mockUser.email) {
        res.status(401).json({
          success: false,
          message: 'Credenciales inválidas'
        });
        return;
      }

      // Verificar contraseña
      const isValidPassword = await bcrypt.compare(password, mockUser.password);
      if (!isValidPassword) {
        res.status(401).json({
          success: false,
          message: 'Credenciales inválidas'
        });
        return;
      }

      // Generar tokens
      const accessToken = jwt.sign(
        { 
          userId: mockUser.id, 
          email: mockUser.email, 
          role: mockUser.role 
        },
        config.jwt.secret,
        { expiresIn: '8h' }
      );

      const refreshToken = jwt.sign(
        { 
          userId: mockUser.id, 
          email: mockUser.email 
        },
        config.jwt.refreshSecret,
        { expiresIn: '7d' }
      );

      res.json({
        success: true,
        message: 'Login exitoso',
        data: {
          user: {
            id: mockUser.id,
            email: mockUser.email,
            firstName: mockUser.firstName,
            lastName: mockUser.lastName,
            role: mockUser.role,
            status: mockUser.status
          },
          accessToken,
          refreshToken
        }
      });
    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Refresh token
  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(400).json({
          success: false,
          message: 'Refresh token es requerido'
        });
        return;
      }

      // Verificar refresh token
      const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as any;
      
      // Generar nuevo access token
      const accessToken = jwt.sign(
        { 
          userId: decoded.userId, 
          email: decoded.email, 
          role: 'ADMIN' // En producción esto vendría de la base de datos
        },
        config.jwt.secret,
        { expiresIn: '8h' }
      );

      res.json({
        success: true,
        data: {
          accessToken
        }
      });
    } catch (error) {
      console.error('Error en refresh token:', error);
      res.status(401).json({
        success: false,
        message: 'Refresh token inválido'
      });
    }
  }

  // Logout
  async logout(req: Request, res: Response): Promise<void> {
    try {
      // En una implementación real, aquí invalidarías el token
      res.json({
        success: true,
        message: 'Logout exitoso'
      });
    } catch (error) {
      console.error('Error en logout:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Verificar token
  async verifyToken(req: Request, res: Response): Promise<void> {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        res.status(401).json({
          success: false,
          message: 'Token no proporcionado'
        });
        return;
      }

      const decoded = jwt.verify(token, config.jwt.secret) as any;
      
      res.json({
        success: true,
        data: {
          user: {
            id: decoded.userId,
            email: decoded.email,
            role: decoded.role
          }
        }
      });
    } catch (error) {
      console.error('Error verificando token:', error);
      res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }
  }
}