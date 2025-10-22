-- Agregar columna is_also_supply a la tabla products
ALTER TABLE `products` 
ADD COLUMN `is_also_supply` BOOLEAN NOT NULL DEFAULT FALSE;

-- Agregar índice para mejorar consultas
ALTER TABLE `products` 
ADD INDEX `idx_is_also_supply` (`is_also_supply`);

