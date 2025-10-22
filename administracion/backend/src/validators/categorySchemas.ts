import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  slug: z.string().min(1, 'El slug es requerido'),
  parent_id: z.number().int().positive('ID de categoría padre inválido').optional(),
});

export const updateCategorySchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').optional(),
  slug: z.string().min(1, 'El slug es requerido').optional(),
  parent_id: z.number().int().positive('ID de categoría padre inválido').optional(),
  is_active: z.boolean().optional(),
});

export const categoryQuerySchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 20),
  search: z.string().optional(),
  parent_id: z.string().optional().transform(val => val ? parseInt(val) : undefined),
  is_active: z.string().optional().transform(val => val === 'true'),
});



