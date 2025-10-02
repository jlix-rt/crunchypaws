import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { ApiService } from './api.service';
import { NotificationService } from './notification.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.Spy;
  let notificationSpy: jasmine.Spy;

  const mockUser = {
    id: 1,
    nombre: 'Juan',
    apellido: 'Pérez',
    email: 'juan@example.com',
    telefono: '+50212345678',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  };

  const mockAuthResponse = {
    success: true,
    data: {
      user: mockUser,
      token: 'mock-jwt-token',
    },
  };

  beforeEach(() => {
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    const notificationSpyObj = jasmine.createSpyObj('NotificationService', [
      'showSuccess',
      'showError',
      'showInfo',
    ]);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        ApiService,
        { provide: Router, useValue: routerSpyObj },
        { provide: NotificationService, useValue: notificationSpyObj },
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    routerSpy = TestBed.inject(Router).navigate as jasmine.Spy;
    notificationSpy = TestBed.inject(NotificationService).showSuccess as jasmine.Spy;

    // Clear localStorage
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  describe('login', () => {
    it('should login user and store auth data', () => {
      const loginData = {
        email: 'juan@example.com',
        password: 'password123',
      };

      service.login(loginData).subscribe((response) => {
        expect(response).toEqual(mockAuthResponse);
        expect(service.isLoggedIn()).toBe(true);
        expect(service.getCurrentUser()).toEqual(mockUser);
        expect(localStorage.getItem('crunchypaws_token')).toBe('mock-jwt-token');
      });

      const req = httpMock.expectOne('/api/auth/login');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(loginData);
      req.flush(mockAuthResponse);

      expect(notificationSpy).toHaveBeenCalledWith('¡Bienvenido de nuevo!');
    });

    it('should handle login error', () => {
      const loginData = {
        email: 'juan@example.com',
        password: 'wrongpassword',
      };

      const errorResponse = {
        success: false,
        error: 'Credenciales inválidas',
      };

      service.login(loginData).subscribe({
        error: (error) => {
          expect(error.error).toEqual(errorResponse);
        },
      });

      const req = httpMock.expectOne('/api/auth/login');
      req.flush(errorResponse, { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('register', () => {
    it('should register user successfully', () => {
      const registerData = {
        nombre: 'Juan',
        apellido: 'Pérez',
        email: 'juan@example.com',
        telefono: '+50212345678',
        password: 'password123',
      };

      service.register(registerData).subscribe((response) => {
        expect(response).toEqual(mockAuthResponse);
        expect(service.isLoggedIn()).toBe(true);
      });

      const req = httpMock.expectOne('/api/auth/register');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(registerData);
      req.flush(mockAuthResponse);

      expect(notificationSpy).toHaveBeenCalledWith('¡Cuenta creada exitosamente!');
    });
  });

  describe('logout', () => {
    beforeEach(() => {
      // Set up authenticated state
      localStorage.setItem('crunchypaws_token', 'mock-token');
      localStorage.setItem('crunchypaws_user', JSON.stringify(mockUser));
      service['userSubject'].next(mockUser);
      service.isAuthenticated.set(true);
    });

    it('should logout user and clear auth data', () => {
      service.logout();

      expect(localStorage.getItem('crunchypaws_token')).toBeNull();
      expect(localStorage.getItem('crunchypaws_user')).toBeNull();
      expect(service.isLoggedIn()).toBe(false);
      expect(service.getCurrentUser()).toBeNull();
      expect(routerSpy).toHaveBeenCalledWith(['/']);
    });
  });

  describe('getProfile', () => {
    it('should get user profile', () => {
      const profileResponse = {
        success: true,
        data: mockUser,
      };

      service.getProfile().subscribe((response) => {
        expect(response).toEqual(mockUser);
        expect(service.getCurrentUser()).toEqual(mockUser);
      });

      const req = httpMock.expectOne('/api/auth/me');
      expect(req.request.method).toBe('GET');
      req.flush(profileResponse);
    });
  });

  describe('updateProfile', () => {
    it('should update user profile', () => {
      const updateData = {
        telefono: '+50287654321',
      };

      const updatedUser = { ...mockUser, ...updateData };
      const updateResponse = {
        success: true,
        data: updatedUser,
      };

      service.updateProfile(updateData).subscribe((response) => {
        expect(response).toEqual(updatedUser);
        expect(service.getCurrentUser()).toEqual(updatedUser);
      });

      const req = httpMock.expectOne('/api/auth/me');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updateData);
      req.flush(updateResponse);

      expect(notificationSpy).toHaveBeenCalledWith('Perfil actualizado');
    });
  });

  describe('getToken', () => {
    it('should return token from localStorage', () => {
      localStorage.setItem('crunchypaws_token', 'test-token');
      expect(service.getToken()).toBe('test-token');
    });

    it('should return null if no token', () => {
      expect(service.getToken()).toBeNull();
    });
  });

  describe('isLoggedIn', () => {
    it('should return true when authenticated', () => {
      service.isAuthenticated.set(true);
      expect(service.isLoggedIn()).toBe(true);
    });

    it('should return false when not authenticated', () => {
      service.isAuthenticated.set(false);
      expect(service.isLoggedIn()).toBe(false);
    });
  });
});
