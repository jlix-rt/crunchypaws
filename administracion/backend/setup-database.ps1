# Script de PowerShell para configurar la base de datos
# Ejecutar este script ANTES de iniciar el backend

Write-Host "🗄️ Configurando base de datos CrunchyPaws..." -ForegroundColor Cyan

# Verificar si MySQL está disponible
try {
    mysql --version | Out-Null
    Write-Host "✅ MySQL encontrado" -ForegroundColor Green
} catch {
    Write-Host "❌ MySQL no encontrado. Asegúrate de que MySQL esté instalado y en el PATH" -ForegroundColor Red
    exit 1
}

# Ejecutar el script SQL
Write-Host "📝 Ejecutando script de configuración de base de datos..." -ForegroundColor Yellow
mysql -u root -p1234 < setup-database.sql

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Base de datos configurada exitosamente" -ForegroundColor Green
    Write-Host "🚀 Ahora puedes iniciar el backend con: npm run dev" -ForegroundColor Cyan
} else {
    Write-Host "❌ Error al configurar la base de datos" -ForegroundColor Red
    Write-Host "Verifica las credenciales de MySQL (usuario: root, contraseña: 1234)" -ForegroundColor Yellow
}


