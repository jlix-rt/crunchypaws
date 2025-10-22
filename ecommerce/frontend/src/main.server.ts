import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideMeta } from 'ngx-meta';

import { routes } from './app/app.routes';
import { authInterceptor } from './app/interceptors/auth.interceptor';
import { loadingInterceptor } from './app/interceptors/loading.interceptor';
import { errorInterceptor } from './app/interceptors/error.interceptor';
import { appReducers } from './app/store/app.reducer';
import { AppEffects } from './app/store/app.effects';

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
    
    // Meta tags
    provideMeta({
      title: 'CrunchyPaws - Tienda de Mascotas en Guatemala',
      description: 'La mejor tienda de mascotas en Guatemala. Alimentos, accesorios, juguetes y más para perros y gatos.',
      image: 'https://crunchypaws.com/assets/images/og-image.jpg',
      url: 'https://crunchypaws.com'
    }),
    
    // NgRx Store
    provideStore(appReducers),
    provideEffects(AppEffects)
  ]
}).catch(err => console.error(err));



