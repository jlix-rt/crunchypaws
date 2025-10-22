-- =============================================
-- CRUNCHYPAWS - DATOS INICIALES (SEEDS)
-- =============================================
-- Script de datos iniciales para desarrollo y testing
-- =============================================

USE crunchypaws;

-- =============================================
-- CATEGORÍAS
-- =============================================

INSERT INTO categories (id, parent_id, name, slug, is_active) VALUES
(1, NULL, 'Alimentos', 'alimentos', TRUE),
(2, NULL, 'Accesorios', 'accesorios', TRUE),
(3, NULL, 'Juguetes', 'juguetes', TRUE),
(4, NULL, 'Cuidado e Higiene', 'cuidado-higiene', TRUE),
(5, NULL, 'Medicamentos', 'medicamentos', TRUE),

-- Subcategorías de Alimentos
(6, 1, 'Alimento Seco', 'alimento-seco', TRUE),
(7, 1, 'Alimento Húmedo', 'alimento-humedo', TRUE),
(8, 1, 'Snacks y Premios', 'snacks-premios', TRUE),
(9, 1, 'Alimento Natural', 'alimento-natural', TRUE),

-- Subcategorías de Accesorios
(10, 2, 'Collares y Correas', 'collares-correas', TRUE),
(11, 2, 'Platos y Bebederos', 'platos-bebederos', TRUE),
(12, 2, 'Camas y Casas', 'camas-casas', TRUE),
(13, 2, 'Transportadores', 'transportadores', TRUE),

-- Subcategorías de Juguetes
(14, 3, 'Juguetes de Interactivos', 'juguetes-interactivos', TRUE),
(15, 3, 'Pelotas y Frisbees', 'pelotas-frisbees', TRUE),
(16, 3, 'Juguetes de Mordida', 'juguetes-mordida', TRUE),
(17, 3, 'Juguetes Educativos', 'juguetes-educativos', TRUE),

-- Subcategorías de Cuidado
(18, 4, 'Shampoo y Acondicionador', 'shampoo-acondicionador', TRUE),
(19, 4, 'Cepillos y Peines', 'cepillos-peines', TRUE),
(20, 4, 'Cortauñas y Limpieza', 'cortauñas-limpieza', TRUE),
(21, 4, 'Productos de Limpieza', 'productos-limpieza', TRUE),

-- Subcategorías de Medicamentos
(22, 5, 'Vitaminas y Suplementos', 'vitaminas-suplementos', TRUE),
(23, 5, 'Medicamentos Preventivos', 'medicamentos-preventivos', TRUE),
(24, 5, 'Primeros Auxilios', 'primeros-auxilios', TRUE),
(25, 5, 'Productos Veterinarios', 'productos-veterinarios', TRUE);

-- =============================================
-- INSUMOS
-- =============================================

INSERT INTO supplies (id, name, unit, unit_cost, is_active, is_also_product) VALUES
(1, 'Carne de Pollo', 'kg', 25.00, TRUE, FALSE),
(2, 'Arroz Integral', 'kg', 8.50, TRUE, FALSE),
(3, 'Zanahoria', 'kg', 6.00, TRUE, FALSE),
(4, 'Aceite de Girasol', 'litro', 12.00, TRUE, FALSE),
(5, 'Sal Marina', 'kg', 4.00, TRUE, FALSE),
(6, 'Proteína de Soja', 'kg', 15.00, TRUE, FALSE),
(7, 'Calcio', 'kg', 20.00, TRUE, FALSE),
(8, 'Vitamina E', 'kg', 35.00, TRUE, FALSE),
(9, 'Embalaje Bolsa', 'unidad', 0.50, TRUE, FALSE),
(10, 'Etiqueta Producto', 'unidad', 0.10, TRUE, FALSE);

-- =============================================
-- AGREGADOS DE PRECIO
-- =============================================

INSERT INTO price_addons (id, name, percent, is_active) VALUES
(1, 'IVA', 12.00, TRUE),
(2, 'Costo de Almacenamiento', 5.00, TRUE),
(3, 'Costo de Distribución', 8.00, TRUE),
(4, 'Margen de Ganancia', 30.00, TRUE),
(5, 'Costo de Empaque', 3.00, TRUE),
(6, 'Costo de Marketing', 10.00, TRUE);

-- =============================================
-- PRODUCTOS
-- =============================================

