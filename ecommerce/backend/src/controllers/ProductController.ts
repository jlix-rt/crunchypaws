import { Request, Response } from 'express';
import { ProductRepository } from '@/repositories/ProductRepository';
import { ResponseHelper, createPaginationResponse } from '@/utils/response';
import { PaginationData, ProductFiltersData } from '@/utils/validation';

const productRepository = new ProductRepository();

export class ProductController {
  async getProducts(req: Request, res: Response): Promise<void> {
    try {
      const pagination: PaginationData = req.query as any;
      const filters: ProductFiltersData = req.query as any;

      const paginationParams = {
        page: pagination.page,
        limit: Math.min(pagination.limit, 50), // Máximo 50 productos por página
        offset: (pagination.page - 1) * pagination.limit,
      };

      const { products, total } = await productRepository.findAll(
        filters,
        paginationParams,
        filters.sortBy,
        filters.sortOrder
      );

      const response = createPaginationResponse(products, total, pagination.page, pagination.limit);
      ResponseHelper.success(res, response);
    } catch (error) {
      console.error('Error obteniendo productos:', error);
      ResponseHelper.serverError(res);
    }
  }

  async getProductBySlug(req: Request, res: Response): Promise<void> {
    try {
      const { slug } = req.params;

      const product = await productRepository.findBySlug(slug);
      if (!product) {
        ResponseHelper.notFound(res, 'Producto no encontrado');
        return;
      }

      // Obtener productos relacionados
      const relatedProducts = await productRepository.getRelatedProducts(
        product.categoryId,
        product.id,
        4
      );

      ResponseHelper.success(res, {
        product,
        relatedProducts,
      });
    } catch (error) {
      console.error('Error obteniendo producto:', error);
      ResponseHelper.serverError(res);
    }
  }

  async getFeaturedProducts(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 8;
      const products = await productRepository.findFeatured(Math.min(limit, 20));

      ResponseHelper.success(res, products);
    } catch (error) {
      console.error('Error obteniendo productos destacados:', error);
      ResponseHelper.serverError(res);
    }
  }

  async searchProducts(req: Request, res: Response): Promise<void> {
    try {
      const { q } = req.query;
      
      if (!q || typeof q !== 'string' || q.trim().length < 2) {
        ResponseHelper.error(res, 'Término de búsqueda debe tener al menos 2 caracteres');
        return;
      }

      const pagination: PaginationData = req.query as any;
      const paginationParams = {
        page: pagination.page,
        limit: Math.min(pagination.limit, 50),
        offset: (pagination.page - 1) * pagination.limit,
      };

      const { products, total } = await productRepository.findAll(
        { search: q.trim() },
        paginationParams
      );

      const response = createPaginationResponse(products, total, pagination.page, pagination.limit);
      ResponseHelper.success(res, response);
    } catch (error) {
      console.error('Error en búsqueda de productos:', error);
      ResponseHelper.serverError(res);
    }
  }

  async getProductsByCategory(req: Request, res: Response): Promise<void> {
    try {
      const { categorySlug } = req.params;
      const pagination: PaginationData = req.query as any;
      const filters: ProductFiltersData = req.query as any;

      const paginationParams = {
        page: pagination.page,
        limit: Math.min(pagination.limit, 50),
        offset: (pagination.page - 1) * pagination.limit,
      };

      const { products, total } = await productRepository.findAll(
        { ...filters, category: categorySlug },
        paginationParams,
        filters.sortBy,
        filters.sortOrder
      );

      const response = createPaginationResponse(products, total, pagination.page, pagination.limit);
      ResponseHelper.success(res, response);
    } catch (error) {
      console.error('Error obteniendo productos por categoría:', error);
      ResponseHelper.serverError(res);
    }
  }

  async checkStock(req: Request, res: Response): Promise<void> {
    try {
      const { items } = req.body;

      if (!Array.isArray(items) || items.length === 0) {
        ResponseHelper.error(res, 'Items son requeridos');
        return;
      }

      const stockCheck = await productRepository.checkStock(items);
      
      if (!stockCheck) {
        ResponseHelper.error(res, 'Stock insuficiente para algunos productos', 409);
        return;
      }

      ResponseHelper.success(res, { available: true }, 'Stock disponible');
    } catch (error) {
      console.error('Error verificando stock:', error);
      ResponseHelper.serverError(res);
    }
  }
}
