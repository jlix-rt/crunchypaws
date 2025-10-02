import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, tap, catchError, of } from 'rxjs';
import { ApiService } from './api.service';
import { NotificationService } from './notification.service';
import { User, AuthResponse, LoginRequest, RegisterRequest } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiService = inject(ApiService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  private readonly TOKEN_KEY = 'crunchypaws_token';
  private readonly USER_KEY = 'crunchypaws_user';

  // Signals for reactive state
  private userSubject = new BehaviorSubject<User | null>(null);
  public user$ = this.userSubject.asObservable();
  public isAuthenticated = signal(false);

  constructor() {
    this.loadUserFromStorage();
  }

  // Load user from localStorage on app init
  private loadUserFromStorage(): void {
    const token = this.getToken();
    const userData = localStorage.getItem(this.USER_KEY);
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        this.userSubject.next(user);
        this.isAuthenticated.set(true);
      } catch (error) {
        this.logout();
      }
    }
  }

  // Login
  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>('/auth/login', credentials).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.setAuthData(response.data);
          this.notificationService.showSuccess('¡Bienvenido de nuevo!');
        }
      }),
      catchError(error => {
        this.notificationService.showError('Error al iniciar sesión');
        throw error;
      })
    );
  }

  // Register
  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>('/auth/register', userData).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.setAuthData(response.data);
          this.notificationService.showSuccess('¡Cuenta creada exitosamente!');
        }
      }),
      catchError(error => {
        this.notificationService.showError('Error al crear la cuenta');
        throw error;
      })
    );
  }

  // Logout
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.userSubject.next(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/']);
    this.notificationService.showInfo('Sesión cerrada');
  }

  // Get current user profile
  getProfile(): Observable<User> {
    return this.apiService.get<User>('/auth/me').pipe(
      tap(response => {
        if (response.success && response.data) {
          this.userSubject.next(response.data);
          localStorage.setItem(this.USER_KEY, JSON.stringify(response.data));
        }
      })
    );
  }

  // Update profile
  updateProfile(userData: Partial<User>): Observable<User> {
    return this.apiService.put<User>('/auth/me', userData).pipe(
      tap(response => {
        if (response.success && response.data) {
          this.userSubject.next(response.data);
          localStorage.setItem(this.USER_KEY, JSON.stringify(response.data));
          this.notificationService.showSuccess('Perfil actualizado');
        }
      })
    );
  }

  // Change password
  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.apiService.put('/auth/change-password', {
      currentPassword,
      newPassword
    }).pipe(
      tap(response => {
        if (response.success) {
          this.notificationService.showSuccess('Contraseña actualizada');
        }
      })
    );
  }

  // Get token
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.userSubject.value;
  }

  // Check if user is authenticated
  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  // Set authentication data
  private setAuthData(authData: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, authData.token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(authData.user));
    this.userSubject.next(authData.user);
    this.isAuthenticated.set(true);
  }

  // Validate token (call on app init or before sensitive operations)
  validateToken(): Observable<boolean> {
    const token = this.getToken();
    if (!token) {
      return of(false);
    }

    return this.getProfile().pipe(
      tap(() => this.isAuthenticated.set(true)),
      catchError(() => {
        this.logout();
        return of(false);
      })
    );
  }
}