INSERT INTO products (id, sku, name, slug, description, category_id, is_active, stock, min_price, max_price, base_price, final_price) VALUES
-- Alimentos Secos
(1, 'AS001', 'Alimento Premium para Perros Adultos', 'alimento-premium-perros-adultos', 'Alimento balanceado con proteína de pollo y arroz integral. Ideal para perros adultos de todas las razas.', 6, TRUE, 50, 45.00, 55.00, 35.00, 50.00),
(2, 'AS002', 'Alimento Natural para Gatos', 'alimento-natural-gatos', 'Alimento natural sin conservantes artificiales, rico en proteínas y vitaminas esenciales.', 6, TRUE, 30, 40.00, 50.00, 30.00, 45.00),
(3, 'AS003', 'Alimento para Cachorros', 'alimento-cachorros', 'Fórmula especial para cachorros con DHA y calcio para un desarrollo óptimo.', 6, TRUE, 25, 50.00, 65.00, 40.00, 58.00),

-- Alimentos Húmedos
(4, 'AH001', 'Lata Pollo y Vegetales', 'lata-pollo-vegetales', 'Alimento húmedo con trozos de pollo y vegetales frescos.', 7, TRUE, 40, 8.00, 12.00, 6.00, 10.00),
(5, 'AH002', 'Lata Salmón y Arroz', 'lata-salmon-arroz', 'Deliciosa combinación de salmón y arroz integral.', 7, TRUE, 35, 9.00, 13.00, 7.00, 11.00),

-- Snacks
(6, 'SN001', 'Galletas de Pollo', 'galletas-pollo', 'Snacks crujientes con sabor a pollo, ideales para entrenamiento.', 8, TRUE, 60, 15.00, 20.00, 12.00, 18.00),
(7, 'SN002', 'Huesos de Cuero', 'huesos-cuero', 'Huesos naturales de cuero para limpieza dental.', 8, TRUE, 45, 12.00, 18.00, 10.00, 15.00),

-- Accesorios
(8, 'AC001', 'Collar Ajustable de Cuero', 'collar-ajustable-cuero', 'Collar de cuero genuino con hebilla ajustable.', 10, TRUE, 20, 25.00, 35.00, 20.00, 30.00),
(9, 'AC002', 'Correa Retráctil 5m', 'correa-retractil-5m', 'Correa retráctil de 5 metros con botón de bloqueo.', 10, TRUE, 15, 30.00, 45.00, 25.00, 38.00),
(10, 'AC003', 'Plato Doble Acero Inoxidable', 'plato-doble-acero-inoxidable', 'Plato doble en acero inoxidable, fácil de limpiar.', 11, TRUE, 30, 20.00, 30.00, 15.00, 25.00),

-- Juguetes
(11, 'JU001', 'Pelota de Goma Resistente', 'pelota-goma-resistente', 'Pelota de goma extra resistente para perros activos.', 15, TRUE, 25, 8.00, 15.00, 6.00, 12.00),
(12, 'JU002', 'Kong Clásico', 'kong-clasico', 'Juguete interactivo Kong para estimulación mental.', 14, TRUE, 20, 25.00, 40.00, 20.00, 35.00),

-- Cuidado e Higiene
(13, 'CH001', 'Shampoo Antialérgico', 'shampoo-antialergico', 'Shampoo hipoalergénico para mascotas con piel sensible.', 18, TRUE, 15, 18.00, 28.00, 15.00, 24.00),
(14, 'CH002', 'Cepillo de Cerdas Suaves', 'cepillo-cerdas-suaves', 'Cepillo con cerdas suaves para el cuidado diario del pelaje.', 19, TRUE, 20, 12.00, 20.00, 10.00, 16.00),

-- Medicamentos
(15, 'ME001', 'Vitamina C para Mascotas', 'vitamina-c-mascotas', 'Suplemento de vitamina C para fortalecer el sistema inmunológico.', 22, TRUE, 25, 15.00, 25.00, 12.00, 20.00),
(16, 'ME002', 'Desparasitante Interno', 'desparasitante-interno', 'Medicamento para desparasitación interna mensual.', 23, TRUE, 30, 20.00, 35.00, 18.00, 28.00);

-- =============================================
-- IMÁGENES DE PRODUCTOS
-- =============================================

