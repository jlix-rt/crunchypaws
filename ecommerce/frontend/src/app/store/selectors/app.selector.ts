import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from '../app.state';

export const selectAppState = createFeatureSelector<AppState>('app');

export const selectLoading = createSelector(
  selectAppState,
  (state: AppState) => state.loading
);

export const selectError = createSelector(
  selectAppState,
  (state: AppState) => state.error
);

export const selectAuth = createSelector(
  selectAppState,
  (state: AppState) => state.auth
);

export const selectUser = createSelector(
  selectAuth,
  (auth) => auth.user
);

export const selectIsAuthenticated = createSelector(
  selectAuth,
  (auth) => auth.isAuthenticated
);

export const selectCart = createSelector(
  selectAppState,
  (state: AppState) => state.cart
);

export const selectCartItems = createSelector(
  selectCart,
  (cart) => cart.items
);

export const selectCartItemCount = createSelector(
  selectCart,
  (cart) => cart.item_count
);

export const selectCartTotal = createSelector(
  selectCart,
  (cart) => cart.total
);



