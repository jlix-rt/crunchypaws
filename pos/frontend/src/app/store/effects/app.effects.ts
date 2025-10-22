import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { AppState } from './app.state';
import * as AppActions from './actions/app.actions';
import { PosService } from '../services/pos.service';

@Injectable()
export class AppEffects {
  private actions$ = inject(Actions);
  private store = inject(Store<AppState>);
  private posService = inject(PosService);
  
  loadInitialData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.loadInitialData),
      switchMap(() =>
        this.posService.getCurrentSession().pipe(
          map(session => {
            this.store.dispatch(AppActions.setCurrentSession({ session }));
            return AppActions.loadInitialDataSuccess();
          }),
          catchError(error => of(AppActions.loadInitialDataFailure({ 
            error: error.message || 'Error loading initial data' 
          })))
        )
      )
    )
  );
}