INSERT INTO product_images (product_id, url, alt, sort_order) VALUES
(1, '/assets/images/products/alimento-premium-perros-adultos-1.jpg', 'Alimento Premium para Perros Adultos - Vista frontal', 1),
(1, '/assets/images/products/alimento-premium-perros-adultos-2.jpg', 'Alimento Premium para Perros Adultos - Ingredientes', 2),
(2, '/assets/images/products/alimento-natural-gatos-1.jpg', 'Alimento Natural para Gatos - Envase', 1),
(3, '/assets/images/products/alimento-cachorros-1.jpg', 'Alimento para Cachorros - Bolsa', 1),
(4, '/assets/images/products/lata-pollo-vegetales-1.jpg', 'Lata Pollo y Vegetales', 1),
(5, '/assets/images/products/lata-salmon-arroz-1.jpg', 'Lata Salmón y Arroz', 1),
(6, '/assets/images/products/galletas-pollo-1.jpg', 'Galletas de Pollo', 1),
(7, '/assets/images/products/huesos-cuero-1.jpg', 'Huesos de Cuero', 1),
(8, '/assets/images/products/collar-ajustable-cuero-1.jpg', 'Collar Ajustable de Cuero', 1),
(9, '/assets/images/products/correa-retractil-5m-1.jpg', 'Correa Retráctil 5m', 1),
(10, '/assets/images/products/plato-doble-acero-inoxidable-1.jpg', 'Plato Doble Acero Inoxidable', 1),
(11, '/assets/images/products/pelota-goma-resistente-1.jpg', 'Pelota de Goma Resistente', 1),
(12, '/assets/images/products/kong-clasico-1.jpg', 'Kong Clásico', 1),
(13, '/assets/images/products/shampoo-antialergico-1.jpg', 'Shampoo Antialérgico', 1),
(14, '/assets/images/products/cepillo-cerdas-suaves-1.jpg', 'Cepillo de Cerdas Suaves', 1),
(15, '/assets/images/products/vitamina-c-mascotas-1.jpg', 'Vitamina C para Mascotas', 1),
(16, '/assets/images/products/desparasitante-interno-1.jpg', 'Desparasitante Interno', 1);

-- =============================================
-- RECETAS DE PRODUCTOS
-- =============================================

INSERT INTO product_recipe (product_id, supply_id, quantity, total_cost_cached) VALUES
-- Alimento Premium para Perros Adultos
(1, 1, 0.5, 12.50),  -- 0.5kg de pollo
(1, 2, 0.3, 2.55),   -- 0.3kg de arroz
(1, 3, 0.1, 0.60),   -- 0.1kg de zanahoria
(1, 4, 0.05, 0.60),  -- 0.05L de aceite
(1, 5, 0.01, 0.04),  -- 0.01kg de sal
(1, 9, 1, 0.50),     -- 1 bolsa
(1, 10, 1, 0.10),    -- 1 etiqueta

-- Alimento Natural para Gatos
(2, 1, 0.4, 10.00),  -- 0.4kg de pollo
(2, 2, 0.2, 1.70),   -- 0.2kg de arroz
(2, 3, 0.05, 0.30),  -- 0.05kg de zanahoria
(2, 4, 0.03, 0.36),  -- 0.03L de aceite
(2, 9, 1, 0.50),     -- 1 bolsa
(2, 10, 1, 0.10);    -- 1 etiqueta

-- =============================================
-- AGREGADOS POR PRODUCTO
-- =============================================

INSERT INTO product_addons (product_id, addon_id) VALUES
-- Todos los productos tienen IVA
(1, 1), (2, 1), (3, 1), (4, 1), (5, 1), (6, 1), (7, 1), (8, 1), (9, 1), (10, 1),
(11, 1), (12, 1), (13, 1), (14, 1), (15, 1), (16, 1),

-- Alimentos tienen costo de almacenamiento
(1, 2), (2, 2), (3, 2), (4, 2), (5, 2), (6, 2), (7, 2),

-- Todos tienen margen de ganancia
(1, 4), (2, 4), (3, 4), (4, 4), (5, 4), (6, 4), (7, 4), (8, 4), (9, 4), (10, 4),
(11, 4), (12, 4), (13, 4), (14, 4), (15, 4), (16, 4),

-- Productos con empaque
(1, 5), (2, 5), (3, 5), (6, 5), (7, 5);

-- =============================================
-- MÉTODOS DE PAGO
-- =============================================

