import { z } from 'zod';

export const searchSchema = z.object({
  q: z.string().min(1, 'Parámetro de búsqueda requerido'),
  page: z.string().optional().transform((val) => val ? parseInt(val) : 1),
  limit: z.string().optional().transform((val) => val ? parseInt(val) : 20),
  category_id: z.string().optional().transform((val) => val ? parseInt(val) : undefined),
  min_price: z.string().optional().transform((val) => val ? parseFloat(val) : undefined),
  max_price: z.string().optional().transform((val) => val ? parseFloat(val) : undefined),
});

export const productSchema = z.object({
  name: z.string().min(1, 'Nombre del producto requerido'),
  description: z.string().optional(),
  category_id: z.number().int().positive('ID de categoría inválido'),
  sku: z.string().min(1, 'SKU requerido'),
  base_price: z.number().positive('Precio base debe ser positivo'),
  stock: z.number().int().min(0, 'Stock no puede ser negativo'),
});


