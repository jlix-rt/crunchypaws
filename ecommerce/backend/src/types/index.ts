import { Request } from 'express';
import { User } from '@prisma/client';

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  subcategory?: string;
  minPrice?: number;
  maxPrice?: number;
  isFeatured?: boolean;
}

export interface CartItem {
  productId: number;
  quantity: number;
}

export interface CartCalculation {
  items: Array<{
    productId: number;
    name: string;
    price: number;
    quantity: number;
    subtotal: number;
  }>;
  subtotal: number;
  discount: number;
  total: number;
  couponApplied?: string;
}

export interface OrderCreateData {
  userId?: number;
  addressId?: number;
  customer?: {
    name: string;
    email: string;
    phone: string;
    billingNit?: string;
    address: {
      line1: string;
      line2?: string;
      municipio: string;
      departamento: string;
      codigoPostal?: string;
      referencia?: string;
    };
  };
  items: CartItem[];
  paymentMethod: string;
  couponCode?: string;
}

export interface WhatsAppConfig {
  enabled: boolean;
  provider: 'mock' | 'twilio' | 'meta';
  from: string;
  to: string;
  token: string;
  namespace: string;
}

export interface NotificationMessage {
  orderId: number;
  customerName: string;
  customerPhone: string;
  total: number;
  paymentMethod: string;
  address: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}
