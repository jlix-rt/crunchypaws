import { z } from 'zod';

export const createUserSchema = z.object({
  full_name: z.string().min(1, 'El nombre completo es requerido'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  nit: z.string().optional(),
  role: z.enum(['CLIENT', 'EMPLOYEE', 'ADMIN']).default('CLIENT'),
});

export const updateUserSchema = z.object({
  full_name: z.string().min(1, 'El nombre completo es requerido').optional(),
  email: z.string().email('Email inválido').optional(),
  phone: z.string().optional(),
  nit: z.string().optional(),
  role: z.enum(['CLIENT', 'EMPLOYEE', 'ADMIN']).optional(),
  is_active: z.boolean().optional(),
});

export const userQuerySchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 20),
  search: z.string().optional(),
  role: z.enum(['CLIENT', 'EMPLOYEE', 'ADMIN']).optional(),
  is_active: z.string().optional().transform(val => val === 'true'),
});



