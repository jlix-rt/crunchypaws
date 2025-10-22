import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, of } from 'rxjs';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';
import { User, LoginRequest, LoginResponse, RegisterRequest, AuthState } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  private readonly API_URL = `${environment.apiUrl}/auth`;
  
  private authStateSubject = new BehaviorSubject<AuthState>({
    user: null,
    token: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: false,
    error: null
  });
  
  public authState$ = this.authStateSubject.asObservable();
  
  constructor() {
    this.initializeAuth();
  }
  
  private initializeAuth(): void {
    const token = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        this.authStateSubject.next({
          user,
          token,
          refreshToken,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
      } catch (error) {
        this.clearAuth();
      }
    }
  }
  
  login(credentials: LoginRequest): Observable<LoginResponse> {
    this.setLoading(true);
    
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, credentials)
      .pipe(
        tap(response => {
          this.setAuthData(response.user, response.accessToken, response.refreshToken);
          this.setLoading(false);
        }),
        catchError(error => {
          this.setError(error.error?.message || 'Error al iniciar sesión');
          this.setLoading(false);
          throw error;
        })
      );
  }
  
  register(userData: RegisterRequest): Observable<any> {
    this.setLoading(true);
    
    return this.http.post(`${this.API_URL}/register`, userData)
      .pipe(
        tap(() => {
          this.setLoading(false);
        }),
        catchError(error => {
          this.setError(error.error?.message || 'Error al registrarse');
          this.setLoading(false);
          throw error;
        })
      );
  }
  
  logout(): void {
    this.http.post(`${this.API_URL}/logout`, {}).subscribe();
    this.clearAuth();
    this.router.navigate(['/']);
  }
  
  refreshToken(): Observable<any> {
    const refreshToken = this.authStateSubject.value.refreshToken;
    
    if (!refreshToken) {
      this.clearAuth();
      return of(null);
    }
    
    return this.http.post(`${this.API_URL}/refresh`, { refreshToken })
      .pipe(
        tap((response: any) => {
          this.setAuthData(
            this.authStateSubject.value.user!,
            response.accessToken,
            this.authStateSubject.value.refreshToken!
          );
        }),
        catchError(error => {
          this.clearAuth();
          throw error;
        })
      );
  }
  
  private setAuthData(user: User, token: string, refreshToken: string): void {
    localStorage.setItem('access_token', token);
    localStorage.setItem('refresh_token', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    
    this.authStateSubject.next({
      user,
      token,
      refreshToken,
      isAuthenticated: true,
      isLoading: false,
      error: null
    });
  }
  
  private clearAuth(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    
    this.authStateSubject.next({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    });
  }
  
  private setLoading(loading: boolean): void {
    const currentState = this.authStateSubject.value;
    this.authStateSubject.next({
      ...currentState,
      isLoading: loading
    });
  }
  
  private setError(error: string): void {
    const currentState = this.authStateSubject.value;
    this.authStateSubject.next({
      ...currentState,
      error,
      isLoading: false
    });
  }
  
  getToken(): string | null {
    return this.authStateSubject.value.token;
  }
  
  getUser(): User | null {
    return this.authStateSubject.value.user;
  }
  
  isAuthenticated(): boolean {
    return this.authStateSubject.value.isAuthenticated;
  }
  
  isAdmin(): boolean {
    const user = this.getUser();
    return user?.role === 'ADMIN';
  }
  
  isEmployee(): boolean {
    const user = this.getUser();
    return user?.role === 'EMPLOYEE' || user?.role === 'ADMIN';
  }
}



