-- =============================================
-- CRUNCHYPAWS - ESQUEMA DE BASE DE DATOS
-- =============================================
-- Script de inicialización de la base de datos
-- Incluye todas las tablas para ecommerce, POS y administración
-- =============================================

SET FOREIGN_KEY_CHECKS = 0;
DROP DATABASE IF EXISTS crunchypaws;
CREATE DATABASE crunchypaws CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE crunchypaws;
SET FOREIGN_KEY_CHECKS = 1;

-- =============================================
-- CATÁLOGO Y PRECIOS
-- =============================================

-- Categorías
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    parent_id INT NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_parent_id (parent_id),
    INDEX idx_slug (slug),
    INDEX idx_is_active (is_active),
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Productos
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    sku VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    category_id INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    stock INT DEFAULT 0,
    min_price DECIMAL(10,2) DEFAULT 0.00,
    max_price DECIMAL(10,2) DEFAULT 0.00,
    base_price DECIMAL(10,2) DEFAULT 0.00,
    final_price DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_sku (sku),
    INDEX idx_slug (slug),
    INDEX idx_category_id (category_id),
    INDEX idx_is_active (is_active),
    INDEX idx_final_price (final_price),
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
);

-- Imágenes de productos
CREATE TABLE product_images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    url VARCHAR(500) NOT NULL,
    alt VARCHAR(255),
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_product_id (product_id),
    INDEX idx_sort_order (sort_order),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Variantes de productos
CREATE TABLE product_variants (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    extra_price DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_product_id (product_id),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Cupones
CREATE TABLE coupons (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) NOT NULL UNIQUE,
    type ENUM('PERCENT', 'AMOUNT') NOT NULL,
    value DECIMAL(10,2) NOT NULL,
    starts_at TIMESTAMP NULL,
    ends_at TIMESTAMP NULL,
    max_uses INT NULL,
    times_used INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    apply_scope ENUM('GLOBAL', 'CATEGORY', 'PRODUCT') DEFAULT 'GLOBAL',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_code (code),
    INDEX idx_is_active (is_active),
    INDEX idx_apply_scope (apply_scope)
);

-- Sobrescritura de precios
CREATE TABLE price_overrides (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    min_allowed DECIMAL(10,2) NOT NULL,
    max_allowed DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_product_id (product_id),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- =============================================
-- USUARIOS, DIRECCIONES Y SOCIAL
-- =============================================

-- Usuarios
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    nit VARCHAR(20) NULL,
    role ENUM('CLIENT', 'EMPLOYEE', 'ADMIN') DEFAULT 'CLIENT',
    is_active BOOLEAN DEFAULT TRUE,
    referral_code VARCHAR(20) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_phone (phone),
    INDEX idx_role (role),
    INDEX idx_is_active (is_active),
    INDEX idx_referral_code (referral_code)
);

-- Direcciones
CREATE TABLE addresses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    label VARCHAR(100) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    department VARCHAR(100) NOT NULL,
    municipality VARCHAR(100) NOT NULL,
    zone VARCHAR(100),
    colonia VARCHAR(100),
    street VARCHAR(255) NOT NULL,
    reference TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_is_default (is_default),
    INDEX idx_department (department),
    INDEX idx_municipality (municipality),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Enlaces sociales
CREATE TABLE social_links (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name ENUM('facebook', 'tiktok', 'messenger', 'instagram', 'whatsapp') NOT NULL,
    url VARCHAR(500) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_name (name),
    INDEX idx_is_active (is_active)
);

-- =============================================
-- ENVÍOS Y TARIFAS
-- =============================================

