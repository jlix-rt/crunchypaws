import { z } from 'zod';

export const calculateShippingSchema = z.object({
  department: z.string().min(1, 'Departamento requerido'),
  municipality: z.string().min(1, 'Municipio requerido'),
  zone: z.string().optional(),
  colonia: z.string().optional(),
  weight: z.number().positive('Peso debe ser positivo').optional(),
  value: z.number().positive('Valor debe ser positivo').optional(),
});


