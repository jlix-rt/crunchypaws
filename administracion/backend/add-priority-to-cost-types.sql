-- Agregar columna de prioridad a cost_types
ALTER TABLE cost_types ADD COLUMN priority INT DEFAULT 1;

-- Actualizar prioridades para los costos existentes
UPDATE cost_types SET priority = 1 WHERE name = 'IVA';
UPDATE cost_types SET priority = 2 WHERE name = 'ISR';
UPDATE cost_types SET priority = 3 WHERE name = 'Costo de Producción';
UPDATE cost_types SET priority = 4 WHERE name = 'Costo de Marketing';
UPDATE cost_types SET priority = 5 WHERE name = 'Costo de Empaque';
UPDATE cost_types SET priority = 6 WHERE name = 'Costo de Transporte';
UPDATE cost_types SET priority = 7 WHERE name = 'Margen de Ganancia';