-- Tarifas de envío
CREATE TABLE shipping_rates (
    id INT PRIMARY KEY AUTO_INCREMENT,
    department VARCHAR(100) NOT NULL,
    municipality VARCHAR(100) NULL,
    zone VARCHAR(100) NULL,
    colonia VARCHAR(100) NULL,
    price DECIMAL(10,2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_department (department),
    INDEX idx_municipality (municipality),
    INDEX idx_zone (zone),
    INDEX idx_colonia (colonia),
    INDEX idx_is_active (is_active)
);

-- =============================================
-- PEDIDOS, PAGOS Y ESTADOS
-- =============================================

-- Pedidos
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    nit VARCHAR(20) NULL,
    address_snapshot JSON,
    subtotal DECIMAL(10,2) NOT NULL,
    discount_total DECIMAL(10,2) DEFAULT 0.00,
    shipping_price DECIMAL(10,2) DEFAULT 0.00,
    total DECIMAL(10,2) NOT NULL,
    status ENUM('CREATED', 'PAID', 'PREPARING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED') DEFAULT 'CREATED',
    source ENUM('ECOMMERCE', 'POS') DEFAULT 'ECOMMERCE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_phone (phone),
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_source (source),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Items de pedidos
CREATE TABLE order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100) NOT NULL,
    qty INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0.00,
    final_line_total DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_order_id (order_id),
    INDEX idx_product_id (product_id),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
);

-- Pagos
CREATE TABLE payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    method_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status ENUM('PENDING', 'PAID', 'FAILED', 'REFUNDED') DEFAULT 'PENDING',
    transaction_ref VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_order_id (order_id),
    INDEX idx_method_id (method_id),
    INDEX idx_status (status),
    INDEX idx_transaction_ref (transaction_ref),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Métodos de pago
CREATE TABLE payment_methods (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    type ENUM('CARD', 'TRANSFER', 'CASH', 'WALLET', 'OTHERS') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_type (type),
    INDEX idx_is_active (is_active)
);

-- Historial de estados de pedidos
CREATE TABLE order_status_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    status ENUM('CREATED', 'PAID', 'PREPARING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED') NOT NULL,
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_order_id (order_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Envíos
CREATE TABLE shipments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    carrier VARCHAR(100) NOT NULL,
    tracking_code VARCHAR(255),
    status VARCHAR(50) DEFAULT 'PENDING',
    events JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_order_id (order_id),
    INDEX idx_tracking_code (tracking_code),
    INDEX idx_status (status),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- =============================================
-- POS: EMPLEADOS, SESIONES Y AUDITORÍA
-- =============================================

-- Empleados
CREATE TABLE employees (
    id INT PRIMARY KEY,
    commission_percent DECIMAL(5,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id) REFERENCES users(id) ON DELETE CASCADE
);

-- Sesiones POS
CREATE TABLE pos_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    employee_id INT NOT NULL,
    opened_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    closed_at TIMESTAMP NULL,
    opening_amount DECIMAL(10,2) DEFAULT 0.00,
    closing_amount DECIMAL(10,2) DEFAULT 0.00,
    INDEX idx_employee_id (employee_id),
    INDEX idx_opened_at (opened_at),
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE RESTRICT
);

-- Discrepancias POS
CREATE TABLE pos_discrepancies (
    id INT PRIMARY KEY AUTO_INCREMENT,
    session_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    reason TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_session_id (session_id),
    FOREIGN KEY (session_id) REFERENCES pos_sessions(id) ON DELETE CASCADE
);

-- Logs de auditoría
CREATE TABLE audit_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NULL,
    action VARCHAR(100) NOT NULL,
    entity VARCHAR(100) NOT NULL,
    entity_id INT NULL,
    meta JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_action (action),
    INDEX idx_entity (entity),
    INDEX idx_entity_id (entity_id),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Sucursales
CREATE TABLE branches (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(20) NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_code (code),
    INDEX idx_is_active (is_active)
);

-- Listas de precios
CREATE TABLE price_lists (
    id INT PRIMARY KEY AUTO_INCREMENT,
    branch_id INT NULL,
    name VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_branch_id (branch_id),
    INDEX idx_is_active (is_active),
    FOREIGN KEY (branch_id) REFERENCES branches(id) ON DELETE SET NULL
);

-- Precios de productos por lista
CREATE TABLE product_prices (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    price_list_id INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_product_id (product_id),
    INDEX idx_price_list_id (price_list_id),
    UNIQUE KEY unique_product_price_list (product_id, price_list_id),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (price_list_id) REFERENCES price_lists(id) ON DELETE CASCADE
);

-- =============================================
-- ADMINISTRACIÓN: INSUMOS, RECETAS, AGREGADOS Y PROMOCIONES
-- =============================================

