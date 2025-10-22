export interface User {
  id: number;
  full_name: string;
  email: string;
  phone?: string;
  nit?: string;
  role: UserRole;
  is_active: boolean;
  referral_code?: string;
  created_at: string;
  updated_at: string;
}

export enum UserRole {
  CLIENT = 'CLIENT',
  EMPLOYEE = 'EMPLOYEE',
  ADMIN = 'ADMIN'
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RegisterRequest {
  full_name: string;
  email: string;
  password: string;
  phone?: string;
  nit?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}



