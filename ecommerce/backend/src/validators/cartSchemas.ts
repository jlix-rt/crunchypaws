import { z } from 'zod';

export const addToCartSchema = z.object({
  product_id: z.number().int().positive('ID de producto inválido'),
  quantity: z.number().int().positive('Cantidad debe ser positiva'),
  variant_id: z.number().int().positive().optional(),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().positive('Cantidad debe ser positiva'),
});

export const applyCouponSchema = z.object({
  code: z.string().min(1, 'Código de cupón requerido'),
});