-- Insumos
CREATE TABLE supplies (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    unit_cost DECIMAL(10,2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_also_product BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name),
    INDEX idx_is_active (is_active),
    INDEX idx_is_also_product (is_also_product)
);

-- Recetas de productos
CREATE TABLE product_recipe (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    supply_id INT NOT NULL,
    quantity DECIMAL(10,3) NOT NULL,
    total_cost_cached DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_product_id (product_id),
    INDEX idx_supply_id (supply_id),
    UNIQUE KEY unique_product_supply (product_id, supply_id),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (supply_id) REFERENCES supplies(id) ON DELETE CASCADE
);

-- Agregados de precio
CREATE TABLE price_addons (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    percent DECIMAL(5,2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name),
    INDEX idx_is_active (is_active)
);

-- Agregados por producto
CREATE TABLE product_addons (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    addon_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_product_id (product_id),
    INDEX idx_addon_id (addon_id),
    UNIQUE KEY unique_product_addon (product_id, addon_id),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (addon_id) REFERENCES price_addons(id) ON DELETE CASCADE
);

-- Promociones
CREATE TABLE promotions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    scope ENUM('GLOBAL', 'CATEGORY', 'PRODUCT', 'BUNDLE') NOT NULL,
    rule JSON NOT NULL,
    starts_at TIMESTAMP NULL,
    ends_at TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name),
    INDEX idx_scope (scope),
    INDEX idx_is_active (is_active),
    INDEX idx_starts_at (starts_at),
    INDEX idx_ends_at (ends_at)
);

-- Reseñas
CREATE TABLE reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    user_id INT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    body TEXT,
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_product_id (product_id),
    INDEX idx_user_id (user_id),
    INDEX idx_rating (rating),
    INDEX idx_is_approved (is_approved),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- =============================================
-- FIDELIZACIÓN Y REFERIDOS
-- =============================================

-- Cuentas de fidelización
CREATE TABLE loyalty_accounts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL UNIQUE,
    points INT DEFAULT 0,
    tier VARCHAR(50) DEFAULT 'BRONZE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_tier (tier),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Transacciones de fidelización
CREATE TABLE loyalty_transactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    account_id INT NOT NULL,
    points_delta INT NOT NULL,
    reason VARCHAR(255) NOT NULL,
    order_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_account_id (account_id),
    INDEX idx_order_id (order_id),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (account_id) REFERENCES loyalty_accounts(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL
);

