import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';

import { AppState } from '../app.state';
import * as AppActions from '../actions/app.actions';
import { selectUserToken, selectCurrentUser } from '../selectors/app.selector';

import { AuthService } from '../../services/auth.service';
import { AdminService } from '../../services/admin.service';
import { LoadingService } from '../../services/loading.service';
import { ToastService } from '../../services/toast.service';
import { ThemeService } from '../../services/theme.service';
import { NotificationService } from '../../services/notification.service';
import { CacheService } from '../../services/cache.service';
import { ErrorService } from '../../services/error.service';

@Injectable()
export class AppEffects {

  // Auth Effects
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.login),
      tap(() => this.loadingService.show('Iniciando sesión...')),
      switchMap(({ email, password, rememberMe }) =>
        this.authService.login(email, password, rememberMe).pipe(
          map((response) => AppActions.loginSuccess({
            user: response.user,
            token: response.token,
            refreshToken: response.refreshToken,
            permissions: response.permissions,
            features: response.features
          })),
          catchError((error) => of(AppActions.loginFailure({ error: error.message })))
        )
      )
    )
  );

  loginSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.loginSuccess),
      tap(({ user, token, refreshToken }) => {
        this.loadingService.hide();
        this.toastService.success('Éxito', 'Sesión iniciada correctamente');
        this.authService.setTokens(token, refreshToken);
        this.authService.setUser(user);
      })
    ), { dispatch: false }
  );

  loginFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.loginFailure),
      tap(({ error }) => {
        this.loadingService.hide();
        this.toastService.error('Error', error);
      })
    ), { dispatch: false }
  );

  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.logout),
      tap(() => {
        this.authService.logout();
        this.toastService.info('Información', 'Sesión cerrada correctamente');
      })
    ), { dispatch: false }
  );

  refreshToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.refreshToken),
      switchMap(() =>
        this.authService.refreshToken().pipe(
          map((response) => AppActions.refreshTokenSuccess({
            token: response.token,
            refreshToken: response.refreshToken
          })),
          catchError((error) => of(AppActions.refreshTokenFailure({ error: error.message })))
        )
      )
    )
  );

  refreshTokenSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.refreshTokenSuccess),
      tap(({ token, refreshToken }) => {
        this.authService.setTokens(token, refreshToken);
      })
    ), { dispatch: false }
  );

  refreshTokenFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.refreshTokenFailure),
      tap(() => {
        this.authService.logout();
        this.toastService.error('Error', 'Sesión expirada. Por favor, inicie sesión nuevamente.');
      })
    ), { dispatch: false }
  );

  // Theme Effects
  toggleDarkMode$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.toggleDarkMode),
      tap(() => {
        this.themeService.toggleDarkMode();
      })
    ), { dispatch: false }
  );

  setTheme$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.setTheme),
      tap(({ theme }) => {
        this.themeService.setTheme(theme);
      })
    ), { dispatch: false }
  );

  setLanguage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.setLanguage),
      tap(({ language }) => {
        this.themeService.setLanguage(language);
      })
    ), { dispatch: false }
  );

  // Notification Effects
  addNotification$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.addNotification),
      tap(({ notification }) => {
        this.notificationService.addNotification(notification);
      })
    ), { dispatch: false }
  );

  removeNotification$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.removeNotification),
      tap(({ id }) => {
        this.notificationService.removeNotification(id);
      })
    ), { dispatch: false }
  );

  markNotificationAsRead$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.markNotificationAsRead),
      tap(({ id }) => {
        this.notificationService.markAsRead(id);
      })
    ), { dispatch: false }
  );

  clearNotifications$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.clearNotifications),
      tap(() => {
        this.notificationService.clearNotifications();
      })
    ), { dispatch: false }
  );

  updateNotificationSettings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.updateNotificationSettings),
      tap(({ settings }) => {
        this.notificationService.updateSettings(settings);
      })
    ), { dispatch: false }
  );

  // Cache Effects
  setCacheData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.setCacheData),
      tap(({ key, data }) => {
        this.cacheService.set(key, data);
      })
    ), { dispatch: false }
  );

  clearCacheData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.clearCacheData),
      tap(({ key }) => {
        if (key) {
          this.cacheService.remove(key);
        } else {
          this.cacheService.clear();
        }
      })
    ), { dispatch: false }
  );

  // Error Effects
  addError$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.addError),
      tap(({ error }) => {
        this.errorService.logError(error);
      })
    ), { dispatch: false }
  );

  clearError$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.clearError),
      tap(({ errorId }) => {
        if (errorId) {
          this.errorService.clearError(errorId);
        } else {
          this.errorService.clearAllErrors();
        }
      })
    ), { dispatch: false }
  );

  clearAllErrors$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.clearAllErrors),
      tap(() => {
        this.errorService.clearAllErrors();
      })
    ), { dispatch: false }
  );

  // Data Effects
  loadSupplies$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.loadSupplies),
      switchMap(({ params }) =>
        this.adminService.getSupplies(params).pipe(
          map((response) => AppActions.loadSuppliesSuccess({
            supplies: response.supplies,
            pagination: response.pagination
          })),
          catchError((error) => of(AppActions.loadSuppliesFailure({ error: error.message })))
        )
      )
    )
  );

  loadSuppliesFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.loadSuppliesFailure),
      tap(({ error }) => {
        this.toastService.error('Error', 'No se pudieron cargar los insumos');
      })
    ), { dispatch: false }
  );

  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.loadProducts),
      switchMap(({ params }) =>
        this.adminService.getProducts(params).pipe(
          map((response) => AppActions.loadProductsSuccess({
            products: response.products,
            pagination: response.pagination
          })),
          catchError((error) => of(AppActions.loadProductsFailure({ error: error.message })))
        )
      )
    )
  );

  loadProductsFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.loadProductsFailure),
      tap(({ error }) => {
        this.toastService.error('Error', 'No se pudieron cargar los productos');
      })
    ), { dispatch: false }
  );

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.loadUsers),
      switchMap(({ params }) =>
        this.adminService.getUsers(params).pipe(
          map((response) => AppActions.loadUsersSuccess({
            users: response.users,
            pagination: response.pagination
          })),
          catchError((error) => of(AppActions.loadUsersFailure({ error: error.message })))
        )
      )
    )
  );

  loadUsersFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.loadUsersFailure),
      tap(({ error }) => {
        this.toastService.error('Error', 'No se pudieron cargar los usuarios');
      })
    ), { dispatch: false }
  );

  loadCategories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.loadCategories),
      switchMap(({ params }) =>
        this.adminService.getCategories(params).pipe(
          map((response) => AppActions.loadCategoriesSuccess({
            categories: response.categories,
            pagination: response.pagination
          })),
          catchError((error) => of(AppActions.loadCategoriesFailure({ error: error.message })))
        )
      )
    )
  );

  loadCategoriesFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.loadCategoriesFailure),
      tap(({ error }) => {
        this.toastService.error('Error', 'No se pudieron cargar las categorías');
      })
    ), { dispatch: false }
  );

  loadPromotions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.loadPromotions),
      switchMap(({ params }) =>
        this.adminService.getPromotions(params).pipe(
          map((response) => AppActions.loadPromotionsSuccess({
            promotions: response.promotions,
            pagination: response.pagination
          })),
          catchError((error) => of(AppActions.loadPromotionsFailure({ error: error.message })))
        )
      )
    )
  );

  loadPromotionsFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.loadPromotionsFailure),
      tap(({ error }) => {
        this.toastService.error('Error', 'No se pudieron cargar las promociones');
      })
    ), { dispatch: false }
  );

  loadReviews$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.loadReviews),
      switchMap(({ params }) =>
        this.adminService.getReviews(params).pipe(
          map((response) => AppActions.loadReviewsSuccess({
            reviews: response.reviews,
            pagination: response.pagination
          })),
          catchError((error) => of(AppActions.loadReviewsFailure({ error: error.message })))
        )
      )
    )
  );

  loadReviewsFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.loadReviewsFailure),
      tap(({ error }) => {
        this.toastService.error('Error', 'No se pudieron cargar las reseñas');
      })
    ), { dispatch: false }
  );

  // Dashboard Effects
  loadDashboardStats$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.loadDashboardStats),
      switchMap(() =>
        this.adminService.getDashboardStats().pipe(
          map((stats) => AppActions.loadDashboardStatsSuccess({ stats })),
          catchError((error) => of(AppActions.loadDashboardStatsFailure({ error: error.message })))
        )
      )
    )
  );

  loadDashboardStatsFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.loadDashboardStatsFailure),
      tap(({ error }) => {
        this.toastService.error('Error', 'No se pudieron cargar las estadísticas del dashboard');
      })
    ), { dispatch: false }
  );

  loadDashboardCharts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.loadDashboardCharts),
      switchMap(({ period }) =>
        this.adminService.getDashboardCharts(period).pipe(
          map((charts) => AppActions.loadDashboardChartsSuccess({ charts })),
          catchError((error) => of(AppActions.loadDashboardChartsFailure({ error: error.message })))
        )
      )
    )
  );

  loadDashboardChartsFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.loadDashboardChartsFailure),
      tap(({ error }) => {
        this.toastService.error('Error', 'No se pudieron cargar los gráficos del dashboard');
      })
    ), { dispatch: false }
  );

  // CRUD Effects
  createItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.createItem),
      switchMap(({ type, data }) =>
        this.adminService.createItem(type, data).pipe(
          map((item) => AppActions.createItemSuccess({ type, item })),
          catchError((error) => of(AppActions.createItemFailure({ type, error: error.message })))
        )
      )
    )
  );

  createItemSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.createItemSuccess),
      tap(({ type, item }) => {
        this.toastService.success('Éxito', `${type} creado correctamente`);
      })
    ), { dispatch: false }
  );

  createItemFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.createItemFailure),
      tap(({ type, error }) => {
        this.toastService.error('Error', `No se pudo crear el ${type}`);
      })
    ), { dispatch: false }
  );

  updateItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.updateItem),
      switchMap(({ type, id, data }) =>
        this.adminService.updateItem(type, id, data).pipe(
          map((item) => AppActions.updateItemSuccess({ type, item })),
          catchError((error) => of(AppActions.updateItemFailure({ type, error: error.message })))
        )
      )
    )
  );

  updateItemSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.updateItemSuccess),
      tap(({ type, item }) => {
        this.toastService.success('Éxito', `${type} actualizado correctamente`);
      })
    ), { dispatch: false }
  );

  updateItemFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.updateItemFailure),
      tap(({ type, error }) => {
        this.toastService.error('Error', `No se pudo actualizar el ${type}`);
      })
    ), { dispatch: false }
  );

  deleteItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.deleteItem),
      switchMap(({ type, id }) =>
        this.adminService.deleteItem(type, id).pipe(
          map(() => AppActions.deleteItemSuccess({ type, id })),
          catchError((error) => of(AppActions.deleteItemFailure({ type, error: error.message })))
        )
      )
    )
  );

  deleteItemSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.deleteItemSuccess),
      tap(({ type, id }) => {
        this.toastService.success('Éxito', `${type} eliminado correctamente`);
      })
    ), { dispatch: false }
  );

  deleteItemFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.deleteItemFailure),
      tap(({ type, error }) => {
        this.toastService.error('Error', `No se pudo eliminar el ${type}`);
      })
    ), { dispatch: false }
  );

  // Export/Import Effects
  exportData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.exportData),
      switchMap(({ type, format, filters }) =>
        this.adminService.exportData(type, format, filters).pipe(
          map((data) => AppActions.exportDataSuccess({ type, data })),
          catchError((error) => of(AppActions.exportDataFailure({ type, error: error.message })))
        )
      )
    )
  );

  exportDataSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.exportDataSuccess),
      tap(({ type, data }) => {
        this.toastService.success('Éxito', `${type} exportado correctamente`);
      })
    ), { dispatch: false }
  );

  exportDataFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.exportDataFailure),
      tap(({ type, error }) => {
        this.toastService.error('Error', `No se pudo exportar ${type}`);
      })
    ), { dispatch: false }
  );

  importData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.importData),
      switchMap(({ type, file }) =>
        this.adminService.importData(type, file).pipe(
          map((result) => AppActions.importDataSuccess({ type, result })),
          catchError((error) => of(AppActions.importDataFailure({ type, error: error.message })))
        )
      )
    )
  );

  importDataSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.importDataSuccess),
      tap(({ type, result }) => {
        this.toastService.success('Éxito', `${type} importado correctamente`);
      })
    ), { dispatch: false }
  );

  importDataFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.importDataFailure),
      tap(({ type, error }) => {
        this.toastService.error('Error', `No se pudo importar ${type}`);
      })
    ), { dispatch: false }
  );

  // Backup Effects
  createBackup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.createBackup),
      switchMap(() =>
        this.adminService.createBackup().pipe(
          map((backup) => AppActions.createBackupSuccess({ backup })),
          catchError((error) => of(AppActions.createBackupFailure({ error: error.message })))
        )
      )
    )
  );

  createBackupSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.createBackupSuccess),
      tap(({ backup }) => {
        this.toastService.success('Éxito', 'Respaldo creado correctamente');
      })
    ), { dispatch: false }
  );

  createBackupFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.createBackupFailure),
      tap(({ error }) => {
        this.toastService.error('Error', 'No se pudo crear el respaldo');
      })
    ), { dispatch: false }
  );

  restoreBackup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.restoreBackup),
      switchMap(({ backupId }) =>
        this.adminService.restoreBackup(backupId).pipe(
          map((result) => AppActions.restoreBackupSuccess({ result })),
          catchError((error) => of(AppActions.restoreBackupFailure({ error: error.message })))
        )
      )
    )
  );

  restoreBackupSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.restoreBackupSuccess),
      tap(({ result }) => {
        this.toastService.success('Éxito', 'Respaldo restaurado correctamente');
      })
    ), { dispatch: false }
  );

  restoreBackupFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.restoreBackupFailure),
      tap(({ error }) => {
        this.toastService.error('Error', 'No se pudo restaurar el respaldo');
      })
    ), { dispatch: false }
  );

  // Audit Effects
  loadAuditLogs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.loadAuditLogs),
      switchMap(({ params }) =>
        this.adminService.getAuditLogs(params).pipe(
          map((response) => AppActions.loadAuditLogsSuccess({
            logs: response.logs,
            pagination: response.pagination
          })),
          catchError((error) => of(AppActions.loadAuditLogsFailure({ error: error.message })))
        )
      )
    )
  );

  loadAuditLogsFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.loadAuditLogsFailure),
      tap(({ error }) => {
        this.toastService.error('Error', 'No se pudieron cargar los logs de auditoría');
      })
    ), { dispatch: false }
  );

  // Security Effects
  loadSecurityEvents$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.loadSecurityEvents),
      switchMap(({ params }) =>
        this.adminService.getSecurityEvents(params).pipe(
          map((response) => AppActions.loadSecurityEventsSuccess({
            events: response.events,
            pagination: response.pagination
          })),
          catchError((error) => of(AppActions.loadSecurityEventsFailure({ error: error.message })))
        )
      )
    )
  );

  loadSecurityEventsFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.loadSecurityEventsFailure),
      tap(({ error }) => {
        this.toastService.error('Error', 'No se pudieron cargar los eventos de seguridad');
      })
    ), { dispatch: false }
  );

  // Analytics Effects
  loadAnalytics$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.loadAnalytics),
      switchMap(({ params }) =>
        this.adminService.getAnalytics(params).pipe(
          map((analytics) => AppActions.loadAnalyticsSuccess({ analytics })),
          catchError((error) => of(AppActions.loadAnalyticsFailure({ error: error.message })))
        )
      )
    )
  );

  loadAnalyticsFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AppActions.loadAnalyticsFailure),
      tap(({ error }) => {
        this.toastService.error('Error', 'No se pudieron cargar las analíticas');
      })
    ), { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private authService: AuthService,
    private adminService: AdminService,
    private loadingService: LoadingService,
    private toastService: ToastService,
    private themeService: ThemeService,
    private notificationService: NotificationService,
    private cacheService: CacheService,
    private errorService: ErrorService
  ) {}
}



