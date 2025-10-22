-- Agregar campo is_deleted a la tabla categories
ALTER TABLE `categories` 
ADD COLUMN `is_deleted` BOOLEAN NOT NULL DEFAULT FALSE;

-- Agregar índice para mejorar consultas
ALTER TABLE `categories` 
ADD INDEX `idx_is_deleted` (`is_deleted`);

-- Insertar categoría "Producto" para insumos si no existe
INSERT IGNORE INTO `categories` (`id`, `parent_id`, `name`, `slug`, `is_active`, `is_deleted`) 
VALUES (NULL, NULL, 'Producto', 'producto', TRUE, FALSE);
