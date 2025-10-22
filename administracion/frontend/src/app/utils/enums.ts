export enum UserRole {
  ADMIN = 'ADMIN',
  EMPLOYEE = 'EMPLOYEE',
  CLIENT = 'CLIENT'
}

export enum Permission {
  // Dashboard
  DASHBOARD_VIEW = 'dashboard:view',
  DASHBOARD_EXPORT = 'dashboard:export',
  
  // Supplies
  SUPPLIES_VIEW = 'supplies:view',
  SUPPLIES_CREATE = 'supplies:create',
  SUPPLIES_UPDATE = 'supplies:update',
  SUPPLIES_DELETE = 'supplies:delete',
  
  // Products
  PRODUCTS_VIEW = 'products:view',
  PRODUCTS_CREATE = 'products:create',
  PRODUCTS_UPDATE = 'products:update',
  PRODUCTS_DELETE = 'products:delete',
  PRODUCTS_RECIPE = 'products:recipe',
  
  // Categories
  CATEGORIES_VIEW = 'categories:view',
  CATEGORIES_CREATE = 'categories:create',
  CATEGORIES_UPDATE = 'categories:update',
  CATEGORIES_DELETE = 'categories:delete',
  
  // Promotions
  PROMOTIONS_VIEW = 'promotions:view',
  PROMOTIONS_CREATE = 'promotions:create',
  PROMOTIONS_UPDATE = 'promotions:update',
  PROMOTIONS_DELETE = 'promotions:delete',
  PROMOTIONS_MANAGE = 'promotions:manage',
  
  // Users
  USERS_VIEW = 'users:view',
  USERS_CREATE = 'users:create',
  USERS_UPDATE = 'users:update',
  USERS_DELETE = 'users:delete',
  USERS_MANAGE = 'users:manage',
  
  // Reviews
  REVIEWS_VIEW = 'reviews:view',
  REVIEWS_MODERATE = 'reviews:moderate',
  REVIEWS_DELETE = 'reviews:delete',
  
  // Reports
  REPORTS_VIEW = 'reports:view',
  REPORTS_EXPORT = 'reports:export',
  REPORTS_CREATE = 'reports:create',
  
  // Analytics
  ANALYTICS_VIEW = 'analytics:view',
  ANALYTICS_EXPORT = 'analytics:export',
  
  // Integrations
  INTEGRATIONS_VIEW = 'integrations:view',
  INTEGRATIONS_MANAGE = 'integrations:manage',
  
  // Backup
  BACKUP_VIEW = 'backup:view',
  BACKUP_CREATE = 'backup:create',
  BACKUP_RESTORE = 'backup:restore',
  
  // Audit
  AUDIT_VIEW = 'audit:view',
  AUDIT_EXPORT = 'audit:export',
  
  // Security
  SECURITY_VIEW = 'security:view',
  SECURITY_MANAGE = 'security:manage',
  
  // Notifications
  NOTIFICATIONS_VIEW = 'notifications:view',
  NOTIFICATIONS_MANAGE = 'notifications:manage'
}

export enum Feature {
  DASHBOARD = 'dashboard',
  SUPPLIES = 'supplies',
  PRODUCTS = 'products',
  CATEGORIES = 'categories',
  PROMOTIONS = 'promotions',
  USERS = 'users',
  REVIEWS = 'reviews',
  REPORTS = 'reports',
  ANALYTICS = 'analytics',
  INTEGRATIONS = 'integrations',
  BACKUP = 'backup',
  AUDIT = 'audit',
  SECURITY = 'security',
  NOTIFICATIONS = 'notifications'
}

export enum StatusType {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  SUSPENDED = 'suspended',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered'
}

export enum SeverityLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum NotificationType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error'
}

export enum ExportFormat {
  CSV = 'csv',
  XLSX = 'xlsx',
  PDF = 'pdf',
  JSON = 'json'
}

