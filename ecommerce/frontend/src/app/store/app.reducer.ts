import { createReducer, on } from '@ngrx/store';
import { AppState, initialState } from './app.state';
import * as AppActions from './actions/app.actions';

export const appReducer = createReducer(
  initialState,
  
  // Loading actions
  on(AppActions.setLoading, (state, { loading }) => ({
    ...state,
    loading
  })),
  
  // Error actions
  on(AppActions.setError, (state, { error }) => ({
    ...state,
    error
  })),
  
  on(AppActions.clearError, (state) => ({
    ...state,
    error: null
  })),
  
  // Initial data loading
  on(AppActions.loadInitialData, (state) => ({
    ...state,
    loading: true
  })),
  
  on(AppActions.loadInitialDataSuccess, (state) => ({
    ...state,
    loading: false
  })),
  
  on(AppActions.loadInitialDataFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);



