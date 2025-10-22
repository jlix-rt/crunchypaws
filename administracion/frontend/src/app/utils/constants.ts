export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile',
    CHANGE_PASSWORD: '/auth/change-password'
  },
  DASHBOARD: {
    STATS: '/dashboard/stats',
    CHARTS: '/dashboard/charts',
    RECENT_ACTIVITY: '/dashboard/recent-activity'
  },
  SUPPLIES: {
    LIST: '/supplies',
    CREATE: '/supplies',
    UPDATE: '/supplies',
    DELETE: '/supplies',
    DETAIL: '/supplies'
  },
  PRODUCTS: {
    LIST: '/products',
    CREATE: '/products',
    UPDATE: '/products',
    DELETE: '/products',
    DETAIL: '/products',
    RECIPE: '/products/recipe',
    CALCULATE_PRICE: '/products/calculate-price'
  },
  CATEGORIES: {
    LIST: '/categories',
    CREATE: '/categories',
    UPDATE: '/categories',
    DELETE: '/categories',
    DETAIL: '/categories'
  },
  PROMOTIONS: {
    LIST: '/promotions',
    CREATE: '/promotions',
    UPDATE: '/promotions',
    DELETE: '/promotions',
    DETAIL: '/promotions',
    ACTIVATE: '/promotions/activate',
    PAUSE: '/promotions/pause'
  },
  USERS: {
    LIST: '/users',
    CREATE: '/users',
    UPDATE: '/users',
    DELETE: '/users',
    DETAIL: '/users',
    ACTIVATE: '/users/activate',
    DEACTIVATE: '/users/deactivate'
  },
  REVIEWS: {
    LIST: '/reviews',
    DETAIL: '/reviews',
    APPROVE: '/reviews/approve',
    REJECT: '/reviews/reject',
    DELETE: '/reviews'
  },
  REPORTS: {
    EXPORT: '/reports/export',
    GENERATE: '/reports/generate',
    TEMPLATES: '/reports/templates'
  },
  ANALYTICS: {
    DASHBOARD: '/analytics/dashboard',
    SALES: '/analytics/sales',
    ORDERS: '/analytics/orders',
    CUSTOMERS: '/analytics/customers',
    PRODUCTS: '/analytics/products'
  },
  INTEGRATIONS: {
    LIST: '/integrations',
    CONFIGURE: '/integrations/configure',
    TEST: '/integrations/test',
    SYNC: '/integrations/sync'
  },
  BACKUP: {
    LIST: '/backups',
    CREATE: '/backups',
    DOWNLOAD: '/backups/download',
    DELETE: '/backups/delete',
    RESTORE: '/backups/restore'
  },
  AUDIT: {
    LOGS: '/audit/logs',
    EXPORT: '/audit/export',
    STATS: '/audit/stats'
  },
  NOTIFICATIONS: {
    LIST: '/notifications',
    MARK_READ: '/notifications/mark-read',
    SETTINGS: '/notifications/settings'
  },
  SECURITY: {
    EVENTS: '/security/events',
    LOGIN_ATTEMPTS: '/security/login-attempts',
    SETTINGS: '/security/settings',
    ALERTS: '/security/alerts'
  }
};

export const USER_ROLES = {
  ADMIN: 'ADMIN',
  EMPLOYEE: 'EMPLOYEE',
  CLIENT: 'CLIENT'
} as const;

