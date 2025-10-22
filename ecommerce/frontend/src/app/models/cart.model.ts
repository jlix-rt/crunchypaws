export interface CartItem {
  id: string;
  product_id: number;
  product: Product;
  quantity: number;
  variant_id?: number;
  variant?: ProductVariant;
  unit_price: number;
  total_price: number;
  added_at: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  discount_total: number;
  shipping_price: number;
  total: number;
  item_count: number;
}

export interface AddToCartRequest {
  product_id: number;
  quantity: number;
  variant_id?: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  subtotal: number;
  discount_total: number;
  shipping_price: number;
  total: number;
  item_count: number;
  isLoading: boolean;
  error: string | null;
}

export interface Coupon {
  id: number;
  code: string;
  name: string;
  description?: string;
  type: 'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING';
  value: number;
  min_order_amount?: number;
  max_discount_amount?: number;
  usage_limit?: number;
  usage_count: number;
  starts_at: string;
  ends_at: string;
  is_active: boolean;
}

export interface ApplyCouponRequest {
  code: string;
}

export interface ApplyCouponResponse {
  success: boolean;
  message: string;
  coupon?: Coupon;
  discount_amount?: number;
}



