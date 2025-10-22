import { createReducer, on } from '@ngrx/store';
import { AppState, initialAppState } from './app.state';
import * as AppActions from './actions/app.actions';

export const appReducer = createReducer(
  initialAppState,

  // Auth actions
  on(AppActions.login, (state): AppState => ({
    ...state,
    auth: {
      ...state.auth,
      loading: true,
      error: null
    }
  })),

  on(AppActions.loginSuccess, (state, { user, token, refreshToken, permissions, features }): AppState => ({
    ...state,
    auth: {
      ...state.auth,
      isAuthenticated: true,
      user,
      token,
      refreshToken,
      permissions,
      features,
      loading: false,
      error: null
    }
  })),

  on(AppActions.loginFailure, (state, { error }): AppState => ({
    ...state,
    auth: {
      ...state.auth,
      isAuthenticated: false,
      user: null,
      token: null,
      refreshToken: null,
      permissions: [],
      features: [],
      loading: false,
      error
    }
  })),

  on(AppActions.logout, (state): AppState => ({
    ...state,
    auth: {
      ...state.auth,
      isAuthenticated: false,
      user: null,
      token: null,
      refreshToken: null,
      permissions: [],
      features: [],
      loading: false,
      error: null
    }
  })),

  on(AppActions.updateUser, (state, { user }): AppState => ({
    ...state,
    auth: {
      ...state.auth,
      user: { ...state.auth.user, ...user }
    }
  })),

  // Loading actions
  on(AppActions.showLoading, (state, { message, taskId }): AppState => ({
    ...state,
    loading: {
      ...state.loading,
      isLoading: true,
      loadingMessage: message || 'Cargando...',
      loadingTasks: taskId ? [...state.loading.loadingTasks, taskId] : state.loading.loadingTasks
    }
  })),

  on(AppActions.hideLoading, (state, { taskId }): AppState => ({
    ...state,
    loading: {
      ...state.loading,
      isLoading: state.loading.loadingTasks.length <= 1,
      loadingMessage: '',
      loadingTasks: taskId 
        ? state.loading.loadingTasks.filter(id => id !== taskId)
        : []
    }
  })),

  // Theme actions
  on(AppActions.toggleDarkMode, (state): AppState => ({
    ...state,
    theme: {
      ...state.theme,
      isDarkMode: !state.theme.isDarkMode
    }
  })),

  on(AppActions.setTheme, (state, { theme }): AppState => ({
    ...state,
    theme: {
      ...state.theme,
      ...theme
    }
  })),

  on(AppActions.setLanguage, (state, { language }): AppState => ({
    ...state,
    theme: {
      ...state.theme,
      language
    }
  })),

  // Notification actions
  on(AppActions.addNotification, (state, { notification }): AppState => ({
    ...state,
    notifications: {
      ...state.notifications,
      notifications: [...state.notifications.notifications, notification],
      unreadCount: state.notifications.unreadCount + 1
    }
  })),

  on(AppActions.removeNotification, (state, { id }): AppState => ({
    ...state,
    notifications: {
      ...state.notifications,
      notifications: state.notifications.notifications.filter(n => n.id !== id),
      unreadCount: Math.max(0, state.notifications.unreadCount - 1)
    }
  })),

  on(AppActions.markNotificationAsRead, (state, { id }): AppState => ({
    ...state,
    notifications: {
      ...state.notifications,
      notifications: state.notifications.notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
      ),
      unreadCount: Math.max(0, state.notifications.unreadCount - 1)
    }
  })),

  on(AppActions.clearNotifications, (state): AppState => ({
    ...state,
    notifications: {
      ...state.notifications,
      notifications: [],
      unreadCount: 0
    }
  })),

  on(AppActions.updateNotificationSettings, (state, { settings }): AppState => ({
    ...state,
    notifications: {
      ...state.notifications,
      settings: {
        ...state.notifications.settings,
        ...settings
      }
    }
  })),

  // Cache actions
  on(AppActions.setCacheData, (state, { key, data }): AppState => ({
    ...state,
    cache: {
      ...state.cache,
      data: {
        ...state.cache.data,
        [key]: data
      },
      timestamps: {
        ...state.cache.timestamps,
        [key]: Date.now()
      }
    }
  })),

  on(AppActions.clearCacheData, (state, { key }): AppState => {
    const newData = { ...state.cache.data };
    const newTimestamps = { ...state.cache.timestamps };
    
    if (key) {
      delete newData[key];
      delete newTimestamps[key];
    } else {
      // Clear all cache
      Object.keys(newData).forEach(k => delete newData[k]);
      Object.keys(newTimestamps).forEach(k => delete newTimestamps[k]);
    }

    return {
      ...state,
      cache: {
        ...state.cache,
        data: newData,
        timestamps: newTimestamps
      }
    };
  }),

  // Error actions
  on(AppActions.addError, (state, { error }): AppState => ({
    ...state,
    error: {
      ...state.error,
      errors: [...state.error.errors, error],
      lastError: error
    }
  })),

  on(AppActions.clearError, (state, { errorId }): AppState => ({
    ...state,
    error: {
      ...state.error,
      errors: errorId 
        ? state.error.errors.filter(e => e.id !== errorId)
        : [],
      lastError: null
    }
  })),

  on(AppActions.clearAllErrors, (state): AppState => ({
    ...state,
    error: {
      ...state.error,
      errors: [],
      lastError: null
    }
  }))
);