export const PERMISSIONS = {
  // Dashboard
  DASHBOARD_VIEW: 'dashboard:view',
  DASHBOARD_EXPORT: 'dashboard:export',
  
  // Supplies
  SUPPLIES_VIEW: 'supplies:view',
  SUPPLIES_CREATE: 'supplies:create',
  SUPPLIES_UPDATE: 'supplies:update',
  SUPPLIES_DELETE: 'supplies:delete',
  
  // Products
  PRODUCTS_VIEW: 'products:view',
  PRODUCTS_CREATE: 'products:create',
  PRODUCTS_UPDATE: 'products:update',
  PRODUCTS_DELETE: 'products:delete',
  PRODUCTS_RECIPE: 'products:recipe',
  
  // Categories
  CATEGORIES_VIEW: 'categories:view',
  CATEGORIES_CREATE: 'categories:create',
  CATEGORIES_UPDATE: 'categories:update',
  CATEGORIES_DELETE: 'categories:delete',
  
  // Promotions
  PROMOTIONS_VIEW: 'promotions:view',
  PROMOTIONS_CREATE: 'promotions:create',
  PROMOTIONS_UPDATE: 'promotions:update',
  PROMOTIONS_DELETE: 'promotions:delete',
  PROMOTIONS_MANAGE: 'promotions:manage',
  
  // Users
  USERS_VIEW: 'users:view',
  USERS_CREATE: 'users:create',
  USERS_UPDATE: 'users:update',
  USERS_DELETE: 'users:delete',
  USERS_MANAGE: 'users:manage',
  
  // Reviews
  REVIEWS_VIEW: 'reviews:view',
  REVIEWS_MODERATE: 'reviews:moderate',
  REVIEWS_DELETE: 'reviews:delete',
  
  // Reports
  REPORTS_VIEW: 'reports:view',
  REPORTS_EXPORT: 'reports:export',
  REPORTS_CREATE: 'reports:create',
  
  // Analytics
  ANALYTICS_VIEW: 'analytics:view',
  ANALYTICS_EXPORT: 'analytics:export',
  
  // Integrations
  INTEGRATIONS_VIEW: 'integrations:view',
  INTEGRATIONS_MANAGE: 'integrations:manage',
  
  // Backup
  BACKUP_VIEW: 'backup:view',
  BACKUP_CREATE: 'backup:create',
  BACKUP_RESTORE: 'backup:restore',
  
  // Audit
  AUDIT_VIEW: 'audit:view',
  AUDIT_EXPORT: 'audit:export',
  
  // Security
  SECURITY_VIEW: 'security:view',
  SECURITY_MANAGE: 'security:manage',
  
  // Notifications
  NOTIFICATIONS_VIEW: 'notifications:view',
  NOTIFICATIONS_MANAGE: 'notifications:manage'
} as const;

export const FEATURES = {
  DASHBOARD: 'dashboard',
  SUPPLIES: 'supplies',
  PRODUCTS: 'products',
  CATEGORIES: 'categories',
  PROMOTIONS: 'promotions',
  USERS: 'users',
  REVIEWS: 'reviews',
  REPORTS: 'reports',
  ANALYTICS: 'analytics',
  INTEGRATIONS: 'integrations',
  BACKUP: 'backup',
  AUDIT: 'audit',
  SECURITY: 'security',
  NOTIFICATIONS: 'notifications'
} as const;

export const STATUS_TYPES = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  SUSPENDED: 'suspended'
} as const;

export const SEVERITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
} as const;

export const NOTIFICATION_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error'
} as const;

export const EXPORT_FORMATS = {
  CSV: 'csv',
  XLSX: 'xlsx',
  PDF: 'pdf',
  JSON: 'json'
} as const;

export const CHART_TYPES = {
  LINE: 'line',
  BAR: 'bar',
  PIE: 'pie',
  DOUGHNUT: 'doughnut',
  AREA: 'area',
  SCATTER: 'scatter'
} as const;

export const DATE_FORMATS = {
  SHORT: 'short',
  MEDIUM: 'medium',
  LONG: 'long',
  FULL: 'full',
  CUSTOM: 'custom'
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 25, 50, 100],
  MAX_PAGE_SIZE: 100
} as const;

export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[1-9]\d{1,14}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  NIT: /^\d{4}-\d{6}-\d{3}-\d{1}$/,
  CURRENCY: /^\d+(\.\d{1,2})?$/
} as const;

