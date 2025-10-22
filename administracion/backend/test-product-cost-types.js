const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

async function testProductCostTypes() {
  try {
    console.log('🧪 Iniciando pruebas de costos por producto...\n');

    // 1. Login
    console.log('1️⃣ Iniciando sesión...');
    const loginResponse = await axios.post(`${BASE_URL}/api/auth/login`, {
      email: 'admin@crunchypaws.com',
      password: 'password'
    });

    if (!loginResponse.data.success) {
      throw new Error('Error en login: ' + JSON.stringify(loginResponse.data));
    }

    const token = loginResponse.data.data.accessToken;
    console.log('✅ Login exitoso\n');

    // 2. Obtener tipos de costos disponibles
    console.log('2️⃣ Obteniendo tipos de costos...');
    const costTypesResponse = await axios.get(`${BASE_URL}/api/cost-types`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!costTypesResponse.data.success) {
      throw new Error('Error obteniendo tipos de costos: ' + JSON.stringify(costTypesResponse.data));
    }

    const costTypes = costTypesResponse.data.data.costTypes;
    console.log('✅ Tipos de costos obtenidos:', costTypes.length);
    
    // Mostrar tipos de costos disponibles
    console.log('\n📋 Tipos de costos disponibles:');
    costTypes.forEach((ct, index) => {
      console.log(`   ${index + 1}. ${ct.name} - ${ct.percentage}% (Prioridad: ${ct.priority}) ${ct.isMandatory ? '(Obligatorio)' : '(Opcional)'}`);
    });

    // 3. Crear un producto con costos seleccionados
    console.log('\n3️⃣ Creando producto con costos seleccionados...');
    
    // Seleccionar algunos costos (obligatorios + algunos opcionales)
    const mandatoryCosts = costTypes.filter(ct => ct.isMandatory).map(ct => ct.id);
    const optionalCosts = costTypes.filter(ct => !ct.isMandatory).slice(0, 2).map(ct => ct.id); // Tomar 2 opcionales
    const selectedCostTypes = [...mandatoryCosts, ...optionalCosts];
    
    console.log('💰 Costos seleccionados:', selectedCostTypes);
    
    const productData = {
      name: 'Producto con Costos Test',
      description: 'Producto de prueba con costos seleccionados',
      categories: [1], // Categoría por defecto
      stock: 10,
      status: 'active',
      basePrice: 50.00,
      finalPrice: 75.00,
      suppliesData: [], // Sin insumos por ahora
      isAlsoSupply: false,
      selectedCostTypes: selectedCostTypes
    };

    const createResponse = await axios.post(`${BASE_URL}/api/products`, productData, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!createResponse.data.success) {
      throw new Error('Error creando producto: ' + JSON.stringify(createResponse.data));
    }

    const createdProduct = createResponse.data.data.product;
    console.log('✅ Producto creado:', createdProduct.name);
    console.log('💰 Costos seleccionados en el producto:', createdProduct.selectedCostTypes?.length || 0);

    // 4. Verificar que los costos se guardaron correctamente
    console.log('\n4️⃣ Verificando costos guardados...');
    
    if (createdProduct.selectedCostTypes && createdProduct.selectedCostTypes.length > 0) {
      console.log('✅ Costos encontrados en el producto:');
      createdProduct.selectedCostTypes.forEach(cost => {
        console.log(`   - ${cost.name}: ${cost.percentage}% (Prioridad: ${cost.priority}) ${cost.isMandatory ? '(Obligatorio)' : '(Opcional)'}`);
      });
    } else {
      console.log('❌ No se encontraron costos en el producto');
    }

    // 5. Actualizar el producto con diferentes costos
    console.log('\n5️⃣ Actualizando producto con diferentes costos...');
    
    // Cambiar los costos opcionales
    const newOptionalCosts = costTypes.filter(ct => !ct.isMandatory).slice(1, 3).map(ct => ct.id); // Diferentes opcionales
    const newSelectedCostTypes = [...mandatoryCosts, ...newOptionalCosts];
    
    console.log('💰 Nuevos costos seleccionados:', newSelectedCostTypes);
    
    const updateData = {
      name: 'Producto con Costos Test Actualizado',
      description: 'Producto actualizado con diferentes costos',
      categories: [1],
      stock: 15,
      status: 'active',
      basePrice: 60.00,
      finalPrice: 85.00,
      suppliesData: [],
      isAlsoSupply: false,
      selectedCostTypes: newSelectedCostTypes
    };

    const updateResponse = await axios.put(`${BASE_URL}/api/products/${createdProduct.id}`, updateData, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!updateResponse.data.success) {
      throw new Error('Error actualizando producto: ' + JSON.stringify(updateResponse.data));
    }

    const updatedProduct = updateResponse.data.data.product;
    console.log('✅ Producto actualizado:', updatedProduct.name);
    console.log('💰 Costos actualizados en el producto:', updatedProduct.selectedCostTypes?.length || 0);

    // 6. Verificar que los costos se actualizaron correctamente
    console.log('\n6️⃣ Verificando costos actualizados...');
    
    if (updatedProduct.selectedCostTypes && updatedProduct.selectedCostTypes.length > 0) {
      console.log('✅ Costos actualizados en el producto:');
      updatedProduct.selectedCostTypes.forEach(cost => {
        console.log(`   - ${cost.name}: ${cost.percentage}% (Prioridad: ${cost.priority}) ${cost.isMandatory ? '(Obligatorio)' : '(Opcional)'}`);
      });
    } else {
      console.log('❌ No se encontraron costos actualizados en el producto');
    }

    // 7. Obtener todos los productos para verificar
    console.log('\n7️⃣ Verificando todos los productos...');
    const productsResponse = await axios.get(`${BASE_URL}/api/products`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!productsResponse.data.success) {
      throw new Error('Error obteniendo productos: ' + JSON.stringify(productsResponse.data));
    }

    const products = productsResponse.data.data.products;
    console.log('✅ Productos obtenidos:', products.length);
    
    // Mostrar costos de cada producto
    products.forEach((product, index) => {
      console.log(`\n📦 Producto ${index + 1}: ${product.name}`);
      if (product.selectedCostTypes && product.selectedCostTypes.length > 0) {
        console.log(`   💰 Costos (${product.selectedCostTypes.length}):`);
        product.selectedCostTypes.forEach(cost => {
          console.log(`      - ${cost.name}: ${cost.percentage}% ${cost.isMandatory ? '(Obligatorio)' : '(Opcional)'}`);
        });
      } else {
        console.log('   ❌ Sin costos seleccionados');
      }
    });

    console.log('\n🎉 Pruebas de costos por producto completadas exitosamente!');
    console.log('\n📋 Resumen:');
    console.log(`   ✅ Producto creado con ${createdProduct.selectedCostTypes?.length || 0} costos`);
    console.log(`   ✅ Producto actualizado con ${updatedProduct.selectedCostTypes?.length || 0} costos`);
    console.log(`   ✅ Total de productos con costos: ${products.filter(p => p.selectedCostTypes?.length > 0).length}`);

  } catch (error) {
    console.error('❌ Error en las pruebas:', error.response?.data || error.message);
    process.exit(1);
  }
}

// Ejecutar las pruebas
testProductCostTypes();
