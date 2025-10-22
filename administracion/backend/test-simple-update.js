const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

async function testSimpleUpdate() {
  try {
    console.log('🧪 Prueba simple de actualización...\n');

    // 1. Login
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@crunchypaws.com',
      password: 'password'
    });

    const token = loginResponse.data.data.accessToken;
    console.log('✅ Login exitoso');

    // 2. Actualizar producto con isAlsoSupply = true
    console.log('\n📝 Actualizando producto...');
    const updateData = {
      name: 'Producto prueba 2 insumo',
      sku: 'PROD-004',
      description: '',
      categories: [2, 1],
      stock: 2,
      status: 'active',
      finalPrice: 15.48,
      suppliesData: [
        {
          supplyId: 1,
          quantity: 3
        }
      ],
      isAlsoSupply: true
    };

    console.log('Datos a enviar:', JSON.stringify(updateData, null, 2));

    const response = await axios.put(`${BASE_URL}/products/4`, updateData, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('✅ Respuesta del servidor:', response.data);

    // 3. Verificar insumos
    console.log('\n🔍 Verificando insumos...');
    const suppliesResponse = await axios.get(`${BASE_URL}/supplies`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const correspondingSupply = suppliesResponse.data.data.supplies.find(s => 
      s.name === 'Producto prueba 2 insumo'
    );
    
    if (correspondingSupply) {
      console.log('✅ ¡Insumo encontrado!');
      console.log('   - ID:', correspondingSupply.id);
      console.log('   - Nombre:', correspondingSupply.name);
      console.log('   - Categoría:', correspondingSupply.category);
    } else {
      console.log('❌ Insumo no encontrado');
      console.log('Insumos disponibles:');
      suppliesResponse.data.data.supplies.forEach(s => {
        console.log(`   - ${s.name} (${s.category})`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testSimpleUpdate();
