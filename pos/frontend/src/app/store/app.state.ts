import { AuthState } from '../models/user.model';
import { PosSession, Product, PosOrder } from '../models/pos.model';

export interface AppState {
  auth: AuthState;
  pos: PosState;
  loading: boolean;
  error: string | null;
}

export interface PosState {
  currentSession: PosSession | null;
  products: Product[];
  cart: PosOrderItem[];
  orders: PosOrder[];
  isLoading: boolean;
  error: string | null;
}

export interface PosOrderItem {
  product: Product;
  quantity: number;
  unit_price: number;
  total: number;
  variant_id?: number;
}

export const initialState: AppState = {
  auth: {
    user: null,
    token: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: false,
    error: null
  },
  pos: {
    currentSession: null,
    products: [],
    cart: [],
    orders: [],
    isLoading: false,
    error: null
  },
  loading: false,
  error: null
};



