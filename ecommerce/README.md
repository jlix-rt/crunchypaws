# 🐾 CrunchyPaws E-commerce

Un e-commerce B2C completo para productos deshidratados para mascotas (perros y gatos), construido con tecnologías modernas y mejores prácticas de desarrollo.

## 📋 Tabla de Contenidos

- [🚀 Características](#-características)
- [🏗️ Arquitectura](#️-arquitectura)
- [🛠️ Tecnologías](#️-tecnologías)
- [📦 Instalación](#-instalación)
- [🔧 Configuración](#-configuración)
- [🚀 Desarrollo](#-desarrollo)
- [🐳 Docker](#-docker)
- [🧪 Testing](#-testing)
- [📊 Monitoreo](#-monitoreo)
- [🔒 Seguridad](#-seguridad)
- [📚 Documentación](#-documentación)
- [🤝 Contribución](#-contribución)

## 🚀 Características

### Funcionalidades del E-commerce
- **Catálogo de productos** con búsqueda, filtros y paginación
- **Carrito de compras** persistente con validación de stock
- **Sistema de cupones** con descuentos por porcentaje o monto fijo
- **Checkout** para usuarios invitados y registrados
- **Gestión de direcciones** múltiples por usuario
- **Métodos de pago** configurables (tarjeta, efectivo, transferencia)
- **Notificaciones WhatsApp** automáticas al finalizar pedidos
- **Sistema de usuarios** con autenticación JWT
- **Panel de configuración** para administradores

### Características Técnicas
- **Monorepo** con frontend y backend separados
- **API REST** completamente documentada
- **Base de datos** MySQL con Prisma ORM
- **Autenticación** JWT con refresh tokens
- **Validación** robusta en frontend y backend
- **Tests** unitarios, integración y E2E
- **Docker** para desarrollo y producción
- **SEO** optimizado con meta tags dinámicos
- **Accesibilidad** AA compliant
- **PWA** ready con service workers

## 🏗️ Arquitectura

```
crunchypaws-ecommerce/
├── frontend/          # Angular 20 + Material + Tailwind
├── backend/           # Node.js + TypeScript + Express
├── database/          # Scripts SQL y migraciones
├── nginx/             # Configuración del proxy reverso
├── .husky/            # Git hooks para calidad de código
└── docker-compose.yml # Orquestación de servicios
```

### Flujo de Datos
```
[Cliente] → [Nginx] → [Frontend Angular] → [API Backend] → [MySQL Database]
                                      ↓
                              [WhatsApp Service]
```

## 🛠️ Tecnologías

### Frontend
- **Angular 20** - Framework principal
- **Angular Material** - Componentes UI
- **Tailwind CSS** - Utilidades de estilo
- **TypeScript** - Tipado estático
- **RxJS** - Programación reactiva
- **Playwright** - Testing E2E

### Backend
- **Node.js LTS** - Runtime
- **TypeScript** - Tipado estático
- **Express** - Framework web
- **Prisma** - ORM y migraciones
- **Zod** - Validación de esquemas
- **Jest + Supertest** - Testing

### Base de Datos
- **MySQL 8.0** - Base de datos principal
- **Prisma** - ORM y query builder

### DevOps
- **Docker** - Containerización
- **Nginx** - Proxy reverso y servidor web
- **Husky** - Git hooks
- **ESLint + Prettier** - Calidad de código

## 📦 Instalación

### Prerrequisitos
- Node.js 18+ LTS
- npm 9+
- Docker y Docker Compose
- Git

### Instalación Rápida
```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/crunchypaws-ecommerce.git
cd crunchypaws-ecommerce

# Instalar dependencias
npm run setup

# Configurar git hooks
npm run setup:husky

# Configurar variables de entorno
cp backend/env.example backend/.env
# Editar backend/.env con tus configuraciones

# Levantar con Docker
npm run docker:up
```

### Instalación Manual
```bash
# Instalar dependencias del root
npm install

# Backend
cd backend
npm install
cp env.example .env
# Configurar .env

# Frontend
cd ../frontend
npm install

# Volver al root
cd ..
```

## 🔧 Configuración

### Variables de Entorno

#### Backend (.env)
```bash
# Base de datos
DATABASE_URL="mysql://crunchyuser:crunchypass@localhost:3306/crunchypaws"

# JWT
JWT_SECRET="tu-clave-secreta-super-segura"
JWT_EXPIRES_IN="7d"

# WhatsApp (opcional)
WHATSAPP_PROVIDER=mock  # mock | twilio | meta
WHATSAPP_ENABLED=true
WHATSAPP_FROM=+50200000000
WHATSAPP_TO=+50200000000

# Para Twilio
TWILIO_ACCOUNT_SID=tu-account-sid
TWILIO_AUTH_TOKEN=tu-auth-token

# Para Meta WhatsApp Business
META_ACCESS_TOKEN=tu-access-token
META_PHONE_NUMBER_ID=tu-phone-number-id
```

#### Frontend (environments)
Los archivos de environment se configuran automáticamente para desarrollo y producción.

### Base de Datos
```bash
# Aplicar migraciones
npm run db:push

# Ejecutar seeds
npm run db:seed

# Abrir Prisma Studio (opcional)
npm run db:studio
```

## 🚀 Desarrollo

### Comandos Principales
```bash
# Desarrollo completo (frontend + backend)
npm run dev

# Solo backend
npm run dev:backend

# Solo frontend
npm run dev:frontend

# Build completo
npm run build

# Tests
npm run test
npm run test:e2e

# Linting
npm run lint
npm run lint:fix

# Formateo
npm run format
```

### URLs de Desarrollo
- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:3000
- **API Health**: http://localhost:3000/api/health
- **Prisma Studio**: http://localhost:5555

### Estructura de Desarrollo
```
backend/src/
├── controllers/     # Controladores de rutas
├── services/       # Lógica de negocio
├── repositories/   # Acceso a datos
├── middleware/     # Middleware de Express
├── utils/          # Utilidades y helpers
├── types/          # Tipos TypeScript
└── routes/         # Definición de rutas

frontend/src/app/
├── components/     # Componentes reutilizables
├── pages/          # Páginas/vistas
├── services/       # Servicios Angular
├── models/         # Interfaces y tipos
├── guards/         # Guards de rutas
└── interceptors/   # Interceptores HTTP
```

## 🐳 Docker

### Desarrollo con Docker
```bash
# Levantar todos los servicios
npm run docker:up

# Ver logs
npm run docker:logs

# Reconstruir imágenes
npm run docker:build

# Limpiar todo
npm run docker:clean
```

### Servicios Docker
- **mysql**: Base de datos MySQL 8.0
- **backend**: API Node.js + TypeScript
- **frontend**: Aplicación Angular compilada
- **nginx**: Proxy reverso y servidor web

### Puertos
- **80**: Nginx (aplicación completa)
- **3000**: Backend API (desarrollo)
- **3306**: MySQL
- **4200**: Frontend (desarrollo)

## 🧪 Testing

### Backend
```bash
cd backend

# Tests unitarios
npm test

# Tests con coverage
npm run test:coverage

# Tests en modo watch
npm run test:watch
```

### Frontend
```bash
cd frontend

# Tests unitarios
npm test

# Tests E2E
npm run e2e

# Tests E2E en CI
npm run e2e:ci
```

### Cobertura de Tests
- **Backend**: >80% cobertura en statements, branches, functions y lines
- **Frontend**: Tests unitarios para servicios y componentes críticos
- **E2E**: Flujos completos de usuario (catálogo → carrito → checkout)

### Escenarios E2E Cubiertos
1. **Navegación**: Home → Catálogo → Producto → Carrito
2. **Autenticación**: Registro, login, logout
3. **Checkout invitado**: Sin registro, completar compra
4. **Checkout autenticado**: Con direcciones guardadas
5. **Gestión de direcciones**: CRUD completo
6. **Aplicación de cupones**: Validación y descuentos
7. **Notificaciones WhatsApp**: Verificación de envío

## 📊 Monitoreo

### Health Checks
```bash
# Verificar estado de la aplicación
npm run health

# O directamente
curl http://localhost/api/health
```

### Logs
```bash
# Ver logs de todos los servicios
npm run docker:logs

# Logs específicos
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mysql
```

### Métricas Disponibles
- **API Health**: Status, uptime, environment
- **Base de datos**: Conexiones activas
- **WhatsApp**: Estado del servicio de notificaciones

## 🔒 Seguridad

### Implementadas
- **Autenticación JWT** con tokens seguros
- **Validación de entrada** en frontend y backend
- **Rate limiting** por IP en rutas críticas
- **CORS** configurado correctamente
- **Helmet** para headers de seguridad
- **Sanitización** de datos de entrada
- **Passwords hasheadas** con bcrypt

### Recomendaciones para Producción
- Cambiar `JWT_SECRET` por una clave robusta
- Configurar HTTPS con certificados SSL
- Implementar WAF (Web Application Firewall)
- Monitoreo de seguridad con herramientas como Snyk
- Backup automático de base de datos
- Rotación de logs

## 📚 Documentación

### APIs
- **Postman Collection**: `docs/api/crunchypaws.postman_collection.json`
- **OpenAPI Spec**: `docs/api/openapi.yaml`
- **Endpoints**: Ver [Backend README](backend/README.md)

### Frontend
- **Componentes**: Ver [Frontend README](frontend/README.md)
- **Servicios**: Documentación inline en código
- **Routing**: Configuración en `app.routes.ts`

### Base de Datos
- **Esquema**: Ver [Database README](database/README.md)
- **Migraciones**: `backend/prisma/migrations/`
- **Seeds**: `backend/src/prisma/seed.ts`

## 🤝 Contribución

### Flujo de Trabajo
1. Fork del repositorio
2. Crear rama feature: `git checkout -b feature/nueva-funcionalidad`
3. Commit con formato: `feat(scope): descripción`
4. Push y crear Pull Request

### Estándares de Código
- **Commits**: Conventional Commits
- **Código**: ESLint + Prettier
- **Tests**: Obligatorios para nuevas funcionalidades
- **Documentación**: Actualizar README si es necesario

### Comandos de Calidad
```bash
# Verificar calidad antes del commit
npm run lint
npm run test:ci
npm run format
```

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver [LICENSE](LICENSE) para más detalles.

## 👥 Equipo

- **Desarrollo**: Tu equipo de desarrollo
- **Diseño**: Tu equipo de diseño
- **DevOps**: Tu equipo de infraestructura

## 🆘 Soporte

### Problemas Comunes

#### Error de conexión a MySQL
```bash
# Verificar que MySQL esté corriendo
docker-compose ps mysql

# Reiniciar MySQL
docker-compose restart mysql
```

#### Error de permisos en Husky
```bash
# En sistemas Unix/Linux/Mac
chmod +x .husky/pre-commit
chmod +x .husky/commit-msg
```

#### Frontend no se conecta al backend
- Verificar que el backend esté corriendo en puerto 3000
- Revisar configuración de proxy en `frontend/proxy.conf.json`

### Contacto
- **Issues**: GitHub Issues
- **Email**: soporte@crunchypaws.com
- **Documentación**: [Wiki del proyecto](https://github.com/tu-usuario/crunchypaws-ecommerce/wiki)

---

**¡Gracias por contribuir a CrunchyPaws! 🐾**
