import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideClientHydration } from '@angular/platform-browser';

import { routes } from './app.routes';
import { appReducer } from './store/app.reducer';
import { AppEffects } from './store/effects/app.effects';
import { authInterceptor } from './interceptors/auth.interceptor';
import { loadingInterceptor } from './interceptors/loading.interceptor';
import { errorInterceptor } from './interceptors/error.interceptor';
import { cacheInterceptor } from './interceptors/cache.interceptor';
import { auditInterceptor } from './interceptors/audit.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // Router configuration
    provideRouter(
      routes,
      withPreloading(PreloadAllModules)
    ),

    // HTTP client with interceptors
    provideHttpClient(
      withInterceptors([
        authInterceptor,
        loadingInterceptor,
        errorInterceptor,
        cacheInterceptor,
        auditInterceptor
      ])
    ),

    // Browser animations
    provideAnimations(),

    // Client-side hydration for SSR
    provideClientHydration(),

    // NgRx store configuration
    provideStore(appReducer),
    provideEffects(AppEffects),

    // NgRx DevTools (only in development)
    provideStoreDevtools({
      maxAge: 25,
      logOnly: false, // Set to true in production
      autoPause: true,
      trace: false,
      traceLimit: 75
    })
  ]
};