export enum ChartType {
  LINE = 'line',
  BAR = 'bar',
  PIE = 'pie',
  DOUGHNUT = 'doughnut',
  AREA = 'area',
  SCATTER = 'scatter',
  RADAR = 'radar',
  POLAR = 'polar'
}

export enum DateFormat {
  SHORT = 'short',
  MEDIUM = 'medium',
  LONG = 'long',
  FULL = 'full',
  CUSTOM = 'custom'
}

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
  BLUE = 'blue',
  GREEN = 'green'
}

export enum Language {
  ES = 'es',
  EN = 'en'
}

export enum Currency {
  GTQ = 'GTQ',
  USD = 'USD',
  EUR = 'EUR'
}

export enum Timezone {
  GUATEMALA = 'America/Guatemala',
  UTC = 'UTC'
}

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
  HEAD = 'HEAD',
  OPTIONS = 'OPTIONS'
}

export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504
}

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc'
}

export enum FilterOperator {
  EQUALS = 'equals',
  NOT_EQUALS = 'not_equals',
  CONTAINS = 'contains',
  NOT_CONTAINS = 'not_contains',
  STARTS_WITH = 'starts_with',
  ENDS_WITH = 'ends_with',
  GREATER_THAN = 'greater_than',
  LESS_THAN = 'less_than',
  GREATER_THAN_OR_EQUAL = 'greater_than_or_equal',
  LESS_THAN_OR_EQUAL = 'less_than_or_equal',
  IN = 'in',
  NOT_IN = 'not_in',
  BETWEEN = 'between',
  IS_NULL = 'is_null',
  IS_NOT_NULL = 'is_not_null'
}

export enum DataType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  DATE = 'date',
  DATETIME = 'datetime',
  TIME = 'time',
  EMAIL = 'email',
  URL = 'url',
  PHONE = 'phone',
  CURRENCY = 'currency',
  PERCENTAGE = 'percentage',
  JSON = 'json'
}

export enum ValidationRule {
  REQUIRED = 'required',
  EMAIL = 'email',
  PHONE = 'phone',
  URL = 'url',
  MIN_LENGTH = 'min_length',
  MAX_LENGTH = 'max_length',
  MIN_VALUE = 'min_value',
  MAX_VALUE = 'max_value',
  PATTERN = 'pattern',
  UNIQUE = 'unique',
  DATE_RANGE = 'date_range',
  FILE_TYPE = 'file_type',
  FILE_SIZE = 'file_size'
}

export enum FileType {
  IMAGE = 'image',
  DOCUMENT = 'document',
  SPREADSHEET = 'spreadsheet',
  PRESENTATION = 'presentation',
  PDF = 'pdf',
  AUDIO = 'audio',
  VIDEO = 'video',
  ARCHIVE = 'archive',
  CODE = 'code',
  OTHER = 'other'
}

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal'
}

export enum AuditAction {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  LOGIN = 'login',
  LOGOUT = 'logout',
  EXPORT = 'export',
  IMPORT = 'import',
  BACKUP = 'backup',
  RESTORE = 'restore'
}

export enum IntegrationType {
  PAYMENT = 'payment',
  SHIPPING = 'shipping',
  INVENTORY = 'inventory',
  ACCOUNTING = 'accounting',
  MARKETING = 'marketing',
  ANALYTICS = 'analytics'
}

export enum BackupType {
  FULL = 'full',
  INCREMENTAL = 'incremental',
  DIFFERENTIAL = 'differential'
}

export enum ReportType {
  SALES = 'sales',
  INVENTORY = 'inventory',
  USERS = 'users',
  PRODUCTS = 'products',
  CUSTOM = 'custom'
}

export enum ChartPeriod {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  QUARTER = 'quarter',
  YEAR = 'year'
}

export enum NotificationChannel {
  EMAIL = 'email',
  SMS = 'sms',
  PUSH = 'push',
  IN_APP = 'in_app'
}

export enum SecurityEventType {
  LOGIN = 'login',
  LOGOUT = 'logout',
  FAILED_LOGIN = 'failed_login',
  PASSWORD_CHANGE = 'password_change',
  PERMISSION_DENIED = 'permission_denied',
  SUSPICIOUS_ACTIVITY = 'suspicious_activity'
}

