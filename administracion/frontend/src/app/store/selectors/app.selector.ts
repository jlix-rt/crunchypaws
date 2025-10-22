import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from '../app.state';

export const selectAppState = createFeatureSelector<AppState>('app');

// Auth selectors
export const selectAuthState = createSelector(
  selectAppState,
  (state: AppState) => state.auth
);

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (auth) => auth.isAuthenticated
);

export const selectCurrentUser = createSelector(
  selectAuthState,
  (auth) => auth.user
);

export const selectUserToken = createSelector(
  selectAuthState,
  (auth) => auth.token
);

export const selectUserPermissions = createSelector(
  selectAuthState,
  (auth) => auth.permissions
);

export const selectUserFeatures = createSelector(
  selectAuthState,
  (auth) => auth.features
);

export const selectAuthLoading = createSelector(
  selectAuthState,
  (auth) => auth.loading
);

export const selectAuthError = createSelector(
  selectAuthState,
  (auth) => auth.error
);

export const selectUserRole = createSelector(
  selectCurrentUser,
  (user) => user?.role
);

export const selectIsAdmin = createSelector(
  selectUserRole,
  (role) => role === 'ADMIN'
);

export const selectIsEmployee = createSelector(
  selectUserRole,
  (role) => role === 'EMPLOYEE'
);

export const selectIsClient = createSelector(
  selectUserRole,
  (role) => role === 'CLIENT'
);

// Loading selectors
export const selectLoadingState = createSelector(
  selectAppState,
  (state: AppState) => state.loading
);

export const selectIsLoading = createSelector(
  selectLoadingState,
  (loading) => loading.isLoading
);

export const selectLoadingMessage = createSelector(
  selectLoadingState,
  (loading) => loading.loadingMessage
);

export const selectLoadingTasks = createSelector(
  selectLoadingState,
  (loading) => loading.loadingTasks
);

// Theme selectors
export const selectThemeState = createSelector(
  selectAppState,
  (state: AppState) => state.theme
);

export const selectIsDarkMode = createSelector(
  selectThemeState,
  (theme) => theme.isDarkMode
);

export const selectPrimaryColor = createSelector(
  selectThemeState,
  (theme) => theme.primaryColor
);

export const selectSecondaryColor = createSelector(
  selectThemeState,
  (theme) => theme.secondaryColor
);

export const selectFontSize = createSelector(
  selectThemeState,
  (theme) => theme.fontSize
);

export const selectLanguage = createSelector(
  selectThemeState,
  (theme) => theme.language
);

// Notification selectors
export const selectNotificationState = createSelector(
  selectAppState,
  (state: AppState) => state.notifications
);

export const selectNotifications = createSelector(
  selectNotificationState,
  (notifications) => notifications.notifications
);

export const selectUnreadCount = createSelector(
  selectNotificationState,
  (notifications) => notifications.unreadCount
);

export const selectNotificationSettings = createSelector(
  selectNotificationState,
  (notifications) => notifications.settings
);

export const selectUnreadNotifications = createSelector(
  selectNotifications,
  (notifications) => notifications.filter(n => !n.read)
);

export const selectRecentNotifications = createSelector(
  selectNotifications,
  (notifications) => notifications.slice(0, 5)
);

// Cache selectors
export const selectCacheState = createSelector(
  selectAppState,
  (state: AppState) => state.cache
);

export const selectCacheData = createSelector(
  selectCacheState,
  (cache) => cache.data
);

export const selectCacheTimestamps = createSelector(
  selectCacheState,
  (cache) => cache.timestamps
);

export const selectCacheMaxAge = createSelector(
  selectCacheState,
  (cache) => cache.maxAge
);

// Error selectors
export const selectErrorState = createSelector(
  selectAppState,
  (state: AppState) => state.error
);

export const selectErrors = createSelector(
  selectErrorState,
  (error) => error.errors
);

export const selectLastError = createSelector(
  selectErrorState,
  (error) => error.lastError
);

export const selectHasErrors = createSelector(
  selectErrors,
  (errors) => errors.length > 0
);

// Permission selectors
export const selectHasPermission = createSelector(
  selectUserPermissions,
  (permissions) => (permission: string) => permissions.includes(permission)
);

export const selectHasAnyPermission = createSelector(
  selectUserPermissions,
  (permissions) => (permissionList: string[]) => 
    permissionList.some(permission => permissions.includes(permission))
);

