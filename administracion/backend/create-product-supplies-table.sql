-- Crear tabla para la relación entre productos e insumos
CREATE TABLE IF NOT EXISTS product_supplies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    supply_id INT NOT NULL,
    quantity DECIMAL(10,3) NOT NULL DEFAULT 0.000,
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (supply_id) REFERENCES supplies(id) ON DELETE CASCADE,
    UNIQUE KEY unique_product_supply (product_id, supply_id),
    INDEX idx_product_id (product_id),
    INDEX idx_supply_id (supply_id)
);

