import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideServiceWorker } from '@angular/service-worker';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideClientHydration } from '@angular/platform-browser';
import { provideMeta } from 'ngx-meta';

import { routes } from './app/app.routes';
import { authInterceptor } from './app/interceptors/auth.interceptor';
import { loadingInterceptor } from './app/interceptors/loading.interceptor';
import { errorInterceptor } from './app/interceptors/error.interceptor';
import { appReducers } from './app/store/app.reducer';
import { AppEffects } from './app/store/app.effects';
import { environment } from './environments/environment';

bootstrapApplication(AppComponent, {
  providers: [
    // Router
    provideRouter(routes),
    
    // HTTP Client with interceptors
    provideHttpClient(
      withInterceptors([
        authInterceptor,
        loadingInterceptor,
        errorInterceptor
      ])
    ),
    
    // Animations
    provideAnimations(),
    
    // Client-side hydration
    provideClientHydration(),
    
    // Meta tags
    provideMeta({
      title: 'CrunchyPaws - Tienda de Mascotas en Guatemala',
      description: 'La mejor tienda de mascotas en Guatemala. Alimentos, accesorios, juguetes y más para perros y gatos.',
      image: 'https://crunchypaws.com/assets/images/og-image.jpg',
      url: 'https://crunchypaws.com'
    }),
    
    // NgRx Store
    provideStore(appReducers),
    provideEffects(AppEffects),
    
    // Store DevTools (only in development)
    ...(environment.production ? [] : [
      provideStoreDevtools({
        maxAge: 25,
        logOnly: environment.production,
        autoPause: true,
        trace: false,
        traceLimit: 75
      })
    ]),
    
    // Service Worker (only in production)
    ...(environment.production ? [
      provideServiceWorker('ngsw-worker.js', {
        enabled: environment.production,
        registrationStrategy: 'registerWhenStable:30000'
      })
    ] : [])
  ]
}).catch(err => console.error(err));



