import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';

export interface ErrorInfo {
  id: string;
  message: string;
  code?: string;
  details?: any;
  stack?: string;
  timestamp: Date;
  userAgent?: string;
  url?: string;
  userId?: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'network' | 'validation' | 'authentication' | 'authorization' | 'business' | 'system';
  resolved: boolean;
}

export interface ErrorReport {
  totalErrors: number;
  errorsByCategory: {[key: string]: number};
  errorsBySeverity: {[key: string]: number};
  recentErrors: ErrorInfo[];
  topErrors: {message: string, count: number}[];
}

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  private errorsSubject = new BehaviorSubject<ErrorInfo[]>([]);
  private errorCountSubject = new BehaviorSubject<number>(0);

  get errors$(): Observable<ErrorInfo[]> {
    return this.errorsSubject.asObservable();
  }

  get errorCount$(): Observable<number> {
    return this.errorCountSubject.asObservable();
  }

  // Handle HTTP errors
  handleHttpError(error: HttpErrorResponse): Observable<never> {
    const errorInfo: ErrorInfo = {
      id: this.generateErrorId(),
      message: this.getHttpErrorMessage(error),
      code: error.status.toString(),
      details: {
        status: error.status,
        statusText: error.statusText,
        url: error.url,
        error: error.error
      },
      timestamp: new Date(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      severity: this.getHttpErrorSeverity(error.status),
      category: this.getHttpErrorCategory(error.status),
      resolved: false
    };

    this.addError(errorInfo);
    return throwError(() => error);
  }

  // Handle general errors
  handleError(error: any, context?: string): void {
    const errorInfo: ErrorInfo = {
      id: this.generateErrorId(),
      message: error.message || 'Unknown error occurred',
      code: error.code || 'UNKNOWN',
      details: {
        context,
        error: error,
        stack: error.stack
      },
      stack: error.stack,
      timestamp: new Date(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      severity: this.getErrorSeverity(error),
      category: this.getErrorCategory(error),
      resolved: false
    };

    this.addError(errorInfo);
  }

  // Handle validation errors
  handleValidationError(errors: any, context?: string): void {
    const errorInfo: ErrorInfo = {
      id: this.generateErrorId(),
      message: 'Validation error',
      code: 'VALIDATION_ERROR',
      details: {
        context,
        validationErrors: errors
      },
      timestamp: new Date(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      severity: 'medium',
      category: 'validation',
      resolved: false
    };

    this.addError(errorInfo);
  }

  // Handle authentication errors
  handleAuthError(error: any): void {
    const errorInfo: ErrorInfo = {
      id: this.generateErrorId(),
      message: 'Authentication error',
      code: 'AUTH_ERROR',
      details: {
        error: error
      },
      timestamp: new Date(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      severity: 'high',
      category: 'authentication',
      resolved: false
    };

    this.addError(errorInfo);
  }

  // Handle authorization errors
  handleAuthzError(error: any): void {
    const errorInfo: ErrorInfo = {
      id: this.generateErrorId(),
      message: 'Authorization error',
      code: 'AUTHZ_ERROR',
      details: {
        error: error
      },
      timestamp: new Date(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      severity: 'high',
      category: 'authorization',
      resolved: false
    };

    this.addError(errorInfo);
  }

  // Handle business logic errors
  handleBusinessError(message: string, details?: any): void {
    const errorInfo: ErrorInfo = {
      id: this.generateErrorId(),
      message,
      code: 'BUSINESS_ERROR',
      details,
      timestamp: new Date(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      severity: 'medium',
      category: 'business',
      resolved: false
    };

    this.addError(errorInfo);
  }

  // Handle system errors
  handleSystemError(error: any): void {
    const errorInfo: ErrorInfo = {
      id: this.generateErrorId(),
      message: 'System error occurred',
      code: 'SYSTEM_ERROR',
      details: {
        error: error
      },
      stack: error.stack,
      timestamp: new Date(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      severity: 'critical',
      category: 'system',
      resolved: false
    };

    this.addError(errorInfo);
  }

  // Add error to the list
  private addError(error: ErrorInfo): void {
    const currentErrors = this.errorsSubject.value;
    const updatedErrors = [error, ...currentErrors].slice(0, 100); // Keep only last 100 errors
    this.errorsSubject.next(updatedErrors);
    this.errorCountSubject.next(updatedErrors.length);
  }

  // Get all errors
  getErrors(): ErrorInfo[] {
    return this.errorsSubject.value;
  }

  // Get errors by category
  getErrorsByCategory(category: string): ErrorInfo[] {
    return this.errorsSubject.value.filter(error => error.category === category);
  }

  // Get errors by severity
  getErrorsBySeverity(severity: string): ErrorInfo[] {
    return this.errorsSubject.value.filter(error => error.severity === severity);
  }

  // Get unresolved errors
  getUnresolvedErrors(): ErrorInfo[] {
    return this.errorsSubject.value.filter(error => !error.resolved);
  }

  // Mark error as resolved
  resolveError(errorId: string): void {
    const currentErrors = this.errorsSubject.value;
    const updatedErrors = currentErrors.map(error => 
      error.id === errorId ? { ...error, resolved: true } : error
    );
    this.errorsSubject.next(updatedErrors);
  }

  // Clear resolved errors
  clearResolvedErrors(): void {
    const currentErrors = this.errorsSubject.value;
    const unresolvedErrors = currentErrors.filter(error => !error.resolved);
    this.errorsSubject.next(unresolvedErrors);
    this.errorCountSubject.next(unresolvedErrors.length);
  }

  // Clear all errors
  clearAllErrors(): void {
    this.errorsSubject.next([]);
    this.errorCountSubject.next(0);
  }

  // Get error report
  getErrorReport(): ErrorReport {
    const errors = this.errorsSubject.value;
    const errorsByCategory: {[key: string]: number} = {};
    const errorsBySeverity: {[key: string]: number} = {};
    const errorCounts: {[key: string]: number} = {};

    errors.forEach(error => {
      // Count by category
      errorsByCategory[error.category] = (errorsByCategory[error.category] || 0) + 1;
      
      // Count by severity
      errorsBySeverity[error.severity] = (errorsBySeverity[error.severity] || 0) + 1;
      
      // Count by message
      errorCounts[error.message] = (errorCounts[error.message] || 0) + 1;
    });

    const topErrors = Object.entries(errorCounts)
      .map(([message, count]) => ({ message, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalErrors: errors.length,
      errorsByCategory,
      errorsBySeverity,
      recentErrors: errors.slice(0, 10),
      topErrors
    };
  }

  // Private helper methods
  private generateErrorId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private getHttpErrorMessage(error: HttpErrorResponse): string {
    if (error.error && error.error.message) {
      return error.error.message;
    }
    
    switch (error.status) {
      case 400:
        return 'Bad Request';
      case 401:
        return 'Unauthorized';
      case 403:
        return 'Forbidden';
      case 404:
        return 'Not Found';
      case 500:
        return 'Internal Server Error';
      case 502:
        return 'Bad Gateway';
      case 503:
        return 'Service Unavailable';
      default:
        return `HTTP Error ${error.status}`;
    }
  }

  private getHttpErrorSeverity(status: number): 'low' | 'medium' | 'high' | 'critical' {
    if (status >= 500) return 'critical';
    if (status >= 400) return 'high';
    if (status >= 300) return 'medium';
    return 'low';
  }

  private getHttpErrorCategory(status: number): 'network' | 'validation' | 'authentication' | 'authorization' | 'business' | 'system' {
    if (status === 401) return 'authentication';
    if (status === 403) return 'authorization';
    if (status >= 400 && status < 500) return 'validation';
    if (status >= 500) return 'system';
    return 'network';
  }

  private getErrorSeverity(error: any): 'low' | 'medium' | 'high' | 'critical' {
    if (error.severity) return error.severity;
    if (error.name === 'TypeError') return 'medium';
    if (error.name === 'ReferenceError') return 'high';
    return 'medium';
  }

  private getErrorCategory(error: any): 'network' | 'validation' | 'authentication' | 'authorization' | 'business' | 'system' {
    if (error.category) return error.category;
    if (error.name === 'TypeError') return 'system';
    if (error.name === 'ReferenceError') return 'system';
    return 'system';
  }
}



