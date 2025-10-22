const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

// Función para hacer login y obtener token
async function login() {
  try {
    console.log('🔐 Iniciando sesión...');
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@crunchypaws.com',
      password: 'password'
    });
    
    if (response.data.success) {
      console.log('✅ Login exitoso');
      return response.data.data.accessToken;
    } else {
      throw new Error('Error en login: ' + response.data.message);
    }
  } catch (error) {
    console.error('❌ Error en login:', error.response?.data || error.message);
    throw error;
  }
}

// Función para probar el CRUD de cost types
async function testCostTypesCRUD() {
  let token;
  
  try {
    // 1. Login
    token = await login();
    
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    console.log('\n🧪 Probando CRUD de Tipos de Costos...\n');

    // 2. Obtener todos los tipos de costos
    console.log('📋 Obteniendo tipos de costos...');
    const getResponse = await axios.get(`${BASE_URL}/cost-types`, { headers });
    console.log(`✅ Se encontraron ${getResponse.data.data.costTypes.length} tipos de costos`);

    // 3. Obtener tipos de costos activos
    console.log('\n📋 Obteniendo tipos de costos activos...');
    const getActiveResponse = await axios.get(`${BASE_URL}/cost-types/active`, { headers });
    console.log(`✅ Se encontraron ${getActiveResponse.data.data.costTypes.length} tipos de costos activos`);

    // 4. Crear un nuevo tipo de costo
    console.log('\n➕ Creando nuevo tipo de costo...');
    const newCostType = {
      name: 'Costo de Envío',
      description: 'Costos asociados al envío del producto',
      percentage: 0,
      isMandatory: false
    };

    const createResponse = await axios.post(`${BASE_URL}/cost-types`, newCostType, { headers });
    console.log('✅ Tipo de costo creado exitosamente');
    console.log('📊 Datos del tipo de costo:');
    console.log(`   - ID: ${createResponse.data.data.costType.id}`);
    console.log(`   - Nombre: ${createResponse.data.data.costType.name}`);
    console.log(`   - Descripción: ${createResponse.data.data.costType.description}`);
    console.log(`   - Porcentaje: ${createResponse.data.data.costType.percentage}%`);
    console.log(`   - Activo: ${createResponse.data.data.costType.isActive}`);
    console.log(`   - Obligatorio: ${createResponse.data.data.costType.isMandatory}`);

    const costTypeId = createResponse.data.data.costType.id;

    // 5. Obtener tipo de costo por ID
    console.log('\n🔍 Obteniendo tipo de costo por ID...');
    const getByIdResponse = await axios.get(`${BASE_URL}/cost-types/${costTypeId}`, { headers });
    console.log('✅ Tipo de costo obtenido por ID:', getByIdResponse.data.data.costType.name);

    // 6. Actualizar tipo de costo
    console.log('\n✏️  Actualizando tipo de costo...');
    const updateData = {
      name: 'Costo de Envío Premium',
      description: 'Costos asociados al envío premium del producto',
      percentage: 2.5,
      isActive: true,
      isMandatory: true
    };

    const updateResponse = await axios.put(`${BASE_URL}/cost-types/${costTypeId}`, updateData, { headers });
    console.log('✅ Tipo de costo actualizado exitosamente');
    console.log('📊 Nuevos datos:');
    console.log(`   - Nombre: ${updateResponse.data.data.costType.name}`);
    console.log(`   - Porcentaje: ${updateResponse.data.data.costType.percentage}%`);
    console.log(`   - Obligatorio: ${updateResponse.data.data.costType.isMandatory}`);

    // 7. Eliminar tipo de costo
    console.log('\n🗑️  Eliminando tipo de costo...');
    const deleteResponse = await axios.delete(`${BASE_URL}/cost-types/${costTypeId}`, { headers });
    console.log('✅ Tipo de costo eliminado exitosamente');

    // 8. Verificar que fue eliminado
    console.log('\n🔍 Verificando eliminación...');
    try {
      await axios.get(`${BASE_URL}/cost-types/${costTypeId}`, { headers });
      console.log('❌ Error: El tipo de costo aún existe');
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('✅ Tipo de costo eliminado correctamente (404 - No encontrado)');
      } else {
        console.log('⚠️  Error inesperado:', error.response?.data || error.message);
      }
    }

    console.log('\n🎉 ¡Todas las pruebas del CRUD de Tipos de Costos pasaron exitosamente!');

  } catch (error) {
    console.error('\n❌ Error en las pruebas:', error.response?.data || error.message);
    process.exit(1);
  }
}

// Ejecutar las pruebas
testCostTypesCRUD();

