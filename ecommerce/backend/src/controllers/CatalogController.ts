import { Request, Response, NextFunction } from 'express';
import { AppDataSource } from '../config/database';
import { Category } from '../entities/Category';
import { Product } from '../entities/Product';
import { CustomError, asyncHandler } from '../middleware/errorHandler';

export class CatalogController {
  private categoryRepository = AppDataSource.getRepository(Category);
  private productRepository = AppDataSource.getRepository(Product);

  getCategories = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { parent_id } = req.query;

    const whereCondition: any = { is_active: true };
    if (parent_id) {
      whereCondition.parent_id = parent_id;
    }

    const categories = await this.categoryRepository.find({
      where: whereCondition,
      relations: ['children'],
      order: { name: 'ASC' },
    });

    res.json({
      message: 'Categorías obtenidas exitosamente',
      data: categories,
    });
  });

  getCategoryById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const category = await this.categoryRepository.findOne({
      where: { id: parseInt(id), is_active: true },
      relations: ['parent', 'children', 'products'],
    });

    if (!category) {
      throw new CustomError('Categoría no encontrada', 404);
    }

    res.json({
      message: 'Categoría obtenida exitosamente',
      data: category,
    });
  });

  getProducts = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { 
      page = 1, 
      limit = 20, 
      category_id, 
      min_price, 
      max_price, 
      sort_by = 'created_at', 
      sort_order = 'DESC' 
    } = req.query;

    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.images', 'images')
      .where('product.is_active = :isActive', { isActive: true });

    // Filtros
    if (category_id) {
      queryBuilder.andWhere('product.category_id = :categoryId', { categoryId: category_id });
    }

    if (min_price) {
      queryBuilder.andWhere('product.final_price >= :minPrice', { minPrice: min_price });
    }

    if (max_price) {
      queryBuilder.andWhere('product.final_price <= :maxPrice', { maxPrice: max_price });
    }

    // Ordenamiento
    const validSortFields = ['name', 'final_price', 'created_at'];
    const sortField = validSortFields.includes(sort_by as string) ? sort_by : 'created_at';
    const sortDirection = sort_order === 'ASC' ? 'ASC' : 'DESC';
    
    queryBuilder.orderBy(`product.${sortField}`, sortDirection);

    // Paginación
    const offset = (Number(page) - 1) * Number(limit);
    queryBuilder.skip(offset).take(Number(limit));

    const [products, total] = await queryBuilder.getManyAndCount();

    res.json({
      message: 'Productos obtenidos exitosamente',
      data: {
        products,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      },
    });
  });

  getProductById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const product = await this.productRepository.findOne({
      where: { id: parseInt(id), is_active: true },
      relations: ['category', 'images', 'variants', 'reviews'],
    });

    if (!product) {
      throw new CustomError('Producto no encontrado', 404);
    }

    res.json({
      message: 'Producto obtenido exitosamente',
      data: product,
    });
  });

  getProductBySlug = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { slug } = req.params;

    const product = await this.productRepository.findOne({
      where: { slug, is_active: true },
      relations: ['category', 'images', 'variants', 'reviews'],
    });

    if (!product) {
      throw new CustomError('Producto no encontrado', 404);
    }

    res.json({
      message: 'Producto obtenido exitosamente',
      data: product,
    });
  });

  searchProducts = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { 
      q, 
      page = 1, 
      limit = 20, 
      category_id, 
      min_price, 
      max_price 
    } = req.query;

    if (!q) {
      throw new CustomError('Parámetro de búsqueda requerido', 400);
    }

    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.images', 'images')
      .where('product.is_active = :isActive', { isActive: true })
      .andWhere(
        '(product.name LIKE :search OR product.description LIKE :search OR product.sku LIKE :search)',
        { search: `%${q}%` }
      );

    // Filtros adicionales
    if (category_id) {
      queryBuilder.andWhere('product.category_id = :categoryId', { categoryId: category_id });
    }

    if (min_price) {
      queryBuilder.andWhere('product.final_price >= :minPrice', { minPrice: min_price });
    }

    if (max_price) {
      queryBuilder.andWhere('product.final_price <= :maxPrice', { maxPrice: max_price });
    }

    // Ordenamiento por relevancia (simplificado)
    queryBuilder.orderBy('product.name', 'ASC');

    // Paginación
    const offset = (Number(page) - 1) * Number(limit);
    queryBuilder.skip(offset).take(Number(limit));

    const [products, total] = await queryBuilder.getManyAndCount();

    res.json({
      message: 'Búsqueda completada exitosamente',
      data: {
        products,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
        query: q,
      },
    });
  });

  autocomplete = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { q } = req.query;

    if (!q || (q as string).length < 2) {
      return res.json({
        message: 'Autocompletado obtenido exitosamente',
        data: [],
      });
    }

    const products = await this.productRepository
      .createQueryBuilder('product')
      .select(['product.id', 'product.name', 'product.slug', 'product.sku', 'product.final_price'])
      .where('product.is_active = :isActive', { isActive: true })
      .andWhere(
        '(product.name LIKE :search OR product.sku LIKE :search)',
        { search: `%${q}%` }
      )
      .orderBy('product.name', 'ASC')
      .limit(10)
      .getMany();

    res.json({
      message: 'Autocompletado obtenido exitosamente',
      data: products,
    });
  });

  getFeaturedProducts = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { limit = 8 } = req.query;

    // Productos destacados (simplificado - se puede mejorar con lógica de negocio)
    const products = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.images', 'images')
      .where('product.is_active = :isActive', { isActive: true })
      .orderBy('product.final_price', 'DESC')
      .limit(Number(limit))
      .getMany();

    res.json({
      message: 'Productos destacados obtenidos exitosamente',
      data: products,
    });
  });

  getRelatedProducts = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { limit = 4 } = req.query;

    // Obtener el producto actual
    const currentProduct = await this.productRepository.findOne({
      where: { id: parseInt(id) },
    });

    if (!currentProduct) {
      throw new CustomError('Producto no encontrado', 404);
    }

    // Productos relacionados de la misma categoría
    const relatedProducts = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.images', 'images')
      .where('product.is_active = :isActive', { isActive: true })
      .andWhere('product.category_id = :categoryId', { categoryId: currentProduct.category_id })
      .andWhere('product.id != :productId', { productId: currentProduct.id })
      .orderBy('RAND()')
      .limit(Number(limit))
      .getMany();

    res.json({
      message: 'Productos relacionados obtenidos exitosamente',
      data: relatedProducts,
    });
  });
}


