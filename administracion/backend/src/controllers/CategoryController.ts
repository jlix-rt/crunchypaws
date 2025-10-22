import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Category } from '../entities/Category';

export class CategoryController {
  // Obtener todas las categorías (no eliminadas)
  async getCategories(req: Request, res: Response): Promise<void> {
    try {
      const categoryRepository = AppDataSource.getRepository(Category);
      const categories = await categoryRepository.find({
        where: { is_deleted: false },
        order: { name: 'ASC' }
      });

      // Mapear a formato esperado por el frontend
      const formattedCategories = categories.map(category => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        parentId: category.parent_id,
        status: category.is_active ? 'active' : 'inactive',
        createdAt: category.created_at,
        updatedAt: category.updated_at
      }));

      res.json({
        success: true,
        data: {
          categories: formattedCategories,
          pagination: {
            page: 1,
            limit: 10,
            total: formattedCategories.length,
            pages: 1
          }
        }
      });
    } catch (error) {
      console.error('Error obteniendo categorías:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Obtener categoría por ID
  async getCategoryById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const categoryRepository = AppDataSource.getRepository(Category);
      
      const category = await categoryRepository.findOne({
        where: { id: parseInt(id), is_deleted: false }
      });

      if (!category) {
        res.status(404).json({
          success: false,
          message: 'Categoría no encontrada'
        });
        return;
      }

      const formattedCategory = {
        id: category.id,
        name: category.name,
        slug: category.slug,
        parentId: category.parent_id,
        status: category.is_active ? 'active' : 'inactive',
        createdAt: category.created_at,
        updatedAt: category.updated_at
      };

      res.json({
        success: true,
        data: { category: formattedCategory }
      });
    } catch (error) {
      console.error('Error obteniendo categoría:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Crear categoría
  async createCategory(req: Request, res: Response): Promise<void> {
    try {
      const { name, parentId } = req.body;

      if (!name) {
        res.status(400).json({
          success: false,
          message: 'El nombre de la categoría es requerido'
        });
        return;
      }

      const categoryRepository = AppDataSource.getRepository(Category);
      
      // Verificar si ya existe una categoría con el mismo nombre
      const existingCategory = await categoryRepository.findOne({
        where: { name, is_deleted: false }
      });

      if (existingCategory) {
        res.status(400).json({
          success: false,
          message: 'Ya existe una categoría con este nombre'
        });
        return;
      }

      // Crear slug único
      const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      
      // Verificar si el slug ya existe
      let finalSlug = slug;
      let counter = 1;
      while (await categoryRepository.findOne({ where: { slug: finalSlug, is_deleted: false } })) {
        finalSlug = `${slug}-${counter}`;
        counter++;
      }

      const newCategory = categoryRepository.create({
        name,
        slug: finalSlug,
        parent_id: parentId || null,
        is_active: true,
        is_deleted: false
      });

      const savedCategory = await categoryRepository.save(newCategory);

      const formattedCategory = {
        id: savedCategory.id,
        name: savedCategory.name,
        slug: savedCategory.slug,
        parentId: savedCategory.parent_id,
        status: savedCategory.is_active ? 'active' : 'inactive',
        createdAt: savedCategory.created_at,
        updatedAt: savedCategory.updated_at
      };

      res.status(201).json({
        success: true,
        message: 'Categoría creada exitosamente',
        data: { category: formattedCategory }
      });
    } catch (error) {
      console.error('Error creando categoría:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Actualizar categoría
  async updateCategory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, parentId, status } = req.body;

      const categoryRepository = AppDataSource.getRepository(Category);
      
      const existingCategory = await categoryRepository.findOne({
        where: { id: parseInt(id), is_deleted: false }
      });

      if (!existingCategory) {
        res.status(404).json({
          success: false,
          message: 'Categoría no encontrada'
        });
        return;
      }

      // Verificar si el nuevo nombre ya existe (si se está cambiando)
      if (name && name !== existingCategory.name) {
        const duplicateCategory = await categoryRepository.findOne({
          where: { name, is_deleted: false }
        });

        if (duplicateCategory) {
          res.status(400).json({
            success: false,
            message: 'Ya existe una categoría con este nombre'
          });
          return;
        }

        // Actualizar slug si cambió el nombre
        const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        let finalSlug = slug;
        let counter = 1;
        while (await categoryRepository.findOne({ where: { slug: finalSlug, is_deleted: false } })) {
          finalSlug = `${slug}-${counter}`;
          counter++;
        }
        existingCategory.slug = finalSlug;
      }

      // Actualizar campos
      if (name) existingCategory.name = name;
      if (parentId !== undefined) existingCategory.parent_id = parentId;
      if (status !== undefined) existingCategory.is_active = status === 'active';

      const updatedCategory = await categoryRepository.save(existingCategory);

      const formattedCategory = {
        id: updatedCategory.id,
        name: updatedCategory.name,
        slug: updatedCategory.slug,
        parentId: updatedCategory.parent_id,
        status: updatedCategory.is_active ? 'active' : 'inactive',
        createdAt: updatedCategory.created_at,
        updatedAt: updatedCategory.updated_at
      };

      res.json({
        success: true,
        message: 'Categoría actualizada exitosamente',
        data: { category: formattedCategory }
      });
    } catch (error) {
      console.error('Error actualizando categoría:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  // Eliminar categoría (eliminación lógica)
  async deleteCategory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const categoryRepository = AppDataSource.getRepository(Category);
      
      const existingCategory = await categoryRepository.findOne({
        where: { id: parseInt(id), is_deleted: false }
      });

      if (!existingCategory) {
        res.status(404).json({
          success: false,
          message: 'Categoría no encontrada'
        });
        return;
      }

      // Verificar si la categoría tiene productos asociados
      const productCategoryRepository = AppDataSource.getRepository('ProductCategory');
      const associatedProducts = await productCategoryRepository.count({
        where: { category_id: parseInt(id) }
      });

      if (associatedProducts > 0) {
        res.status(400).json({
          success: false,
          message: 'No se puede eliminar la categoría porque tiene productos asociados'
        });
        return;
      }

      // Eliminación lógica
      existingCategory.is_deleted = true;
      await categoryRepository.save(existingCategory);

      res.json({
        success: true,
        message: 'Categoría eliminada exitosamente'
      });
    } catch (error) {
      console.error('Error eliminando categoría:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
}



