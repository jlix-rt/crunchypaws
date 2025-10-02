# 🗄️ CrunchyPaws Database

Documentación completa de la base de datos MySQL para el e-commerce de productos deshidratados para mascotas.

## 📋 Tabla de Contenidos

- [🏗️ Arquitectura](#️-arquitectura)
- [📊 Modelo de Datos](#-modelo-de-datos)
- [🔗 Relaciones](#-relaciones)
- [📝 Esquemas](#-esquemas)
- [🌱 Seeds](#-seeds)
- [🔍 Índices](#-índices)
- [🚀 Migraciones](#-migraciones)
- [📈 Performance](#-performance)
- [🔒 Seguridad](#-seguridad)
- [🛠️ Mantenimiento](#️-mantenimiento)

## 🏗️ Arquitectura

### Tecnologías
- **MySQL 8.0** - Base de datos principal
- **Prisma** - ORM y query builder
- **TypeScript** - Tipado de esquemas

### Estructura de Directorios
```
database/
├── init/              # Scripts de inicialización
├── migrations/        # Migraciones de Prisma
├── backups/          # Respaldos de base de datos
└── docs/             # Documentación adicional
```

## 📊 Modelo de Datos

### Entidades Principales

#### 👤 Usuarios y Autenticación
```sql
-- Usuarios del sistema
User {
  id: Int (PK, AI)
  nombre: String(100)
  apellido: String(100)
  email: String(255) UNIQUE
  telefono: String(20) NOT NULL
  nit: String(20) OPTIONAL
  passwordHash: String(255)
  createdAt: DateTime
  updatedAt: DateTime
}

-- Direcciones de usuarios
UserAddress {
  id: Int (PK, AI)
  userId: Int (FK → User.id)
  alias: String(50)
  line1: String(200)
  line2: String(200) OPTIONAL
  municipio: String(100)
  departamento: String(100)
  codigoPostal: String(10) OPTIONAL
  referencia: String(200) OPTIONAL
  esPredeterminada: Boolean DEFAULT false
  createdAt: DateTime
  updatedAt: DateTime
}
```

#### 🛍️ Catálogo de Productos
```sql
-- Categorías jerárquicas
Category {
  id: Int (PK, AI)
  name: String(100)
  slug: String(100) UNIQUE
  parentId: Int OPTIONAL (FK → Category.id)
  createdAt: DateTime
  updatedAt: DateTime
}

-- Productos del catálogo
Product {
  id: Int (PK, AI)
  name: String(200)
  slug: String(200) UNIQUE
  description: Text
  price: Decimal(10,2)
  imageUrl: String(500) OPTIONAL
  stock: Int DEFAULT 0
  isFeatured: Boolean DEFAULT false
  categoryId: Int (FK → Category.id)
  createdAt: DateTime
  updatedAt: DateTime
}
```

#### 📦 Órdenes y Pagos
```sql
-- Órdenes de compra
Order {
  id: Int (PK, AI)
  userId: Int OPTIONAL (FK → User.id)
  addressId: Int OPTIONAL (FK → UserAddress.id)
  
  -- Información del cliente (snapshot)
  customerName: String(200)
  email: String(255)
  phone: String(20)
  billingNit: String(20) OPTIONAL
  
  -- Dirección de envío (snapshot)
  shipToLine1: String(200)
  shipToLine2: String(200) OPTIONAL
  shipToMunicipio: String(100)
  shipToDepartamento: String(100)
  shipToCodigoPostal: String(10) OPTIONAL
  shipToReferencia: String(200) OPTIONAL
  
  -- Detalles de pago
  paymentMethod: String(50)
  status: OrderStatus DEFAULT 'PENDING'
  subtotal: Decimal(10,2)
  discount: Decimal(10,2) DEFAULT 0
  total: Decimal(10,2)
  
  createdAt: DateTime
  updatedAt: DateTime
}

-- Items de las órdenes
OrderItem {
  id: Int (PK, AI)
  orderId: Int (FK → Order.id)
  productId: Int (FK → Product.id)
  nameSnapshot: String(200)
  priceSnapshot: Decimal(10,2)
  quantity: Int
  createdAt: DateTime
}

-- Estados de órdenes
OrderStatus: ENUM {
  'PENDING'
  'PAID'
  'CANCELLED'
}
```

#### 🎫 Marketing y Promociones
```sql
-- Cupones de descuento
Coupon {
  id: Int (PK, AI)
  code: String(50) UNIQUE
  type: CouponType
  value: Decimal(10,2)
  minSubtotal: Decimal(10,2) OPTIONAL
  expiresAt: DateTime OPTIONAL
  isActive: Boolean DEFAULT true
  createdAt: DateTime
  updatedAt: DateTime
}

-- Tipos de cupones
CouponType: ENUM {
  'PERCENTAGE'
  'FIXED'
}
```

#### 💳 Métodos de Pago
```sql
-- Métodos de pago disponibles
PaymentMethod {
  id: Int (PK, AI)
  key: String(50) UNIQUE
  label: String(100)
  enabled: Boolean DEFAULT true
  meta: JSON OPTIONAL
  createdAt: DateTime
  updatedAt: DateTime
}
```

#### 📞 Comunicación
```sql
-- Mensajes de contacto
ContactMessage {
  id: Int (PK, AI)
  name: String(100)
  email: String(255)
  message: Text
  createdAt: DateTime
}
```

#### ⚙️ Configuración
```sql
-- Configuraciones del sistema
Config {
  id: Int (PK, AI)
  scope: String(50)
  key: String(100)
  value: JSON
  createdAt: DateTime
  updatedAt: DateTime
  
  UNIQUE(scope, key)
}
```

## 🔗 Relaciones

### Diagrama de Relaciones
```
User ||--o{ UserAddress : "tiene múltiples"
User ||--o{ Order : "realiza múltiples"

Category ||--o{ Category : "contiene subcategorías"
Category ||--o{ Product : "agrupa múltiples"

Order ||--o{ OrderItem : "contiene múltiples"
Product ||--o{ OrderItem : "aparece en múltiples"

UserAddress ||--o{ Order : "se usa en múltiples"
```

### Relaciones Detalladas

#### Usuario → Direcciones (1:N)
- Un usuario puede tener múltiples direcciones
- Una dirección pertenece a un solo usuario
- Cascade delete: eliminar usuario elimina sus direcciones

#### Usuario → Órdenes (1:N)
- Un usuario puede tener múltiples órdenes
- Una orden puede ser de un usuario o invitado (userId nullable)

#### Categoría → Subcategorías (1:N Self-Reference)
- Una categoría puede tener múltiples subcategorías
- Una subcategoría tiene una categoría padre

#### Categoría → Productos (1:N)
- Una categoría puede tener múltiples productos
- Un producto pertenece a una categoría

#### Orden → Items (1:N)
- Una orden contiene múltiples items
- Un item pertenece a una orden
- Cascade delete: eliminar orden elimina sus items

#### Producto → Items de Orden (1:N)
- Un producto puede aparecer en múltiples items de orden
- Un item de orden referencia un producto (con snapshot)

## 📝 Esquemas

### Esquema Prisma
```prisma
// Ubicación: backend/prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

// Ver archivo completo en backend/prisma/schema.prisma
```

### Comandos Prisma
```bash
# Generar cliente
npx prisma generate

# Aplicar cambios al esquema
npx prisma db push

# Crear migración
npx prisma migrate dev --name descripcion_cambio

# Aplicar migraciones en producción
npx prisma migrate deploy

# Abrir Prisma Studio
npx prisma studio

# Reset completo (desarrollo)
npx prisma migrate reset
```

## 🌱 Seeds

### Datos de Prueba Incluidos

#### Categorías
```typescript
// Estructura jerárquica
Perro
├── Snacks
└── Tratamientos

Gato
├── Snacks
└── Tratamientos
```

#### Productos Demo
- **Patitas de Pollo Deshidratadas** (Destacado)
- **Tráqueas de Res Deshidratadas** (Destacado)
- **Orejas de Cerdo Deshidratadas**
- **Pulmón de Res Deshidratado**
- **Hígado de Pollo Deshidratado** (Destacado)
- **Pescado Deshidratado para Gatos** (Destacado)
- **Pollo Deshidratado para Gatos**
- **Hígado de Pollo para Gatos** (Destacado)

#### Cupones
- **BIENVENIDO10**: 10% descuento, mínimo Q50
- **ENVIOGRATIS**: Q15 descuento fijo, mínimo Q100
- **PRIMERACOMPRA**: 15% descuento, mínimo Q75

#### Usuario Demo
- **Email**: demo@crunchypaws.com
- **Password**: password123
- **Direcciones**: 2 direcciones de ejemplo (Casa y Oficina)

#### Métodos de Pago
- **CARD**: Tarjeta de Crédito/Débito
- **CASH**: Efectivo contra entrega
- **TRANSFER**: Transferencia Bancaria

#### Configuración WhatsApp
- **Provider**: mock (para desarrollo)
- **Habilitado**: true
- **Números**: +50200000000 (ejemplo)

### Ejecutar Seeds
```bash
# Desde el directorio backend
npm run db:seed

# O directamente
npx tsx src/prisma/seed.ts
```

## 🔍 Índices

### Índices Implementados

#### Usuarios
```sql
-- Búsqueda por email (único)
CREATE UNIQUE INDEX users_email_key ON users(email);

-- Búsqueda de direcciones por usuario
CREATE INDEX user_addresses_userId_idx ON user_addresses(userId);
CREATE INDEX user_addresses_esPredeterminada_idx ON user_addresses(esPredeterminada);
```

#### Productos y Categorías
```sql
-- Búsqueda por slug (único)
CREATE UNIQUE INDEX products_slug_key ON products(slug);
CREATE UNIQUE INDEX categories_slug_key ON categories(slug);

-- Filtros comunes
CREATE INDEX products_categoryId_idx ON products(categoryId);
CREATE INDEX products_isFeatured_idx ON products(isFeatured);
CREATE INDEX products_createdAt_idx ON products(createdAt);

-- Jerarquía de categorías
CREATE INDEX categories_parentId_idx ON categories(parentId);
```

#### Órdenes
```sql
-- Búsqueda por usuario
CREATE INDEX orders_userId_idx ON orders(userId);

-- Filtros por estado y fecha
CREATE INDEX orders_status_idx ON orders(status);
CREATE INDEX orders_createdAt_idx ON orders(createdAt);

-- Items de orden
CREATE INDEX order_items_orderId_idx ON order_items(orderId);
CREATE INDEX order_items_productId_idx ON order_items(productId);
```

#### Cupones
```sql
-- Búsqueda por código (único)
CREATE UNIQUE INDEX coupons_code_key ON coupons(code);

-- Filtros por estado
CREATE INDEX coupons_isActive_idx ON coupons(isActive);
```

#### Métodos de Pago
```sql
-- Búsqueda por clave (único)
CREATE UNIQUE INDEX payment_methods_key_key ON payment_methods(key);

-- Filtros por estado
CREATE INDEX payment_methods_enabled_idx ON payment_methods(enabled);
```

#### Configuración
```sql
-- Búsqueda por scope y key (único compuesto)
CREATE UNIQUE INDEX configs_scope_key_key ON configs(scope, key);

-- Filtros por scope
CREATE INDEX configs_scope_idx ON configs(scope);
```

### Análisis de Performance
```sql
-- Verificar uso de índices
EXPLAIN SELECT * FROM products WHERE categoryId = 1;

-- Estadísticas de índices
SHOW INDEX FROM products;

-- Análizar consultas lentas
SHOW PROCESSLIST;
```

## 🚀 Migraciones

### Flujo de Migraciones

#### Desarrollo
```bash
# 1. Modificar schema.prisma
# 2. Crear migración
npx prisma migrate dev --name add_user_preferences

# 3. Aplicar automáticamente y regenerar cliente
```

#### Producción
```bash
# 1. Aplicar migraciones
npx prisma migrate deploy

# 2. Verificar estado
npx prisma migrate status
```

### Estrategias de Migración

#### Cambios No Destructivos
- Agregar columnas opcionales
- Agregar índices
- Agregar tablas nuevas

#### Cambios Destructivos
```sql
-- 1. Crear nueva columna
ALTER TABLE products ADD COLUMN new_price DECIMAL(10,2);

-- 2. Migrar datos
UPDATE products SET new_price = old_price;

-- 3. Eliminar columna antigua (en migración posterior)
ALTER TABLE products DROP COLUMN old_price;
```

### Rollback de Migraciones
```bash
# Ver historial
npx prisma migrate status

# Rollback manual (no automático en Prisma)
# Requiere restaurar backup y aplicar migraciones hasta punto deseado
```

## 📈 Performance

### Optimizaciones Implementadas

#### Consultas Eficientes
```typescript
// Incluir relaciones necesarias
const products = await prisma.product.findMany({
  include: {
    category: true,
  },
  where: {
    categoryId: categoryId,
  },
  orderBy: {
    createdAt: 'desc',
  },
  take: 12,
  skip: offset,
});

// Contar sin traer datos
const total = await prisma.product.count({
  where: { categoryId },
});
```

#### Paginación
```typescript
// Offset-based pagination (implementado)
const products = await prisma.product.findMany({
  skip: (page - 1) * limit,
  take: limit,
});

// Cursor-based pagination (para listas grandes)
const products = await prisma.product.findMany({
  take: 10,
  cursor: lastProductId ? { id: lastProductId } : undefined,
  orderBy: { id: 'asc' },
});
```

#### Transacciones
```typescript
// Transacciones para operaciones atómicas
await prisma.$transaction(async (tx) => {
  const order = await tx.order.create({ data: orderData });
  
  for (const item of items) {
    await tx.orderItem.create({
      data: { orderId: order.id, ...item },
    });
    
    await tx.product.update({
      where: { id: item.productId },
      data: { stock: { decrement: item.quantity } },
    });
  }
});
```

### Monitoreo de Performance
```sql
-- Consultas lentas
SELECT * FROM information_schema.processlist 
WHERE command != 'Sleep' AND time > 5;

-- Uso de índices
SELECT 
  table_name,
  index_name,
  cardinality,
  sub_part,
  packed,
  nullable,
  index_type
FROM information_schema.statistics 
WHERE table_schema = 'crunchypaws';

-- Tamaño de tablas
SELECT 
  table_name,
  round(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.tables 
WHERE table_schema = 'crunchypaws'
ORDER BY (data_length + index_length) DESC;
```

## 🔒 Seguridad

### Medidas Implementadas

#### Acceso a Datos
- **Prisma ORM** previene SQL injection
- **Validación** en capa de aplicación
- **Sanitización** de inputs
- **Principio de menor privilegio**

#### Configuración MySQL
```sql
-- Usuario específico para la aplicación
CREATE USER 'crunchyapp'@'%' IDENTIFIED BY 'secure_password';

-- Permisos mínimos necesarios
GRANT SELECT, INSERT, UPDATE, DELETE ON crunchypaws.* TO 'crunchyapp'@'%';

-- Sin permisos administrativos
-- NO GRANT: CREATE, DROP, ALTER, INDEX, etc.
```

#### Datos Sensibles
```typescript
// Passwords hasheadas
const passwordHash = await bcrypt.hash(password, 10);

// Tokens JWT seguros
const token = jwt.sign(payload, process.env.JWT_SECRET, {
  expiresIn: '7d',
});

// No exponer datos sensibles en respuestas
const { passwordHash, ...userResponse } = user;
```

### Auditoría y Logs
```sql
-- Habilitar logs de consultas (desarrollo)
SET GLOBAL general_log = 'ON';
SET GLOBAL log_output = 'TABLE';

-- Ver logs
SELECT * FROM mysql.general_log 
WHERE command_type = 'Query' 
ORDER BY event_time DESC 
LIMIT 100;
```

## 🛠️ Mantenimiento

### Respaldos

#### Backup Automático
```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
DB_NAME="crunchypaws"

# Crear backup
mysqldump -h localhost -u backup_user -p$BACKUP_PASSWORD \
  --single-transaction \
  --routines \
  --triggers \
  $DB_NAME > $BACKUP_DIR/crunchypaws_$DATE.sql

# Comprimir
gzip $BACKUP_DIR/crunchypaws_$DATE.sql

# Limpiar backups antiguos (mantener 30 días)
find $BACKUP_DIR -name "crunchypaws_*.sql.gz" -mtime +30 -delete
```

#### Restaurar Backup
```bash
# Descomprimir
gunzip crunchypaws_20231201_120000.sql.gz

# Restaurar
mysql -h localhost -u root -p crunchypaws < crunchypaws_20231201_120000.sql
```

### Mantenimiento Regular

#### Optimización de Tablas
```sql
-- Analizar tablas
ANALYZE TABLE products, orders, order_items;

-- Optimizar tablas
OPTIMIZE TABLE products, orders, order_items;

-- Verificar integridad
CHECK TABLE products, orders, order_items;
```

#### Limpieza de Datos
```sql
-- Limpiar logs antiguos (si se habilitan)
DELETE FROM mysql.general_log 
WHERE event_time < DATE_SUB(NOW(), INTERVAL 7 DAY);

-- Limpiar carritos abandonados (si se implementa tabla de carritos)
DELETE FROM carts 
WHERE updated_at < DATE_SUB(NOW(), INTERVAL 30 DAY);
```

### Monitoreo
```sql
-- Conexiones activas
SHOW PROCESSLIST;

-- Estado del servidor
SHOW STATUS LIKE 'Threads_connected';
SHOW STATUS LIKE 'Queries';
SHOW STATUS LIKE 'Uptime';

-- Variables importantes
SHOW VARIABLES LIKE 'max_connections';
SHOW VARIABLES LIKE 'innodb_buffer_pool_size';
```

## 📊 Métricas y Estadísticas

### Consultas Útiles

#### Estadísticas de Ventas
```sql
-- Productos más vendidos
SELECT 
  p.name,
  SUM(oi.quantity) as total_sold,
  SUM(oi.quantity * oi.priceSnapshot) as revenue
FROM order_items oi
JOIN products p ON oi.productId = p.id
JOIN orders o ON oi.orderId = o.id
WHERE o.status = 'PAID'
GROUP BY p.id, p.name
ORDER BY total_sold DESC
LIMIT 10;

-- Ventas por mes
SELECT 
  DATE_FORMAT(createdAt, '%Y-%m') as month,
  COUNT(*) as orders,
  SUM(total) as revenue
FROM orders 
WHERE status = 'PAID'
GROUP BY month
ORDER BY month DESC;
```

#### Estadísticas de Usuarios
```sql
-- Usuarios más activos
SELECT 
  u.nombre,
  u.apellido,
  COUNT(o.id) as total_orders,
  SUM(o.total) as total_spent
FROM users u
LEFT JOIN orders o ON u.id = o.userId
WHERE o.status = 'PAID'
GROUP BY u.id
ORDER BY total_spent DESC
LIMIT 10;

-- Registros por mes
SELECT 
  DATE_FORMAT(createdAt, '%Y-%m') as month,
  COUNT(*) as new_users
FROM users
GROUP BY month
ORDER BY month DESC;
```

## 🚀 Escalabilidad

### Consideraciones Futuras

#### Particionamiento
```sql
-- Particionar órdenes por fecha (para volúmenes altos)
ALTER TABLE orders 
PARTITION BY RANGE (YEAR(createdAt)) (
  PARTITION p2023 VALUES LESS THAN (2024),
  PARTITION p2024 VALUES LESS THAN (2025),
  PARTITION p_future VALUES LESS THAN MAXVALUE
);
```

#### Réplicas de Lectura
```sql
-- Configurar replica para consultas de solo lectura
-- Master: escrituras
-- Slave: lecturas (reportes, analytics)
```

#### Archivado de Datos
```sql
-- Mover órdenes antiguas a tabla de archivo
CREATE TABLE orders_archive LIKE orders;

INSERT INTO orders_archive 
SELECT * FROM orders 
WHERE createdAt < DATE_SUB(NOW(), INTERVAL 2 YEAR);

DELETE FROM orders 
WHERE createdAt < DATE_SUB(NOW(), INTERVAL 2 YEAR);
```

---

**Base de datos diseñada con ❤️ para CrunchyPaws 🐾**