export enum AccessibilityIssueType {
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info'
}

export enum AccessibilityIssueCategory {
  COLOR = 'color',
  CONTRAST = 'contrast',
  KEYBOARD = 'keyboard',
  SCREEN_READER = 'screen_reader',
  FOCUS = 'focus',
  SEMANTIC = 'semantic',
  ARIA = 'aria'
}

export enum PerformanceMetricCategory {
  NAVIGATION = 'navigation',
  RESOURCE = 'resource',
  PAINT = 'paint',
  LAYOUT = 'layout',
  SCRIPT = 'script',
  NETWORK = 'network'
}

export enum CacheStrategy {
  LRU = 'lru',
  FIFO = 'fifo',
  TTL = 'ttl'
}

export enum WebSocketMessageType {
  NOTIFICATION = 'notification',
  ORDER_UPDATE = 'order_update',
  INVENTORY_UPDATE = 'inventory_update',
  USER_ACTIVITY = 'user_activity',
  SYSTEM_ALERT = 'system_alert',
  PING = 'ping',
  PONG = 'pong'
}

export enum FormFieldType {
  TEXT = 'text',
  EMAIL = 'email',
  PASSWORD = 'password',
  NUMBER = 'number',
  TEL = 'tel',
  URL = 'url',
  DATE = 'date',
  TIME = 'time',
  DATETIME = 'datetime',
  TEXTAREA = 'textarea',
  SELECT = 'select',
  MULTISELECT = 'multiselect',
  CHECKBOX = 'checkbox',
  RADIO = 'radio',
  FILE = 'file',
  HIDDEN = 'hidden'
}

export enum ButtonType {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  SUCCESS = 'success',
  DANGER = 'danger',
  WARNING = 'warning',
  INFO = 'info',
  LIGHT = 'light',
  DARK = 'dark',
  LINK = 'link'
}

export enum ButtonSize {
  SMALL = 'sm',
  MEDIUM = 'md',
  LARGE = 'lg'
}

export enum ModalSize {
  SMALL = 'sm',
  MEDIUM = 'md',
  LARGE = 'lg',
  EXTRA_LARGE = 'xl'
}

export enum ToastPosition {
  TOP_LEFT = 'top-left',
  TOP_CENTER = 'top-center',
  TOP_RIGHT = 'top-right',
  BOTTOM_LEFT = 'bottom-left',
  BOTTOM_CENTER = 'bottom-center',
  BOTTOM_RIGHT = 'bottom-right'
}

export enum LoadingState {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error'
}

export enum TableAction {
  VIEW = 'view',
  EDIT = 'edit',
  DELETE = 'delete',
  DUPLICATE = 'duplicate',
  EXPORT = 'export',
  CUSTOM = 'custom'
}

export enum TableSelectionMode {
  SINGLE = 'single',
  MULTIPLE = 'multiple',
  NONE = 'none'
}

export enum TableSortMode {
  SINGLE = 'single',
  MULTIPLE = 'multiple'
}

export enum TableFilterMode {
  MENU = 'menu',
  ROW = 'row'
}

export enum PaginationMode {
  SIMPLE = 'simple',
  ADVANCED = 'advanced'
}

export enum SearchMode {
  SIMPLE = 'simple',
  ADVANCED = 'advanced',
  GLOBAL = 'global'
}

export enum ViewMode {
  GRID = 'grid',
  LIST = 'list',
  CARD = 'card',
  TABLE = 'table'
}

export enum LayoutMode {
  SIDEBAR = 'sidebar',
  TOPBAR = 'topbar',
  COMPACT = 'compact',
  FULLSCREEN = 'fullscreen'
}

export enum ResponsiveBreakpoint {
  XS = 'xs',
  SM = 'sm',
  MD = 'md',
  LG = 'lg',
  XL = 'xl',
  XXL = 'xxl'
}



