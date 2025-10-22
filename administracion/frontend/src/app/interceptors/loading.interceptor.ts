import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  constructor(private loadingService: LoadingService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Show loading for non-GET requests or specific endpoints
    if (req.method !== 'GET' || req.url.includes('/dashboard') || req.url.includes('/reports')) {
      this.loadingService.show();
    }

    return next.handle(req).pipe(
      finalize(() => {
        this.loadingService.hide();
      })
    );
  }
}



