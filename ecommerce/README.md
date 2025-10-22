# CrunchyPaws Ecommerce

Sistema de tienda online para mascotas con funcionalidades específicas para el mercado guatemalteco.

## 🛒 Características

### Funcionalidades Principales
- **Catálogo de productos** con categorías y subcategorías
- **Sistema de búsqueda** con autocompletado y filtros
- **Carrito de compras** con cupones y descuentos
- **Checkout completo** con cálculo de envíos
- **Sistema de pagos** integrado
- **Reseñas de productos** con moderación
- **Programa de fidelización** con puntos y recompensas
- **Sistema de referidos**
- **SEO optimizado** con SSR/Prerender

### Características Específicas para Guatemala
- **Direcciones** con jerarquía departamento → municipio → zona → colonia
- **NIT opcional** para facturación
- **Cálculo de envíos** por ubicación geográfica
- **Integración FEL** preparada para Facturación Electrónica
- **Enlaces sociales** (WhatsApp, Facebook, Instagram)

## 🏗️ Arquitectura

### Frontend (Angular 20)
- **Angular Universal** para SSR
- **Tailwind CSS** para estilos
- **SCSS** para estilos personalizados
- **TypeScript** para tipado estático
- **RxJS** para programación reactiva
- **Angular Router** con lazy loading

### Backend (Node.js + Express + TypeScript)
- **Express.js** como framework web
- **TypeORM** como ORM
- **MySQL 8** como base de datos
- **JWT** para autenticación
- **Zod** para validación
- **Swagger** para documentación API

## 🚀 Inicio Rápido

### Desarrollo Local

1. **Instalar dependencias**
```bash
cd ecommerce/backend
npm install

cd ../frontend
npm install
```

2. **Configurar variables de entorno**
```bash
cp backend/env.example backend/.env
```

3. **Iniciar base de datos**
```bash
docker-compose up -d mysql adminer
```

4. **Ejecutar migraciones**
```bash
cd backend
npm run migration:run
npm run seed:run
```

5. **Iniciar servicios**
```bash
# Backend
cd backend
npm run dev

# Frontend (nueva terminal)
cd frontend
npm run start
```

### Docker

```bash
# Desde la raíz del proyecto
docker-compose up -d ecommerce-backend ecommerce-frontend
```

## 📁 Estructura del Proyecto

```
ecommerce/
├── frontend/                 # Aplicación Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/   # Componentes reutilizables
│   │   │   ├── pages/        # Páginas principales
│   │   │   ├── services/     # Servicios Angular
│   │   │   ├── guards/       # Guards de autenticación
│   │   │   └── interceptors/ # Interceptors HTTP
│   │   ├── assets/           # Recursos estáticos
│   │   └── environments/     # Configuraciones de entorno
│   ├── angular.json          # Configuración Angular
│   └── tailwind.config.js    # Configuración Tailwind
├── backend/                  # API Node.js
│   ├── src/
│   │   ├── entities/         # Entidades TypeORM
│   │   ├── controllers/      # Controladores
│   │   ├── services/         # Lógica de negocio
│   │   ├── routes/           # Rutas de la API
│   │   ├── middleware/       # Middlewares
│   │   ├── validators/       # Esquemas de validación
│   │   └── config/           # Configuraciones
│   ├── package.json
│   └── tsconfig.json
├── scripts/                  # Scripts SQL
│   ├── init.sql             # Esquema de base de datos
│   └── seeds.sql            # Datos iniciales
└── postman/                 # Colecciones de API
    ├── CrunchyPaws-Ecommerce-API.postman_collection.json
    └── CrunchyPaws-Ecommerce-Environment.postman_environment.json
```

## 🔧 Configuración

### Variables de Entorno

```bash
# Servidor
NODE_ENV=development
PORT=3001

# Base de datos
DATABASE_URL=mysql://appuser:apppassword@localhost:3306/crunchypaws

# JWT
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret

# CORS
CORS_ORIGIN=http://localhost:4200

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Redes sociales
SOCIAL_WHATSAPP_BASE_URL=https://api.whatsapp.com/send?phone=50212345678
FACEBOOK_MESSENGER_DEEPLINK=https://m.me/crunchypaws

# FEL (Facturación Electrónica)
FEL_PROVIDER_URL=https://api.fel.gt/stub
FEL_PROVIDER_TOKEN=fel-stub-token
```

