# 🚀 CrunchyPaws Backend API

API REST para el e-commerce de productos deshidratados para mascotas, construida con Node.js, TypeScript, Express y Prisma.

## 📋 Tabla de Contenidos

- [🏗️ Arquitectura](#️-arquitectura)
- [🛠️ Tecnologías](#️-tecnologías)
- [📦 Instalación](#-instalación)
- [🔧 Configuración](#-configuración)
- [🚀 Desarrollo](#-desarrollo)
- [📡 API Endpoints](#-api-endpoints)
- [🗄️ Base de Datos](#️-base-de-datos)
- [🧪 Testing](#-testing)
- [📊 Monitoreo](#-monitoreo)
- [🔒 Seguridad](#-seguridad)

## 🏗️ Arquitectura

### Patrón de Capas
```
Controllers → Services → Repositories → Database
     ↓           ↓           ↓
Middleware ← Utils ← Types
```

### Estructura del Proyecto
```
src/
├── controllers/     # Controladores HTTP
├── services/       # Lógica de negocio
├── repositories/   # Acceso a datos
├── middleware/     # Middleware Express
├── utils/          # Utilidades
├── types/          # Tipos TypeScript
├── routes/         # Definición de rutas
├── prisma/         # Esquemas y seeds
└── __tests__/      # Tests de integración
```

## 🛠️ Tecnologías

- **Node.js 18+** - Runtime JavaScript
- **TypeScript** - Tipado estático
- **Express** - Framework web
- **Prisma** - ORM y query builder
- **MySQL** - Base de datos
- **Zod** - Validación de esquemas
- **JWT** - Autenticación
- **bcryptjs** - Hash de contraseñas
- **Jest + Supertest** - Testing

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp env.example .env

# Generar cliente Prisma
npm run db:generate

# Aplicar migraciones
npm run db:push

# Ejecutar seeds
npm run db:seed
```

## 🔧 Configuración

### Variables de Entorno (.env)

```bash
# Base de datos
DATABASE_URL="mysql://usuario:contraseña@host:puerto/database"

# JWT
JWT_SECRET="clave-super-secreta-cambiar-en-produccion"
JWT_EXPIRES_IN="7d"

# Servidor
PORT=3000
NODE_ENV=development

# WhatsApp
WHATSAPP_PROVIDER=mock          # mock | twilio | meta
WHATSAPP_ENABLED=true
WHATSAPP_FROM=+50200000000
WHATSAPP_TO=+50200000000
WHATSAPP_TOKEN=mock-token
WHATSAPP_NAMESPACE=crunchypaws

# Twilio (si se usa)
TWILIO_ACCOUNT_SID=tu-account-sid
TWILIO_AUTH_TOKEN=tu-auth-token

# Meta WhatsApp (si se usa)
META_ACCESS_TOKEN=tu-access-token
META_PHONE_NUMBER_ID=tu-phone-number-id

# Uploads
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
```

## 🚀 Desarrollo

### Comandos Disponibles

```bash
# Desarrollo con hot reload
npm run dev

# Build para producción
npm run build

# Ejecutar build
npm start

# Tests
npm test
npm run test:watch
npm run test:coverage

# Linting y formato
npm run lint
npm run lint:fix
npm run format

# Base de datos
npm run db:generate    # Generar cliente Prisma
npm run db:push       # Aplicar cambios al esquema
npm run db:seed       # Ejecutar seeds
npm run db:reset      # Reset completo
npm run db:studio     # Abrir Prisma Studio
```

### URLs de Desarrollo
- **API**: http://localhost:3000
- **Health Check**: http://localhost:3000/api/health
- **Prisma Studio**: http://localhost:5555

## 📡 API Endpoints

### 🔐 Autenticación
```http
POST   /api/auth/register      # Registrar usuario
POST   /api/auth/login         # Iniciar sesión
GET    /api/auth/me            # Obtener perfil (requiere auth)
PUT    /api/auth/me            # Actualizar perfil (requiere auth)
PUT    /api/auth/change-password # Cambiar contraseña (requiere auth)
```

### 🛍️ Productos
```http
GET    /api/products           # Listar productos (con filtros)
GET    /api/products/featured  # Productos destacados
GET    /api/products/search    # Buscar productos
GET    /api/products/:slug     # Obtener producto por slug
GET    /api/products/category/:categorySlug # Productos por categoría
POST   /api/products/check-stock # Verificar stock
```

### 📂 Categorías
```http
GET    /api/categories         # Listar categorías (árbol)
GET    /api/categories/root    # Categorías principales
GET    /api/categories/:slug   # Obtener categoría por slug
GET    /api/categories/:id/subcategories # Subcategorías
GET    /api/categories/:id/path # Ruta de categoría
```

### 🛒 Carrito
```http
POST   /api/cart/price         # Calcular precios del carrito
POST   /api/cart/validate      # Validar items del carrito
```

### 🎫 Cupones
```http
POST   /api/coupons/validate   # Validar cupón
GET    /api/coupons/active     # Cupones activos
GET    /api/coupons/:code      # Obtener cupón por código
```

### 📦 Órdenes
```http
POST   /api/orders             # Crear orden
GET    /api/orders/:id         # Obtener orden por ID
GET    /api/orders             # Órdenes del usuario (requiere auth)
GET    /api/orders/stats       # Estadísticas de órdenes
PUT    /api/orders/:id/status  # Actualizar estado (admin)
```

### 📍 Direcciones
```http
GET    /api/addresses          # Listar direcciones (requiere auth)
GET    /api/addresses/:id      # Obtener dirección (requiere auth)
POST   /api/addresses          # Crear dirección (requiere auth)
PUT    /api/addresses/:id      # Actualizar dirección (requiere auth)
DELETE /api/addresses/:id      # Eliminar dirección (requiere auth)
PATCH  /api/addresses/:id/default # Marcar como predeterminada (requiere auth)
```

### 💳 Pagos
```http
GET    /api/payments/methods   # Métodos de pago disponibles
POST   /api/payments/intent    # Crear intención de pago
POST   /api/payments/confirm   # Confirmar pago
GET    /api/payments/status/:id # Estado del pago
POST   /api/payments/webhook   # Webhook de procesador
```

### 📞 Contacto
```http
POST   /api/contact            # Enviar mensaje de contacto
GET    /api/contact            # Listar mensajes (admin)
GET    /api/contact/stats      # Estadísticas de contacto (admin)
GET    /api/contact/:id        # Obtener mensaje (admin)
DELETE /api/contact/:id        # Eliminar mensaje (admin)
```

### ⚙️ Configuración
```http
GET    /api/config/whatsapp    # Configuración WhatsApp (admin)
PUT    /api/config/whatsapp    # Actualizar WhatsApp (admin)
POST   /api/config/whatsapp/test # Probar conexión WhatsApp (admin)
GET    /api/config/general     # Configuración general (admin)
PUT    /api/config/general     # Actualizar configuración (admin)
DELETE /api/config/general/:scope/:key # Eliminar configuración (admin)
```

### 🏥 Salud
```http
GET    /api/health             # Estado de la API
```

## 🗄️ Base de Datos

### Modelo de Datos

#### Usuarios y Autenticación
- **User**: Información del usuario
- **UserAddress**: Direcciones del usuario

#### Catálogo
- **Category**: Categorías jerárquicas
- **Product**: Productos del catálogo

#### Órdenes y Pagos
- **Order**: Órdenes de compra
- **OrderItem**: Items de las órdenes
- **PaymentMethod**: Métodos de pago disponibles

#### Marketing
- **Coupon**: Cupones de descuento

#### Comunicación
- **ContactMessage**: Mensajes de contacto

#### Configuración
- **Config**: Configuraciones del sistema

### Relaciones Principales
```sql
User 1:N UserAddress
User 1:N Order
Category 1:N Category (self-reference)
Category 1:N Product
Order 1:N OrderItem
Product 1:N OrderItem
```

### Seeds Incluidos
- Categorías de ejemplo (Perro, Gato con subcategorías)
- Productos demo con imágenes
- Métodos de pago (Tarjeta, Efectivo, Transferencia)
- Usuario demo: `demo@crunchypaws.com` / `password123`
- Cupones de ejemplo
- Configuración inicial de WhatsApp

## 🧪 Testing

### Estructura de Tests
```
src/
├── __tests__/
│   ├── integration/    # Tests de integración
│   └── unit/          # Tests unitarios
├── controllers/__tests__/
├── services/__tests__/
└── test/
    └── setup.ts       # Configuración de tests
```

### Ejecutar Tests
```bash
# Todos los tests
npm test

# Tests en modo watch
npm run test:watch

# Coverage report
npm run test:coverage

# Tests específicos
npm test -- --testNamePattern="Auth"
```

### Cobertura Objetivo
- **Statements**: >80%
- **Branches**: >80%
- **Functions**: >80%
- **Lines**: >80%

### Tests Implementados

#### Unitarios
- **AuthController**: Registro, login, perfil
- **NotificationService**: Envío de WhatsApp
- **Repositories**: CRUD operations
- **Utils**: JWT, validación, respuestas

#### Integración
- **Auth endpoints**: Flujo completo de autenticación
- **Health check**: Verificación de estado
- **Orders**: Creación y gestión de órdenes
- **Cart**: Cálculos y validaciones

## 📊 Monitoreo

### Health Check
```bash
curl http://localhost:3000/api/health
```

Respuesta:
```json
{
  "status": "OK",
  "timestamp": "2023-12-01T10:00:00.000Z",
  "uptime": 3600,
  "environment": "development"
}
```

### Logs
El sistema utiliza un logger estructurado que incluye:
- **Timestamp**: Fecha y hora del evento
- **Level**: ERROR, WARN, INFO, DEBUG
- **Message**: Descripción del evento
- **Metadata**: Información adicional contextual

Configuración de niveles por environment:
- **Development**: DEBUG
- **Production**: INFO
- **Test**: ERROR

### Métricas Disponibles
- Tiempo de respuesta de endpoints
- Errores por tipo y frecuencia
- Uso de memoria y CPU
- Conexiones a base de datos
- Rate limiting por IP

## 🔒 Seguridad

### Implementaciones de Seguridad

#### Autenticación y Autorización
- **JWT Tokens** con expiración configurable
- **Bcrypt** para hash de contraseñas (salt rounds: 10)
- **Guards** para rutas protegidas
- **Role-based access** (preparado para expansión)

#### Validación y Sanitización
- **Zod schemas** para validación de entrada
- **SQL Injection** prevenido por Prisma ORM
- **XSS Protection** con sanitización de datos
- **Input validation** en todos los endpoints

#### Rate Limiting
```typescript
// Configuraciones por endpoint
/api/*          → 100 req/15min por IP
/api/auth/*     → 5 req/15min por IP
/api/contact    → 3 req/1h por IP
/api/orders     → 10 req/1h por IP
```

#### Headers de Seguridad
- **Helmet** para headers estándar
- **CORS** configurado por environment
- **Content Security Policy**
- **X-Frame-Options**: SAMEORIGIN
- **X-XSS-Protection**: 1; mode=block

#### Logging de Seguridad
- Intentos de login fallidos
- Accesos no autorizados
- Rate limiting triggers
- Errores de validación

### Recomendaciones para Producción

#### Variables de Entorno
```bash
# JWT con clave robusta (256+ bits)
JWT_SECRET="clave-super-segura-generada-aleatoriamente"

# Base de datos con usuario específico
DATABASE_URL="mysql://app_user:password_seguro@db:3306/crunchypaws"

# Logs en nivel INFO
LOG_LEVEL=INFO
```

#### Infraestructura
- **HTTPS** obligatorio con certificados válidos
- **WAF** (Web Application Firewall)
- **Database encryption** at rest
- **Backup automático** con retención
- **Monitoring** con alertas

#### Auditoría
- **Log aggregation** (ELK Stack, Splunk)
- **Security scanning** (Snyk, OWASP ZAP)
- **Dependency updates** automatizadas
- **Penetration testing** periódico

## 🚀 Deployment

### Build para Producción
```bash
# Build optimizado
npm run build

# Verificar build
node dist/index.js
```

### Docker
```bash
# Build imagen
docker build -t crunchypaws-backend .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL="mysql://..." \
  -e JWT_SECRET="..." \
  crunchypaws-backend
```

### Variables de Entorno Críticas
- `DATABASE_URL`: Conexión a base de datos
- `JWT_SECRET`: Clave para tokens JWT
- `NODE_ENV=production`: Modo producción
- `PORT`: Puerto del servidor (default: 3000)

### Health Checks
```bash
# Kubernetes/Docker health check
curl -f http://localhost:3000/api/health || exit 1
```

## 🤝 Contribución

### Estándares de Código
- **TypeScript strict mode** habilitado
- **ESLint** con reglas estrictas
- **Prettier** para formateo consistente
- **Conventional Commits** para mensajes

### Flujo de Desarrollo
1. Crear feature branch
2. Implementar funcionalidad
3. Escribir tests (unitarios + integración)
4. Verificar cobertura >80%
5. Lint y format
6. Commit con formato convencional
7. Push y crear PR

### Comandos Pre-commit
```bash
npm run lint:fix
npm run format
npm run test
```

## 📚 Recursos Adicionales

- **Prisma Docs**: https://www.prisma.io/docs
- **Express.js**: https://expressjs.com
- **TypeScript**: https://www.typescriptlang.org
- **Jest Testing**: https://jestjs.io
- **Zod Validation**: https://zod.dev

---

**API desarrollada con ❤️ para CrunchyPaws 🐾**
