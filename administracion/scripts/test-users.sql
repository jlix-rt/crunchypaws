-- Script de datos de prueba para el sistema de administración
-- CrunchyPaws - Usuarios de prueba

-- Insertar usuarios de prueba
INSERT INTO users (email, password_hash, first_name, last_name, role, status, phone, created_at) VALUES
-- Usuario Administrador
('admin@crunchypaws.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Juan', 'Administrador', 'ADMIN', 'active', '+502 1234-5678', NOW()),

-- Usuario Empleado
('empleado@crunchypaws.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'María', 'García', 'EMPLOYEE', 'active', '+502 2345-6789', NOW()),

-- Usuario Cliente (para pruebas)
('cliente@crunchypaws.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Carlos', 'López', 'CLIENT', 'active', '+502 3456-7890', NOW()),

-- Usuario Empleado adicional
('inventario@crunchypaws.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Ana', 'Martínez', 'EMPLOYEE', 'active', '+502 4567-8901', NOW());

-- Insertar permisos para el administrador (todos los permisos)
INSERT INTO user_permissions (user_id, permission) 
SELECT u.id, p.permission 
FROM users u, (
    SELECT 'dashboard:view' as permission
    UNION SELECT 'supplies:view'
    UNION SELECT 'supplies:create'
    UNION SELECT 'supplies:update'
    UNION SELECT 'supplies:delete'
    UNION SELECT 'products:view'
    UNION SELECT 'products:create'
    UNION SELECT 'products:update'
    UNION SELECT 'products:delete'
    UNION SELECT 'categories:view'
    UNION SELECT 'categories:create'
    UNION SELECT 'categories:update'
    UNION SELECT 'categories:delete'
    UNION SELECT 'users:view'
    UNION SELECT 'users:create'
    UNION SELECT 'users:update'
    UNION SELECT 'users:delete'
    UNION SELECT 'reports:view'
    UNION SELECT 'analytics:view'
    UNION SELECT 'backup:view'
    UNION SELECT 'backup:create'
    UNION SELECT 'backup:restore'
    UNION SELECT 'audit:view'
    UNION SELECT 'security:view'
    UNION SELECT 'settings:view'
    UNION SELECT 'settings:update'
) p
WHERE u.email = 'admin@crunchypaws.com';

-- Insertar permisos para el empleado
INSERT INTO user_permissions (user_id, permission) 
SELECT u.id, p.permission 
FROM users u, (
    SELECT 'dashboard:view' as permission
    UNION SELECT 'supplies:view'
    UNION SELECT 'supplies:create'
    UNION SELECT 'supplies:update'
    UNION SELECT 'products:view'
    UNION SELECT 'products:create'
    UNION SELECT 'products:update'
    UNION SELECT 'categories:view'
    UNION SELECT 'categories:create'
    UNION SELECT 'categories:update'
    UNION SELECT 'users:view'
    UNION SELECT 'reports:view'
    UNION SELECT 'settings:view'
) p
WHERE u.email = 'empleado@crunchypaws.com';

-- Insertar permisos para el empleado de inventario
INSERT INTO user_permissions (user_id, permission) 
SELECT u.id, p.permission 
FROM users u, (
    SELECT 'dashboard:view' as permission
    UNION SELECT 'supplies:view'
    UNION SELECT 'supplies:create'
    UNION SELECT 'supplies:update'
    UNION SELECT 'products:view'
    UNION SELECT 'products:create'
    UNION SELECT 'products:update'
    UNION SELECT 'categories:view'
    UNION SELECT 'categories:create'
    UNION SELECT 'categories:update'
) p
WHERE u.email = 'inventario@crunchypaws.com';

-- Insertar permisos básicos para el cliente
INSERT INTO user_permissions (user_id, permission) 
SELECT u.id, p.permission 
FROM users u, (
    SELECT 'dashboard:view' as permission
) p
WHERE u.email = 'cliente@crunchypaws.com';

-- Insertar características para el administrador
INSERT INTO user_features (user_id, feature) 
SELECT u.id, f.feature 
FROM users u, (
    SELECT 'dashboard' as feature
    UNION SELECT 'inventory'
    UNION SELECT 'marketing'
    UNION SELECT 'users'
    UNION SELECT 'reports'
    UNION SELECT 'analytics'
    UNION SELECT 'integrations'
    UNION SELECT 'backup'
    UNION SELECT 'audit'
    UNION SELECT 'security'
    UNION SELECT 'settings'
) f
WHERE u.email = 'admin@crunchypaws.com';

-- Insertar características para el empleado
INSERT INTO user_features (user_id, feature) 
SELECT u.id, f.feature 
FROM users u, (
    SELECT 'dashboard' as feature
    UNION SELECT 'inventory'
    UNION SELECT 'users'
    UNION SELECT 'reports'
    UNION SELECT 'settings'
) f
WHERE u.email = 'empleado@crunchypaws.com';

-- Insertar características para el empleado de inventario
INSERT INTO user_features (user_id, feature) 
SELECT u.id, f.feature 
FROM users u, (
    SELECT 'dashboard' as feature
    UNION SELECT 'inventory'
) f
WHERE u.email = 'inventario@crunchypaws.com';

-- Insertar características básicas para el cliente
INSERT INTO user_features (user_id, feature) 
SELECT u.id, f.feature 
FROM users u, (
    SELECT 'dashboard' as feature
) f
WHERE u.email = 'cliente@crunchypaws.com';

-- Actualizar última conexión para simular actividad
UPDATE users SET last_login_at = NOW() - INTERVAL 1 HOUR WHERE email = 'admin@crunchypaws.com';
UPDATE users SET last_login_at = NOW() - INTERVAL 2 HOUR WHERE email = 'empleado@crunchypaws.com';
UPDATE users SET last_login_at = NOW() - INTERVAL 1 DAY WHERE email = 'inventario@crunchypaws.com';

-- Verificar datos insertados
SELECT 
    u.id,
    u.email,
    u.first_name,
    u.last_name,
    u.role,
    u.status,
    u.last_login_at,
    COUNT(DISTINCT p.permission) as total_permissions,
    COUNT(DISTINCT f.feature) as total_features
FROM users u
LEFT JOIN user_permissions p ON u.id = p.user_id
LEFT JOIN user_features f ON u.id = f.user_id
WHERE u.email IN ('admin@crunchypaws.com', 'empleado@crunchypaws.com', 'inventario@crunchypaws.com', 'cliente@crunchypaws.com')
GROUP BY u.id, u.email, u.first_name, u.last_name, u.role, u.status, u.last_login_at
ORDER BY u.role, u.first_name;



