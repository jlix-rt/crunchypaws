const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

async function testSimpleDeactivation() {
  try {
    console.log('🧪 Prueba simple de desactivación...\n');

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

    // 3. Desmarcar el checkbox
    console.log('\n🗑️ Desmarcando checkbox...');
    const updateData = {
      name: product.name,
      sku: product.sku,
      description: product.description || '',
      categories: product.categories || [],
      stock: product.stock,
      status: product.status,
      finalPrice: product.price,
      basePrice: product.basePrice,
      suppliesData: product.supplies || [],
      isAlsoSupply: false // Desmarcar
    };

    console.log('Enviando isAlsoSupply: false');

    const response = await axios.put(`${BASE_URL}/products/${product.id}`, updateData, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('✅ Respuesta del servidor:', response.data);

    // 4. Verificar en base de datos
    console.log('\n🔍 Verificando en base de datos...');
    console.log('Para verificar manualmente, ejecuta:');
    console.log(`SELECT id, name, is_active, is_also_product FROM supplies WHERE name = '${product.name}';`);

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testSimpleDeactivation();
