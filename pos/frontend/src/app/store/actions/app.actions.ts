import { createAction, props } from '@ngrx/store';
import { PosSession, PosOrderItem } from '../app.state';

// Loading actions
export const setLoading = createAction(
  '[App] Set Loading',
  props<{ loading: boolean }>()
);

// Error actions
export const setError = createAction(
  '[App] Set Error',
  props<{ error: string }>()
);

export const clearError = createAction(
  '[App] Clear Error'
);

// Initial data loading
export const loadInitialData = createAction(
  '[App] Load Initial Data'
);

export const loadInitialDataSuccess = createAction(
  '[App] Load Initial Data Success'
);

export const loadInitialDataFailure = createAction(
  '[App] Load Initial Data Failure',
  props<{ error: string }>()
);

// POS Session actions
export const setCurrentSession = createAction(
  '[POS] Set Current Session',
  props<{ session: PosSession | null }>()
);

// Cart actions
export const addToCart = createAction(
  '[POS] Add To Cart',
  props<{ item: PosOrderItem }>()
);

export const removeFromCart = createAction(
  '[POS] Remove From Cart',
  props<{ index: number }>()
);

export const updateCartItem = createAction(
  '[POS] Update Cart Item',
  props<{ index: number; item: PosOrderItem }>()
);

export const clearCart = createAction(
  '[POS] Clear Cart'
);



