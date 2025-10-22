import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  
  // Skip auth for login/register endpoints
  if (req.url.includes('/auth/login') || req.url.includes('/auth/register')) {
    return next(req);
  }
  
  const token = authService.getToken();
  
  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return next(authReq).pipe(
      catchError(error => {
        if (error.status === 401) {
          // Token expired, try to refresh
          return authService.refreshToken().pipe(
            switchMap(() => {
              const newToken = authService.getToken();
              if (newToken) {
                const retryReq = req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${newToken}`
                  }
                });
                return next(retryReq);
              }
              return throwError(() => error);
            }),
            catchError(() => {
              // Refresh failed, redirect to login
              authService.logout();
              return throwError(() => error);
            })
          );
        }
        return throwError(() => error);
      })
    );
  }
  
  return next(req);
};



