# 🎨 CrunchyPaws Frontend

Aplicación web moderna para el e-commerce de productos deshidratados para mascotas, construida con Angular 20, Material Design y Tailwind CSS.

## 📋 Tabla de Contenidos

- [🏗️ Arquitectura](#️-arquitectura)
- [🛠️ Tecnologías](#️-tecnologías)
- [📦 Instalación](#-instalación)
- [🔧 Configuración](#-configuración)
- [🚀 Desarrollo](#-desarrollo)
- [🎨 UI/UX](#-uiux)
- [🧪 Testing](#-testing)
- [📱 PWA](#-pwa)
- [♿ Accesibilidad](#-accesibilidad)
- [🔍 SEO](#-seo)
- [🚀 Deployment](#-deployment)

## 🏗️ Arquitectura

### Patrón de Arquitectura
```
Components → Services → API → Backend
     ↓         ↓
Guards ← Interceptors
```

### Estructura del Proyecto
```
src/app/
├── components/     # Componentes reutilizables
│   ├── layout/    # Header, Footer, Sidebar
│   ├── ui/        # Botones, Cards, Modals
│   └── forms/     # Formularios específicos
├── pages/         # Páginas/vistas principales
├── services/      # Servicios Angular
├── models/        # Interfaces y tipos
├── guards/        # Guards de rutas
├── interceptors/  # Interceptores HTTP
├── utils/         # Utilidades y helpers
└── environments/  # Configuraciones por entorno
```

## 🛠️ Tecnologías

### Core
- **Angular 20** - Framework principal
- **TypeScript** - Tipado estático
- **RxJS** - Programación reactiva
- **Angular Signals** - Estado reactivo

### UI/UX
- **Angular Material** - Componentes UI
- **Tailwind CSS** - Utilidades de estilo
- **Material Icons** - Iconografía
- **Google Fonts** - Tipografía (Inter + Poppins)

### Testing
- **Jest** - Testing framework
- **Angular Testing Library** - Utilidades de testing
- **Playwright** - Testing E2E

### Build & Tools
- **Angular CLI** - Herramientas de desarrollo
- **ESLint** - Linting
- **Prettier** - Formateo de código
- **Husky** - Git hooks

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Desarrollo
npm start

# Build para producción
npm run build
```

## 🔧 Configuración

### Environments

#### Development (environment.ts)
```typescript
export const environment = {
  production: false,
  apiBaseUrl: '/api',
  featureFlags: {
    infiniteScroll: true,
    showBadges: true,
    enableCoupons: true,
    enableWhatsApp: true,
    enableGuestCheckout: true,
  },
  seo: {
    siteName: 'CrunchyPaws',
    defaultTitle: 'CrunchyPaws - Productos Deshidratados para Mascotas',
    // ...
  }
};
```

#### Production (environment.prod.ts)
- URLs absolutas para assets
- Analytics IDs configurados
- Feature flags de producción
- Optimizaciones habilitadas

### Proxy Configuration
```json
{
  "/api/*": {
    "target": "http://localhost:3000",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug"
  }
}
```

## 🚀 Desarrollo

### Comandos Disponibles

```bash
# Desarrollo con hot reload
npm start

# Build para producción
npm run build

# Build con análisis de bundle
npm run analyze

# Tests unitarios
npm test
npm run test:ci

# Tests E2E
npm run e2e

# Linting y formato
npm run lint
npm run lint:fix
npm run format
```

### URLs de Desarrollo
- **App**: http://localhost:4200
- **Proxy API**: http://localhost:4200/api/*

### Estructura de Rutas
```typescript
/                    → HomeComponent
/catalogo           → CatalogComponent
/producto/:slug     → ProductDetailComponent
/carrito            → CartComponent
/checkout           → CheckoutComponent
/informacion        → InfoComponent
/contacto           → ContactComponent
/auth/login         → LoginComponent
/auth/register      → RegisterComponent
/perfil             → ProfileComponent (auth required)
/direcciones        → AddressesComponent (auth required)
/ordenes            → OrdersComponent (auth required)
/orden/:id          → OrderDetailComponent
/**                 → NotFoundComponent
```

## 🎨 UI/UX

### Design System

#### Colores
```scss
// Paleta principal
$primary: #f2804b;    // Naranja cálido
$secondary: #0ea5e9;  // Azul cielo
$accent: #22c55e;     // Verde menta
$neutral: #78716c;    // Gris neutro

// Estados
$success: #10b981;
$warning: #f59e0b;
$error: #ef4444;
$info: #3b82f6;
```

#### Tipografía
```scss
// Familias
font-family-sans: 'Inter', system-ui, sans-serif;
font-family-display: 'Poppins', system-ui, sans-serif;

// Escalas
text-xs: 0.75rem;     // 12px
text-sm: 0.875rem;    // 14px
text-base: 1rem;      // 16px
text-lg: 1.125rem;    // 18px
text-xl: 1.25rem;     // 20px
// ...
```

#### Espaciado
```scss
// Sistema de espaciado (4px base)
space-1: 0.25rem;     // 4px
space-2: 0.5rem;      // 8px
space-4: 1rem;        // 16px
space-8: 2rem;        // 32px
// ...
```

### Componentes UI

#### Botones
```html
<!-- Primario -->
<button class="btn-primary">Acción Principal</button>

<!-- Secundario -->
<button class="btn-secondary">Acción Secundaria</button>

<!-- Outline -->
<button class="btn-outline">Acción Terciaria</button>
```

#### Cards
```html
<!-- Card básica -->
<div class="card">
  <div class="card-content">Contenido</div>
</div>

<!-- Card con hover -->
<div class="card-hover">
  <div class="card-content">Contenido interactivo</div>
</div>
```

#### Badges
```html
<!-- Nuevo -->
<span class="badge badge-new">Nuevo</span>

<!-- Oferta -->
<span class="badge badge-offer">Oferta</span>

<!-- Destacado -->
<span class="badge badge-featured">Destacado</span>
```

### Responsive Design
```scss
// Breakpoints
sm: 640px;    // Móvil grande
md: 768px;    // Tablet
lg: 1024px;   // Desktop
xl: 1280px;   // Desktop grande
2xl: 1536px;  // Desktop extra grande
```

### Animaciones
```scss
// Transiciones suaves
.transition-smooth {
  transition: all 0.2s ease-in-out;
}

// Animaciones personalizadas
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
```

## 🧪 Testing

### Estructura de Tests
```
src/app/
├── services/
│   ├── auth.service.spec.ts
│   ├── cart.service.spec.ts
│   └── ...
├── components/
│   ├── header/
│   │   └── header.component.spec.ts
│   └── ...
└── pages/
    ├── home/
    │   └── home.component.spec.ts
    └── ...
```

### Tests Unitarios

#### Servicios
```typescript
describe('AuthService', () => {
  let service: AuthService;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
  });

  it('should login user successfully', () => {
    // Test implementation
  });
});
```

#### Componentes
```typescript
describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HeaderComponent]
    });
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
  });

  it('should display cart item count', () => {
    // Test implementation
  });
});
```

### Tests E2E con Playwright

#### Configuración
```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:4200',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
```

#### Tests E2E Implementados
```typescript
// e2e/home.spec.ts
test('should navigate to catalog', async ({ page }) => {
  await page.goto('/');
  await page.click('button:has-text("Ver Catálogo")');
  await expect(page).toHaveURL('/catalogo');
});

// e2e/auth.spec.ts
test('should login successfully', async ({ page }) => {
  await page.goto('/auth/login');
  await page.fill('input[type="email"]', 'demo@crunchypaws.com');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button:has-text("Iniciar Sesión")');
  await expect(page).toHaveURL('/');
});

// e2e/cart-checkout.spec.ts
test('should complete guest checkout', async ({ page }) => {
  // Add product to cart
  await page.goto('/catalogo');
  await page.click('[data-testid="product-card"]:first-child');
  await page.click('button:has-text("Agregar al Carrito")');
  
  // Complete checkout
  await page.goto('/checkout');
  // Fill form and complete...
});
```

### Cobertura de Tests
- **Servicios críticos**: 100% (Auth, Cart, API)
- **Componentes principales**: >80%
- **Guards e Interceptors**: 100%
- **E2E flows**: Todos los flujos críticos cubiertos

## 📱 PWA

### Service Worker
```typescript
// Configuración en app.config.ts
provideServiceWorker('ngsw-worker.js', {
  enabled: environment.production,
  registrationStrategy: 'registerWhenStable:30000'
})
```

### Manifest
```json
{
  "name": "CrunchyPaws - Productos Deshidratados para Mascotas",
  "short_name": "CrunchyPaws",
  "theme_color": "#f2804b",
  "background_color": "#fafaf9",
  "display": "standalone",
  "start_url": "/",
  "icons": [
    // Iconos en múltiples tamaños
  ]
}
```

### Características PWA
- **Instalable** en dispositivos móviles y desktop
- **Offline support** para páginas visitadas
- **Push notifications** (preparado)
- **Background sync** (preparado)

## ♿ Accesibilidad

### Estándares Implementados
- **WCAG 2.1 AA** compliance
- **Semantic HTML** en todos los componentes
- **ARIA labels** y roles apropiados
- **Keyboard navigation** completa
- **Focus management** visible
- **Color contrast** >4.5:1

### Herramientas de Accesibilidad
```html
<!-- Navegación por teclado -->
<button class="focus-visible:focus:outline-2 focus-visible:focus:outline-primary-500">
  Botón accesible
</button>

<!-- Screen readers -->
<img [src]="product.imageUrl" 
     [alt]="product.name + ' - Producto deshidratado para mascotas'">

<!-- ARIA labels -->
<button [attr.aria-label]="'Agregar ' + product.name + ' al carrito'">
  <mat-icon>add_shopping_cart</mat-icon>
</button>
```

### Testing de Accesibilidad
```typescript
// Tests automáticos con @angular-eslint/template/accessibility
"@angular-eslint/template/accessibility"
```

## 🔍 SEO

### Meta Tags Dinámicos
```typescript
// SEO Service
updateSeo(data: {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
}) {
  this.titleService.setTitle(data.title);
  this.metaService.updateTag({ name: 'description', content: data.description });
  // Open Graph, Twitter Cards, etc.
}
```

### Structured Data
```typescript
// Producto
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Patitas de Pollo Deshidratadas",
  "description": "...",
  "offers": {
    "@type": "Offer",
    "price": "25.50",
    "priceCurrency": "GTQ"
  }
}

// Breadcrumbs
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [...]
}
```

### Optimizaciones SEO
- **Server-side rendering** (preparado con Angular Universal)
- **Sitemap.xml** generado dinámicamente
- **Robots.txt** configurado por environment
- **Canonical URLs** en todas las páginas
- **Open Graph** y **Twitter Cards**
- **Lazy loading** de imágenes con `loading="lazy"`

## 🚀 Deployment

### Build para Producción
```bash
# Build optimizado
npm run build

# Análisis de bundle
npm run analyze

# Verificar build
npx http-server dist/
```

### Optimizaciones de Build
```typescript
// angular.json - configuración de producción
"production": {
  "budgets": [
    {
      "type": "initial",
      "maximumWarning": "500kb",
      "maximumError": "1mb"
    }
  ],
  "outputHashing": "all",
  "serviceWorker": true,
  "ngswConfigPath": "ngsw-config.json"
}
```

### Docker
```dockerfile
# Multi-stage build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine AS production
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
```

### Nginx Configuration
```nginx
server {
  listen 80;
  root /usr/share/nginx/html;
  index index.html;

  # Angular SPA
  location / {
    try_files $uri $uri/ /index.html;
  }

  # Static assets caching
  location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }

  # Gzip compression
  gzip on;
  gzip_types text/plain text/css application/json application/javascript;
}
```

## 📊 Performance

### Métricas Objetivo
- **First Contentful Paint**: <1.5s
- **Largest Contentful Paint**: <2.5s
- **Cumulative Layout Shift**: <0.1
- **First Input Delay**: <100ms

### Optimizaciones Implementadas
- **Lazy loading** de rutas y componentes
- **OnPush change detection** en componentes críticos
- **TrackBy functions** en listas
- **Image optimization** con `loading="lazy"`
- **Bundle splitting** automático
- **Tree shaking** habilitado
- **Service worker** para caching

### Monitoring
```typescript
// Web Vitals (preparado)
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

## 🔧 Configuración Avanzada

### Feature Flags
```typescript
// environment.ts
featureFlags: {
  infiniteScroll: true,
  showBadges: true,
  enableCoupons: true,
  enableWhatsApp: true,
  enableGuestCheckout: true,
}

// Uso en componentes
@if (environment.featureFlags.infiniteScroll) {
  <app-infinite-scroll></app-infinite-scroll>
} @else {
  <app-pagination></app-pagination>
}
```

### Interceptors
```typescript
// Auth Interceptor
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).getToken();
  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }
  return next(req);
};

// Error Interceptor
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle errors globally
      return throwError(() => error);
    })
  );
};
```

### Guards
```typescript
// Auth Guard
export const AuthGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isLoggedIn()) {
    return true;
  }
  
  router.navigate(['/auth/login']);
  return false;
};
```

## 🤝 Contribución

### Estándares de Código
- **Angular Style Guide** oficial
- **TypeScript strict mode**
- **ESLint** con reglas de Angular
- **Prettier** para formateo
- **Conventional Commits**

### Flujo de Desarrollo
1. Crear feature branch
2. Implementar funcionalidad
3. Escribir tests unitarios
4. Verificar accesibilidad
5. Optimizar performance
6. Lint y format
7. Commit y PR

### Comandos Pre-commit
```bash
npm run lint:fix
npm run format
npm run test:ci
```

## 📚 Recursos

- **Angular Docs**: https://angular.io/docs
- **Angular Material**: https://material.angular.io
- **Tailwind CSS**: https://tailwindcss.com
- **Playwright**: https://playwright.dev
- **Web Vitals**: https://web.dev/vitals

---

**Frontend desarrollado con ❤️ para CrunchyPaws 🐾**