INSERT INTO payment_methods (id, name, type, is_active) VALUES
(1, 'Efectivo', 'CASH', TRUE),
(2, 'Tarjeta de Débito', 'CARD', TRUE),
(3, 'Tarjeta de Crédito', 'CARD', TRUE),
(4, 'Transferencia Bancaria', 'TRANSFER', TRUE),
(5, 'Pago Móvil', 'WALLET', TRUE),
(6, 'PayPal', 'WALLET', TRUE);

-- =============================================
-- TARIFAS DE ENVÍO
-- =============================================

INSERT INTO shipping_rates (department, municipality, zone, colonia, price, is_active) VALUES
-- Guatemala
('Guatemala', NULL, NULL, NULL, 25.00, TRUE),
('Guatemala', 'Guatemala', NULL, NULL, 20.00, TRUE),
('Guatemala', 'Guatemala', 'Zona 1', NULL, 15.00, TRUE),
('Guatemala', 'Guatemala', 'Zona 10', NULL, 15.00, TRUE),
('Guatemala', 'Guatemala', 'Zona 15', NULL, 15.00, TRUE),
('Guatemala', 'Mixco', NULL, NULL, 18.00, TRUE),
('Guatemala', 'Villa Nueva', NULL, NULL, 18.00, TRUE),

-- Sacatepéquez
('Sacatepéquez', NULL, NULL, NULL, 30.00, TRUE),
('Sacatepéquez', 'Antigua Guatemala', NULL, NULL, 25.00, TRUE),
('Sacatepéquez', 'Jocotenango', NULL, NULL, 25.00, TRUE),

-- Escuintla
('Escuintla', NULL, NULL, NULL, 35.00, TRUE),
('Escuintla', 'Escuintla', NULL, NULL, 30.00, TRUE),
('Escuintla', 'Santa Lucía Cotzumalguapa', NULL, NULL, 30.00, TRUE),

-- Quetzaltenango
('Quetzaltenango', NULL, NULL, NULL, 40.00, TRUE),
('Quetzaltenango', 'Quetzaltenango', NULL, NULL, 35.00, TRUE),

-- Petén
('Petén', NULL, NULL, NULL, 60.00, TRUE),
('Petén', 'Flores', NULL, NULL, 55.00, TRUE);

-- =============================================
-- ENLACES SOCIALES
-- =============================================

INSERT INTO social_links (name, url, is_active) VALUES
('facebook', 'https://facebook.com/crunchypaws', TRUE),
('instagram', 'https://instagram.com/crunchypaws', TRUE),
('whatsapp', 'https://wa.me/50212345678', TRUE),
('tiktok', 'https://tiktok.com/@crunchypaws', TRUE),
('messenger', 'https://m.me/crunchypaws', TRUE);

-- =============================================
-- SUCURSALES
-- =============================================

INSERT INTO branches (id, name, code, is_active) VALUES
(1, 'Sucursal Central', 'CENTRAL', TRUE),
(2, 'Sucursal Zona 10', 'Z10', TRUE),
(3, 'Sucursal Mixco', 'MIXCO', TRUE),
(4, 'Sucursal Antigua', 'ANTIGUA', TRUE);

-- =============================================
-- LISTAS DE PRECIOS
-- =============================================

INSERT INTO price_lists (id, branch_id, name, is_active) VALUES
(1, NULL, 'Lista Base', TRUE),
(2, 1, 'Lista Central', TRUE),
(3, 2, 'Lista Zona 10', TRUE),
(4, 3, 'Lista Mixco', TRUE),
(5, 4, 'Lista Antigua', TRUE);

-- =============================================
-- PRECIOS POR LISTA
-- =============================================

INSERT INTO product_prices (product_id, price_list_id, price) VALUES
-- Lista Base (precios estándar)
(1, 1, 50.00), (2, 1, 45.00), (3, 1, 58.00), (4, 1, 10.00), (5, 1, 11.00),
(6, 1, 18.00), (7, 1, 15.00), (8, 1, 30.00), (9, 1, 38.00), (10, 1, 25.00),
(11, 1, 12.00), (12, 1, 35.00), (13, 1, 24.00), (14, 1, 16.00), (15, 1, 20.00), (16, 1, 28.00),

-- Lista Central (precios premium)
(1, 2, 55.00), (2, 2, 50.00), (3, 2, 63.00), (4, 2, 11.00), (5, 2, 12.00),
(6, 2, 20.00), (7, 2, 17.00), (8, 2, 35.00), (9, 2, 43.00), (10, 2, 30.00),
(11, 2, 15.00), (12, 2, 40.00), (13, 2, 28.00), (14, 2, 20.00), (15, 2, 25.00), (16, 2, 33.00),

