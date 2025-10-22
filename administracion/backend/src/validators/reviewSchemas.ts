import { z } from 'zod';

export const reviewQuerySchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 20),
  product_id: z.string().optional().transform(val => val ? parseInt(val) : undefined),
  user_id: z.string().optional().transform(val => val ? parseInt(val) : undefined),
  rating: z.string().optional().transform(val => val ? parseInt(val) : undefined),
  is_approved: z.string().optional().transform(val => val === 'true'),
});



