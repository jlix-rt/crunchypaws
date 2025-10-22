import { z } from 'zod';

export const createOrderSchema = z.object({
  items: z.array(z.object({
    product_id: z.number().int().positive('ID de producto inválido'),
    quantity: z.number().int().positive('Cantidad debe ser positiva'),
    variant_id: z.number().int().positive().optional(),
  })).min(1, 'Debe incluir al menos un producto'),
  shipping_address: z.object({
    label: z.string().min(1, 'Etiqueta de dirección requerida'),
    department: z.string().min(1, 'Departamento requerido'),
    municipality: z.string().min(1, 'Municipio requerido'),
    zone: z.string().optional(),
    colonia: z.string().optional(),
    street: z.string().min(1, 'Calle requerida'),
    reference: z.string().optional(),
  }),
  payment_method_id: z.number().int().positive('ID de método de pago inválido'),
  coupon_code: z.string().optional(),
  notes: z.string().optional(),
});


