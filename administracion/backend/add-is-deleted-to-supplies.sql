-- Agregar campo is_deleted a la tabla supplies
ALTER TABLE `supplies` 
ADD COLUMN `is_deleted` BOOLEAN NOT NULL DEFAULT FALSE;

-- Agregar índice para mejorar consultas
ALTER TABLE `supplies` 
ADD INDEX `idx_is_deleted` (`is_deleted`);
