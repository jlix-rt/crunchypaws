import { AuthState } from '../models/user.model';
import { CartState } from '../models/cart.model';

export interface AppState {
  auth: AuthState;
  cart: CartState;
  loading: boolean;
  error: string | null;
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
  cart: {
    items: [],
    subtotal: 0,
    discount_total: 0,
    shipping_price: 0,
    total: 0,
    item_count: 0,
    isLoading: false,
    error: null
  },
  loading: false,
  error: null
};



