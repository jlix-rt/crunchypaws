const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

async function forceUpdateProductSupply() {
  try {
    console.log('🔄 Forzando actualización de producto como insumo...\n');

    // 1. Login
    console.log('1️⃣ Haciendo login...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@crunchypaws.com',
      password: 'password'
    });

    const token = loginResponse.data.data.accessToken;
    console.log('✅ Login exitoso\n');

    // 2. Obtener el producto
    console.log('2️⃣ Obteniendo producto...');
    const productsResponse = await axios.get(`${BASE_URL}/products`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const product = productsResponse.data.data.products.find(p => p.name === 'Producto prueba 2 insumo');
    
    if (!product) {
      console.log('❌ No se encontró el producto');
      return;
    }

    console.log('✅ Producto encontrado:', product.name);
    console.log('   - ID:', product.id);
    console.log('   - isAlsoSupply:', product.isAlsoSupply);

    // 3. Forzar actualización del producto (marcar y desmarcar isAlsoSupply)
    console.log('\n3️⃣ Forzando actualización...');
    
    // Primero desmarcar
    console.log('   - Desmarcando isAlsoSupply...');
    const updateData1 = {
      name: product.name,
      sku: product.sku,
      description: product.description || '',
      categories: product.categories || [],
      stock: product.stock,
      status: product.status,
      finalPrice: product.price,
      suppliesData: product.supplies || [],
      isAlsoSupply: false
    };

    await axios.put(`${BASE_URL}/products/${product.id}`, updateData1, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('   ✅ Desmarcado');

    // Luego volver a marcar
    console.log('   - Marcando isAlsoSupply...');
    const updateData2 = {
      name: product.name,
      sku: product.sku,
      description: product.description || '',
      categories: product.categories || [],
      stock: product.stock,
      status: product.status,
      finalPrice: product.price,
      suppliesData: product.supplies || [],
      isAlsoSupply: true
    };

    await axios.put(`${BASE_URL}/products/${product.id}`, updateData2, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('   ✅ Marcado');

    // 4. Verificar que se creó el insumo
    console.log('\n4️⃣ Verificando insumos...');
    const suppliesResponse = await axios.get(`${BASE_URL}/supplies`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const correspondingSupply = suppliesResponse.data.data.supplies.find(s => 
      s.name === 'Producto prueba 2 insumo' && s.category === 'Producto'
    );
    
    if (correspondingSupply) {
      console.log('✅ ¡Insumo creado exitosamente!');
      console.log('   - ID:', correspondingSupply.id);
      console.log('   - Nombre:', correspondingSupply.name);
      console.log('   - Categoría:', correspondingSupply.category);
      console.log('   - Stock:', correspondingSupply.stock);
      console.log('   - Precio Unitario:', correspondingSupply.unitPrice);
    } else {
      console.log('❌ El insumo aún no se creó');
      console.log('Insumos disponibles:');
      suppliesResponse.data.data.supplies.forEach(s => {
        console.log(`   - ${s.name} (${s.category})`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

forceUpdateProductSupply();
