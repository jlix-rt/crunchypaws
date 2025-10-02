import { PrismaClient, Category } from '@prisma/client';

const prisma = new PrismaClient();

export interface CategoryWithChildren extends Category {
  children: Category[];
}

export interface CategoryTree extends Category {
  children: CategoryTree[];
}

export class CategoryRepository {
  async findAll(): Promise<CategoryTree[]> {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });

    // Construir árbol de categorías
    const categoryMap = new Map<number, CategoryTree>();
    const rootCategories: CategoryTree[] = [];

    // Crear mapa de categorías
    categories.forEach(cat => {
      categoryMap.set(cat.id, { ...cat, children: [] });
    });

    // Construir jerarquía
    categories.forEach(cat => {
      const categoryNode = categoryMap.get(cat.id)!;
      
      if (cat.parentId) {
        const parent = categoryMap.get(cat.parentId);
        if (parent) {
          parent.children.push(categoryNode);
        }
      } else {
        rootCategories.push(categoryNode);
      }
    });

    return rootCategories;
  }

  async findBySlug(slug: string): Promise<CategoryWithChildren | null> {
    return prisma.category.findUnique({
      where: { slug },
      include: {
        children: {
          orderBy: { name: 'asc' },
        },
      },
    });
  }

  async findById(id: number): Promise<Category | null> {
    return prisma.category.findUnique({
      where: { id },
    });
  }

  async findRootCategories(): Promise<Category[]> {
    return prisma.category.findMany({
      where: { parentId: null },
      orderBy: { name: 'asc' },
    });
  }

  async findSubcategories(parentId: number): Promise<Category[]> {
    return prisma.category.findMany({
      where: { parentId },
      orderBy: { name: 'asc' },
    });
  }

  async getCategoryPath(categoryId: number): Promise<Category[]> {
    const path: Category[] = [];
    let currentId: number | null = categoryId;

    while (currentId) {
      const category = await this.findById(currentId);
      if (!category) break;
      
      path.unshift(category);
      currentId = category.parentId;
    }

    return path;
  }

  async getCategoryWithProductCount(): Promise<Array<CategoryTree & { productCount: number }>> {
    const categories = await this.findAll();
    
    // Obtener conteos de productos para cada categoría
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const productCount = await this.getProductCountRecursive(category.id);
        const childrenWithCount = await Promise.all(
          category.children.map(async (child) => ({
            ...child,
            productCount: await this.getProductCountRecursive(child.id),
            children: [],
          }))
        );

        return {
          ...category,
          productCount,
          children: childrenWithCount,
        };
      })
    );

    return categoriesWithCount;
  }

  private async getProductCountRecursive(categoryId: number): Promise<number> {
    // Obtener todas las subcategorías
    const subcategories = await this.getAllSubcategoryIds(categoryId);
    const allCategoryIds = [categoryId, ...subcategories];

    return prisma.product.count({
      where: {
        categoryId: { in: allCategoryIds },
      },
    });
  }

  private async getAllSubcategoryIds(categoryId: number): Promise<number[]> {
    const subcategories = await prisma.category.findMany({
      where: { parentId: categoryId },
    });

    let allIds: number[] = [];
    
    for (const sub of subcategories) {
      allIds.push(sub.id);
      const childIds = await this.getAllSubcategoryIds(sub.id);
      allIds = allIds.concat(childIds);
    }

    return allIds;
  }
}
