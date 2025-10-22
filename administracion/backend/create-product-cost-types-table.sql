-- Crear tabla para relación muchos a muchos entre productos y tipos de costos
CREATE TABLE IF NOT EXISTS `product_cost_types` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `product_id` INT NOT NULL,
    `cost_type_id` INT NOT NULL,
    `is_selected` BOOLEAN NOT NULL DEFAULT TRUE,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    
    -- Claves foráneas
    FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`cost_type_id`) REFERENCES `cost_types`(`id`) ON DELETE CASCADE,
    
    -- Índices
    INDEX `idx_product_cost_types_product_id` (`product_id`),
    INDEX `idx_product_cost_types_cost_type_id` (`cost_type_id`),
    INDEX `idx_product_cost_types_selected` (`is_selected`),
    
    -- Restricción única para evitar duplicados
    UNIQUE KEY `unique_product_cost_type` (`product_id`, `cost_type_id`)
);

-- Insertar costos obligatorios para productos existentes
INSERT IGNORE INTO `product_cost_types` (`product_id`, `cost_type_id`, `is_selected`)
SELECT 
    p.id as product_id,
    ct.id as cost_type_id,
    TRUE as is_selected
FROM `products` p
CROSS JOIN `cost_types` ct
WHERE ct.is_mandatory = TRUE
AND p.is_active = TRUE;

-- Insertar costos opcionales como NO seleccionados por defecto para productos existentes
INSERT IGNORE INTO `product_cost_types` (`product_id`, `cost_type_id`, `is_selected`)
SELECT 
    p.id as product_id,
    ct.id as cost_type_id,
    FALSE as is_selected
FROM `products` p
CROSS JOIN `cost_types` ct
WHERE ct.is_mandatory = FALSE
AND p.is_active = TRUE;
