# CrunchyPaws Administración

Panel de administración completo para la gestión de productos, usuarios, inventario y operaciones del negocio.

## ⚙️ Características

### Funcionalidades Principales
- **Gestión de insumos** y materias primas
- **Construcción de productos** desde recetas (BOM)
- **Cálculo automático de precios** con agregados
- **Gestión de categorías** y subcategorías
- **Administración de usuarios** y roles
- **Moderación de reseñas** y contenido
- **Reportes y analytics** del negocio
- **Gestión de promociones** y cupones

### Características Específicas
- **BOM (Bill of Materials)** para productos complejos
- **Simulador de precios** what-if
- **Gestión de agregados** (IVA, costos, márgenes)
- **Workflow de aprobación** para productos
- **Integración con FEL** para facturación
- **Exportación contable** y conectores ERP

## 🏗️ Arquitectura

### Frontend (Angular 20)
- **Angular** con componentes standalone
- **Tailwind CSS** para estilos
- **TypeScript** para tipado estático
- **RxJS** para programación reactiva
- **Charts.js** para gráficos y reportes

### Backend (Node.js + Express + TypeScript)
- **Express.js** como framework web
- **TypeORM** como ORM
- **MySQL 8** como base de datos
- **JWT** para autenticación de administradores
- **Swagger** para documentación API

## 🚀 Inicio Rápido

### Desarrollo Local

1. **Instalar dependencias**
```bash
cd administracion/backend
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
docker-compose up -d administracion-backend administracion-frontend
```

## 📁 Estructura del Proyecto

```
administracion/
├── frontend/                 # Aplicación Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/   # Componentes administrativos
│   │   │   ├── pages/        # Páginas principales
│   │   │   ├── services/     # Servicios Angular
│   │   │   └── guards/       # Guards de autenticación
│   │   └── assets/           # Recursos estáticos
│   ├── angular.json
│   └── tailwind.config.js
├── backend/                  # API Node.js
│   ├── src/
│   │   ├── entities/         # Entidades TypeORM
│   │   ├── controllers/      # Controladores admin
│   │   ├── services/         # Lógica de negocio
│   │   ├── routes/           # Rutas de la API
│   │   └── middleware/       # Middlewares
│   ├── package.json
│   └── tsconfig.json
├── scripts/                  # Scripts SQL
└── postman/                 # Colecciones de API
    └── CrunchyPaws-Administracion-API.postman_collection.json
```

## 🔧 Configuración

### Variables de Entorno

```bash
# Servidor
NODE_ENV=development
PORT=3003

# Base de datos
DATABASE_URL=mysql://appuser:apppassword@localhost:3306/crunchypaws

# JWT
JWT_SECRET=admin-jwt-secret-key-2024
JWT_REFRESH_SECRET=admin-refresh-secret-key-2024

# CORS
CORS_ORIGIN=http://localhost:4202

# FEL (Facturación Electrónica)
FEL_PROVIDER_URL=https://api.fel.gt/stub
FEL_PROVIDER_TOKEN=fel-stub-token
```

## 📊 API Endpoints

### Autenticación
- `POST /api/auth/login` - Login de administrador
- `POST /api/auth/refresh` - Renovar token
- `POST /api/auth/logout` - Cerrar sesión

### Insumos
- `GET /api/admin/supplies` - Listar insumos
- `POST /api/admin/supplies` - Crear insumo
- `PUT /api/admin/supplies/:id` - Actualizar insumo
- `DELETE /api/admin/supplies/:id` - Eliminar insumo

### Productos
- `GET /api/admin/products` - Listar productos
- `POST /api/admin/products` - Crear producto
- `PUT /api/admin/products/:id` - Actualizar producto
- `PUT /api/admin/products/:id/recipe` - Actualizar receta
- `POST /api/admin/products/:id/calculate-price` - Calcular precio

### Agregados de Precio
- `GET /api/admin/price-addons` - Listar agregados
- `POST /api/admin/price-addons` - Crear agregado
- `PUT /api/admin/price-addons/:id` - Actualizar agregado
- `DELETE /api/admin/price-addons/:id` - Eliminar agregado

### Usuarios
- `GET /api/admin/users` - Listar usuarios
- `POST /api/admin/users` - Crear usuario
- `PUT /api/admin/users/:id` - Actualizar usuario
- `PUT /api/admin/users/:id/role` - Cambiar rol
- `PUT /api/admin/users/:id/status` - Cambiar estado

### Reseñas
- `GET /api/admin/reviews/pending` - Reseñas pendientes
- `PUT /api/admin/reviews/:id/approve` - Aprobar reseña
- `PUT /api/admin/reviews/:id/reject` - Rechazar reseña

