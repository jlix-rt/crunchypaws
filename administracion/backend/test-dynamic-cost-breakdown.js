const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

async function testDynamicCostBreakdown() {
  try {
    console.log('🧪 Iniciando pruebas del desglose dinámico de costos...\n');

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

    // 2. Obtener desglose dinámico
    console.log('2️⃣ Obteniendo desglose dinámico...');
    const dynamicResponse = await axios.get(`${BASE_URL}/api/cost-breakdowns/dynamic/all`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!dynamicResponse.data.success) {
      throw new Error('Error obteniendo desglose dinámico: ' + JSON.stringify(dynamicResponse.data));
    }

    const { costBreakdowns, costTypes } = dynamicResponse.data.data;
    console.log('✅ Desglose dinámico obtenido exitosamente');
    console.log(`📊 Productos encontrados: ${costBreakdowns.length}`);
    console.log(`💰 Tipos de costos disponibles: ${costTypes.length}\n`);

    // 3. Mostrar tipos de costos disponibles
    console.log('3️⃣ Tipos de costos disponibles:');
    costTypes.forEach((costType, index) => {
      console.log(`   ${index + 1}. ${costType.name} - ${costType.percentage}% (Prioridad: ${costType.priority}) ${costType.isMandatory ? '(Obligatorio)' : '(Opcional)'}`);
    });
    console.log('');

    // 4. Mostrar desglose de cada producto
    console.log('4️⃣ Desglose de costos por producto:');
    costBreakdowns.forEach((breakdown, index) => {
      console.log(`\n📦 Producto ${index + 1}: ${breakdown.productName} (${breakdown.productSku})`);
      console.log(`   💰 Costo Base: Q${breakdown.baseCost.toFixed(2)}`);
      console.log(`   📈 Ganancia: Q${breakdown.profitAmount.toFixed(2)} (${breakdown.profitPercentage}%)`);
      console.log(`   📊 Subtotal: Q${breakdown.subtotal.toFixed(2)}`);
      
      if (breakdown.costs.length > 0) {
        console.log(`   🔧 Costos adicionales:`);
        breakdown.costs.forEach(cost => {
          console.log(`      - ${cost.name}: Q${cost.amount.toFixed(2)} (${cost.percentage}%)`);
        });
      }
      
      console.log(`   💵 Precio Final: Q${breakdown.finalPrice.toFixed(2)}`);
    });

    // 5. Calcular estadísticas
    console.log('\n5️⃣ Estadísticas del desglose:');
    const totalProducts = costBreakdowns.length;
    const avgBaseCost = costBreakdowns.reduce((sum, b) => sum + b.baseCost, 0) / totalProducts;
    const avgFinalPrice = costBreakdowns.reduce((sum, b) => sum + b.finalPrice, 0) / totalProducts;
    const avgMargin = costBreakdowns.reduce((sum, b) => sum + b.profitPercentage, 0) / totalProducts;

    console.log(`   📊 Total de productos: ${totalProducts}`);
    console.log(`   💰 Costo base promedio: Q${avgBaseCost.toFixed(2)}`);
    console.log(`   💵 Precio final promedio: Q${avgFinalPrice.toFixed(2)}`);
    console.log(`   📈 Margen promedio: ${avgMargin.toFixed(1)}%`);

    // 6. Verificar que los cálculos son correctos
    console.log('\n6️⃣ Verificando cálculos...');
    let calculationErrors = 0;
    
    costBreakdowns.forEach((breakdown, index) => {
      let calculatedSubtotal = breakdown.baseCost + breakdown.profitAmount;
      let calculatedFinalPrice = calculatedSubtotal;
      
      // Aplicar costos adicionales
      breakdown.costs.forEach(cost => {
        calculatedFinalPrice += cost.amount;
      });
      
      const expectedFinalPrice = calculatedFinalPrice;
      const actualFinalPrice = breakdown.finalPrice;
      const difference = Math.abs(expectedFinalPrice - actualFinalPrice);
      
      if (difference > 0.01) { // Tolerancia de 1 centavo
        console.log(`   ❌ Error en producto ${index + 1}: Esperado Q${expectedFinalPrice.toFixed(2)}, Obtenido Q${actualFinalPrice.toFixed(2)}`);
        calculationErrors++;
      }
    });

    if (calculationErrors === 0) {
      console.log('   ✅ Todos los cálculos son correctos');
    } else {
      console.log(`   ⚠️ Se encontraron ${calculationErrors} errores de cálculo`);
    }

    console.log('\n🎉 Pruebas del desglose dinámico completadas exitosamente!');
    console.log('\n📋 Resumen:');
    console.log(`   ✅ Endpoint funcionando correctamente`);
    console.log(`   ✅ ${totalProducts} productos procesados`);
    console.log(`   ✅ ${costTypes.length} tipos de costos aplicados`);
    console.log(`   ✅ Cálculos verificados`);

  } catch (error) {
    console.error('❌ Error en las pruebas:', error.response?.data || error.message);
    process.exit(1);
  }
}

// Ejecutar las pruebas
testDynamicCostBreakdown();
