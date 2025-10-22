import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

export interface LogEntry {
  id: string;
  level: 'debug' | 'info' | 'warn' | 'error' | 'fatal';
  message: string;
  context?: string;
  data?: any;
  timestamp: Date;
  userId?: number;
  sessionId?: string;
  userAgent?: string;
  url?: string;
  stack?: string;
}

export interface LogFilter {
  level?: string;
  context?: string;
  userId?: number;
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
  page?: number;
  limit?: number;
}

export interface LogStats {
  totalLogs: number;
  logsByLevel: {[key: string]: number};
  logsByContext: {[key: string]: number};
  logsByUser: {[key: string]: number};
  recentLogs: LogEntry[];
}

@Injectable({
  providedIn: 'root'
})
export class LoggingService {
  private logs: LogEntry[] = [];
  private maxLogs = 1000;

  constructor(private http: HttpClient) {}

  private readonly API_URL = `${environment.apiUrl}`;

  // Local logging methods
  debug(message: string, context?: string, data?: any): void {
    this.log('debug', message, context, data);
  }

  info(message: string, context?: string, data?: any): void {
    this.log('info', message, context, data);
  }

  warn(message: string, context?: string, data?: any): void {
    this.log('warn', message, context, data);
  }

  error(message: string, context?: string, data?: any, error?: Error): void {
    this.log('error', message, context, data, error);
  }

  fatal(message: string, context?: string, data?: any, error?: Error): void {
    this.log('fatal', message, context, data, error);
  }

  private log(
    level: LogEntry['level'],
    message: string,
    context?: string,
    data?: any,
    error?: Error
  ): void {
    const logEntry: LogEntry = {
      id: this.generateLogId(),
      level,
      message,
      context,
      data,
      timestamp: new Date(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      stack: error?.stack
    };

    // Add to local logs
    this.logs.unshift(logEntry);
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs);
    }

    // Console logging
    this.consoleLog(level, message, context, data, error);

