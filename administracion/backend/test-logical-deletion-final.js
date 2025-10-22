const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

async function testLogicalDeletionFinal() {
  try {
    console.log('🧪 Probando eliminación lógica final...\n');

    // 1. Login
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@crunchypaws.com',
      password: 'password'
    });

    const token = loginResponse.data.data.accessToken;
    console.log('✅ Login exitoso');

    // 2. Obtener el producto
    console.log('\n📋 Obteniendo producto...');
    const productsResponse = await axios.get(`${BASE_URL}/products`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const product = productsResponse.data.data.products.find(p => p.name === 'Producto prueba 2 insumo');
    
    if (!product) {
      console.log('❌ No se encontró el producto');
      return;
    }

    console.log('✅ Producto encontrado:');
    console.log('   - ID:', product.id);
    console.log('   - isAlsoSupply:', product.isAlsoSupply);

    // 3. Verificar insumos antes de la prueba
    console.log('\n📦 Verificando insumos antes de la prueba...');
    const suppliesBeforeResponse = await axios.get(`${BASE_URL}/supplies`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const supplyBefore = suppliesBeforeResponse.data.data.supplies.find(s => 
      s.name === 'Producto prueba 2 insumo' && s.category === 'Producto'
    );
    
    if (supplyBefore) {
      console.log('✅ Insumo encontrado antes de la prueba:');
      console.log('   - ID:', supplyBefore.id);
      console.log('   - Estado:', supplyBefore.status);
    } else {
      console.log('ℹ️ No se encontró el insumo antes de la prueba');
    }

    // 4. Asegurar que está marcado como insumo
    if (!product.isAlsoSupply) {
      console.log('\n✅ Marcando como insumo primero...');
      const markData = {
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

      await axios.put(`${BASE_URL}/products/${product.id}`, markData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Marcado como insumo');
    }

    // 5. Desmarcar (eliminación lógica)
    console.log('\n🗑️ Desmarcando (eliminación lógica)...');
    const unmarkData = {
      name: product.name,
      sku: product.sku,
      description: product.description || '',
      categories: product.categories || [],
      stock: product.stock,
      status: product.status,
      finalPrice: product.price,
      basePrice: product.basePrice,
      suppliesData: product.supplies || [],
      isAlsoSupply: false
    };

    console.log('Enviando isAlsoSupply: false');

    const response = await axios.put(`${BASE_URL}/products/${product.id}`, unmarkData, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('✅ Respuesta del servidor:', response.data);

    // 6. Verificar que el insumo ya no aparece en la lista
    console.log('\n🔍 Verificando que el insumo no aparece en la lista...');
    const suppliesAfterResponse = await axios.get(`${BASE_URL}/supplies`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const supplyAfter = suppliesAfterResponse.data.data.supplies.find(s => 
      s.name === 'Producto prueba 2 insumo' && s.category === 'Producto'
    );
    
    if (supplyAfter) {
      console.log('❌ El insumo sigue apareciendo en la lista:');
      console.log('   - ID:', supplyAfter.id);
      console.log('   - Estado:', supplyAfter.status);
    } else {
      console.log('✅ ¡Eliminación lógica exitosa! El insumo ya no aparece en la lista.');
    }

    // 7. Verificar en base de datos
    console.log('\n🔍 Verificando en base de datos...');
    console.log('Para verificar manualmente, ejecuta:');
    console.log(`SELECT id, name, is_active, is_deleted, is_also_product FROM supplies WHERE name = '${product.name}';`);

    // 8. Volver a marcar (reactivación)
    console.log('\n🔄 Volviendo a marcar (reactivación)...');
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

    // 9. Verificar que el insumo vuelve a aparecer
    console.log('\n🔍 Verificando que el insumo vuelve a aparecer...');
    const suppliesFinalResponse = await axios.get(`${BASE_URL}/supplies`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const supplyFinal = suppliesFinalResponse.data.data.supplies.find(s => 
      s.name === 'Producto prueba 2 insumo' && s.category === 'Producto'
    );
    
    if (supplyFinal) {
      console.log('✅ ¡Reactivación exitosa! El insumo vuelve a aparecer:');
      console.log('   - ID:', supplyFinal.id);
      console.log('   - Estado:', supplyFinal.status);
    } else {
      console.log('❌ El insumo no volvió a aparecer');
    }

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testLogicalDeletionFinal();
