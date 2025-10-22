import { z } from 'zod';

export const createPosOrderSchema = z.object({
  items: z.array(z.object({
    product_id: z.number().int().positive('ID de producto inválido'),
    quantity: z.number().int().positive('Cantidad debe ser positiva'),
    unit_price: z.number().positive('Precio unitario debe ser positivo'),
    variant_id: z.number().int().positive().optional(),
  })).min(1, 'Debe incluir al menos un producto'),
  customer_phone: z.string().optional(),
  customer_email: z.string().email().optional(),
  customer_nit: z.string().optional(),
  payment_method_id: z.number().int().positive('ID de método de pago inválido'),
  notes: z.string().optional(),
  discount_amount: z.number().min(0).optional(),
});



