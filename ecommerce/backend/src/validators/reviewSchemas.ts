import { z } from 'zod';

export const createReviewSchema = z.object({
  product_id: z.number().int().positive('ID de producto inválido'),
  rating: z.number().int().min(1, 'Rating mínimo es 1').max(5, 'Rating máximo es 5'),
  title: z.string().min(1, 'Título requerido').max(255, 'Título muy largo'),
  body: z.string().min(1, 'Comentario requerido'),
});

export const updateReviewSchema = z.object({
  rating: z.number().int().min(1, 'Rating mínimo es 1').max(5, 'Rating máximo es 5').optional(),
  title: z.string().min(1, 'Título requerido').max(255, 'Título muy largo').optional(),
  body: z.string().min(1, 'Comentario requerido').optional(),
});


