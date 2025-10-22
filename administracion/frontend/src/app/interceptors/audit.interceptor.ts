import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggingService } from '../services/logging.service';

@Injectable()
export class AuditInterceptor implements HttpInterceptor {
  constructor(private loggingService: LoggingService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const startTime = Date.now();
    
    // Log request
    this.loggingService.info(`HTTP ${req.method} ${req.url}`, 'HTTP_REQUEST', {
      method: req.method,
      url: req.url,
      headers: req.headers.keys(),
      body: req.body
    });

    return next.handle(req).pipe(
      tap({
        next: (response) => {
          const duration = Date.now() - startTime;
          this.loggingService.info(`HTTP ${req.method} ${req.url} - ${response.type}`, 'HTTP_RESPONSE', {
            method: req.method,
            url: req.url,
            status: response.type,
            duration: `${duration}ms`
          });
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          this.loggingService.error(`HTTP ${req.method} ${req.url} - ERROR`, 'HTTP_ERROR', {
            method: req.method,
            url: req.url,
            error: error.message,
            duration: `${duration}ms`
          });
        }
      })
    );
  }
}



