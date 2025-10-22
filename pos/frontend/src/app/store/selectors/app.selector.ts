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

export const selectPos = createSelector(
  selectAppState,
  (state: AppState) => state.pos
);

export const selectCurrentSession = createSelector(
  selectPos,
  (pos) => pos.currentSession
);

export const selectCart = createSelector(
  selectPos,
  (pos) => pos.cart
);

export const selectCartTotal = createSelector(
  selectCart,
  (cart) => cart.reduce((total, item) => total + item.total, 0)
);

export const selectCartItemCount = createSelector(
  selectCart,
  (cart) => cart.reduce((count, item) => count + item.quantity, 0)
);



