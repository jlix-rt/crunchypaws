import { z } from 'zod';

export const createPromotionSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().optional(),
  type: z.enum(['PERCENTAGE', 'FIXED_AMOUNT', 'BUY_X_GET_Y', 'FREE_SHIPPING']),
  discount_value: z.number().positive('El valor de descuento debe ser positivo').optional(),
  min_order_amount: z.number().positive('El monto mínimo debe ser positivo').optional(),
  starts_at: z.string().datetime('Fecha de inicio inválida'),
  ends_at: z.string().datetime('Fecha de fin inválida'),
  usage_limit: z.number().int().positive('El límite de uso debe ser positivo').optional(),
});

export const updatePromotionSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').optional(),
  description: z.string().optional(),
  type: z.enum(['PERCENTAGE', 'FIXED_AMOUNT', 'BUY_X_GET_Y', 'FREE_SHIPPING']).optional(),
  discount_value: z.number().positive('El valor de descuento debe ser positivo').optional(),
  min_order_amount: z.number().positive('El monto mínimo debe ser positivo').optional(),
  starts_at: z.string().datetime('Fecha de inicio inválida').optional(),
  ends_at: z.string().datetime('Fecha de fin inválida').optional(),
  usage_limit: z.number().int().positive('El límite de uso debe ser positivo').optional(),
});

export const promotionQuerySchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 20),
  search: z.string().optional(),
  type: z.enum(['PERCENTAGE', 'FIXED_AMOUNT', 'BUY_X_GET_Y', 'FREE_SHIPPING']).optional(),
  status: z.enum(['DRAFT', 'ACTIVE', 'PAUSED', 'EXPIRED']).optional(),
});



