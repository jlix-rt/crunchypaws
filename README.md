# CrunchyPaws - Sistema de Ecommerce para Mascotas

Sistema completo de ecommerce, POS y administración para tienda de mascotas con funcionalidades específicas para el mercado guatemalteco.

## 🏗️ Arquitectura del Sistema

El sistema está compuesto por **3 proyectos independientes**:

- **🛒 Ecommerce** - Tienda online pública
- **🏪 POS** - Sistema de punto de venta para empleados
- **⚙️ Administración** - Panel de administración y gestión

## 🚀 Inicio Rápido

### Prerrequisitos

- Docker y Docker Compose
- Node.js 20+ (para desarrollo local)
- MySQL 8.0+

### Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/crunchypaws/crunchypaws.git
cd crunchypaws
```

2. **Iniciar todos los servicios**
```bash
docker-compose up -d
```

3. **Acceder a las aplicaciones**
- **Ecommerce**: http://localhost/ecommerce
- **POS**: http://localhost/pos
- **Administración**: http://localhost/admin
- **Adminer (BD)**: http://localhost:8080

## 📁 Estructura del Proyecto

```
crunchypaws/
├── ecommerce/                 # Tienda online
│   ├── frontend/             # Angular 20 + SSR + Tailwind
│   ├── backend/              # Node.js + Express + TypeScript + TypeORM
│   ├── scripts/              # SQL migrations y seeds
│   └── postman/              # Colecciones de API
├── pos/                      # Sistema POS
│   ├── frontend/             # Angular 20 + Tailwind
│   ├── backend/              # Node.js + Express + TypeScript + TypeORM
│   ├── scripts/              # SQL migrations y seeds
│   └── postman/              # Colecciones de API
├── administracion/           # Panel de administración
│   ├── frontend/             # Angular 20 + Tailwind
│   ├── backend/              # Node.js + Express + TypeScript + TypeORM
│   ├── scripts/              # SQL migrations y seeds
│   └── postman/              # Colecciones de API
├── nginx/                    # Configuración del proxy reverso
├── docker-compose.yml        # Orquestación de servicios
├── .editorconfig            # Configuración de editor
├── .gitignore              # Archivos ignorados por Git
└── LICENSE                  # Licencia MIT
```

## 🛠️ Tecnologías Utilizadas

### Frontend
- **Angular 20** - Framework principal
- **Angular Universal** - Server-Side Rendering (SSR)
- **Tailwind CSS** - Framework de estilos
- **SCSS** - Preprocesador CSS
- **TypeScript** - Lenguaje de programación

### Backend
- **Node.js 20** - Runtime de JavaScript
- **Express.js** - Framework web
- **TypeScript** - Lenguaje de programación
- **TypeORM** - ORM para base de datos
- **MySQL 8** - Base de datos principal
- **JWT** - Autenticación
- **Zod** - Validación de esquemas

### DevOps
- **Docker** - Contenedores
- **Docker Compose** - Orquestación
- **Nginx** - Proxy reverso
- **Adminer** - Administración de BD

## 🗄️ Base de Datos

### Esquema Principal

El sistema utiliza un esquema unificado con las siguientes entidades principales:

- **Catálogo**: `categories`, `products`, `product_images`, `product_variants`
- **Usuarios**: `users`, `addresses`, `employees`
- **Pedidos**: `orders`, `order_items`, `payments`, `order_status_history`
- **Envíos**: `shipping_rates`, `shipments`
- **Fidelización**: `loyalty_accounts`, `loyalty_transactions`, `referrals`
- **Administración**: `supplies`, `product_recipe`, `price_addons`, `promotions`

### Características Específicas para Guatemala

- **Direcciones**: Jerarquía departamento → municipio → zona → colonia
- **NIT**: Campo opcional para facturación
- **FEL**: Integración preparada para Facturación Electrónica
- **Envíos**: Cálculo por jerarquía geográfica

## 🔧 Configuración de Desarrollo

### Variables de Entorno

Cada backend tiene su archivo `env.example` con las variables necesarias:

```bash
# Copiar archivos de ejemplo
cp ecommerce/backend/env.example ecommerce/backend/.env
cp pos/backend/env.example pos/backend/.env
cp administracion/backend/env.example administracion/backend/.env
```

### Comandos de Desarrollo

```bash
# Desarrollo completo
docker-compose up -d

