-- Script para crear la base de datos y tablas manualmente
-- Ejecutar este script ANTES de iniciar el backend

-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS crunchypaws CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE crunchypaws;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    nit VARCHAR(20),
    role ENUM('CLIENT', 'EMPLOYEE', 'ADMIN') DEFAULT 'CLIENT',
    is_active BOOLEAN DEFAULT TRUE,
    referral_code VARCHAR(20) UNIQUE,
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    INDEX idx_email (email),
    INDEX idx_phone (phone),
    INDEX idx_role (role),
    INDEX idx_is_active (is_active)
);

-- Tabla de categorías
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    parent_id INT,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    INDEX idx_parent_id (parent_id),
    INDEX idx_is_active (is_active),
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Tabla de insumos
CREATE TABLE IF NOT EXISTS supplies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    unit_cost DECIMAL(10,2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_also_product BOOLEAN DEFAULT FALSE,
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    INDEX idx_name (name),
    INDEX idx_is_active (is_active),
    INDEX idx_is_also_product (is_also_product)
);

-- Tabla de productos
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sku VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    category_id INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    stock INT DEFAULT 0,
    min_price DECIMAL(10,2) DEFAULT 0.00,
    max_price DECIMAL(10,2) DEFAULT 0.00,
    base_price DECIMAL(10,2) DEFAULT 0.00,
    final_price DECIMAL(10,2) DEFAULT 0.00,
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    INDEX idx_category_id (category_id),
    INDEX idx_is_active (is_active),
    INDEX idx_final_price (final_price),
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
);

-- Tabla de recetas de productos (relación producto-insumo)
CREATE TABLE IF NOT EXISTS product_recipe (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    supply_id INT NOT NULL,
    quantity DECIMAL(10,3) NOT NULL,
    total_cost_cached DECIMAL(10,2) DEFAULT 0.00,
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    INDEX idx_product_id (product_id),
    INDEX idx_supply_id (supply_id),
    UNIQUE KEY unique_product_supply (product_id, supply_id),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (supply_id) REFERENCES supplies(id) ON DELETE CASCADE
);

-- Insertar usuario administrador por defecto
INSERT IGNORE INTO users (full_name, email, password_hash, role, is_active) 
VALUES ('Administrador', 'admin@crunchypaws.com', '$2b$10$rQZ8K9vX7mN2pL1oE3fGCOxY8vB6nM9qR4sT7uW2eI5aD8cF1gH3jK', 'ADMIN', TRUE);

-- Insertar categorías básicas
INSERT IGNORE INTO categories (name, slug, is_active) VALUES 
('Alimentos', 'alimentos', TRUE),
('Bebidas', 'bebidas', TRUE),
('Snacks', 'snacks', TRUE);

-- Insertar algunos insumos de ejemplo
INSERT IGNORE INTO supplies (name, unit, unit_cost, is_active) VALUES 
('Harina', 'kg', 2.50, TRUE),
('Azúcar', 'kg', 1.80, TRUE),
('Huevos', 'unidad', 0.25, TRUE),
('Leche', 'litro', 1.20, TRUE);

-- Tabla de relación producto-categoría (muchos a muchos)
CREATE TABLE IF NOT EXISTS product_categories (
    product_id INT NOT NULL,
    category_id INT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    PRIMARY KEY (product_id, category_id),
    INDEX idx_product_id (product_id),
    INDEX idx_category_id (category_id),
    INDEX idx_is_primary (is_primary),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Tabla de desglose de costos de productos
CREATE TABLE IF NOT EXISTS product_cost_breakdown (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    base_cost DECIMAL(10,2) DEFAULT 0.00 NOT NULL,
    production_cost DECIMAL(10,2) DEFAULT 0.00 NOT NULL,
    marketing_cost DECIMAL(10,2) DEFAULT 0.00 NOT NULL,
    profit_margin DECIMAL(10,2) DEFAULT 0.00 NOT NULL,
    subtotal DECIMAL(10,2) DEFAULT 0.00 NOT NULL,
    iva_amount DECIMAL(10,2) DEFAULT 0.00 NOT NULL,
    isr_amount DECIMAL(10,2) DEFAULT 0.00 NOT NULL,
    final_price DECIMAL(10,2) DEFAULT 0.00 NOT NULL,
    iva_percentage DECIMAL(5,2) DEFAULT 12.00 NOT NULL,
    isr_percentage DECIMAL(5,2) DEFAULT 5.00 NOT NULL,
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    INDEX idx_product_id (product_id),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
