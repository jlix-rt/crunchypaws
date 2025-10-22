import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

import { environment } from '../../environments/environment';

export interface SecurityEvent {
  id: number;
  type: 'login' | 'logout' | 'failed_login' | 'password_change' | 'permission_denied' | 'suspicious_activity';
  userId?: number;
  userEmail?: string;
  ipAddress: string;
  userAgent: string;
  details: any;
  timestamp: string;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  sessionTimeout: number; // in minutes
  maxLoginAttempts: number;
  lockoutDuration: number; // in minutes
  passwordExpiry: number; // in days
  requireStrongPassword: boolean;
  allowedIpRanges: string[];
  blockedIpRanges: string[];
}

export interface LoginAttempt {
  id: number;
  email: string;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  private securityEventsSubject = new BehaviorSubject<SecurityEvent[]>([]);
  private loginAttemptsSubject = new BehaviorSubject<LoginAttempt[]>([]);

  constructor(private http: HttpClient) {}

  private readonly API_URL = `${environment.apiUrl}`;

  get securityEvents$(): Observable<SecurityEvent[]> {
    return this.securityEventsSubject.asObservable();
  }

  get loginAttempts$(): Observable<LoginAttempt[]> {
    return this.loginAttemptsSubject.asObservable();
  }

  // Security Events
  getSecurityEvents(params: any = {}): Observable<{events: SecurityEvent[], pagination: any}> {
    return this.http.get<{events: SecurityEvent[], pagination: any}>(`${this.API_URL}/security/events`, { params });
  }

  getSecurityEventById(id: number): Observable<SecurityEvent> {
    return this.http.get<SecurityEvent>(`${this.API_URL}/security/events/${id}`);
  }

  getSecurityStats(): Observable<{
    totalEvents: number;
    eventsByType: {[key: string]: number};
    eventsByUser: {[key: string]: number};
    recentEvents: SecurityEvent[];
  }> {
    return this.http.get<any>(`${this.API_URL}/security/stats`);
  }

  // Login Attempts
  getLoginAttempts(params: any = {}): Observable<{attempts: LoginAttempt[], pagination: any}> {
    return this.http.get<{attempts: LoginAttempt[], pagination: any}>(`${this.API_URL}/security/login-attempts`, { params });
  }

  getFailedLoginAttempts(params: any = {}): Observable<{attempts: LoginAttempt[], pagination: any}> {
    return this.http.get<{attempts: LoginAttempt[], pagination: any}>(`${this.API_URL}/security/failed-logins`, { params });
  }

  blockIpAddress(ipAddress: string, reason: string): Observable<{message: string}> {
    return this.http.post<{message: string}>(`${this.API_URL}/security/block-ip`, { ipAddress, reason });
  }

  unblockIpAddress(ipAddress: string): Observable<{message: string}> {
    return this.http.delete<{message: string}>(`${this.API_URL}/security/block-ip/${ipAddress}`);
  }

  getBlockedIpAddresses(): Observable<string[]> {
    return this.http.get<string[]>(`${this.API_URL}/security/blocked-ips`);
  }

  // Security Settings
  getSecuritySettings(): Observable<SecuritySettings> {
    return this.http.get<SecuritySettings>(`${this.API_URL}/security/settings`);
  }

  updateSecuritySettings(settings: Partial<SecuritySettings>): Observable<SecuritySettings> {
    return this.http.put<SecuritySettings>(`${this.API_URL}/security/settings`, settings);
  }

  // Two-Factor Authentication
  enableTwoFactor(): Observable<{qrCode: string, secret: string}> {
    return this.http.post<{qrCode: string, secret: string}>(`${this.API_URL}/security/2fa/enable`, {});
  }

  disableTwoFactor(): Observable<{message: string}> {
    return this.http.post<{message: string}>(`${this.API_URL}/security/2fa/disable`, {});
  }

  verifyTwoFactor(token: string): Observable<{message: string}> {
    return this.http.post<{message: string}>(`${this.API_URL}/security/2fa/verify`, { token });
  }

  // Password Security
  changePassword(currentPassword: string, newPassword: string): Observable<{message: string}> {
    return this.http.post<{message: string}>(`${this.API_URL}/security/change-password`, {
      currentPassword,
      newPassword
    });
  }

  resetPassword(email: string): Observable<{message: string}> {
    return this.http.post<{message: string}>(`${this.API_URL}/security/reset-password`, { email });
  }

  validatePasswordStrength(password: string): Observable<{
    score: number;
    feedback: string[];
    isStrong: boolean;
  }> {
    return this.http.post<any>(`${this.API_URL}/security/validate-password`, { password });
  }

  // Session Management
  getActiveSessions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/security/sessions`);
  }

  terminateSession(sessionId: string): Observable<{message: string}> {
    return this.http.delete<{message: string}>(`${this.API_URL}/security/sessions/${sessionId}`);
  }

  terminateAllSessions(): Observable<{message: string}> {
    return this.http.delete<{message: string}>(`${this.API_URL}/security/sessions/all`);
  }

  // Security Alerts
  getSecurityAlerts(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/security/alerts`);
  }

  markAlertAsRead(alertId: number): Observable<{message: string}> {
    return this.http.put<{message: string}>(`${this.API_URL}/security/alerts/${alertId}/read`, {});
  }

  // Audit Logs
  getAuditLogs(params: any = {}): Observable<{logs: any[], pagination: any}> {
    return this.http.get<{logs: any[], pagination: any}>(`${this.API_URL}/security/audit`, { params });
  }

  exportSecurityReport(format: 'csv' | 'xlsx' | 'pdf'): Observable<Blob> {
    return this.http.get(`${this.API_URL}/security/export`, {
      params: { format },
      responseType: 'blob'
    });
  }

  // Real-time Security Monitoring
  connectSecurityWebSocket(): void {
    // Implementation would depend on your WebSocket setup
    // This is a placeholder for real-time security monitoring
  }

  disconnectSecurityWebSocket(): void {
    // Implementation would depend on your WebSocket setup
  }

  // Utility Methods
  isIpBlocked(ipAddress: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.API_URL}/security/check-ip/${ipAddress}`);
  }

  getSecurityScore(): Observable<{
    score: number;
    maxScore: number;
    recommendations: string[];
  }> {
    return this.http.get<any>(`${this.API_URL}/security/score`);
  }
}