-- Referidos
CREATE TABLE referrals (
    id INT PRIMARY KEY AUTO_INCREMENT,
    referrer_user_id INT NOT NULL,
    referred_user_id INT NOT NULL,
    reward_points INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_referrer_user_id (referrer_user_id),
    INDEX idx_referred_user_id (referred_user_id),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (referrer_user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (referred_user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =============================================
-- DEVOLUCIONES Y NOTAS
-- =============================================

-- Devoluciones
CREATE TABLE returns (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    reason TEXT NOT NULL,
    status ENUM('REQUESTED', 'APPROVED', 'REJECTED', 'REFUNDED') DEFAULT 'REQUESTED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_order_id (order_id),
    INDEX idx_status (status),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Notas de crédito
CREATE TABLE credit_notes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    reason TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_order_id (order_id),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- =============================================
-- ÍNDICES ADICIONALES PARA OPTIMIZACIÓN
-- =============================================

-- Índices compuestos para consultas frecuentes
CREATE INDEX idx_products_category_active ON products(category_id, is_active);
CREATE INDEX idx_orders_user_status ON orders(user_id, status);
CREATE INDEX idx_orders_status_created ON orders(status, created_at);
CREATE INDEX idx_order_items_order_product ON order_items(order_id, product_id);
CREATE INDEX idx_payments_order_status ON payments(order_id, status);
CREATE INDEX idx_reviews_product_approved ON reviews(product_id, is_approved);
CREATE INDEX idx_loyalty_transactions_account_created ON loyalty_transactions(account_id, created_at);

-- =============================================
-- TRIGGERS PARA AUDITORÍA
-- =============================================

DELIMITER $$

-- Trigger para actualizar updated_at automáticamente
CREATE TRIGGER tr_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW 
BEGIN 
    SET NEW.updated_at = CURRENT_TIMESTAMP; 
END$$

CREATE TRIGGER tr_orders_updated_at 
    BEFORE UPDATE ON orders 
    FOR EACH ROW 
BEGIN 
    SET NEW.updated_at = CURRENT_TIMESTAMP; 
END$$

CREATE TRIGGER tr_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
BEGIN 
    SET NEW.updated_at = CURRENT_TIMESTAMP; 
END$$

DELIMITER ;

-- =============================================
-- VISTAS ÚTILES
-- =============================================

-- Vista de productos con información de categoría
CREATE VIEW v_products_with_category AS
SELECT 
    p.id,
    p.sku,
    p.name,
    p.slug,
    p.description,
    p.is_active,
    p.stock,
    p.final_price,
    c.name as category_name,
    c.slug as category_slug,
    p.created_at,
    p.updated_at
FROM products p
LEFT JOIN categories c ON p.category_id = c.id;

-- Vista de pedidos con información del usuario
CREATE VIEW v_orders_with_user AS
SELECT 
    o.id,
    o.phone,
    o.email,
    o.nit,
    o.total,
    o.status,
    o.source,
    o.created_at,
    u.full_name as user_name,
    u.role as user_role
FROM orders o
LEFT JOIN users u ON o.user_id = u.id;

-- Vista de items de pedidos con información del producto
CREATE VIEW v_order_items_with_product AS
SELECT 
    oi.id,
    oi.order_id,
    oi.product_id,
    oi.name,
    oi.sku,
    oi.qty,
    oi.unit_price,
    oi.final_line_total,
    p.final_price as current_price,
    c.name as category_name
FROM order_items oi
LEFT JOIN products p ON oi.product_id = p.id
LEFT JOIN categories c ON p.category_id = c.id;

-- =============================================
-- PROCEDIMIENTOS ALMACENADOS
-- =============================================

DELIMITER $$

-- Procedimiento para calcular precio de envío
CREATE PROCEDURE sp_calculate_shipping(
    IN p_department VARCHAR(100),
    IN p_municipality VARCHAR(100),
    IN p_zone VARCHAR(100),
    IN p_colonia VARCHAR(100),
    OUT p_price DECIMAL(10,2)
)
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE v_price DECIMAL(10,2) DEFAULT 0.00;
    
    -- Buscar tarifa más específica (colonia > zona > municipio > departamento)
    SELECT price INTO v_price
    FROM shipping_rates 
    WHERE is_active = TRUE
    AND (
        (colonia = p_colonia AND colonia IS NOT NULL) OR
        (zone = p_zone AND zone IS NOT NULL AND colonia IS NULL) OR
        (municipality = p_municipality AND municipality IS NOT NULL AND zone IS NULL AND colonia IS NULL) OR
        (department = p_department AND municipality IS NULL AND zone IS NULL AND colonia IS NULL)
    )
    ORDER BY 
        CASE WHEN colonia IS NOT NULL THEN 1 ELSE 2 END,
        CASE WHEN zone IS NOT NULL THEN 1 ELSE 2 END,
        CASE WHEN municipality IS NOT NULL THEN 1 ELSE 2 END
    LIMIT 1;
    
    SET p_price = COALESCE(v_price, 0.00);
END$$

-- Procedimiento para actualizar stock
CREATE PROCEDURE sp_update_product_stock(
    IN p_product_id INT,
    IN p_quantity_change INT
)
BEGIN
    UPDATE products 
    SET stock = stock + p_quantity_change,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_product_id;
    
    -- Log de auditoría
    INSERT INTO audit_logs (action, entity, entity_id, meta)
    VALUES ('STOCK_UPDATE', 'products', p_product_id, 
            JSON_OBJECT('quantity_change', p_quantity_change, 'new_stock', (SELECT stock FROM products WHERE id = p_product_id)));
END$$

DELIMITER ;

-- =============================================
-- CONFIGURACIÓN FINAL
-- =============================================

-- Configurar timezone
SET time_zone = '-06:00';

-- Configurar charset por defecto
ALTER DATABASE crunchypaws CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Mensaje de confirmación
SELECT 'Base de datos CrunchyPaws creada exitosamente' as message;




