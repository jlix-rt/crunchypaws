import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CacheService } from '../services/cache.service';

@Injectable()
export class CacheInterceptor implements HttpInterceptor {
  constructor(private cacheService: CacheService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next.handle(req);
    }

    // Check if request should be cached
    const cacheKey = this.getCacheKey(req);
    const cachedResponse = this.cacheService.get(cacheKey);

    if (cachedResponse) {
      return of(cachedResponse);
    }

    // Make request and cache response
    return next.handle(req).pipe(
      tap(response => {
        // Cache successful responses for 5 minutes
        this.cacheService.set(cacheKey, response, 5 * 60 * 1000);
      })
    );
  }

  private getCacheKey(req: HttpRequest<any>): string {
    const url = req.url;
    const params = req.params.toString();
    return `${url}?${params}`;
  }
}



