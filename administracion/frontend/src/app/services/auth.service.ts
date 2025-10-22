import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    user: {
      id: number;
      firstName: string;
      lastName: string;
      email: string;
      role: string;
    };
  };
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'auth_user';
  private baseUrl = environment.apiUrl || 'http://localhost:3001/api';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Inicialización diferida para evitar dependencias circulares
    setTimeout(() => this.initializeAuth(), 0);
  }

  private initializeAuth(): void {
    // Limpiar storage corrupto
    this.cleanCorruptedStorage();
    
    const token = this.getToken();
    const user = this.getStoredUser();
    
    console.log('AuthService initialization:', { token: !!token, user: !!user });
    
    if (token && user && this.isTokenValid()) {
      this.currentUserSubject.next(user);
      this.isAuthenticatedSubject.next(true);
      console.log('User authenticated on initialization');
    } else {
      // Si el token no es válido, limpiar todo
      if (token && !this.isTokenValid()) {
        console.log('Token expired, clearing auth state');
        this.removeToken();
        this.removeUser();
      }
      this.currentUserSubject.next(null);
      this.isAuthenticatedSubject.next(false);
      console.log('User not authenticated on initialization');
    }
  }

  private cleanCorruptedStorage(): void {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const user = localStorage.getItem(this.USER_KEY);
    
    if (token === 'undefined' || token === 'null') {
      localStorage.removeItem(this.TOKEN_KEY);
      console.log('Removed corrupted token');
    }
    
    if (user === 'undefined' || user === 'null') {
      localStorage.removeItem(this.USER_KEY);
      console.log('Removed corrupted user data');
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    // Limpiar tokens previos antes del login
    this.removeToken();
    this.removeUser();
    
    return this.http.post<LoginResponse>(`${this.baseUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          console.log('🔍 Login response received:', response);
          console.log('🔍 Full response.data:', response.data);
          console.log('🔍 AccessToken received:', response.data?.accessToken);
          console.log('🔍 User received:', response.data?.user);
          
          if (response.success && response.data) {
            // Verificar que el accessToken existe y no es undefined
            if (response.data.accessToken && response.data.accessToken !== 'undefined') {
              this.setToken(response.data.accessToken);
              this.setUser(response.data.user);
              this.currentUserSubject.next(response.data.user);
              this.isAuthenticatedSubject.next(true);
              
              console.log('✅ Auth state updated:', {
                isAuthenticated: this.isAuthenticated(),
                isTokenValid: this.isTokenValid(),
                currentUser: this.getCurrentUser()
              });
            } else {
              console.error('❌ AccessToken is undefined or invalid:', response.data.accessToken);
              console.error('❌ Login failed - no valid token received');
            }
          } else {
            console.error('Login failed:', response.message);
          }
        })
      );
  }

  logout(): void {
    this.removeToken();
    this.removeUser();
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    const token = localStorage.getItem(this.TOKEN_KEY);
    console.log('🔑 AuthService.getToken() - Retrieved:', token ? 'EXISTS' : 'NULL', token ? `(${token.length} chars)` : '');
    return token;
  }

  private setToken(token: string): void {
    console.log('🔑 AuthService.setToken() - Setting:', token ? 'EXISTS' : 'NULL', token ? `(${token.length} chars)` : '');
    localStorage.setItem(this.TOKEN_KEY, token);
    console.log('🔑 AuthService.setToken() - ✅ Stored in localStorage');
  }

  private removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  getStoredUser(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    if (!userStr || userStr === 'undefined' || userStr === 'null') {
      return null;
    }
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Error parsing stored user:', error);
      localStorage.removeItem(this.USER_KEY);
      return null;
    }
  }

  private setUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  private removeUser(): void {
    localStorage.removeItem(this.USER_KEY);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user ? user.role === role : false;
  }

  isAdmin(): boolean {
    return this.hasRole('ADMIN');
  }

  isEmployee(): boolean {
    return this.hasRole('EMPLOYEE');
  }

  isClient(): boolean {
    return this.hasRole('CLIENT');
  }

  // Método para verificar si el token es válido
  isTokenValid(): boolean {
    const token = this.getToken();
    console.log('Token validation check:', { token: token ? 'exists' : 'null', tokenLength: token?.length });
    
    if (!token) return false;

    try {
      // Si el token no es un JWT (no tiene puntos), asumir que es válido
      if (!token.includes('.')) {
        console.log('Token is not JWT format, assuming valid');
        return true;
      }

      // Decodificar el JWT para verificar la expiración
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      const isValid = payload.exp > currentTime;
      console.log('JWT validation:', { exp: payload.exp, current: currentTime, isValid });
      return isValid;
    } catch (error) {
      console.log('Token validation error:', error);
      // Si no se puede decodificar, asumir que es válido (token simple)
      return true;
    }
  }

  // Método para refrescar el token si es necesario
  refreshTokenIfNeeded(): Observable<any> {
    if (!this.isTokenValid()) {
      this.logout();
      return new Observable(observer => {
        observer.error('Token expired');
      });
    }
    return new Observable(observer => {
      observer.next(true);
    });
  }
}