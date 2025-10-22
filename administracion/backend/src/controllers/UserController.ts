import { Request, Response } from 'express';

export class UserController {
  // Obtener todos los usuarios
  async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const mockUsers = [
        {
          id: 1,
          email: 'admin@crunchypaws.com',
          firstName: 'Juan',
          lastName: 'Administrador',
          role: 'ADMIN',
          status: 'active',
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          email: 'empleado@crunchypaws.com',
          firstName: 'María',
          lastName: 'García',
          role: 'EMPLOYEE',
          status: 'active',
          createdAt: new Date().toISOString()
        }
      ];

      res.json({
        success: true,
        data: {
          users: mockUsers,
          pagination: {
            page: 1,
            limit: 10,
            total: mockUsers.length,
            pages: 1
          }
        }
      });
    } catch (error) {
      console.error('Error obteniendo usuarios:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Obtener usuario por ID
  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      // Mock user
      const user = {
        id: parseInt(id),
        email: 'admin@crunchypaws.com',
        firstName: 'Juan',
        lastName: 'Administrador',
        role: 'ADMIN',
        status: 'active'
      };

      res.json({
        success: true,
        data: { user }
      });
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Crear usuario
  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { email, firstName, lastName, role } = req.body;

      // Mock response
      const newUser = {
        id: Math.floor(Math.random() * 1000),
        email,
        firstName,
        lastName,
        role: role || 'CLIENT',
        status: 'active',
        createdAt: new Date().toISOString()
      };

      res.status(201).json({
        success: true,
        message: 'Usuario creado exitosamente',
        data: { user: newUser }
      });
    } catch (error) {
      console.error('Error creando usuario:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Actualizar usuario
  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Mock response
      const updatedUser = {
        id: parseInt(id),
        ...updateData,
        updatedAt: new Date().toISOString()
      };

      res.json({
        success: true,
        message: 'Usuario actualizado exitosamente',
        data: { user: updatedUser }
      });
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Eliminar usuario
  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      res.json({
        success: true,
        message: 'Usuario eliminado exitosamente'
      });
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
}



