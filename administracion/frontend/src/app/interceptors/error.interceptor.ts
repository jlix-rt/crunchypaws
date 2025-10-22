import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorService } from '../services/error.service';
import { ToastService } from '../services/toast.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private errorService: ErrorService,
    private toastService: ToastService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle different types of errors
        this.handleError(error, req);
        return throwError(() => error);
      })
    );
  }

  private handleError(error: HttpErrorResponse, req: HttpRequest<any>): void {
    let errorMessage = 'Ha ocurrido un error inesperado';
    let errorTitle = 'Error';

    switch (error.status) {
      case 400:
        errorTitle = 'Solicitud Inválida';
        errorMessage = error.error?.message || 'Los datos enviados no son válidos';
        break;
      case 401:
        errorTitle = 'No Autorizado';
        errorMessage = 'Su sesión ha expirado. Por favor, inicie sesión nuevamente';
        break;
      case 403:
        errorTitle = 'Acceso Denegado';
        errorMessage = 'No tiene permisos para realizar esta acción';
        break;
      case 404:
        errorTitle = 'No Encontrado';
        errorMessage = 'El recurso solicitado no existe';
        break;
      case 422:
        errorTitle = 'Error de Validación';
        errorMessage = error.error?.message || 'Los datos no cumplen con los requisitos';
        break;
      case 500:
        errorTitle = 'Error del Servidor';
        errorMessage = 'Ha ocurrido un error interno del servidor';
        break;
      case 503:
        errorTitle = 'Servicio No Disponible';
        errorMessage = 'El servicio no está disponible temporalmente';
        break;
      default:
        if (error.status >= 500) {
          errorTitle = 'Error del Servidor';
          errorMessage = 'Ha ocurrido un error del servidor';
        } else if (error.status >= 400) {
          errorTitle = 'Error de Cliente';
          errorMessage = 'Ha ocurrido un error en la solicitud';
        }
    }

    // Log error
    this.errorService.handleHttpError(error);

    // Show toast notification
    this.toastService.error(errorTitle, errorMessage);
  }
}