export const ERROR_MESSAGES = {
  REQUIRED: 'Este campo es requerido',
  EMAIL_INVALID: 'El email no es válido',
  PHONE_INVALID: 'El teléfono no es válido',
  PASSWORD_WEAK: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial',
  NIT_INVALID: 'El NIT no es válido',
  CURRENCY_INVALID: 'El valor monetario no es válido',
  MIN_LENGTH: 'Debe tener al menos {0} caracteres',
  MAX_LENGTH: 'No puede tener más de {0} caracteres',
  MIN_VALUE: 'Debe ser mayor o igual a {0}',
  MAX_VALUE: 'Debe ser menor o igual a {0}',
  PATTERN: 'El formato no es válido',
  UNIQUE: 'Este valor ya existe',
  DATE_RANGE: 'La fecha de inicio debe ser anterior a la fecha de fin',
  FILE_TYPE: 'Tipo de archivo no válido',
  FILE_SIZE: 'El archivo es demasiado grande'
} as const;

export const SUCCESS_MESSAGES = {
  CREATED: 'Registro creado exitosamente',
  UPDATED: 'Registro actualizado exitosamente',
  DELETED: 'Registro eliminado exitosamente',
  SAVED: 'Cambios guardados exitosamente',
  EXPORTED: 'Datos exportados exitosamente',
  IMPORTED: 'Datos importados exitosamente',
  BACKUP_CREATED: 'Respaldo creado exitosamente',
  BACKUP_RESTORED: 'Respaldo restaurado exitosamente',
  PASSWORD_CHANGED: 'Contraseña cambiada exitosamente',
  SETTINGS_SAVED: 'Configuración guardada exitosamente'
} as const;

export const CONFIRMATION_MESSAGES = {
  DELETE: '¿Está seguro de que desea eliminar este registro?',
  DELETE_MULTIPLE: '¿Está seguro de que desea eliminar los registros seleccionados?',
  RESET: '¿Está seguro de que desea restablecer los valores?',
  LOGOUT: '¿Está seguro de que desea cerrar sesión?',
  BACKUP: '¿Está seguro de que desea crear un respaldo?',
  RESTORE: '¿Está seguro de que desea restaurar desde el respaldo? Esta acción no se puede deshacer.',
  CLEAR_CACHE: '¿Está seguro de que desea limpiar la caché?',
  RESET_SETTINGS: '¿Está seguro de que desea restablecer la configuración a los valores predeterminados?'
} as const;

export const LOADING_MESSAGES = {
  LOADING: 'Cargando...',
  SAVING: 'Guardando...',
  DELETING: 'Eliminando...',
  EXPORTING: 'Exportando...',
  IMPORTING: 'Importando...',
  BACKING_UP: 'Creando respaldo...',
  RESTORING: 'Restaurando...',
  SYNCING: 'Sincronizando...',
  PROCESSING: 'Procesando...'
} as const;

export const EMPTY_STATES = {
  NO_DATA: 'No hay datos disponibles',
  NO_RESULTS: 'No se encontraron resultados',
  NO_PERMISSIONS: 'No tiene permisos para ver este contenido',
  FEATURE_DISABLED: 'Esta funcionalidad está deshabilitada',
  CONNECTION_ERROR: 'Error de conexión. Verifique su conexión a internet.',
  SERVER_ERROR: 'Error del servidor. Intente nuevamente más tarde.',
  UNAUTHORIZED: 'No tiene autorización para acceder a este recurso',
  NOT_FOUND: 'El recurso solicitado no existe'
} as const;

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  BLUE: 'blue',
  GREEN: 'green'
} as const;

export const LANGUAGES = {
  ES: 'es',
  EN: 'en'
} as const;

export const CURRENCIES = {
  GTQ: 'GTQ',
  USD: 'USD',
  EUR: 'EUR'
} as const;

export const TIMEZONES = {
  GUATEMALA: 'America/Guatemala',
  UTC: 'UTC'
} as const;

export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[1-9]\d{1,14}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  NIT: /^\d{4}-\d{6}-\d{3}-\d{1}$/,
  CURRENCY: /^\d+(\.\d{1,2})?$/,
  URL: /^https?:\/\/.+/,
  ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
  ALPHANUMERIC_SPACES: /^[a-zA-Z0-9\s]+$/,
  NUMBERS_ONLY: /^\d+$/,
  DECIMAL: /^\d+(\.\d{1,2})?$/
} as const;



