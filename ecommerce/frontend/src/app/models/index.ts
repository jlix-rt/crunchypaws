// API Response
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

// Pagination
export interface PaginationResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// User & Auth
export interface User {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  nit?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  nit?: string;
  password: string;
}

// Address
export interface Address {
  id: number;
  userId: number;
  alias: string;
  line1: string;
  line2?: string;
  municipio: string;
  departamento: string;
  codigoPostal?: string;
  referencia?: string;
  esPredeterminada: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AddressRequest {
  alias: string;
  line1: string;
  line2?: string;
  municipio: string;
  departamento: string;
  codigoPostal?: string;
  referencia?: string;
}

// Category
export interface Category {
  id: number;
  name: string;
  slug: string;
  parentId?: number;
  children: Category[];
  createdAt: string;
  updatedAt: string;
}

// Product
export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  imageUrl?: string;
  stock: number;
  isFeatured: boolean;
  categoryId: number;
  category: Category;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  subcategory?: string;
  minPrice?: number;
  maxPrice?: number;
  isFeatured?: boolean;
  sortBy?: 'name' | 'price' | 'created' | 'featured';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Cart
export interface CartItem {
  productId: number;
  quantity: number;
  product?: Product;
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

// Coupon
export interface Coupon {
  id: number;
  code: string;
  type: 'PERCENTAGE' | 'FIXED';
  value: number;
  minSubtotal?: number;
  expiresAt?: string;
  isActive: boolean;
}

export interface CouponValidation {
  valid: boolean;
  discount: number;
  newTotal: number;
  message: string;
  coupon?: {
    code: string;
    type: string;
    value: number;
  };
}

// Payment
export interface PaymentMethod {
  id: number;
  key: string;
  label: string;
  enabled: boolean;
  meta?: any;
}

// Order
export interface Order {
  id: number;
  userId?: number;
  customerName: string;
  email: string;
  phone: string;
  billingNit?: string;
  shipToLine1: string;
  shipToLine2?: string;
  shipToMunicipio: string;
  shipToDepartamento: string;
  shipToCodigoPostal?: string;
  shipToReferencia?: string;
  paymentMethod: string;
  status: 'PENDING' | 'PAID' | 'CANCELLED';
  subtotal: number;
  discount: number;
  total: number;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  nameSnapshot: string;
  priceSnapshot: number;
  quantity: number;
  product?: {
    id: number;
    name: string;
    imageUrl?: string;
  };
}

export interface OrderRequest {
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

// Contact
export interface ContactRequest {
  name: string;
  email: string;
  message: string;
}

// Feature flags
export interface FeatureFlags {
  infiniteScroll: boolean;
  showBadges: boolean;
  enableCoupons: boolean;
  enableWhatsApp: boolean;
  enableGuestCheckout: boolean;
}
