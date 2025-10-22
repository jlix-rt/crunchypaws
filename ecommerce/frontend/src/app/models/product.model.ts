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
  reviews?: Review[];
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
}

export interface ProductSearchParams {
  page?: number;
  limit?: number;
  search?: string;
  category_id?: number;
  min_price?: number;
  max_price?: number;
  sort_by?: 'name' | 'price' | 'created_at';
  sort_order?: 'asc' | 'desc';
  is_active?: boolean;
}

export interface ProductSearchResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}



