const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

async function testBasePriceUpdate() {
  try {
    console.log('🧪 Probando actualización de base_price...\n');

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
    console.log('   - Nombre:', product.name);
    console.log('   - Precio actual:', product.price);
    console.log('   - Base Price (desde frontend):', product.basePrice || 'No disponible');

    // 3. Actualizar con nuevo base_price
    console.log('\n📝 Actualizando producto con nuevo base_price...');
    const newBasePrice = 25.50; // Nuevo precio base
    
    const updateData = {
      name: product.name,
      sku: product.sku,
      description: product.description || '',
      categories: product.categories || [],
      stock: product.stock,
      status: product.status,
      finalPrice: product.price,
      basePrice: newBasePrice, // Nuevo base_price
      suppliesData: product.supplies || [],
      isAlsoSupply: true
    };

    console.log('Datos a enviar:', JSON.stringify(updateData, null, 2));

    const response = await axios.put(`${BASE_URL}/products/${product.id}`, updateData, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('✅ Respuesta del servidor:', response.data);

    // 4. Verificar en base de datos
    console.log('\n🔍 Verificando en base de datos...');
    console.log('Para verificar manualmente, ejecuta:');
    console.log(`SELECT id, name, base_price, final_price FROM products WHERE id = ${product.id};`);

    // 5. Obtener el producto actualizado
    console.log('\n📋 Obteniendo producto actualizado...');
    const updatedProductsResponse = await axios.get(`${BASE_URL}/products`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const updatedProduct = updatedProductsResponse.data.data.products.find(p => p.id === product.id);
    
    if (updatedProduct) {
      console.log('✅ Producto actualizado:');
      console.log('   - ID:', updatedProduct.id);
      console.log('   - Nombre:', updatedProduct.name);
      console.log('   - Precio final:', updatedProduct.price);
      console.log('   - Base Price (desde frontend):', updatedProduct.basePrice || 'No disponible');
    }

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testBasePriceUpdate();
