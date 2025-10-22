import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';

import { AppState } from './app.state';
import * as AppActions from './actions/app.actions';
import { ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';

@Injectable()
export class AppEffects {
  private actions$ = inject(Actions);
  private store = inject(Store<AppState>);
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  
  loadInitialData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.loadInitialData),
      switchMap(() =>
        this.productService.getCategories().pipe(
          map(() => AppActions.loadInitialDataSuccess()),
          catchError(error => of(AppActions.loadInitialDataFailure({ 
            error: error.message || 'Error loading initial data' 
          })))
        )
      )
    )
  );
}



