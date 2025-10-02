import { PrismaClient, Product, Category } from '@prisma/client';
import { ProductFilters, PaginationParams } from '@/types';

const prisma = new PrismaClient();

export interface ProductWithCategory extends Product {
  category: Category;
}

export interface ProductSearchResult {
  products: ProductWithCategory[];
  total: number;
}

export class ProductRepository {
  async findAll(
    filters: ProductFilters,
    pagination: PaginationParams,
    sortBy = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc'
  ): Promise<ProductSearchResult> {
    const where: any = {};

    // Filtro por búsqueda de texto
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    // Filtro por categoría
    if (filters.category) {
      const category = await prisma.category.findUnique({
        where: { slug: filters.category },
        include: { children: true },
      });

      if (category) {
        const categoryIds = [category.id, ...category.children.map(c => c.id)];
        where.categoryId = { in: categoryIds };
      }
    }

    // Filtro por subcategoría específica
    if (filters.subcategory) {
      const subcategory = await prisma.category.findUnique({
        where: { slug: filters.subcategory },
      });

      if (subcategory) {
        where.categoryId = subcategory.id;
      }
    }

    // Filtro por rango de precios
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.price = {};
      if (filters.minPrice !== undefined) {
        where.price.gte = filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        where.price.lte = filters.maxPrice;
      }
    }

    // Filtro por productos destacados
    if (filters.isFeatured !== undefined) {
      where.isFeatured = filters.isFeatured;
    }

    // Configurar ordenamiento
    const orderBy: any = {};
    switch (sortBy) {
      case 'name':
        orderBy.name = sortOrder;
        break;
      case 'price':
        orderBy.price = sortOrder;
        break;
      case 'featured':
        orderBy.isFeatured = 'desc';
        orderBy.createdAt = 'desc';
        break;
      case 'created':
      default:
        orderBy.createdAt = sortOrder;
        break;
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: true,
        },
        orderBy,
        skip: pagination.offset,
        take: pagination.limit,
      }),
      prisma.product.count({ where }),
    ]);

    return { products, total };
  }

  async findBySlug(slug: string): Promise<ProductWithCategory | null> {
    return prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
      },
    });
  }

  async findById(id: number): Promise<Product | null> {
    return prisma.product.findUnique({
      where: { id },
    });
  }

  async findByIds(ids: number[]): Promise<Product[]> {
    return prisma.product.findMany({
      where: {
        id: { in: ids },
      },
    });
  }

  async findFeatured(limit = 8): Promise<ProductWithCategory[]> {
    return prisma.product.findMany({
      where: { isFeatured: true },
      include: {
        category: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async updateStock(id: number, quantity: number): Promise<Product> {
    return prisma.product.update({
      where: { id },
      data: {
        stock: {
          decrement: quantity,
        },
      },
    });
  }

  async checkStock(items: Array<{ productId: number; quantity: number }>): Promise<boolean> {
    for (const item of items) {
      const product = await this.findById(item.productId);
      if (!product || product.stock < item.quantity) {
        return false;
      }
    }
    return true;
  }

  async getRelatedProducts(categoryId: number, excludeId: number, limit = 4): Promise<ProductWithCategory[]> {
    return prisma.product.findMany({
      where: {
        categoryId,
        id: { not: excludeId },
      },
      include: {
        category: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}
