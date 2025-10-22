const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

async function testProductSupply() {
  try {
    console.log('🧪 Iniciando prueba de Producto como Insumo...\n');

    // 1. Login
    console.log('1️⃣ Haciendo login...');
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@crunchypaws.com',
      password: 'password'
    });

    const token = loginResponse.data.data.accessToken;
    console.log('✅ Login exitoso\n');

    // 2. Obtener productos
    console.log('2️⃣ Obteniendo productos...');
    const productsResponse = await axios.get(`${BASE_URL}/products`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('Productos encontrados:', productsResponse.data.data.products.length);
    
    // Buscar un producto que sea también insumo
    const productWithSupply = productsResponse.data.data.products.find(p => p.name === 'Producto prueba 2 insumo');
    
    if (productWithSupply) {
      console.log('✅ Producto encontrado:', productWithSupply.name);
      console.log('   - ID:', productWithSupply.id);
      console.log('   - SKU:', productWithSupply.sku);
      console.log('   - Precio:', productWithSupply.price);
    } else {
      console.log('❌ No se encontró el producto "Producto prueba 2 insumo"');
      return;
    }

    // 3. Obtener insumos
    console.log('\n3️⃣ Obteniendo insumos...');
    const suppliesResponse = await axios.get(`${BASE_URL}/supplies`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('Insumos encontrados:', suppliesResponse.data.data.supplies.length);
    
    // Buscar el insumo correspondiente al producto
    const correspondingSupply = suppliesResponse.data.data.supplies.find(s => 
      s.name === 'Producto prueba 2 insumo' && s.category === 'Producto'
    );
    
    if (correspondingSupply) {
      console.log('✅ Insumo encontrado para el producto:');
      console.log('   - ID:', correspondingSupply.id);
      console.log('   - Nombre:', correspondingSupply.name);
      console.log('   - Categoría:', correspondingSupply.category);
      console.log('   - Stock:', correspondingSupply.stock);
      console.log('   - Precio Unitario:', correspondingSupply.unitPrice);
      console.log('   - Unidad:', correspondingSupply.unit);
    } else {
      console.log('❌ No se encontró el insumo correspondiente al producto');
      console.log('Insumos disponibles:');
      suppliesResponse.data.data.supplies.forEach(s => {
        console.log(`   - ${s.name} (${s.category})`);
      });
    }

    // 4. Verificar en base de datos directamente
    console.log('\n4️⃣ Verificando en base de datos...');
    console.log('Para verificar manualmente, ejecuta:');
    console.log('SELECT * FROM supplies WHERE name = "Producto prueba 2 insumo" AND is_also_product = 1;');
    console.log('SELECT * FROM products WHERE name = "Producto prueba 2 insumo";');

  } catch (error) {
    console.error('❌ Error en las pruebas:', error.response?.data || error.message);
  }
}

testProductSupply();
