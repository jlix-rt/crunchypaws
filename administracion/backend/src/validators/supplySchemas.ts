import { z } from 'zod';

export const createSupplySchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  unit: z.string().min(1, 'La unidad es requerida'),
  unit_cost: z.number().positive('El costo unitario debe ser positivo'),
  is_also_product: z.boolean().optional().default(false),
});

export const updateSupplySchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').optional(),
  unit: z.string().min(1, 'La unidad es requerida').optional(),
  unit_cost: z.number().positive('El costo unitario debe ser positivo').optional(),
  is_active: z.boolean().optional(),
  is_also_product: z.boolean().optional(),
});

export const supplyQuerySchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 20),
  search: z.string().optional(),
  is_active: z.string().optional().transform(val => val === 'true'),
});