## 📊 API Endpoints

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/refresh` - Renovar token
- `POST /api/auth/logout` - Cerrar sesión

### Catálogo
- `GET /api/catalog/categories` - Listar categorías
- `GET /api/catalog/products` - Listar productos
- `GET /api/catalog/products/:id` - Obtener producto
- `GET /api/catalog/search` - Buscar productos
- `GET /api/catalog/autocomplete` - Autocompletado

### Carrito
- `GET /api/cart` - Obtener carrito
- `POST /api/cart/add` - Agregar al carrito
- `PUT /api/cart/update/:itemId` - Actualizar item
- `DELETE /api/cart/remove/:itemId` - Remover item
- `POST /api/cart/apply-coupon` - Aplicar cupón

### Pedidos
- `GET /api/orders` - Listar pedidos del usuario
- `POST /api/orders` - Crear pedido
- `GET /api/orders/:id` - Obtener pedido
- `PUT /api/orders/:id/cancel` - Cancelar pedido
- `GET /api/orders/:id/tracking` - Seguimiento

### Pagos
- `GET /api/payments/methods` - Métodos de pago
- `POST /api/payments/process` - Procesar pago
- `GET /api/payments/:id/status` - Estado del pago

### Reseñas
- `GET /api/reviews/product/:productId` - Reseñas del producto
- `POST /api/reviews` - Crear reseña
- `PUT /api/reviews/:id` - Actualizar reseña
- `DELETE /api/reviews/:id` - Eliminar reseña

### Fidelización
- `GET /api/loyalty/account` - Cuenta de fidelización
- `GET /api/loyalty/transactions` - Transacciones
- `GET /api/loyalty/tiers` - Niveles de fidelización
- `POST /api/loyalty/redeem` - Canjear puntos

### Envíos
- `POST /api/shipping/calculate` - Calcular envío
- `GET /api/shipping/rates` - Tarifas de envío

## 🧪 Testing

### Backend
```bash
cd backend

# Tests unitarios
npm run test

# Tests e2e
npm run test:e2e

# Coverage
npm run test:coverage
```

### Frontend
```bash
cd frontend

# Tests unitarios
ng test

# Tests e2e
ng e2e

# Coverage
ng test --code-coverage
```

## 🚀 Despliegue

### Docker Production
```bash
# Construir imagen
docker build -t crunchypaws-ecommerce-backend ./backend
docker build -t crunchypaws-ecommerce-frontend ./frontend

# Ejecutar
docker run -d -p 3001:3001 crunchypaws-ecommerce-backend
docker run -d -p 4200:4200 crunchypaws-ecommerce-frontend
```

### Kubernetes
```bash
# Aplicar manifests
kubectl apply -f k8s/
```

## 📈 SEO y Performance

### Optimizaciones Implementadas
- **Server-Side Rendering (SSR)** con Angular Universal
- **Meta tags dinámicos** para cada producto/categoría
- **JSON-LD** para datos estructurados
- **Sitemap.xml** generado automáticamente
- **Robots.txt** configurado
- **Lazy loading** de rutas y componentes
- **Compresión gzip** habilitada
- **Cache headers** para recursos estáticos

### URLs Semánticas
- `/categoria/producto-slug` - Páginas de productos
- `/categoria` - Páginas de categorías
- `/buscar?q=termino` - Resultados de búsqueda

## 🔒 Seguridad

### Implementado
- **JWT** con access/refresh tokens
- **Rate limiting** por endpoint
- **CORS** configurado
- **Helmet** para headers de seguridad
- **Validación** de entrada con Zod
- **Sanitización** de datos
- **Logging** de auditoría

## 📱 Responsive Design

- **Mobile-first** approach
- **Breakpoints** optimizados
- **Touch-friendly** interfaces
- **Progressive Web App** ready

## 🌐 Internacionalización

- **i18n** configurado para español Guatemala (es-GT)
- **Formateo** de fechas y números localizado
- **Moneda** en Quetzales (GTQ)

## 📊 Analytics y Tracking

### Preparado para
- **Google Analytics 4**
- **Facebook Pixel**
- **Google Tag Manager**
- **Hotjar** para heatmaps

## 🛠️ Comandos Útiles

### Backend
```bash
# Desarrollo
npm run dev

# Producción
npm run start:prod

# Migraciones
npm run migration:generate -- -n CreateUserTable
npm run migration:run
npm run migration:revert

# Seeds
npm run seed:run

# Linting
npm run lint
npm run lint:fix

# Formateo
npm run format
```

### Frontend
```bash
# Desarrollo
ng serve

# Build
ng build

# Build con SSR
ng build:ssr

# Serve SSR
ng serve:ssr

# Tests
ng test
ng e2e

# Linting
ng lint
```

## 📞 Soporte

Para soporte técnico:
- **Email**: dev@crunchypaws.com
- **Issues**: [GitHub Issues](https://github.com/crunchypaws/crunchypaws/issues)

---

**CrunchyPaws Ecommerce** - Tienda online para mascotas 🐾