-- Lista Zona 10 (precios premium)
(1, 3, 55.00), (2, 3, 50.00), (3, 3, 63.00), (4, 3, 11.00), (5, 3, 12.00),
(6, 3, 20.00), (7, 3, 17.00), (8, 3, 35.00), (9, 3, 43.00), (10, 3, 30.00),
(11, 3, 15.00), (12, 3, 40.00), (13, 3, 28.00), (14, 3, 20.00), (15, 3, 25.00), (16, 3, 33.00);

-- =============================================
-- CUPONES
-- =============================================

INSERT INTO coupons (code, type, value, starts_at, ends_at, max_uses, times_used, is_active, apply_scope) VALUES
('BIENVENIDA10', 'PERCENT', 10.00, '2024-01-01 00:00:00', '2024-12-31 23:59:59', 1000, 0, TRUE, 'GLOBAL'),
('DESCUENTO20', 'PERCENT', 20.00, '2024-01-01 00:00:00', '2024-12-31 23:59:59', 500, 0, TRUE, 'GLOBAL'),
('Q50OFF', 'AMOUNT', 50.00, '2024-01-01 00:00:00', '2024-12-31 23:59:59', 200, 0, TRUE, 'GLOBAL'),
('ALIMENTOS15', 'PERCENT', 15.00, '2024-01-01 00:00:00', '2024-12-31 23:59:59', 300, 0, TRUE, 'CATEGORY'),
('ACCESORIOS25', 'PERCENT', 25.00, '2024-01-01 00:00:00', '2024-12-31 23:59:59', 150, 0, TRUE, 'CATEGORY');

-- =============================================
-- PROMOCIONES
-- =============================================

INSERT INTO promotions (name, scope, rule, starts_at, ends_at, is_active) VALUES
('2x1 en Snacks', 'CATEGORY', '{"category_id": 8, "buy_quantity": 2, "get_quantity": 1, "discount_type": "PERCENT", "discount_value": 100}', '2024-01-01 00:00:00', '2024-12-31 23:59:59', TRUE),
('Descuento por Volumen', 'GLOBAL', '{"min_amount": 500, "discount_type": "PERCENT", "discount_value": 10}', '2024-01-01 00:00:00', '2024-12-31 23:59:59', TRUE),
('Combo Alimento + Accesorio', 'BUNDLE', '{"products": [1, 8], "discount_type": "PERCENT", "discount_value": 15}', '2024-01-01 00:00:00', '2024-12-31 23:59:59', TRUE);

-- =============================================
-- USUARIOS
-- =============================================

INSERT INTO users (id, full_name, email, phone, password_hash, nit, role, is_active, referral_code) VALUES
(1, 'Administrador Sistema', 'admin@crunchypaws.com', '50212345678', '$2b$10$rQZ8K9mN2pL3sT4uV5wX6yA7bC8dE9fG0hI1jK2lM3nO4pQ5rS6tU7vW8xY9zA', '12345678-9', 'ADMIN', TRUE, 'ADMIN001'),
(2, 'María González', 'maria.gonzalez@crunchypaws.com', '50287654321', '$2b$10$rQZ8K9mN2pL3sT4uV5wX6yA7bC8dE9fG0hI1jK2lM3nO4pQ5rS6tU7vW8xY9zA', '87654321-0', 'EMPLOYEE', TRUE, 'EMP001'),
(3, 'Carlos López', 'carlos.lopez@crunchypaws.com', '50298765432', '$2b$10$rQZ8K9mN2pL3sT4uV5wX6yA7bC8dE9fG0hI1jK2lM3nO4pQ5rS6tU7vW8xY9zA', '98765432-1', 'EMPLOYEE', TRUE, 'EMP002'),
(4, 'Ana Martínez', 'ana.martinez@gmail.com', '50212345679', '$2b$10$rQZ8K9mN2pL3sT4uV5wX6yA7bC8dE9fG0hI1jK2lM3nO4pQ5rS6tU7vW8xY9zA', NULL, 'CLIENT', TRUE, 'CLI001'),
(5, 'Luis Rodríguez', 'luis.rodriguez@hotmail.com', '50223456789', '$2b$10$rQZ8K9mN2pL3sT4uV5wX6yA7bC8dE9fG0hI1jK2lM3nO4pQ5rS6tU7vW8xY9zA', '23456789-2', 'CLIENT', TRUE, 'CLI002');

