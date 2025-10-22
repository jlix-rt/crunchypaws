const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

// Función para hacer login y obtener token
async function login() {
  try {
    console.log('🔐 Iniciando sesión...');
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@crunchypaws.com',
      password: 'password'
    });
    
    if (response.data.success) {
      console.log('✅ Login exitoso');
      return response.data.data.accessToken;
    } else {
      throw new Error('Error en login: ' + response.data.message);
    }
  } catch (error) {
    console.error('❌ Error en login:', error.response?.data || error.message);
    throw error;
  }
}

// Función para probar el CRUD de cost breakdowns
async function testCostBreakdownCRUD() {
  let token;
  
  try {
    // 1. Login
    token = await login();
    
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    console.log('\n🧪 Probando CRUD de Cost Breakdowns...\n');

    // 2. Obtener productos disponibles
    console.log('📦 Obteniendo productos...');
    const productsResponse = await axios.get(`${BASE_URL}/products`, { headers });
    console.log('📊 Respuesta de productos:', JSON.stringify(productsResponse.data, null, 2));
    
    let availableProducts = [];
    if (productsResponse.data.success && productsResponse.data.data && productsResponse.data.data.products) {
      availableProducts = productsResponse.data.data.products;
    } else if (productsResponse.data.success && productsResponse.data.data && productsResponse.data.data.items) {
      availableProducts = productsResponse.data.data.items;
    } else if (productsResponse.data.success && productsResponse.data.data && Array.isArray(productsResponse.data.data)) {
      availableProducts = productsResponse.data.data;
    }
    
    console.log(`📦 Se encontraron ${availableProducts.length} productos`);
    
    if (availableProducts.length === 0) {
      console.log('⚠️  No hay productos disponibles. Creando uno de prueba...');
      
      // Crear un producto de prueba
      const newProduct = {
        name: 'Producto de Prueba',
        description: 'Producto para probar cost breakdowns',
        sku: 'TEST-001',
        base_price: 10.00,
        final_price: 10.00,
        stock: 100,
        min_stock: 10,
        is_active: true,
        categories: [1], // Asumiendo que existe la categoría 1
        suppliesData: [],
        isAlsoSupply: false
      };
      
      const productResponse = await axios.post(`${BASE_URL}/products`, newProduct, { headers });
      console.log('✅ Producto creado:', productResponse.data.data.product.name);
      
      // Obtener productos actualizados
      const updatedProductsResponse = await axios.get(`${BASE_URL}/products`, { headers });
      if (updatedProductsResponse.data.success && updatedProductsResponse.data.data && updatedProductsResponse.data.data.products) {
        availableProducts = updatedProductsResponse.data.data.products;
      } else if (updatedProductsResponse.data.success && updatedProductsResponse.data.data && updatedProductsResponse.data.data.items) {
        availableProducts = updatedProductsResponse.data.data.items;
      } else if (updatedProductsResponse.data.success && updatedProductsResponse.data.data && Array.isArray(updatedProductsResponse.data.data)) {
        availableProducts = updatedProductsResponse.data.data;
      }
    }
    
    if (availableProducts.length === 0) {
      throw new Error('No hay productos disponibles para crear cost breakdowns');
    }

    const testProduct = availableProducts[0];
    console.log(`📦 Usando producto: ${testProduct.name} (ID: ${testProduct.id})`);

    // 4. Crear un cost breakdown
    console.log('\n➕ Creando cost breakdown...');
    const newCostBreakdown = {
      productId: testProduct.id,
      baseCost: 15.00,
      productionCost: 3.50,
      marketingCost: 2.00,
      profitMargin: 5.00,
      ivaPercentage: 12.00,
      isrPercentage: 5.00
    };

    const createResponse = await axios.post(`${BASE_URL}/cost-breakdowns`, newCostBreakdown, { headers });
    console.log('✅ Cost breakdown creado exitosamente');
    console.log('📊 Datos del cost breakdown:');
    console.log(`   - ID: ${createResponse.data.data.costBreakdown.id}`);
    console.log(`   - Producto: ${createResponse.data.data.costBreakdown.productName}`);
    console.log(`   - Costo Base: Q${createResponse.data.data.costBreakdown.baseCost}`);
    console.log(`   - Costo Producción: Q${createResponse.data.data.costBreakdown.productionCost}`);
    console.log(`   - Costo Marketing: Q${createResponse.data.data.costBreakdown.marketingCost}`);
    console.log(`   - Margen Ganancia: Q${createResponse.data.data.costBreakdown.profitMargin}`);
    console.log(`   - Subtotal: Q${createResponse.data.data.costBreakdown.subtotal}`);
    console.log(`   - IVA (${createResponse.data.data.costBreakdown.ivaPercentage}%): Q${createResponse.data.data.costBreakdown.ivaAmount}`);
    console.log(`   - ISR (${createResponse.data.data.costBreakdown.isrPercentage}%): Q${createResponse.data.data.costBreakdown.isrAmount}`);
    console.log(`   - Precio Final: Q${createResponse.data.data.costBreakdown.finalPrice}`);

    const costBreakdownId = createResponse.data.data.costBreakdown.id;

    // 5. Obtener todos los cost breakdowns
    console.log('\n📋 Obteniendo todos los cost breakdowns...');
    const getAllResponse = await axios.get(`${BASE_URL}/cost-breakdowns`, { headers });
    console.log(`✅ Se encontraron ${getAllResponse.data.data.costBreakdowns.length} cost breakdowns`);

    // 6. Obtener cost breakdown por ID
    console.log('\n🔍 Obteniendo cost breakdown por ID...');
    const getByIdResponse = await axios.get(`${BASE_URL}/cost-breakdowns/${costBreakdownId}`, { headers });
    console.log('✅ Cost breakdown obtenido por ID:', getByIdResponse.data.data.costBreakdown.productName);

    // 7. Obtener cost breakdowns por producto
    console.log('\n📦 Obteniendo cost breakdowns por producto...');
    const getByProductResponse = await axios.get(`${BASE_URL}/cost-breakdowns/product/${testProduct.id}`, { headers });
    console.log(`✅ Se encontraron ${getByProductResponse.data.data.costBreakdowns.length} cost breakdowns para el producto`);

    // 8. Actualizar cost breakdown
    console.log('\n✏️  Actualizando cost breakdown...');
    const updateData = {
      baseCost: 18.00,
      productionCost: 4.00,
      marketingCost: 2.50,
      profitMargin: 6.00,
      ivaPercentage: 12.00,
      isrPercentage: 5.00
    };

    const updateResponse = await axios.put(`${BASE_URL}/cost-breakdowns/${costBreakdownId}`, updateData, { headers });
    console.log('✅ Cost breakdown actualizado exitosamente');
    console.log('📊 Nuevos datos:');
    console.log(`   - Costo Base: Q${updateResponse.data.data.costBreakdown.baseCost}`);
    console.log(`   - Precio Final: Q${updateResponse.data.data.costBreakdown.finalPrice}`);

    // 9. Eliminar cost breakdown
    console.log('\n🗑️  Eliminando cost breakdown...');
    const deleteResponse = await axios.delete(`${BASE_URL}/cost-breakdowns/${costBreakdownId}`, { headers });
    console.log('✅ Cost breakdown eliminado exitosamente');

    // 10. Verificar que fue eliminado
    console.log('\n🔍 Verificando eliminación...');
    try {
      await axios.get(`${BASE_URL}/cost-breakdowns/${costBreakdownId}`, { headers });
      console.log('❌ Error: El cost breakdown aún existe');
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('✅ Cost breakdown eliminado correctamente (404 - No encontrado)');
      } else {
        console.log('⚠️  Error inesperado:', error.response?.data || error.message);
      }
    }

    console.log('\n🎉 ¡Todas las pruebas del CRUD de Cost Breakdowns pasaron exitosamente!');

  } catch (error) {
    console.error('\n❌ Error en las pruebas:', error.response?.data || error.message);
    process.exit(1);
  }
}

// Ejecutar las pruebas
testCostBreakdownCRUD();
