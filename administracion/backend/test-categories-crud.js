const axios = require('axios');

const BASE_URL = 'http://localhost:3001/api';

async function testCategoriesCRUD() {
  try {
    console.log('🧪 Probando CRUD completo de categorías...\n');

    // 1. Login
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@crunchypaws.com',
      password: 'password'
    });

    const token = loginResponse.data.data.accessToken;
    console.log('✅ Login exitoso');

    // 2. Obtener todas las categorías
    console.log('\n📋 Obteniendo todas las categorías...');
    const categoriesResponse = await axios.get(`${BASE_URL}/categories`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('✅ Categorías obtenidas:', categoriesResponse.data.data.categories.length);
    categoriesResponse.data.data.categories.forEach(cat => {
      console.log(`   - ${cat.id}: ${cat.name} (${cat.status})`);
    });

    // 3. Crear una nueva categoría
    console.log('\n➕ Creando nueva categoría...');
    const newCategoryData = {
      name: 'Categoría de Prueba',
      parentId: null
    };

    const createResponse = await axios.post(`${BASE_URL}/categories`, newCategoryData, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const newCategory = createResponse.data.data.category;
    console.log('✅ Categoría creada:', newCategory);

    // 4. Obtener la categoría por ID
    console.log('\n🔍 Obteniendo categoría por ID...');
    const getByIdResponse = await axios.get(`${BASE_URL}/categories/${newCategory.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('✅ Categoría obtenida por ID:', getByIdResponse.data.data.category);

    // 5. Actualizar la categoría
    console.log('\n✏️ Actualizando categoría...');
    const updateData = {
      name: 'Categoría de Prueba Actualizada',
      status: 'inactive'
    };

    const updateResponse = await axios.put(`${BASE_URL}/categories/${newCategory.id}`, updateData, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('✅ Categoría actualizada:', updateResponse.data.data.category);

    // 6. Verificar que la categoría actualizada aparece en la lista
    console.log('\n📋 Verificando categoría actualizada en la lista...');
    const updatedCategoriesResponse = await axios.get(`${BASE_URL}/categories`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const updatedCategory = updatedCategoriesResponse.data.data.categories.find(cat => cat.id === newCategory.id);
    if (updatedCategory) {
      console.log('✅ Categoría actualizada encontrada en la lista:', updatedCategory);
    } else {
      console.log('❌ Categoría actualizada NO encontrada en la lista');
    }

    // 7. Eliminar la categoría (eliminación lógica)
    console.log('\n🗑️ Eliminando categoría (eliminación lógica)...');
    const deleteResponse = await axios.delete(`${BASE_URL}/categories/${newCategory.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('✅ Respuesta de eliminación:', deleteResponse.data);

    // 8. Verificar que la categoría eliminada NO aparece en la lista
    console.log('\n📋 Verificando que la categoría eliminada NO aparece en la lista...');
    const finalCategoriesResponse = await axios.get(`${BASE_URL}/categories`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const deletedCategory = finalCategoriesResponse.data.data.categories.find(cat => cat.id === newCategory.id);
    if (deletedCategory) {
      console.log('❌ La categoría eliminada SÍ aparece en la lista:', deletedCategory);
    } else {
      console.log('✅ La categoría eliminada NO aparece en la lista (eliminación lógica exitosa)');
    }

    // 9. Verificar en base de datos
    console.log('\n🔍 Verificando en base de datos...');
    console.log('Para verificar manualmente, ejecuta:');
    console.log(`SELECT id, name, is_active, is_deleted FROM categories WHERE name LIKE '%Categoría de Prueba%';`);

    console.log('\n🎉 ¡Prueba de CRUD de categorías completada exitosamente!');

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testCategoriesCRUD();