-- =============================================
-- EMPLEADOS
-- =============================================

INSERT INTO employees (id, commission_percent) VALUES
(2, 5.00),  -- María González
(3, 3.50);  -- Carlos López

-- =============================================
-- DIRECCIONES
-- =============================================

INSERT INTO addresses (user_id, label, is_default, department, municipality, zone, colonia, street, reference) VALUES
(4, 'Casa', TRUE, 'Guatemala', 'Guatemala', 'Zona 10', 'Colonia Las Flores', '15 Avenida 8-45', 'Casa blanca con portón negro'),
(4, 'Oficina', FALSE, 'Guatemala', 'Guatemala', 'Zona 15', 'Colonia El Naranjo', '12 Calle 3-25', 'Edificio Torre Central, 5to piso'),
(5, 'Casa', TRUE, 'Sacatepéquez', 'Antigua Guatemala', NULL, 'Centro Histórico', '5ta Avenida Norte 8', 'Casa colonial azul'),
(5, 'Casa de Campo', FALSE, 'Escuintla', 'Escuintla', NULL, 'Zona 1', 'Km 45 Carretera al Pacífico', 'Finca El Paraíso');

-- =============================================
-- CUENTAS DE FIDELIZACIÓN
-- =============================================

INSERT INTO loyalty_accounts (user_id, points, tier) VALUES
(4, 150, 'SILVER'),
(5, 75, 'BRONZE');

-- =============================================
-- TRANSACCIONES DE FIDELIZACIÓN
-- =============================================

INSERT INTO loyalty_transactions (account_id, points_delta, reason, order_id) VALUES
(1, 100, 'Registro de usuario', NULL),
(1, 50, 'Primera compra', NULL),
(2, 50, 'Registro de usuario', NULL),
(2, 25, 'Compra de productos', NULL);

-- =============================================
-- RESEÑAS
-- =============================================

INSERT INTO reviews (product_id, user_id, rating, title, body, is_approved) VALUES
(1, 4, 5, 'Excelente calidad', 'Mi perro ama este alimento. Se ve más saludable y con más energía.', TRUE),
(1, 5, 4, 'Muy bueno', 'Buen producto, precio justo. Lo recomiendo.', TRUE),
(2, 4, 5, 'Perfecto para mi gato', 'Mi gato es muy exigente pero este alimento le encanta.', TRUE),
(8, 5, 4, 'Collar de buena calidad', 'El cuero se ve genuino y la hebilla funciona bien.', TRUE),
(12, 4, 5, 'Kong excelente', 'Mi perro se entretiene horas con este juguete.', TRUE);

-- =============================================
-- PEDIDOS DE EJEMPLO
-- =============================================

INSERT INTO orders (id, user_id, phone, email, nit, address_snapshot, subtotal, discount_total, shipping_price, total, status, source) VALUES
(1, 4, '50212345679', 'ana.martinez@gmail.com', NULL, '{"department": "Guatemala", "municipality": "Guatemala", "zone": "Zona 10", "colonia": "Colonia Las Flores", "street": "15 Avenida 8-45", "reference": "Casa blanca con portón negro"}', 68.00, 6.80, 15.00, 76.20, 'DELIVERED', 'ECOMMERCE'),
(2, 5, '50223456789', 'luis.rodriguez@hotmail.com', '23456789-2', '{"department": "Sacatepéquez", "municipality": "Antigua Guatemala", "zone": null, "colonia": "Centro Histórico", "street": "5ta Avenida Norte 8", "reference": "Casa colonial azul"}', 45.00, 0.00, 25.00, 70.00, 'SHIPPED', 'ECOMMERCE'),
(3, NULL, '50234567890', 'cliente.anonimo@gmail.com', NULL, '{"department": "Guatemala", "municipality": "Mixco", "zone": null, "colonia": "Zona 1", "street": "Calle Principal 123", "reference": "Casa verde"}', 30.00, 0.00, 18.00, 48.00, 'PREPARING', 'POS');

-- =============================================
-- ITEMS DE PEDIDOS
-- =============================================