export const selectHasAllPermissions = createSelector(
  selectUserPermissions,
  (permissions) => (permissionList: string[]) => 
    permissionList.every(permission => permissions.includes(permission))
);

// Feature selectors
export const selectHasFeature = createSelector(
  selectUserFeatures,
  (features) => (feature: string) => features.includes(feature)
);

export const selectHasAnyFeature = createSelector(
  selectUserFeatures,
  (features) => (featureList: string[]) => 
    featureList.some(feature => features.includes(feature))
);

export const selectHasAllFeatures = createSelector(
  selectUserFeatures,
  (features) => (featureList: string[]) => 
    featureList.every(feature => features.includes(feature))
);

// Combined selectors
export const selectUserDisplayName = createSelector(
  selectCurrentUser,
  (user) => user ? `${user.firstName} ${user.lastName}` : ''
);

export const selectUserInitials = createSelector(
  selectCurrentUser,
  (user) => user ? `${user.firstName?.charAt(0)}${user.lastName?.charAt(0)}` : ''
);

export const selectIsLoggedIn = createSelector(
  selectIsAuthenticated,
  selectCurrentUser,
  (isAuthenticated, user) => isAuthenticated && !!user
);

export const selectCanAccessAdmin = createSelector(
  selectIsAuthenticated,
  selectIsAdmin,
  (isAuthenticated, isAdmin) => isAuthenticated && isAdmin
);

export const selectCanAccessEmployee = createSelector(
  selectIsAuthenticated,
  selectIsAdmin,
  selectIsEmployee,
  (isAuthenticated, isAdmin, isEmployee) => isAuthenticated && (isAdmin || isEmployee)
);

// Cache utility selectors
export const selectCachedData = createSelector(
  selectCacheData,
  selectCacheTimestamps,
  selectCacheMaxAge,
  (data, timestamps, maxAge) => (key: string) => {
    const item = data[key];
    const timestamp = timestamps[key];
    
    if (!item || !timestamp) {
      return null;
    }
    
    const age = Date.now() - timestamp;
    if (age > maxAge) {
      return null;
    }
    
    return item;
  }
);

export const selectIsDataCached = createSelector(
  selectCacheData,
  selectCacheTimestamps,
  selectCacheMaxAge,
  (data, timestamps, maxAge) => (key: string) => {
    const item = data[key];
    const timestamp = timestamps[key];
    
    if (!item || !timestamp) {
      return false;
    }
    
    const age = Date.now() - timestamp;
    return age <= maxAge;
  }
);

// Theme utility selectors
export const selectThemeColors = createSelector(
  selectPrimaryColor,
  selectSecondaryColor,
  (primary, secondary) => ({ primary, secondary })
);

export const selectThemeConfig = createSelector(
  selectIsDarkMode,
  selectPrimaryColor,
  selectSecondaryColor,
  selectFontSize,
  selectLanguage,
  (isDarkMode, primaryColor, secondaryColor, fontSize, language) => ({
    isDarkMode,
    primaryColor,
    secondaryColor,
    fontSize,
    language
  })
);

// Notification utility selectors
export const selectNotificationCount = createSelector(
  selectNotifications,
  (notifications) => notifications.length
);

export const selectNotificationsByType = createSelector(
  selectNotifications,
  (notifications) => (type: string) => notifications.filter(n => n.type === type)
);

export const selectUnreadNotificationsByType = createSelector(
  selectUnreadNotifications,
  (notifications) => (type: string) => notifications.filter(n => n.type === type)
);

// Error utility selectors
export const selectErrorsByType = createSelector(
  selectErrors,
  (errors) => (type: string) => errors.filter(e => e.type === type)
);

export const selectCriticalErrors = createSelector(
  selectErrors,
  (errors) => errors.filter(e => e.severity === 'critical')
);

export const selectWarningErrors = createSelector(
  selectErrors,
  (errors) => errors.filter(e => e.severity === 'warning')
);

// App state utility selectors
export const selectAppReady = createSelector(
  selectIsAuthenticated,
  selectAuthLoading,
  selectIsLoading,
  (isAuthenticated, authLoading, isLoading) => 
    !authLoading && !isLoading && (isAuthenticated || !isAuthenticated)
);

export const selectAppError = createSelector(
  selectAuthError,
  selectLastError,
  (authError, lastError) => authError || lastError
);