### Reportes
- `GET /api/admin/reports/sales` - Reporte de ventas
- `GET /api/admin/reports/products` - Reporte de productos
- `GET /api/admin/reports/users` - Reporte de usuarios
- `GET /api/admin/reports/export` - Exportar reportes

## 🏭 Gestión de Insumos

### Crear Insumo
```bash
POST /api/admin/supplies
{
  "name": "Carne de Pollo",
  "unit": "kg",
  "unit_cost": 25.00,
  "is_also_product": false
}
```

### Actualizar Costo
```bash
PUT /api/admin/supplies/1
{
  "unit_cost": 28.00
}
```

## 🍽️ Construcción de Productos (BOM)

### Crear Receta
```bash
PUT /api/admin/products/1/recipe
{
  "recipe_items": [
    {
      "supply_id": 1,
      "quantity": 0.5
    },
    {
      "supply_id": 2,
      "quantity": 0.3
    }
  ]
}
```

### Calcular Precio
```bash
POST /api/admin/products/1/calculate-price
{
  "addon_ids": [1, 2, 4],
  "profit_margin": 30.00
}
```

## 💰 Gestión de Agregados

### Tipos de Agregados
- **IVA** (12% en Guatemala)
- **Costo de Almacenamiento** (5%)
- **Costo de Distribución** (8%)
- **Margen de Ganancia** (30%)
- **Costo de Empaque** (3%)
- **Costo de Marketing** (10%)

### Aplicar Agregados
```bash
POST /api/admin/products/1/addons
{
  "addon_ids": [1, 2, 4, 5]
}
```

## 👥 Gestión de Usuarios

### Crear Empleado
```bash
POST /api/admin/users
{
  "full_name": "María González",
  "email": "maria.gonzalez@crunchypaws.com",
  "password": "employee123",
  "phone": "50287654321",
  "role": "EMPLOYEE",
  "commission_percent": 5.00
}
```

### Cambiar Rol
```bash
PUT /api/admin/users/2/role
{
  "role": "ADMIN",
  "is_active": true
}
```

## 📊 Reportes y Analytics

### Reportes Disponibles
- **Ventas por período** con gráficos
- **Productos más vendidos** con tendencias
- **Usuarios activos** y registros
- **Inventario** con alertas de stock bajo
- **Comisiones** por empleado
- **Análisis de costos** y márgenes

### Exportación
- **CSV** para análisis externos
- **PDF** para reportes ejecutivos
- **Excel** para contabilidad
- **JSON** para integraciones

## 🔍 Moderación de Contenido

### Reseñas
- **Aprobación manual** de reseñas
- **Filtros automáticos** por palabras
- **Sistema de reportes** de contenido inapropiado
- **Historial de moderación**

### Productos
- **Workflow de aprobación** para nuevos productos
- **Validación de precios** antes de publicación
- **Control de stock** y disponibilidad

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
```

## 🚀 Despliegue

### Docker Production
```bash
# Construir imagen
docker build -t crunchypaws-admin-backend ./backend
docker build -t crunchypaws-admin-frontend ./frontend

# Ejecutar
docker run -d -p 3003:3003 crunchypaws-admin-backend
docker run -d -p 4202:4200 crunchypaws-admin-frontend
```

## 📈 Dashboard y KPIs

### Métricas Principales
- **Ventas totales** del día/mes
- **Número de pedidos** procesados
- **Productos más vendidos**
- **Usuarios activos**
- **Stock bajo** (alertas)
- **Comisiones** generadas

### Gráficos Interactivos
- **Ventas por día** (línea)
- **Productos por categoría** (pie)
- **Usuarios por rol** (barra)
- **Tendencias** de crecimiento

## 🔒 Seguridad y Permisos

### Roles de Usuario
- **ADMIN** - Acceso completo
- **EMPLOYEE** - Acceso limitado a reportes
- **CLIENT** - Solo lectura de datos públicos

### Permisos por Módulo
- **Insumos** - Solo ADMIN
- **Productos** - ADMIN + EMPLOYEE
- **Usuarios** - Solo ADMIN
- **Reportes** - ADMIN + EMPLOYEE
- **Configuración** - Solo ADMIN

## 🛠️ Comandos Útiles

### Backend
```bash
# Desarrollo
npm run dev

# Producción
npm run start:prod

# Migraciones
npm run migration:run

# Seeds
npm run seed:run

# Linting
npm run lint
```

### Frontend
```bash
# Desarrollo
ng serve

# Build
ng build

# Tests
ng test
```

## 📞 Soporte

Para soporte técnico:
- **Email**: dev@crunchypaws.com
- **Issues**: [GitHub Issues](https://github.com/crunchypaws/crunchypaws/issues)

---

**CrunchyPaws Administración** - Panel de control para mascotas ⚙️



