-- Script para actualizar la base de datos para permitir múltiples categorías por producto
-- Ejecutar este script después de setup-database.sql

USE crunchypaws;

-- Crear tabla de relación producto-categoría (muchos a muchos)
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

-- Migrar datos existentes: cada producto actual tendrá su categoría como primaria
INSERT INTO product_categories (product_id, category_id, is_primary)
SELECT id, category_id, TRUE
FROM products
WHERE category_id IS NOT NULL;

-- Agregar columna para mantener compatibilidad (opcional)
-- ALTER TABLE products ADD COLUMN primary_category_id INT;
-- UPDATE products SET primary_category_id = category_id;

-- Comentario: La columna category_id original se puede mantener para compatibilidad
-- o eliminarse después de migrar completamente a la nueva estructura


