import { createAction, props } from '@ngrx/store';

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



