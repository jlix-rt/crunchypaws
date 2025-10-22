-- Script para agregar las tablas faltantes a una base de datos existente
-- Ejecutar este script si ya tienes la base de datos creada

USE crunchypaws;

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

-- Verificar que las tablas se crearon correctamente
SHOW TABLES LIKE 'product_%';

