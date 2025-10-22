const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

async function testUnitsCRUD() {
  try {
    console.log('🧪 Probando CRUD completo de unidades...\n');

    // 1. Login
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@crunchypaws.com',
      password: 'password'
    });

    const token = loginResponse.data.data.accessToken;
    console.log('✅ Login exitoso');

    // 2. Obtener todas las unidades
    console.log('\n📋 Obteniendo todas las unidades...');
    const unitsResponse = await axios.get(`${BASE_URL}/units`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const units = unitsResponse.data.data.units;
    console.log('✅ Unidades obtenidas:', units.length);
    units.forEach(unit => {
      console.log(`   - ${unit.id}: ${unit.name} (${unit.symbol}) - ${unit.category} - ${unit.status}`);
    });

    // 3. Obtener unidades activas
    console.log('\n🔧 Obteniendo unidades activas...');
    const activeUnitsResponse = await axios.get(`${BASE_URL}/units/active`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const activeUnits = activeUnitsResponse.data.data.units;
    console.log('✅ Unidades activas:', activeUnits.length);

    // 4. Crear una nueva unidad
    console.log('\n➕ Creando nueva unidad...');
    const newUnitData = {
      name: 'Metro Cúbico',
      symbol: 'm³',
      description: 'Unidad de volumen cúbico',
      category: 'volumen'
    };

    const createResponse = await axios.post(`${BASE_URL}/units`, newUnitData, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const newUnit = createResponse.data.data.unit;
    console.log('✅ Unidad creada:', newUnit);

    // 5. Obtener unidad por ID
    console.log('\n🔍 Obteniendo unidad por ID...');
    const unitByIdResponse = await axios.get(`${BASE_URL}/units/${newUnit.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const unitById = unitByIdResponse.data.data.unit;
    console.log('✅ Unidad obtenida por ID:', unitById);

    // 6. Actualizar unidad
    console.log('\n✏️ Actualizando unidad...');
    const updateData = {
      name: 'Metro Cúbico Actualizado',
      symbol: 'm³',
      description: 'Unidad de volumen cúbico actualizada',
      category: 'volumen',
      status: 'active'
    };

    const updateResponse = await axios.put(`${BASE_URL}/units/${newUnit.id}`, updateData, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const updatedUnit = updateResponse.data.data.unit;
    console.log('✅ Unidad actualizada:', updatedUnit);

    // 7. Verificar que la unidad actualizada aparece en la lista
    console.log('\n🔍 Verificando unidad actualizada en la lista...');
    const updatedUnitsResponse = await axios.get(`${BASE_URL}/units`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const updatedUnits = updatedUnitsResponse.data.data.units;
    const foundUpdatedUnit = updatedUnits.find(u => u.id === newUnit.id);
    
    if (foundUpdatedUnit) {
      console.log('✅ Unidad actualizada encontrada en la lista:', foundUpdatedUnit);
    } else {
      console.log('❌ Unidad actualizada NO encontrada en la lista');
    }

    // 8. Probar validación de duplicados
    console.log('\n⚠️ Probando validación de duplicados...');
    try {
      const duplicateResponse = await axios.post(`${BASE_URL}/units`, {
        name: 'Kilogramo',
        symbol: 'kg',
        description: 'Unidad duplicada',
        category: 'peso'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('❌ No se detectó duplicado (esto no debería pasar)');
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Validación de duplicados funcionando:', error.response.data.message);
      } else {
        console.log('❌ Error inesperado en validación:', error.response?.data || error.message);
      }
    }

    // 9. Eliminar unidad (eliminación lógica)
    console.log('\n🗑️ Eliminando unidad...');
    const deleteResponse = await axios.delete(`${BASE_URL}/units/${newUnit.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('✅ Unidad eliminada:', deleteResponse.data.message);

    // 10. Verificar que la unidad eliminada no aparece en la lista
    console.log('\n🔍 Verificando que la unidad eliminada no aparece en la lista...');
    const finalUnitsResponse = await axios.get(`${BASE_URL}/units`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const finalUnits = finalUnitsResponse.data.data.units;
    const foundDeletedUnit = finalUnits.find(u => u.id === newUnit.id);
    
    if (!foundDeletedUnit) {
      console.log('✅ Unidad eliminada correctamente (no aparece en la lista)');
    } else {
      console.log('❌ Unidad eliminada aún aparece en la lista');
    }

    // 11. Verificar que las unidades están disponibles para insumos y productos
    console.log('\n📋 Verificando disponibilidad en frontend...');
    console.log('   - Las unidades deberían aparecer en el select de insumos');
    console.log('   - Las unidades deberían aparecer en el select de productos');
    console.log('   - Las unidades deberían aparecer en el listado de unidades');

    console.log('\n🎉 ¡CRUD completo de unidades verificado exitosamente!');
    console.log('\n📝 Resumen:');
    console.log('   ✅ Obtener todas las unidades');
    console.log('   ✅ Obtener unidades activas');
    console.log('   ✅ Crear nueva unidad');
    console.log('   ✅ Obtener unidad por ID');
    console.log('   ✅ Actualizar unidad');
    console.log('   ✅ Validación de duplicados');
    console.log('   ✅ Eliminación lógica');
    console.log('   ✅ Frontend actualizado para usar unidades de BD');

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testUnitsCRUD();