    // Send to server for important logs
    if (level === 'error' || level === 'fatal') {
      this.sendLogToServer(logEntry).subscribe({
        next: () => console.log('Log sent to server successfully'),
        error: (err) => console.error('Failed to send log to server:', err)
      });
    }
  }

  private consoleLog(
    level: LogEntry['level'],
    message: string,
    context?: string,
    data?: any,
    error?: Error
  ): void {
    const timestamp = new Date().toISOString();
    const contextStr = context ? `[${context}]` : '';
    const logMessage = `${timestamp} ${level.toUpperCase()} ${contextStr} ${message}`;

    switch (level) {
      case 'debug':
        console.debug(logMessage, data);
        break;
      case 'info':
        console.info(logMessage, data);
        break;
      case 'warn':
        console.warn(logMessage, data);
        break;
      case 'error':
        console.error(logMessage, data, error);
        break;
      case 'fatal':
        console.error(logMessage, data, error);
        break;
    }
  }

  // Get local logs
  getLocalLogs(): LogEntry[] {
    return [...this.logs];
  }

  getLocalLogsByLevel(level: string): LogEntry[] {
    return this.logs.filter(log => log.level === level);
  }

  getLocalLogsByContext(context: string): LogEntry[] {
    return this.logs.filter(log => log.context === context);
  }

  clearLocalLogs(): void {
    this.logs = [];
  }

  // Server logging methods
  sendLogToServer(log: LogEntry): Observable<{message: string}> {
    return this.http.post<{message: string}>(`${this.API_URL}/logs`, log);
  }

  getServerLogs(filter: LogFilter = {}): Observable<{logs: LogEntry[], pagination: any}> {
    let params: any = {};
    if (filter.level) params.level = filter.level;
    if (filter.context) params.context = filter.context;
    if (filter.userId) params.userId = filter.userId;
    if (filter.dateFrom) params.dateFrom = filter.dateFrom.toISOString();
    if (filter.dateTo) params.dateTo = filter.dateTo.toISOString();
    if (filter.search) params.search = filter.search;
    if (filter.page) params.page = filter.page;
    if (filter.limit) params.limit = filter.limit;

    return this.http.get<{logs: LogEntry[], pagination: any}>(`${this.API_URL}/logs`, { params });
  }

  getLogById(id: string): Observable<LogEntry> {
    return this.http.get<LogEntry>(`${this.API_URL}/logs/${id}`);
  }

  deleteLog(id: string): Observable<{message: string}> {
    return this.http.delete<{message: string}>(`${this.API_URL}/logs/${id}`);
  }

  deleteLogs(filter: LogFilter): Observable<{message: string}> {
    return this.http.delete<{message: string}>(`${this.API_URL}/logs`, { params: filter });
  }

  // Log statistics
  getLogStats(): Observable<LogStats> {
    return this.http.get<LogStats>(`${this.API_URL}/logs/stats`);
  }

  getLocalLogStats(): LogStats {
    const logsByLevel: {[key: string]: number} = {};
    const logsByContext: {[key: string]: number} = {};
    const logsByUser: {[key: string]: number} = {};

    this.logs.forEach(log => {
      logsByLevel[log.level] = (logsByLevel[log.level] || 0) + 1;
      if (log.context) {
        logsByContext[log.context] = (logsByContext[log.context] || 0) + 1;
      }
      if (log.userId) {
        logsByUser[log.userId.toString()] = (logsByUser[log.userId.toString()] || 0) + 1;
      }
    });

    return {
      totalLogs: this.logs.length,
      logsByLevel,
      logsByContext,
      logsByUser,
      recentLogs: this.logs.slice(0, 10)
    };
  }

  // Log export
  exportLogs(filter: LogFilter = {}, format: 'csv' | 'xlsx' | 'json' = 'json'): Observable<Blob> {
    let params: any = { format };
    if (filter.level) params.level = filter.level;
    if (filter.context) params.context = filter.context;
    if (filter.userId) params.userId = filter.userId;
    if (filter.dateFrom) params.dateFrom = filter.dateFrom.toISOString();
    if (filter.dateTo) params.dateTo = filter.dateTo.toISOString();
    if (filter.search) params.search = filter.search;

    return this.http.get(`${this.API_URL}/logs/export`, { 
      params,
      responseType: 'blob'
    });
  }

  exportLocalLogs(format: 'csv' | 'xlsx' | 'json' = 'json'): Blob {
    const data = this.logs.map(log => ({
      id: log.id,
      level: log.level,
      message: log.message,
      context: log.context,
      data: JSON.stringify(log.data),
      timestamp: log.timestamp.toISOString(),
      userId: log.userId,
      sessionId: log.sessionId,
      userAgent: log.userAgent,
      url: log.url,
      stack: log.stack
    }));

    switch (format) {
      case 'json':
        return new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      case 'csv':
        const csv = this.convertToCSV(data);
        return new Blob([csv], { type: 'text/csv' });
      case 'xlsx':
        // Would need a library like xlsx for this
        return new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      default:
        return new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    }
  }

  // Log configuration
  setMaxLogs(maxLogs: number): void {
    this.maxLogs = maxLogs;
    if (this.logs.length > maxLogs) {
      this.logs = this.logs.slice(0, maxLogs);
    }
  }

  // Utility methods
  private generateLogId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private convertToCSV(data: any[]): string {
    if (data.length === 0) return '';

    const headers = Object.keys(data[0]);
    const csvHeaders = headers.join(',');
    
    const csvRows = data.map(row => 
      headers.map(header => {
        const value = row[header];
        if (value === null || value === undefined) return '';
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    );

    return [csvHeaders, ...csvRows].join('\n');
  }

  // Performance logging
  time(label: string): void {
    console.time(label);
  }

  timeEnd(label: string): void {
    console.timeEnd(label);
  }

  // Group logging
  group(label: string): void {
    console.group(label);
  }

  groupEnd(): void {
    console.groupEnd();
  }

  // Table logging
  table(data: any): void {
    console.table(data);
  }
}



