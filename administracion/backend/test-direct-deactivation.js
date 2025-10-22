const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

async function testDirectDeactivation() {
  try {
    console.log('🧪 Prueba directa de desactivación...\n');

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

    // 3. Asegurar que está marcado como insumo
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

    // 4. Ahora desmarcar
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

    // 5. Verificar en base de datos inmediatamente
    console.log('\n🔍 Verificando en base de datos...');
    console.log('Para verificar manualmente, ejecuta:');
    console.log(`SELECT id, name, is_active, is_also_product FROM supplies WHERE name = '${product.name}';`);

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testDirectDeactivation();
