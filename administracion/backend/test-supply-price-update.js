const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

async function testSupplyPriceUpdate() {
  try {
    console.log('🧪 Probando actualización de precio de insumo...\n');

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
    console.log('   - Precio final:', product.price);
    console.log('   - Base Price:', product.basePrice);
    console.log('   - Insumos:', product.supplies);

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
      console.log('   - Precio actual:', correspondingSupply.unitPrice);
      console.log('   - Categoría:', correspondingSupply.category);
    } else {
      console.log('❌ No se encontró el insumo correspondiente');
      return;
    }

    // 4. Calcular el costo esperado de los insumos
    console.log('\n💰 Calculando costo esperado...');
    let expectedCost = 0;
    if (product.supplies && product.supplies.length > 0) {
      for (const supply of product.supplies) {
        // Buscar el insumo en la lista de insumos disponibles
        const availableSupply = suppliesResponse.data.data.supplies.find(s => s.id === supply.supplyId);
        if (availableSupply) {
          const cost = availableSupply.unitPrice * supply.quantity;
          expectedCost += cost;
          console.log(`   - ${availableSupply.name}: ${supply.quantity} × ${availableSupply.unitPrice} = ${cost}`);
        }
      }
    }
    console.log(`   💰 Costo total esperado: ${expectedCost}`);

    // 5. Actualizar el producto con nuevos insumos
    console.log('\n📝 Actualizando producto con nuevos insumos...');
    const newSuppliesData = [
      {
        supplyId: 1, // Harina
        quantity: 5  // Cambiar de 3 a 5
      },
      {
        supplyId: 2, // Azúcar
        quantity: 2  // Agregar azúcar
      }
    ];

    const updateData = {
      name: product.name,
      sku: product.sku,
      description: product.description || '',
      categories: product.categories || [],
      stock: product.stock,
      status: product.status,
      finalPrice: product.price,
      basePrice: product.basePrice,
      suppliesData: newSuppliesData,
      isAlsoSupply: true
    };

    console.log('Datos a enviar:', JSON.stringify(updateData, null, 2));

    const response = await axios.put(`${BASE_URL}/products/${product.id}`, updateData, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('✅ Respuesta del servidor:', response.data);

    // 6. Verificar el insumo actualizado
    console.log('\n🔍 Verificando insumo actualizado...');
    const updatedSuppliesResponse = await axios.get(`${BASE_URL}/supplies`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const updatedSupply = updatedSuppliesResponse.data.data.supplies.find(s => 
      s.name === 'Producto prueba 2 insumo' && s.category === 'Producto'
    );
    
    if (updatedSupply) {
      console.log('✅ Insumo actualizado:');
      console.log('   - ID:', updatedSupply.id);
      console.log('   - Nombre:', updatedSupply.name);
      console.log('   - Precio actualizado:', updatedSupply.unitPrice);
      console.log('   - Categoría:', updatedSupply.category);
      
      // Calcular el nuevo costo esperado
      let newExpectedCost = 0;
      for (const supplyData of newSuppliesData) {
        const availableSupply = updatedSuppliesResponse.data.data.supplies.find(s => s.id === supplyData.supplyId);
        if (availableSupply) {
          const cost = availableSupply.unitPrice * supplyData.quantity;
          newExpectedCost += cost;
          console.log(`   - ${availableSupply.name}: ${supplyData.quantity} × ${availableSupply.unitPrice} = ${cost}`);
        }
      }
      console.log(`   💰 Costo total esperado: ${newExpectedCost}`);
      console.log(`   💰 Precio del insumo: ${updatedSupply.unitPrice}`);
      
      if (Math.abs(updatedSupply.unitPrice - newExpectedCost) < 0.01) {
        console.log('✅ ¡El precio del insumo se actualizó correctamente!');
      } else {
        console.log('❌ El precio del insumo no coincide con el costo esperado');
      }
    } else {
      console.log('❌ No se encontró el insumo actualizado');
    }

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testSupplyPriceUpdate();
