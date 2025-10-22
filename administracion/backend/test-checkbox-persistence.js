const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

async function testCheckboxPersistence() {
  try {
    console.log('🧪 Probando persistencia del checkbox "Es también insumo"...\n');

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
    console.log('   - isAlsoSupply:', product.isAlsoSupply);
    console.log('   - Precio:', product.price);
    console.log('   - Base Price:', product.basePrice);

    // 3. Verificar que el campo isAlsoSupply está presente
    if (product.isAlsoSupply !== undefined) {
      console.log('✅ Campo isAlsoSupply presente en la respuesta del backend');
    } else {
      console.log('❌ Campo isAlsoSupply NO está presente en la respuesta del backend');
    }

    // 4. Simular actualización del producto
    console.log('\n📝 Simulando actualización del producto...');
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
      isAlsoSupply: true // Mantener como insumo
    };

    console.log('Datos a enviar:', JSON.stringify(updateData, null, 2));

    const response = await axios.put(`${BASE_URL}/products/${product.id}`, updateData, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('✅ Respuesta del servidor:', response.data);

    // 5. Verificar que el campo isAlsoSupply se mantiene en la respuesta
    const updatedProduct = response.data.data.product;
    console.log('\n🔍 Verificando respuesta actualizada:');
    console.log('   - isAlsoSupply en respuesta:', updatedProduct.isAlsoSupply);
    
    if (updatedProduct.isAlsoSupply === true) {
      console.log('✅ Campo isAlsoSupply se mantiene correctamente en la respuesta');
    } else {
      console.log('❌ Campo isAlsoSupply NO se mantiene en la respuesta');
    }

    // 6. Obtener el producto nuevamente para verificar persistencia
    console.log('\n📋 Obteniendo producto después de la actualización...');
    const finalProductsResponse = await axios.get(`${BASE_URL}/products`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const finalProduct = finalProductsResponse.data.data.products.find(p => p.id === product.id);
    
    if (finalProduct) {
      console.log('✅ Producto final:');
      console.log('   - ID:', finalProduct.id);
      console.log('   - Nombre:', finalProduct.name);
      console.log('   - isAlsoSupply:', finalProduct.isAlsoSupply);
      
      if (finalProduct.isAlsoSupply === true) {
        console.log('✅ ¡El checkbox se mantiene marcado correctamente!');
      } else {
        console.log('❌ El checkbox NO se mantiene marcado');
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testCheckboxPersistence();
