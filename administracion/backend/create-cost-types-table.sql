-- Crear tabla para tipos de costos adicionales
CREATE TABLE IF NOT EXISTS cost_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255) NULL,
    percentage DECIMAL(5,2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    is_mandatory BOOLEAN DEFAULT FALSE,
    created_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    
    INDEX idx_name (name),
    INDEX idx_is_active (is_active)
);

-- Insertar tipos de costos básicos
INSERT INTO cost_types (name, description, percentage, is_active, is_mandatory) VALUES
('IVA', 'Impuesto al Valor Agregado', 12.00, TRUE, TRUE),
('ISR', 'Impuesto Sobre la Renta', 5.00, TRUE, TRUE),
('Costo de Producción', 'Costos asociados a la producción del producto', 0.00, TRUE, FALSE),
('Costo de Marketing', 'Costos de marketing y publicidad', 0.00, TRUE, FALSE),
('Costo de Empaque', 'Costos de empaque y embalaje', 0.00, TRUE, FALSE),
('Costo de Transporte', 'Costos de transporte y logística', 0.00, TRUE, FALSE),
('Margen de Ganancia', 'Margen de ganancia del producto', 0.00, TRUE, FALSE);

