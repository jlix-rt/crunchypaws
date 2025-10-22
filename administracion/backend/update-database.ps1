# Script de PowerShell para actualizar la base de datos con las tablas faltantes
# Ejecutar desde la carpeta administracion/backend

Write-Host "🔄 Actualizando base de datos con tablas faltantes..." -ForegroundColor Yellow

# Configuración de la base de datos
$DB_HOST = "localhost"
$DB_PORT = "3306"
$DB_USER = "root"
$DB_PASSWORD = "1234"
$DB_NAME = "crunchypaws"

# Ruta al archivo SQL
$SQL_FILE = "add-missing-tables.sql"

Write-Host "📁 Ejecutando archivo: $SQL_FILE" -ForegroundColor Cyan

try {
    # Ejecutar el script SQL
    mysql -h $DB_HOST -P $DB_PORT -u $DB_USER -p$DB_PASSWORD $DB_NAME -e "source $SQL_FILE"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Base de datos actualizada exitosamente!" -ForegroundColor Green
        Write-Host "📊 Tablas agregadas:" -ForegroundColor Cyan
        Write-Host "   - product_categories (relación producto-categoría)" -ForegroundColor White
        Write-Host "   - product_cost_breakdown (desglose de costos)" -ForegroundColor White
    } else {
        Write-Host "❌ Error al ejecutar el script SQL" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "🎉 Proceso completado!" -ForegroundColor Green

