-- Agregar campos category y stock a la tabla supplies
ALTER TABLE `supplies` 
ADD COLUMN `category` VARCHAR(100) NULL,
ADD COLUMN `stock` INT NOT NULL DEFAULT 0;

-- Agregar índice para category
ALTER TABLE `supplies` 
ADD INDEX `idx_category` (`category`);