INSERT INTO order_items (order_id, product_id, name, sku, qty, unit_price, discount_amount, final_line_total) VALUES
-- Pedido 1
(1, 1, 'Alimento Premium para Perros Adultos', 'AS001', 1, 50.00, 5.00, 45.00),
(1, 6, 'Galletas de Pollo', 'SN001', 1, 18.00, 1.80, 16.20),
(1, 8, 'Collar Ajustable de Cuero', 'AC001', 1, 30.00, 0.00, 30.00),

-- Pedido 2
(2, 2, 'Alimento Natural para Gatos', 'AS002', 1, 45.00, 0.00, 45.00),

-- Pedido 3
(3, 8, 'Collar Ajustable de Cuero', 'AC001', 1, 30.00, 0.00, 30.00);

-- =============================================
-- PAGOS
-- =============================================

INSERT INTO payments (order_id, method_id, amount, status, transaction_ref) VALUES
(1, 3, 76.20, 'PAID', 'TXN_001_2024'),
(2, 4, 70.00, 'PAID', 'TXN_002_2024'),
(3, 1, 48.00, 'PAID', 'CASH_003_2024');

-- =============================================
-- HISTORIAL DE ESTADOS
-- =============================================

INSERT INTO order_status_history (order_id, status, note) VALUES
(1, 'CREATED', 'Pedido creado por el cliente'),
(1, 'PAID', 'Pago confirmado'),
(1, 'PREPARING', 'Preparando pedido'),
(1, 'SHIPPED', 'Enviado a domicilio'),
(1, 'DELIVERED', 'Entregado exitosamente'),

(2, 'CREATED', 'Pedido creado por el cliente'),
(2, 'PAID', 'Pago confirmado'),
(2, 'PREPARING', 'Preparando pedido'),
(2, 'SHIPPED', 'Enviado a domicilio'),

(3, 'CREATED', 'Pedido creado en POS'),
(3, 'PAID', 'Pago en efectivo confirmado'),
(3, 'PREPARING', 'Preparando pedido');

-- =============================================
-- ENVÍOS
-- =============================================

INSERT INTO shipments (order_id, carrier, tracking_code, status, events) VALUES
(1, 'Servicio Local', 'SL001234567', 'DELIVERED', '[{"status": "PICKED_UP", "date": "2024-01-15T10:00:00Z", "location": "Bodega Central"}, {"status": "IN_TRANSIT", "date": "2024-01-15T14:30:00Z", "location": "En ruta"}, {"status": "DELIVERED", "date": "2024-01-15T16:45:00Z", "location": "Domicilio del cliente"}]'),
(2, 'Servicio Local', 'SL001234568', 'IN_TRANSIT', '[{"status": "PICKED_UP", "date": "2024-01-16T09:00:00Z", "location": "Bodega Central"}, {"status": "IN_TRANSIT", "date": "2024-01-16T11:30:00Z", "location": "En ruta a Antigua Guatemala"}]');

-- =============================================
-- LOGS DE AUDITORÍA
-- =============================================

INSERT INTO audit_logs (user_id, action, entity, entity_id, meta) VALUES
(1, 'CREATE', 'products', 1, '{"name": "Alimento Premium para Perros Adultos", "sku": "AS001"}'),
(1, 'CREATE', 'categories', 6, '{"name": "Alimento Seco", "slug": "alimento-seco"}'),
(2, 'UPDATE', 'orders', 1, '{"status": "PREPARING", "previous_status": "PAID"}'),
(3, 'CREATE', 'orders', 3, '{"source": "POS", "total": 48.00}');

-- =============================================
-- CONFIGURACIÓN FINAL
-- =============================================

-- Actualizar secuencias de auto_increment
ALTER TABLE categories AUTO_INCREMENT = 26;
ALTER TABLE products AUTO_INCREMENT = 17;
ALTER TABLE supplies AUTO_INCREMENT = 11;
ALTER TABLE price_addons AUTO_INCREMENT = 7;
ALTER TABLE payment_methods AUTO_INCREMENT = 7;
ALTER TABLE branches AUTO_INCREMENT = 5;
ALTER TABLE price_lists AUTO_INCREMENT = 6;
ALTER TABLE users AUTO_INCREMENT = 6;
ALTER TABLE orders AUTO_INCREMENT = 4;
ALTER TABLE payments AUTO_INCREMENT = 4;

-- Mensaje de confirmación
SELECT 'Datos iniciales (seeds) insertados exitosamente' as message;



