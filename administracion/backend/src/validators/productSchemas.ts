import { z } from 'zod';

export const createProductSchema = z.object({
  sku: z.string().min(1, 'El SKU es requerido'),
  name: z.string().min(1, 'El nombre es requerido'),
  slug: z.string().min(1, 'El slug es requerido'),
  description: z.string().optional(),
  category_id: z.number().int().positive('ID de categoría inválido'),
  base_price: z.number().positive('El precio base debe ser positivo'),
  stock: z.number().int().min(0, 'El stock no puede ser negativo').optional().default(0),
});

export const updateProductSchema = z.object({
  sku: z.string().min(1, 'El SKU es requerido').optional(),
  name: z.string().min(1, 'El nombre es requerido').optional(),
  slug: z.string().min(1, 'El slug es requerido').optional(),
  description: z.string().optional(),
  category_id: z.number().int().positive('ID de categoría inválido').optional(),
  base_price: z.number().positive('El precio base debe ser positivo').optional(),
  stock: z.number().int().min(0, 'El stock no puede ser negativo').optional(),
  is_active: z.boolean().optional(),
});

export const productQuerySchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 20),
  search: z.string().optional(),
  category_id: z.string().optional().transform(val => val ? parseInt(val) : undefined),
  is_active: z.string().optional().transform(val => val === 'true'),
});

export const productRecipeSchema = z.object({
  supplies: z.array(z.object({
    supply_id: z.number().int().positive('ID de insumo inválido'),
    quantity: z.number().positive('La cantidad debe ser positiva'),
  })).min(1, 'Debe incluir al menos un insumo'),
});



