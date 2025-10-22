const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

async function testFinalVerification() {
  try {
    console.log('🧪 Verificación final de eliminación lógica...\n');

    // 1. Login
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@crunchypaws.com',
      password: 'password'
    });

    const token = loginResponse.data.data.accessToken;
    console.log('✅ Login exitoso');

    // 2. Verificar que el insumo NO aparece en la lista
    console.log('\n📦 Verificando que el insumo NO aparece en la lista...');
    const suppliesResponse = await axios.get(`${BASE_URL}/supplies`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const deletedSupply = suppliesResponse.data.data.supplies.find(s => 
      s.name === 'Producto prueba 2 insumo' && s.category === 'Producto'
    );
    
    if (deletedSupply) {
      console.log('❌ El insumo eliminado sigue apareciendo en la lista:');
      console.log('   - ID:', deletedSupply.id);
      console.log('   - Estado:', deletedSupply.status);
    } else {
      console.log('✅ ¡Eliminación lógica exitosa! El insumo ya no aparece en la lista.');
    }

    // 3. Obtener el producto
    console.log('\n📋 Obteniendo producto...');
    const productsResponse = await axios.get(`${BASE_URL}/products`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const product = productsResponse.data.data.products.find(p => p.name === 'Producto prueba 2 insumo');
    
    if (product) {
      console.log('✅ Producto encontrado:');
      console.log('   - ID:', product.id);
      console.log('   - isAlsoSupply:', product.isAlsoSupply);
    }

    // 4. Volver a marcar como insumo (reactivación)
    console.log('\n🔄 Volviendo a marcar como insumo (reactivación)...');
    const remarkData = {
      name: product.name,
      sku: product.sku,
      description: product.description || '',
      categories: product.categories || [],
      stock: product.stock,
      status: product.status,
      finalPrice: product.price,
      basePrice: product.basePrice,
      suppliesData: product.supplies || [],
      isAlsoSupply: true
    };

    const remarkResponse = await axios.put(`${BASE_URL}/products/${product.id}`, remarkData, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('✅ Remarcado:', remarkResponse.data.data.product.isAlsoSupply);

    // 5. Verificar que el insumo vuelve a aparecer
    console.log('\n🔍 Verificando que el insumo vuelve a aparecer...');
    const finalSuppliesResponse = await axios.get(`${BASE_URL}/supplies`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const reactivatedSupply = finalSuppliesResponse.data.data.supplies.find(s => 
      s.name === 'Producto prueba 2 insumo' && s.category === 'Producto'
    );
    
    if (reactivatedSupply) {
      console.log('✅ ¡Reactivación exitosa! El insumo vuelve a aparecer:');
      console.log('   - ID:', reactivatedSupply.id);
      console.log('   - Estado:', reactivatedSupply.status);
    } else {
      console.log('❌ El insumo no volvió a aparecer');
    }

    // 6. Verificar en base de datos
    console.log('\n🔍 Verificando estado final en base de datos...');
    console.log('Para verificar manualmente, ejecuta:');
    console.log(`SELECT id, name, is_active, is_deleted, is_also_product FROM supplies WHERE name = '${product.name}';`);

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testFinalVerification();
