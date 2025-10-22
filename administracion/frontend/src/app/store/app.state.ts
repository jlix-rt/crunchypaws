import { User } from '../models/user.model';

export interface AppState {
  auth: AuthState;
  loading: LoadingState;
  theme: ThemeState;
  notifications: NotificationState;
  cache: CacheState;
  error: ErrorState;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  permissions: string[];
  features: string[];
  loading: boolean;
  error: string | null;
}

export interface LoadingState {
  isLoading: boolean;
  loadingMessage: string;
  loadingTasks: string[];
}

export interface ThemeState {
  isDarkMode: boolean;
  primaryColor: string;
  secondaryColor: string;
  fontSize: 'small' | 'medium' | 'large';
  language: 'es' | 'en';
}

export interface NotificationState {
  notifications: any[];
  unreadCount: number;
  settings: NotificationSettings;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  inApp: boolean;
  sound: boolean;
}

export interface CacheState {
  data: {[key: string]: any};
  timestamps: {[key: string]: number};
  maxAge: number;
}

export interface ErrorState {
  errors: any[];
  lastError: any | null;
}

export const initialAppState: AppState = {
  auth: {
    isAuthenticated: false,
    user: null,
    token: null,
    refreshToken: null,
    permissions: [],
    features: [],
    loading: false,
    error: null
  },
  loading: {
    isLoading: false,
    loadingMessage: '',
    loadingTasks: []
  },
  theme: {
    isDarkMode: false,
    primaryColor: '#3b82f6',
    secondaryColor: '#6b7280',
    fontSize: 'medium',
    language: 'es'
  },
  notifications: {
    notifications: [],
    unreadCount: 0,
    settings: {
      email: true,
      push: true,
      inApp: true,
      sound: true
    }
  },
  cache: {
    data: {},
    timestamps: {},
    maxAge: 300000 // 5 minutes
  },
  error: {
    errors: [],
    lastError: null
  }
};



