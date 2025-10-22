const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

async function testDebugLogicalDeletion() {
  try {
    console.log('🧪 Debug de eliminación lógica...\n');

    // 1. Login
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@crunchypaws.com',
      password: 'password'
    });

    const token = loginResponse.data.data.accessToken;
    console.log('✅ Login exitoso');

    // 2. Obtener el producto actual
    console.log('\n📋 Obteniendo producto actual...');
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

    // 3. Asegurar que está marcado como insumo primero
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

    // 4. Ahora desmarcar y ver los logs
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
    console.log('Revisa los logs del backend para ver si se ejecuta la lógica de eliminación...');

    const response = await axios.put(`${BASE_URL}/products/${product.id}`, unmarkData, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('✅ Respuesta del servidor:', response.data);

    // 5. Verificar en base de datos
    console.log('\n🔍 Verificando en base de datos...');
    console.log('Para verificar manualmente, ejecuta:');
    console.log(`SELECT id, name, is_active, is_deleted, is_also_product FROM supplies WHERE name = '${product.name}';`);

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testDebugLogicalDeletion();