# Solo base de datos
docker-compose up -d mysql adminer

# Reconstruir servicios
docker-compose up -d --build

# Ver logs
docker-compose logs -f [servicio]

# Detener servicios
docker-compose down
```

## 📊 APIs y Documentación

### Endpoints Principales

#### Ecommerce API (Puerto 3001)
- **Auth**: `/api/auth/*` - Autenticación de clientes
- **Catálogo**: `/api/catalog/*` - Productos y categorías
- **Carrito**: `/api/cart/*` - Gestión del carrito
- **Pedidos**: `/api/orders/*` - Procesamiento de pedidos
- **Pagos**: `/api/payments/*` - Procesamiento de pagos
- **Reseñas**: `/api/reviews/*` - Sistema de reseñas
- **Fidelización**: `/api/loyalty/*` - Puntos y recompensas
- **Envíos**: `/api/shipping/*` - Cálculo de envíos

#### POS API (Puerto 3002)
- **Auth**: `/api/auth/*` - Autenticación de empleados
- **Sesiones**: `/api/pos/sessions/*` - Gestión de caja
- **Productos**: `/api/pos/products/*` - Búsqueda por SKU/código
- **Pedidos**: `/api/pos/orders/*` - Creación de ventas
- **Reportes**: `/api/pos/reports/*` - Reportes de ventas

#### Administración API (Puerto 3003)
- **Auth**: `/api/auth/*` - Autenticación de administradores
- **Insumos**: `/api/admin/supplies/*` - Gestión de insumos
- **Productos**: `/api/admin/products/*` - CRUD de productos
- **Usuarios**: `/api/admin/users/*` - Gestión de usuarios
- **Reportes**: `/api/admin/reports/*` - Reportes administrativos

### Colecciones Postman

Cada proyecto incluye colecciones completas de Postman:
- `ecommerce/postman/CrunchyPaws-Ecommerce-API.postman_collection.json`
- `pos/postman/CrunchyPaws-POS-API.postman_collection.json`
- `administracion/postman/CrunchyPaws-Administracion-API.postman_collection.json`

## 🧪 Testing

### Backend
```bash
# Tests unitarios
npm run test

# Tests e2e
npm run test:e2e

# Coverage
npm run test:coverage
```

### Frontend
```bash
# Tests unitarios
ng test

# Tests e2e
ng e2e
```

## 🚀 Despliegue a Producción

### Docker Production

```bash
# Construir imágenes de producción
docker-compose -f docker-compose.prod.yml build

# Desplegar
docker-compose -f docker-compose.prod.yml up -d
```

### Kubernetes

Se incluyen manifests de ejemplo en cada proyecto:
- `k8s/deployment.yaml`
- `k8s/service.yaml`
- `k8s/ingress.yaml`

## 🔒 Seguridad

### Implementado
- **JWT** con access/refresh tokens
- **Rate limiting** por endpoint
- **CORS** configurado por origen
- **Helmet** para headers de seguridad
- **Validación** de entrada con Zod
- **Sanitización** de datos
- **Logging** de auditoría

### Recomendaciones
- Usar HTTPS en producción
- Configurar firewall
- Monitorear logs de seguridad
- Actualizar dependencias regularmente

## 📈 Monitoreo y Logs

### Health Checks
- **Ecommerce**: http://localhost:3001/health
- **POS**: http://localhost:3002/health
- **Administración**: http://localhost:3003/health

### Logs
```bash
# Ver logs de todos los servicios
docker-compose logs -f

# Logs de un servicio específico
docker-compose logs -f ecommerce-backend
```

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 📞 Soporte

Para soporte técnico o preguntas:
- **Email**: dev@crunchypaws.com
- **Issues**: [GitHub Issues](https://github.com/crunchypaws/crunchypaws/issues)

## 🗺️ Roadmap

### Próximas Funcionalidades
- [ ] Integración con FEL (Facturación Electrónica Guatemala)
- [ ] Sistema de notificaciones WhatsApp/Email
- [ ] Dashboard en tiempo real
- [ ] Modo offline para POS
- [ ] Integración con impresoras térmicas
- [ ] Sistema de inventario avanzado
- [ ] A/B testing de productos
- [ ] Integración con ERPs

---

**CrunchyPaws** - Sistema completo de ecommerce para mascotas 🐾



