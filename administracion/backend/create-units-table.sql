-- Crear tabla units
CREATE TABLE IF NOT EXISTS `units` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL UNIQUE,
    `symbol` VARCHAR(10) NOT NULL UNIQUE,
    `description` TEXT,
    `category` VARCHAR(50),
    `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
    `is_deleted` BOOLEAN NOT NULL DEFAULT FALSE,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
);

-- Agregar índices
ALTER TABLE `units` 
ADD INDEX `idx_name` (`name`),
ADD INDEX `idx_symbol` (`symbol`),
ADD INDEX `idx_is_active` (`is_active`),
ADD INDEX `idx_is_deleted` (`is_deleted`);

-- Insertar unidades básicas
INSERT IGNORE INTO `units` (`id`, `name`, `symbol`, `description`, `category`, `is_active`, `is_deleted`) VALUES
(1, 'Kilogramo', 'kg', 'Unidad de masa', 'peso', TRUE, FALSE),
(2, 'Gramo', 'g', 'Unidad de masa pequeña', 'peso', TRUE, FALSE),
(3, 'Litro', 'L', 'Unidad de volumen', 'volumen', TRUE, FALSE),
(4, 'Mililitro', 'ml', 'Unidad de volumen pequeña', 'volumen', TRUE, FALSE),
(5, 'Pieza', 'pz', 'Unidad de cantidad', 'cantidad', TRUE, FALSE),
(6, 'Docena', 'doc', '12 piezas', 'cantidad', TRUE, FALSE),
(7, 'Caja', 'caja', 'Contenedor', 'cantidad', TRUE, FALSE),
(8, 'Bolsa', 'bolsa', 'Contenedor flexible', 'cantidad', TRUE, FALSE),
(9, 'Metro', 'm', 'Unidad de longitud', 'longitud', TRUE, FALSE),
(10, 'Centímetro', 'cm', 'Unidad de longitud pequeña', 'longitud', TRUE, FALSE);
