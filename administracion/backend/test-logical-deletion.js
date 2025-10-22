const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

async function testLogicalDeletion() {
  try {
    console.log('🧪 Probando eliminación lógica del insumo...\n');

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

    // 3. Obtener el insumo correspondiente
    console.log('\n📦 Obteniendo insumo correspondiente...');
    const suppliesResponse = await axios.get(`${BASE_URL}/supplies`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const correspondingSupply = suppliesResponse.data.data.supplies.find(s => 
      s.name === 'Producto prueba 2 insumo' && s.category === 'Producto'
    );
    
    if (correspondingSupply) {
      console.log('✅ Insumo encontrado:');
      console.log('   - ID:', correspondingSupply.id);
      console.log('   - Nombre:', correspondingSupply.name);
      console.log('   - Estado:', correspondingSupply.status);
      console.log('   - Precio:', correspondingSupply.unitPrice);
    } else {
      console.log('❌ No se encontró el insumo correspondiente');
      return;
    }

    // 4. Desmarcar el checkbox (eliminación lógica)
    console.log('\n🗑️ Desmarcando checkbox (eliminación lógica)...');
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

    console.log('Datos a enviar:', JSON.stringify(updateData, null, 2));

    const response = await axios.put(`${BASE_URL}/products/${product.id}`, updateData, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('✅ Respuesta del servidor:', response.data);

    // 5. Verificar que el insumo se desactivó (eliminación lógica)
    console.log('\n🔍 Verificando eliminación lógica...');
    const updatedSuppliesResponse = await axios.get(`${BASE_URL}/supplies`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const updatedSupply = updatedSuppliesResponse.data.data.supplies.find(s => 
      s.name === 'Producto prueba 2 insumo' && s.category === 'Producto'
    );
    
    if (updatedSupply) {
      console.log('✅ Insumo encontrado después de desmarcar:');
      console.log('   - ID:', updatedSupply.id);
      console.log('   - Nombre:', updatedSupply.name);
      console.log('   - Estado:', updatedSupply.status);
      console.log('   - Precio:', updatedSupply.unitPrice);
      
      if (updatedSupply.status === 'inactive') {
        console.log('✅ ¡Eliminación lógica exitosa! El insumo se desactivó correctamente.');
      } else {
        console.log('❌ El insumo no se desactivó correctamente');
      }
    } else {
      console.log('✅ ¡Eliminación lógica exitosa! El insumo ya no aparece en la lista activa.');
    }

    // 6. Volver a marcar el checkbox (reactivación)
    console.log('\n🔄 Marcando checkbox nuevamente (reactivación)...');
    const reactivateData = {
      name: product.name,
      sku: product.sku,
      description: product.description || '',
      categories: product.categories || [],
      stock: product.stock,
      status: product.status,
      finalPrice: product.price,
      basePrice: product.basePrice,
      suppliesData: product.supplies || [],
      isAlsoSupply: true // Volver a marcar
    };

    const reactivateResponse = await axios.put(`${BASE_URL}/products/${product.id}`, reactivateData, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('✅ Respuesta del servidor:', reactivateResponse.data);

    // 7. Verificar que el insumo se reactivó
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
      console.log('   - Nombre:', reactivatedSupply.name);
      console.log('   - Estado:', reactivatedSupply.status);
      console.log('   - Precio:', reactivatedSupply.unitPrice);
      
      if (reactivatedSupply.status === 'active') {
        console.log('✅ ¡Reactivación exitosa! El insumo se reactivó correctamente.');
      } else {
        console.log('❌ El insumo no se reactivó correctamente');
      }
    } else {
      console.log('❌ No se encontró el insumo reactivado');
    }

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testLogicalDeletion();
