export interface Supply {
  id: number;
  name: string;
  unit: string;
  unit_cost: number;
  is_active: boolean;
  is_also_product: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductRecipe {
  id: number;
  product_id: number;
  supply_id: number;
  quantity: number;
  total_cost_cached: number;
  created_at: string;
  updated_at: string;
  supply?: Supply;
}

export interface PriceAddon {
  id: number;
  name: string;
  price: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductAddon {
  id: number;
  product_id: number;
  addon_id: number;
  created_at: string;
  addon?: PriceAddon;
}

export interface Promotion {
  id: number;
  name: string;
  description?: string;
  type: PromotionType;
  discount_value?: number;
  min_order_amount?: number;
  starts_at: string;
  ends_at: string;
  status: PromotionStatus;
  usage_count: number;
  usage_limit?: number;
  created_at: string;
  updated_at: string;
}

export enum PromotionType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED_AMOUNT = 'FIXED_AMOUNT',
  BUY_X_GET_Y = 'BUY_X_GET_Y',
  FREE_SHIPPING = 'FREE_SHIPPING'
}

export enum PromotionStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  EXPIRED = 'EXPIRED'
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
  recipes?: ProductRecipe[];
  addons?: ProductAddon[];
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
  products?: Product[];
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

export interface Review {
  id: number;
  product_id: number;
  user_id?: number;
  rating: number;
  title?: string;
  body?: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  user?: User;
  product?: Product;
}

export interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  pendingReviews: number;
  activePromotions: number;
  lowStockProducts: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string[];
    borderWidth?: number;
  }[];
}



