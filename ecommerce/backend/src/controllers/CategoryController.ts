import { Request, Response } from 'express';
import { CategoryRepository } from '@/repositories/CategoryRepository';
import { ResponseHelper } from '@/utils/response';

const categoryRepository = new CategoryRepository();

export class CategoryController {
  async getCategories(req: Request, res: Response): Promise<void> {
    try {
      const includeProductCount = req.query.includeProductCount === 'true';

      if (includeProductCount) {
        const categories = await categoryRepository.getCategoryWithProductCount();
        ResponseHelper.success(res, categories);
      } else {
        const categories = await categoryRepository.findAll();
        ResponseHelper.success(res, categories);
      }
    } catch (error) {
      console.error('Error obteniendo categorías:', error);
      ResponseHelper.serverError(res);
    }
  }

  async getCategoryBySlug(req: Request, res: Response): Promise<void> {
    try {
      const { slug } = req.params;

      const category = await categoryRepository.findBySlug(slug);
      if (!category) {
        ResponseHelper.notFound(res, 'Categoría no encontrada');
        return;
      }

      ResponseHelper.success(res, category);
    } catch (error) {
      console.error('Error obteniendo categoría:', error);
      ResponseHelper.serverError(res);
    }
  }

  async getRootCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await categoryRepository.findRootCategories();
      ResponseHelper.success(res, categories);
    } catch (error) {
      console.error('Error obteniendo categorías principales:', error);
      ResponseHelper.serverError(res);
    }
  }

  async getSubcategories(req: Request, res: Response): Promise<void> {
    try {
      const { categoryId } = req.params;
      const id = parseInt(categoryId);

      if (isNaN(id)) {
        ResponseHelper.error(res, 'ID de categoría inválido');
        return;
      }

      const subcategories = await categoryRepository.findSubcategories(id);
      ResponseHelper.success(res, subcategories);
    } catch (error) {
      console.error('Error obteniendo subcategorías:', error);
      ResponseHelper.serverError(res);
    }
  }

  async getCategoryPath(req: Request, res: Response): Promise<void> {
    try {
      const { categoryId } = req.params;
      const id = parseInt(categoryId);

      if (isNaN(id)) {
        ResponseHelper.error(res, 'ID de categoría inválido');
        return;
      }

      const path = await categoryRepository.getCategoryPath(id);
      ResponseHelper.success(res, path);
    } catch (error) {
      console.error('Error obteniendo ruta de categoría:', error);
      ResponseHelper.serverError(res);
    }
  }
}
