import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('🔍 AuthInterceptor - INTERCEPTOR EXECUTING for URL:', req.url);
  
  const authService = inject(AuthService);
  const router = inject(Router);

  // Obtener el token
  const token = authService.getToken();
  console.log('🔍 AuthInterceptor - Token retrieved:', token ? 'EXISTS' : 'NULL', token ? `(${token.length} chars)` : '');
  
  // Si hay token, agregarlo al header
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('🔍 AuthInterceptor - ✅ Authorization header added:', `Bearer ${token.substring(0, 10)}...`);
  } else {
    console.log('🔍 AuthInterceptor - ❌ No token found, request without Authorization header');
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.log('AuthInterceptor - HTTP Error:', error.status, error.message);
      if (error.status === 401) {
        console.log('AuthInterceptor - 401 Unauthorized, logging out and redirecting');
        // Token inválido o expirado
        authService.logout();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};