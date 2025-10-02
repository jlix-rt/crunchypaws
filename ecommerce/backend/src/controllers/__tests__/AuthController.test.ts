import { Request, Response } from 'express';
import { AuthController } from '../AuthController';
import { UserRepository } from '../../repositories/UserRepository';
import bcrypt from 'bcryptjs';
import { JwtHelper } from '../../utils/jwt';

// Mock dependencies
jest.mock('../../repositories/UserRepository');
jest.mock('bcryptjs');
jest.mock('../../utils/jwt');

describe('AuthController', () => {
  let authController: AuthController;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    authController = new AuthController();
    mockUserRepository = new UserRepository() as jest.Mocked<UserRepository>;
    
    mockRequest = {
      body: {},
    };
    
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'juan@example.com',
        telefono: '+50212345678',
        password: 'password123',
      };

      mockRequest.body = userData;
      
      mockUserRepository.findByEmail = jest.fn().mockResolvedValue(null);
      mockUserRepository.create = jest.fn().mockResolvedValue({
        id: 1,
        ...userData,
        passwordHash: 'hashedPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      (JwtHelper.generateToken as jest.Mock).mockReturnValue('mockToken');

      await authController.register(mockRequest as Request, mockResponse as Response);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(userData.email);
      expect(mockUserRepository.create).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            user: expect.any(Object),
            token: 'mockToken',
          }),
        })
      );
    });

    it('should return error if email already exists', async () => {
      const userData = {
        email: 'existing@example.com',
        password: 'password123',
      };

      mockRequest.body = userData;
      
      mockUserRepository.findByEmail = jest.fn().mockResolvedValue({
        id: 1,
        email: userData.email,
      });

      await authController.register(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(409);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: 'El email ya está registrado',
        })
      );
    });
  });

  describe('login', () => {
    it('should login user with valid credentials', async () => {
      const loginData = {
        email: 'juan@example.com',
        password: 'password123',
      };

      const mockUser = {
        id: 1,
        email: loginData.email,
        passwordHash: 'hashedPassword',
        nombre: 'Juan',
        apellido: 'Pérez',
      };

      mockRequest.body = loginData;
      
      mockUserRepository.findByEmail = jest.fn().mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (JwtHelper.generateToken as jest.Mock).mockReturnValue('mockToken');

      await authController.login(mockRequest as Request, mockResponse as Response);

      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(loginData.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(loginData.password, mockUser.passwordHash);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            user: expect.any(Object),
            token: 'mockToken',
          }),
        })
      );
    });

    it('should return error for invalid email', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      mockRequest.body = loginData;
      mockUserRepository.findByEmail = jest.fn().mockResolvedValue(null);

      await authController.login(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: 'Credenciales inválidas',
        })
      );
    });

    it('should return error for invalid password', async () => {
      const loginData = {
        email: 'juan@example.com',
        password: 'wrongpassword',
      };

      const mockUser = {
        id: 1,
        email: loginData.email,
        passwordHash: 'hashedPassword',
      };

      mockRequest.body = loginData;
      mockUserRepository.findByEmail = jest.fn().mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await authController.login(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: 'Credenciales inválidas',
        })
      );
    });
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      const mockUser = {
        id: 1,
        email: 'juan@example.com',
        nombre: 'Juan',
        apellido: 'Pérez',
        passwordHash: 'hashedPassword',
      };

      mockRequest.user = mockUser;

      await authController.getProfile(mockRequest as any, mockResponse as Response);

      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.not.objectContaining({
            passwordHash: expect.any(String),
          }),
        })
      );
    });

    it('should return unauthorized if no user', async () => {
      mockRequest.user = undefined;

      await authController.getProfile(mockRequest as any, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
    });
  });
});
