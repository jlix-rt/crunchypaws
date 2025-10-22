const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

async function testFullCycle() {
  try {
    console.log('🧪 Probando ciclo completo: marcar → desmarcar → remarcar...\n');

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

    // 3. Marcar como insumo (si no está marcado)
    if (!product.isAlsoSupply) {
      console.log('\n✅ Marcando como insumo...');
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

      const markResponse = await axios.put(`${BASE_URL}/products/${product.id}`, markData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('✅ Marcado como insumo:', markResponse.data.data.product.isAlsoSupply);
    }

    // 4. Verificar que el insumo está activo
    console.log('\n📦 Verificando insumo activo...');
    const suppliesResponse = await axios.get(`${BASE_URL}/supplies`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const activeSupply = suppliesResponse.data.data.supplies.find(s => 
      s.name === 'Producto prueba 2 insumo' && s.category === 'Producto'
    );
    
    if (activeSupply) {
      console.log('✅ Insumo activo encontrado:');
      console.log('   - ID:', activeSupply.id);
      console.log('   - Estado:', activeSupply.status);
    } else {
      console.log('❌ No se encontró el insumo activo');
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

    const unmarkResponse = await axios.put(`${BASE_URL}/products/${product.id}`, unmarkData, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('✅ Desmarcado:', unmarkResponse.data.data.product.isAlsoSupply);

    // 6. Verificar eliminación lógica en base de datos
    console.log('\n🔍 Verificando eliminación lógica en base de datos...');
    console.log('Para verificar manualmente, ejecuta:');
    console.log(`SELECT id, name, is_active, is_also_product FROM supplies WHERE name = '${product.name}';`);

    // 7. Volver a marcar (reactivación)
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

    // 8. Verificar reactivación
    console.log('\n🔍 Verificando reactivación...');
    const finalSuppliesResponse = await axios.get(`${BASE_URL}/supplies`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const reactivatedSupply = finalSuppliesResponse.data.data.supplies.find(s => 
      s.name === 'Producto prueba 2 insumo' && s.category === 'Producto'
    );
    
    if (reactivatedSupply) {
      console.log('✅ Insumo reactivado:');
      console.log('   - ID:', reactivatedSupply.id);
      console.log('   - Estado:', reactivatedSupply.status);
    } else {
      console.log('❌ No se encontró el insumo reactivado');
    }

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testFullCycle();
