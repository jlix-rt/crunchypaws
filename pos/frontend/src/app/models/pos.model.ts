export interface PosSession {
  id: number;
  employee_id: number;
  opened_at: string;
  closed_at?: string;
  opening_amount: number;
  closing_amount: number;
  employee?: User;
  discrepancies?: PosDiscrepancy[];
}

export interface PosDiscrepancy {
  id: number;
  session_id: number;
  amount: number;
  reason: string;
  created_at: string;
}

export interface Employee {
  id: number;
  commission_percent: number;
  created_at: string;
  updated_at: string;
  user?: User;
}

export interface Branch {
  id: number;
  name: string;
  code: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PriceList {
  id: number;
  branch_id?: number;
  name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  branch?: Branch;
}

export interface ProductPrice {
  id: number;
  product_id: number;
  price_list_id: number;
  price: number;
  created_at: string;
  updated_at: string;
  product?: Product;
  priceList?: PriceList;
}

export interface Product {
  id: number;
  sku: string;
  name: string;
  slug: string;
  description?: string;
  category_id: number;
  is_active: boolean;
  stock: number;
  min_price: number;
  max_price: number;
  base_price: number;
  final_price: number;
  created_at: string;
  updated_at: string;
  category?: Category;
  images?: ProductImage[];
  variants?: ProductVariant[];
}

export interface Category {
  id: number;
  parent_id?: number;
  name: string;
  slug: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  parent?: Category;
  children?: Category[];
}

export interface ProductImage {
  id: number;
  product_id: number;
  url: string;
  alt?: string;
  sort_order: number;
  created_at: string;
}

export interface ProductVariant {
  id: number;
  product_id: number;
  name: string;
  extra_price: number;
  created_at: string;
}

export interface PosOrder {
  id: number;
  user_id?: number;
  phone: string;
  email: string;
  nit?: string;
  subtotal: number;
  discount_total: number;
  shipping_price: number;
  total: number;
  status: OrderStatus;
  source: OrderSource;
  created_at: string;
  updated_at: string;
  user?: User;
  items: PosOrderItem[];
  payments: PosPayment[];
}

export interface PosOrderItem {
  id: number;
  order_id: number;
  product_id: number;
  name: string;
  sku: string;
  qty: number;
  unit_price: number;
  discount_amount: number;
  final_line_total: number;
  created_at: string;
  product?: Product;
}

export interface PosPayment {
  id: number;
  order_id: number;
  method_id: number;
  amount: number;
  status: PaymentStatus;
  transaction_ref?: string;
  created_at: string;
  updated_at: string;
  method: PaymentMethod;
}

export interface PaymentMethod {
  id: number;
  name: string;
  type: PaymentMethodType;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export enum OrderStatus {
  CREATED = 'CREATED',
  PAID = 'PAID',
  PREPARING = 'PREPARING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  RETURNED = 'RETURNED'
}

export enum OrderSource {
  ECOMMERCE = 'ECOMMERCE',
  POS = 'POS'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

export enum PaymentMethodType {
  CARD = 'CARD',
  TRANSFER = 'TRANSFER',
  CASH = 'CASH',
  WALLET = 'WALLET',
  OTHERS = 'OTHERS'
}

export interface CreatePosOrderRequest {
  items: {
    product_id: number;
    quantity: number;
    unit_price: number;
    variant_id?: number;
  }[];
  customer_phone?: string;
  customer_email?: string;
  customer_nit?: string;
  payment_method_id: number;
  notes?: string;
  discount_amount?: number;
}

export interface PosReport {
  date: string;
  summary: {
    total_orders: number;
    total_sales: number;
    total_items: number;
    average_order_value: number;
  };
  top_products: Array<{
    product_name: string;
    product_sku: string;
    total_quantity: number;
    total_sales: number;
  }>;
  orders: PosOrder[];
}



