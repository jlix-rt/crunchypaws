export interface Order {
  id: number;
  user_id?: number;
  phone: string;
  email: string;
  nit?: string;
  address_snapshot?: Address;
  subtotal: number;
  discount_total: number;
  shipping_price: number;
  total: number;
  status: OrderStatus;
  source: OrderSource;
  created_at: string;
  updated_at: string;
  user?: User;
  items: OrderItem[];
  payments: Payment[];
  status_history: OrderStatusHistory[];
  shipments: Shipment[];
}

export interface OrderItem {
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

export interface Address {
  id?: number;
  user_id?: number;
  label: string;
  is_default: boolean;
  department: string;
  municipality: string;
  zone?: string;
  colonia?: string;
  street: string;
  reference?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Payment {
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

export interface OrderStatusHistory {
  id: number;
  order_id: number;
  status: OrderStatus;
  note?: string;
  created_at: string;
}

export interface Shipment {
  id: number;
  order_id: number;
  carrier: string;
  tracking_code?: string;
  status: string;
  events?: any[];
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

export interface CreateOrderRequest {
  items: {
    product_id: number;
    quantity: number;
    variant_id?: number;
  }[];
  shipping_address: Address;
  payment_method_id: number;
  coupon_code?: string;
  notes?: string;
}

export interface CreateOrderResponse {
  order: Order;
  payment_url?: string;
}



