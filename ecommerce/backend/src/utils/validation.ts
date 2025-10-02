import { z } from 'zod';

// Auth schemas
export const registerSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
  apellido: z.string().min(2, 'El apellido debe tener al menos 2 caracteres').max(100),
  email: z.string().email('Email inválido'),
  telefono: z.string().min(8, 'El teléfono debe tener al menos 8 caracteres').max(20),
  nit: z.string().optional(),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

export const updateProfileSchema = z.object({
  nombre: z.string().min(2).max(100).optional(),
  apellido: z.string().min(2).max(100).optional(),
  telefono: z.string().min(8).max(20).optional(),
  nit: z.string().optional(),
});

// Address schemas
export const addressSchema = z.object({
  alias: z.string().min(1, 'El alias es requerido').max(50),
  line1: z.string().min(1, 'La dirección línea 1 es requerida').max(200),
  line2: z.string().max(200).optional(),
  municipio: z.string().min(1, 'El municipio es requerido').max(100),
  departamento: z.string().min(1, 'El departamento es requerido').max(100),
  codigoPostal: z.string().max(10).optional(),
  referencia: z.string().max(200).optional(),
});

// Order schemas
export const orderItemSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().positive().max(100),
});

export const guestCustomerSchema = z.object({
  name: z.string().min(2).max(200),
  email: z.string().email(),
  phone: z.string().min(8).max(20),
  billingNit: z.string().optional(),
  address: z.object({
    line1: z.string().min(1).max(200),
    line2: z.string().max(200).optional(),
    municipio: z.string().min(1).max(100),
    departamento: z.string().min(1).max(100),
    codigoPostal: z.string().max(10).optional(),
    referencia: z.string().max(200).optional(),
  }),
});

export const orderSchema = z.object({
  addressId: z.number().int().positive().optional(),
  customer: guestCustomerSchema.optional(),
  items: z.array(orderItemSchema).min(1, 'Debe incluir al menos un producto'),
  paymentMethod: z.string().min(1, 'El método de pago es requerido'),
  couponCode: z.string().optional(),
}).refine((data) => {
  // Si no hay addressId, debe haber customer (para invitados)
  return data.addressId || data.customer;
}, {
  message: 'Debe proporcionar addressId o información del cliente',
});

// Contact schema
export const contactSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(100),
  email: z.string().email('Email inválido'),
  message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres').max(1000),
});

// Coupon validation schema
export const couponValidationSchema = z.object({
  code: z.string().min(1, 'El código del cupón es requerido'),
  items: z.array(orderItemSchema).min(1, 'Debe incluir al menos un producto'),
});

// Cart price calculation schema
export const cartPriceSchema = z.object({
  items: z.array(orderItemSchema).min(1, 'Debe incluir al menos un producto'),
  couponCode: z.string().optional(),
});

// WhatsApp config schema
export const whatsappConfigSchema = z.object({
  enabled: z.boolean(),
  provider: z.enum(['mock', 'twilio', 'meta']),
  from: z.string().min(1),
  to: z.string().min(1),
  token: z.string().min(1),
  namespace: z.string().min(1),
});

// Pagination schema
export const paginationSchema = z.object({
  page: z.string().optional().transform((val) => val ? parseInt(val, 10) : 1),
  limit: z.string().optional().transform((val) => val ? parseInt(val, 10) : 12),
});

// Product filters schema
export const productFiltersSchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  subcategory: z.string().optional(),
  minPrice: z.string().optional().transform((val) => val ? parseFloat(val) : undefined),
  maxPrice: z.string().optional().transform((val) => val ? parseFloat(val) : undefined),
  isFeatured: z.string().optional().transform((val) => val === 'true'),
  sortBy: z.enum(['name', 'price', 'created', 'featured']).optional().default('created'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type RegisterData = z.infer<typeof registerSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type UpdateProfileData = z.infer<typeof updateProfileSchema>;
export type AddressData = z.infer<typeof addressSchema>;
export type OrderData = z.infer<typeof orderSchema>;
export type ContactData = z.infer<typeof contactSchema>;
export type CouponValidationData = z.infer<typeof couponValidationSchema>;
export type CartPriceData = z.infer<typeof cartPriceSchema>;
export type WhatsAppConfigData = z.infer<typeof whatsappConfigSchema>;
export type PaginationData = z.infer<typeof paginationSchema>;
export type ProductFiltersData = z.infer<typeof productFiltersSchema>;
