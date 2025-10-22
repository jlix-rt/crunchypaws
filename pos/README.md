# CrunchyPaws POS

Sistema de punto de venta para empleados con funcionalidades específicas para ventas en tienda física.

## 🏪 Características

### Funcionalidades Principales
- **Gestión de sesiones** de caja con apertura/cierre
- **Búsqueda de productos** por SKU o código de barras
- **Carrito de ventas** con precios modificables
- **Múltiples métodos de pago** (efectivo, tarjeta, transferencia)
- **Gestión de clientes** y datos de contacto
- **Reportes de ventas** por empleado y período
- **Cálculo de comisiones** automático
- **Integración con ecommerce** para pedidos online

### Características Específicas
- **Modo offline** con sincronización posterior
- **Lector de códigos de barras** integrado
- **Impresión de tickets** térmicos
- **Gestión de discrepancias** de caja
- **Múltiples listas de precios** por sucursal
- **Validación de precios** con rangos permitidos

## 🏗️ Arquitectura

### Frontend (Angular 20)
- **Angular** con componentes standalone
- **Tailwind CSS** para estilos
- **TypeScript** para tipado estático
- **RxJS** para programación reactiva
- **PWA** para funcionamiento offline

### Backend (Node.js + Express + TypeScript)
- **Express.js** como framework web
- **TypeORM** como ORM
- **MySQL 8** como base de datos
- **JWT** para autenticación de empleados
- **WebSocket** para actualizaciones en tiempo real

## 🚀 Inicio Rápido

### Desarrollo Local

1. **Instalar dependencias**
```bash
cd pos/backend
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
docker-compose up -d pos-backend pos-frontend
```

## 📁 Estructura del Proyecto

```
pos/
├── frontend/                 # Aplicación Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/   # Componentes POS
│   │   │   ├── pages/        # Páginas principales
│   │   │   ├── services/     # Servicios Angular
│   │   │   └── guards/       # Guards de autenticación
│   │   └── assets/           # Recursos estáticos
│   ├── angular.json
│   └── tailwind.config.js
├── backend/                  # API Node.js
│   ├── src/
│   │   ├── entities/         # Entidades TypeORM
│   │   ├── controllers/      # Controladores POS
│   │   ├── services/         # Lógica de negocio
│   │   ├── routes/           # Rutas de la API
│   │   └── middleware/       # Middlewares
│   ├── package.json
│   └── tsconfig.json
├── scripts/                  # Scripts SQL
└── postman/                 # Colecciones de API
    └── CrunchyPaws-POS-API.postman_collection.json
```

## 🔧 Configuración

### Variables de Entorno

```bash
# Servidor
NODE_ENV=development
PORT=3002

# Base de datos
DATABASE_URL=mysql://appuser:apppassword@localhost:3306/crunchypaws

# JWT
JWT_SECRET=pos-jwt-secret-key-2024
JWT_REFRESH_SECRET=pos-refresh-secret-key-2024

# CORS
CORS_ORIGIN=http://localhost:4201

# Redes sociales
SOCIAL_WHATSAPP_BASE_URL=https://api.whatsapp.com/send?phone=50212345678
FACEBOOK_MESSENGER_DEEPLINK=https://m.me/crunchypaws
```

## 📊 API Endpoints

### Autenticación
- `POST /api/auth/login` - Login de empleado
- `POST /api/auth/refresh` - Renovar token
- `POST /api/auth/logout` - Cerrar sesión

### Sesiones POS
- `POST /api/pos/sessions/open` - Abrir sesión de caja
- `POST /api/pos/sessions/close` - Cerrar sesión de caja
- `GET /api/pos/sessions/current` - Sesión actual
- `GET /api/pos/sessions/history` - Historial de sesiones

### Productos
- `GET /api/pos/products/search` - Buscar por SKU
- `GET /api/pos/products/barcode/:code` - Buscar por código de barras
- `GET /api/pos/price-lists` - Listas de precios
- `GET /api/pos/products/:id/prices` - Precios por lista

### Pedidos POS
- `POST /api/pos/orders` - Crear venta
- `GET /api/pos/orders` - Listar ventas
- `GET /api/pos/orders/:id` - Obtener venta
- `PUT /api/pos/orders/:id/cancel` - Cancelar venta

### Reportes
- `GET /api/pos/reports/daily` - Reporte diario
- `GET /api/pos/reports/employee` - Reporte por empleado
- `GET /api/pos/reports/products` - Reporte de productos
- `GET /api/pos/reports/export` - Exportar reportes

## 🏪 Flujo de Trabajo POS

### 1. Apertura de Caja
```bash
POST /api/pos/sessions/open
{
  "opening_amount": 100.00
}
```

### 2. Búsqueda de Productos
```bash
GET /api/pos/products/search?sku=AS001
GET /api/pos/products/barcode/1234567890123
```

### 3. Creación de Venta
```bash
POST /api/pos/orders
{
  "items": [
    {
      "product_id": 1,
      "quantity": 2,
      "unit_price": 50.00
    }
  ],
  "customer_phone": "50212345678",
  "customer_email": "cliente@email.com",
  "payment_method_id": 1,
  "notes": "Venta en tienda"
}
```

### 4. Cierre de Caja
```bash
POST /api/pos/sessions/close
{
  "closing_amount": 150.00
}
```

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
docker build -t crunchypaws-pos-backend ./backend
docker build -t crunchypaws-pos-frontend ./frontend

# Ejecutar
docker run -d -p 3002:3002 crunchypaws-pos-backend
docker run -d -p 4201:4200 crunchypaws-pos-frontend
```

## 📱 Características Móviles

### PWA (Progressive Web App)
- **Instalable** en dispositivos móviles
- **Funcionamiento offline** con sincronización
- **Notificaciones push** para actualizaciones
- **Acceso rápido** desde pantalla de inicio

### Responsive Design
- **Tablet-first** para pantallas táctiles
- **Botones grandes** para fácil uso
- **Navegación intuitiva** con gestos
- **Modo landscape** optimizado

## 🖨️ Integración con Hardware

### Impresoras Térmicas
```bash
POST /api/pos/print/ticket
{
  "order_id": 123,
  "printer_type": "thermal"
}
```

### Lectores de Código de Barras
- **Integración USB** con lectores estándar
- **API de escaneo** para dispositivos móviles
- **Validación automática** de códigos
- **Búsqueda instantánea** de productos

## 📊 Reportes y Analytics

### Reportes Disponibles
- **Ventas diarias** por empleado
- **Productos más vendidos**
- **Métodos de pago** utilizados
- **Comisiones** por empleado
- **Discrepancias** de caja
- **Tiempo promedio** de venta

### Exportación
- **CSV** para análisis externos
- **PDF** para reportes impresos
- **Excel** para contabilidad
- **JSON** para integraciones

## 🔒 Seguridad

### Autenticación
- **JWT** con roles de empleado
- **Sesiones** con timeout automático
- **Logs de auditoría** para todas las acciones
- **Validación** de permisos por función

### Datos Sensibles
- **Encriptación** de datos de pago
- **Máscara** de información personal
- **Backup** automático de transacciones
- **Cumplimiento** con estándares PCI

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

# Build PWA
ng build --configuration production

# Tests
ng test
```

## 📞 Soporte

Para soporte técnico:
- **Email**: dev@crunchypaws.com
- **Issues**: [GitHub Issues](https://github.com/crunchypaws/crunchypaws/issues)

---

**CrunchyPaws POS** - Sistema de punto de venta para mascotas 🏪



