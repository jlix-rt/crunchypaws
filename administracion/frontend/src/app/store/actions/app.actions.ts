import { createAction, props } from '@ngrx/store';
import { User } from '../../models/user.model';

// Auth Actions
export const login = createAction(
  '[Auth] Login',
  props<{ email: string; password: string; rememberMe?: boolean }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{
    user: User;
    token: string;
    refreshToken: string;
    permissions: string[];
    features: string[];
  }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

export const logout = createAction('[Auth] Logout');

export const refreshToken = createAction('[Auth] Refresh Token');

export const refreshTokenSuccess = createAction(
  '[Auth] Refresh Token Success',
  props<{ token: string; refreshToken: string }>()
);

export const refreshTokenFailure = createAction(
  '[Auth] Refresh Token Failure',
  props<{ error: string }>()
);

export const updateUser = createAction(
  '[Auth] Update User',
  props<{ user: Partial<User> }>()
);

export const checkAuthStatus = createAction('[Auth] Check Auth Status');

// Loading Actions
export const showLoading = createAction(
  '[Loading] Show Loading',
  props<{ message?: string; taskId?: string }>()
);

export const hideLoading = createAction(
  '[Loading] Hide Loading',
  props<{ taskId?: string }>()
);

// Theme Actions
export const toggleDarkMode = createAction('[Theme] Toggle Dark Mode');

export const setTheme = createAction(
  '[Theme] Set Theme',
  props<{ theme: Partial<{ isDarkMode: boolean; primaryColor: string; secondaryColor: string; fontSize: 'small' | 'medium' | 'large' }> }>()
);

export const setLanguage = createAction(
  '[Theme] Set Language',
  props<{ language: 'es' | 'en' }>()
);

// Notification Actions
export const addNotification = createAction(
  '[Notification] Add Notification',
  props<{ notification: any }>()
);

export const removeNotification = createAction(
  '[Notification] Remove Notification',
  props<{ id: string }>()
);

export const markNotificationAsRead = createAction(
  '[Notification] Mark As Read',
  props<{ id: string }>()
);

export const clearNotifications = createAction('[Notification] Clear Notifications');

export const updateNotificationSettings = createAction(
  '[Notification] Update Settings',
  props<{ settings: Partial<{ email: boolean; push: boolean; inApp: boolean; sound: boolean }> }>()
);

// Cache Actions
export const setCacheData = createAction(
  '[Cache] Set Data',
  props<{ key: string; data: any }>()
);

export const clearCacheData = createAction(
  '[Cache] Clear Data',
  props<{ key?: string }>()
);

// Error Actions
export const addError = createAction(
  '[Error] Add Error',
  props<{ error: any }>()
);

export const clearError = createAction(
  '[Error] Clear Error',
  props<{ errorId?: string }>()
);

export const clearAllErrors = createAction('[Error] Clear All Errors');

// Data Actions
export const loadSupplies = createAction(
  '[Data] Load Supplies',
  props<{ params?: any }>()
);

export const loadSuppliesSuccess = createAction(
  '[Data] Load Supplies Success',
  props<{ supplies: any[]; pagination: any }>()
);

export const loadSuppliesFailure = createAction(
  '[Data] Load Supplies Failure',
  props<{ error: string }>()
);

export const loadProducts = createAction(
  '[Data] Load Products',
  props<{ params?: any }>()
);

export const loadProductsSuccess = createAction(
  '[Data] Load Products Success',
  props<{ products: any[]; pagination: any }>()
);

export const loadProductsFailure = createAction(
  '[Data] Load Products Failure',
  props<{ error: string }>()
);

export const loadUsers = createAction(
  '[Data] Load Users',
  props<{ params?: any }>()
);

export const loadUsersSuccess = createAction(
  '[Data] Load Users Success',
  props<{ users: any[]; pagination: any }>()
);

export const loadUsersFailure = createAction(
  '[Data] Load Users Failure',
  props<{ error: string }>()
);

export const loadCategories = createAction(
  '[Data] Load Categories',
  props<{ params?: any }>()
);

export const loadCategoriesSuccess = createAction(
  '[Data] Load Categories Success',
  props<{ categories: any[]; pagination: any }>()
);

export const loadCategoriesFailure = createAction(
  '[Data] Load Categories Failure',
  props<{ error: string }>()
);

export const loadPromotions = createAction(
  '[Data] Load Promotions',
  props<{ params?: any }>()
);

export const loadPromotionsSuccess = createAction(
  '[Data] Load Promotions Success',
  props<{ promotions: any[]; pagination: any }>()
);

export const loadPromotionsFailure = createAction(
  '[Data] Load Promotions Failure',
  props<{ error: string }>()
);

export const loadReviews = createAction(
  '[Data] Load Reviews',
  props<{ params?: any }>()
);

export const loadReviewsSuccess = createAction(
  '[Data] Load Reviews Success',
  props<{ reviews: any[]; pagination: any }>()
);

export const loadReviewsFailure = createAction(
  '[Data] Load Reviews Failure',
  props<{ error: string }>()
);

// Dashboard Actions
export const loadDashboardStats = createAction('[Dashboard] Load Stats');

export const loadDashboardStatsSuccess = createAction(
  '[Dashboard] Load Stats Success',
  props<{ stats: any }>()
);

export const loadDashboardStatsFailure = createAction(
  '[Dashboard] Load Stats Failure',
  props<{ error: string }>()
);

export const loadDashboardCharts = createAction(
  '[Dashboard] Load Charts',
  props<{ period?: string }>()
);

export const loadDashboardChartsSuccess = createAction(
  '[Dashboard] Load Charts Success',
  props<{ charts: any }>()
);

export const loadDashboardChartsFailure = createAction(
  '[Dashboard] Load Charts Failure',
  props<{ error: string }>()
);

// CRUD Actions
export const createItem = createAction(
  '[CRUD] Create Item',
  props<{ type: string; data: any }>()
);

export const createItemSuccess = createAction(
  '[CRUD] Create Item Success',
  props<{ type: string; item: any }>()
);

export const createItemFailure = createAction(
  '[CRUD] Create Item Failure',
  props<{ type: string; error: string }>()
);

export const updateItem = createAction(
  '[CRUD] Update Item',
  props<{ type: string; id: string; data: any }>()
);

export const updateItemSuccess = createAction(
  '[CRUD] Update Item Success',
  props<{ type: string; item: any }>()
);

export const updateItemFailure = createAction(
  '[CRUD] Update Item Failure',
  props<{ type: string; error: string }>()
);

export const deleteItem = createAction(
  '[CRUD] Delete Item',
  props<{ type: string; id: string }>()
);

export const deleteItemSuccess = createAction(
  '[CRUD] Delete Item Success',
  props<{ type: string; id: string }>()
);

export const deleteItemFailure = createAction(
  '[CRUD] Delete Item Failure',
  props<{ type: string; error: string }>()
);

// Export/Import Actions
export const exportData = createAction(
  '[Export] Export Data',
  props<{ type: string; format: string; filters?: any }>()
);

export const exportDataSuccess = createAction(
  '[Export] Export Data Success',
  props<{ type: string; data: any }>()
);

export const exportDataFailure = createAction(
  '[Export] Export Data Failure',
  props<{ type: string; error: string }>()
);

export const importData = createAction(
  '[Import] Import Data',
  props<{ type: string; file: File }>()
);

export const importDataSuccess = createAction(
  '[Import] Import Data Success',
  props<{ type: string; result: any }>()
);

export const importDataFailure = createAction(
  '[Import] Import Data Failure',
  props<{ type: string; error: string }>()
);

// Backup Actions
export const createBackup = createAction('[Backup] Create Backup');

export const createBackupSuccess = createAction(
  '[Backup] Create Backup Success',
  props<{ backup: any }>()
);

export const createBackupFailure = createAction(
  '[Backup] Create Backup Failure',
  props<{ error: string }>()
);

export const restoreBackup = createAction(
  '[Backup] Restore Backup',
  props<{ backupId: string }>()
);

export const restoreBackupSuccess = createAction(
  '[Backup] Restore Backup Success',
  props<{ result: any }>()
);

export const restoreBackupFailure = createAction(
  '[Backup] Restore Backup Failure',
  props<{ error: string }>()
);

// Audit Actions
export const loadAuditLogs = createAction(
  '[Audit] Load Logs',
  props<{ params?: any }>()
);

export const loadAuditLogsSuccess = createAction(
  '[Audit] Load Logs Success',
  props<{ logs: any[]; pagination: any }>()
);

export const loadAuditLogsFailure = createAction(
  '[Audit] Load Logs Failure',
  props<{ error: string }>()
);

// Security Actions
export const loadSecurityEvents = createAction(
  '[Security] Load Events',
  props<{ params?: any }>()
);

export const loadSecurityEventsSuccess = createAction(
  '[Security] Load Events Success',
  props<{ events: any[]; pagination: any }>()
);

export const loadSecurityEventsFailure = createAction(
  '[Security] Load Events Failure',
  props<{ error: string }>()
);

// Analytics Actions
export const loadAnalytics = createAction(
  '[Analytics] Load Analytics',
  props<{ params?: any }>()
);

export const loadAnalyticsSuccess = createAction(
  '[Analytics] Load Analytics Success',
  props<{ analytics: any }>()
);

export const loadAnalyticsFailure = createAction(
  '[Analytics] Load Analytics Failure',
  props<{ error: string }>()
);



