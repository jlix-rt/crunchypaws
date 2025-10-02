import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const notificationService = inject(NotificationService);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ha ocurrido un error inesperado';

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Server-side error
        switch (error.status) {
          case 401:
            // Unauthorized - redirect to login
            authService.logout();
            router.navigate(['/auth/login']);
            errorMessage = 'Sesión expirada. Por favor, inicia sesión nuevamente.';
            break;
          case 403:
            // Forbidden
            errorMessage = 'No tienes permisos para realizar esta acción.';
            break;
          case 404:
            // Not found
            errorMessage = 'El recurso solicitado no fue encontrado.';
            break;
          case 422:
            // Validation error
            if (error.error?.errors) {
              const validationErrors = Object.values(error.error.errors).flat();
              errorMessage = validationErrors.join(', ');
            } else {
              errorMessage = error.error?.error || 'Datos inválidos.';
            }
            break;
          case 429:
            // Too many requests
            errorMessage = 'Demasiadas solicitudes. Por favor, intenta más tarde.';
            break;
          case 500:
            // Internal server error
            errorMessage = 'Error interno del servidor. Por favor, intenta más tarde.';
            break;
          case 503:
            // Service unavailable
            errorMessage = 'Servicio temporalmente no disponible. Por favor, intenta más tarde.';
            break;
          default:
            if (error.error?.error) {
              errorMessage = error.error.error;
            } else if (error.error?.message) {
              errorMessage = error.error.message;
            }
        }
      }

      // Show error notification (except for 401 which is handled by logout)
      if (error.status !== 401) {
        notificationService.showError(errorMessage);
      }

      return throwError(() => error);
    })
  );
};
