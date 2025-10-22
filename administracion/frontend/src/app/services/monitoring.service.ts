import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, interval } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { environment } from '../../environments/environment';

export interface SystemMetrics {
  cpu: {
    usage: number;
    cores: number;
    load: number[];
  };
  memory: {
    total: number;
    used: number;
    free: number;
    usage: number;
  };
  disk: {
    total: number;
    used: number;
    free: number;
    usage: number;
  };
  network: {
    bytesIn: number;
    bytesOut: number;
    packetsIn: number;
    packetsOut: number;
  };
  uptime: number;
  timestamp: Date;
}

export interface ApplicationMetrics {
  requests: {
    total: number;
    perSecond: number;
    averageResponseTime: number;
    errorRate: number;
  };
  users: {
    active: number;
    total: number;
    newToday: number;
  };
  database: {
    connections: number;
    queries: number;
    slowQueries: number;
    averageQueryTime: number;
  };
  cache: {
    hits: number;
    misses: number;
    hitRate: number;
    size: number;
  };
  timestamp: Date;
}

export interface HealthCheck {
  service: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  responseTime: number;
  lastCheck: Date;
  details?: any;
}

export interface Alert {
  id: string;
  type: 'warning' | 'error' | 'critical';
  title: string;
  message: string;
  service: string;
  metric: string;
  value: number;
  threshold: number;
  timestamp: Date;
  acknowledged: boolean;
  resolved: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class MonitoringService {
  private systemMetricsSubject = new BehaviorSubject<SystemMetrics | null>(null);
  private applicationMetricsSubject = new BehaviorSubject<ApplicationMetrics | null>(null);
  private healthChecksSubject = new BehaviorSubject<HealthCheck[]>([]);
  private alertsSubject = new BehaviorSubject<Alert[]>([]);

  private monitoringInterval: any;
  private isMonitoring = false;

  constructor(private http: HttpClient) {
    this.startMonitoring();
  }

  get systemMetrics$(): Observable<SystemMetrics | null> {
    return this.systemMetricsSubject.asObservable();
  }

  get applicationMetrics$(): Observable<ApplicationMetrics | null> {
    return this.applicationMetricsSubject.asObservable();
  }

  get healthChecks$(): Observable<HealthCheck[]> {
    return this.healthChecksSubject.asObservable();
  }

  get alerts$(): Observable<Alert[]> {
    return this.alertsSubject.asObservable();
  }

  private readonly API_URL = `${environment.apiUrl}`;

  // System Metrics
  getSystemMetrics(): Observable<SystemMetrics> {
    return this.http.get<SystemMetrics>(`${this.API_URL}/monitoring/system-metrics`);
  }

  getSystemMetricsHistory(period: string = '1h'): Observable<SystemMetrics[]> {
    return this.http.get<SystemMetrics[]>(`${this.API_URL}/monitoring/system-metrics/history`, {
      params: { period }
    });
  }

  // Application Metrics
  getApplicationMetrics(): Observable<ApplicationMetrics> {
    return this.http.get<ApplicationMetrics>(`${this.API_URL}/monitoring/application-metrics`);
  }

  getApplicationMetricsHistory(period: string = '1h'): Observable<ApplicationMetrics[]> {
    return this.http.get<ApplicationMetrics[]>(`${this.API_URL}/monitoring/application-metrics/history`, {
      params: { period }
    });
  }

  // Health Checks
  getHealthChecks(): Observable<HealthCheck[]> {
    return this.http.get<HealthCheck[]>(`${this.API_URL}/monitoring/health-checks`);
  }

  getHealthCheck(service: string): Observable<HealthCheck> {
    return this.http.get<HealthCheck>(`${this.API_URL}/monitoring/health-checks/${service}`);
  }

  runHealthCheck(service: string): Observable<HealthCheck> {
    return this.http.post<HealthCheck>(`${this.API_URL}/monitoring/health-checks/${service}/run`, {});
  }

  // Alerts
  getAlerts(): Observable<Alert[]> {
    return this.http.get<Alert[]>(`${this.API_URL}/monitoring/alerts`);
  }

  getAlertById(id: string): Observable<Alert> {
    return this.http.get<Alert>(`${this.API_URL}/monitoring/alerts/${id}`);
  }

  acknowledgeAlert(id: string): Observable<{message: string}> {
    return this.http.put<{message: string}>(`${this.API_URL}/monitoring/alerts/${id}/acknowledge`, {});
  }

  resolveAlert(id: string): Observable<{message: string}> {
    return this.http.put<{message: string}>(`${this.API_URL}/monitoring/alerts/${id}/resolve`, {});
  }

  createAlert(alert: Partial<Alert>): Observable<Alert> {
    return this.http.post<Alert>(`${this.API_URL}/monitoring/alerts`, alert);
  }

  updateAlert(id: string, alert: Partial<Alert>): Observable<Alert> {
    return this.http.put<Alert>(`${this.API_URL}/monitoring/alerts/${id}`, alert);
  }

  deleteAlert(id: string): Observable<{message: string}> {
    return this.http.delete<{message: string}>(`${this.API_URL}/monitoring/alerts/${id}`);
  }

  // Monitoring Configuration
  getMonitoringConfig(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/monitoring/config`);
  }

  updateMonitoringConfig(config: any): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/monitoring/config`, config);
  }

  // Monitoring Control
  startMonitoring(): void {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    this.monitoringInterval = setInterval(() => {
      this.refreshMetrics();
    }, 30000); // Refresh every 30 seconds

    // Initial refresh
    this.refreshMetrics();
  }

  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    this.isMonitoring = false;
  }

  private refreshMetrics(): void {
    // Refresh system metrics
    this.getSystemMetrics().subscribe({
      next: (metrics) => this.systemMetricsSubject.next(metrics),
      error: (error) => console.error('Error fetching system metrics:', error)
    });

    // Refresh application metrics
    this.getApplicationMetrics().subscribe({
      next: (metrics) => this.applicationMetricsSubject.next(metrics),
      error: (error) => console.error('Error fetching application metrics:', error)
    });

    // Refresh health checks
    this.getHealthChecks().subscribe({
      next: (healthChecks) => this.healthChecksSubject.next(healthChecks),
      error: (error) => console.error('Error fetching health checks:', error)
    });

    // Refresh alerts
    this.getAlerts().subscribe({
      next: (alerts) => this.alertsSubject.next(alerts),
      error: (error) => console.error('Error fetching alerts:', error)
    });
  }

  // Performance Monitoring
  getPerformanceMetrics(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/monitoring/performance`);
  }

  getPerformanceHistory(period: string = '1h'): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/monitoring/performance/history`, {
      params: { period }
    });
  }

  // Error Monitoring
  getErrorMetrics(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/monitoring/errors`);
  }

  getErrorHistory(period: string = '1h'): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/monitoring/errors/history`, {
      params: { period }
    });
  }

  // User Activity Monitoring
  getUserActivityMetrics(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/monitoring/user-activity`);
  }

  getUserActivityHistory(period: string = '1h'): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/monitoring/user-activity/history`, {
      params: { period }
    });
  }

  // Database Monitoring
  getDatabaseMetrics(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/monitoring/database`);
  }

  getDatabaseHistory(period: string = '1h'): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/monitoring/database/history`, {
      params: { period }
    });
  }

  // Cache Monitoring
  getCacheMetrics(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/monitoring/cache`);
  }

  getCacheHistory(period: string = '1h'): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/monitoring/cache/history`, {
      params: { period }
    });
  }

  // Monitoring Reports
  generateMonitoringReport(period: string = '24h'): Observable<Blob> {
    return this.http.get(`${this.API_URL}/monitoring/report`, {
      params: { period },
      responseType: 'blob'
    });
  }

  // Monitoring Dashboard
  getDashboardData(): Observable<{
    systemMetrics: SystemMetrics;
    applicationMetrics: ApplicationMetrics;
    healthChecks: HealthCheck[];
    alerts: Alert[];
    performance: any;
    errors: any;
  }> {
    return this.http.get<any>(`${this.API_URL}/monitoring/dashboard`);
  }

  // Real-time Monitoring
  connectRealTimeMonitoring(): void {
    // Implementation would depend on your WebSocket setup
    // This is a placeholder for real-time monitoring
  }

  disconnectRealTimeMonitoring(): void {
    // Implementation would depend on your WebSocket setup
  }

  // Utility Methods
  getMonitoringStatus(): boolean {
    return this.isMonitoring;
  }

  getLastUpdateTime(): Date | null {
    const systemMetrics = this.systemMetricsSubject.value;
    const applicationMetrics = this.applicationMetricsSubject.value;
    
    if (systemMetrics && applicationMetrics) {
      return systemMetrics.timestamp > applicationMetrics.timestamp 
        ? systemMetrics.timestamp 
        : applicationMetrics.timestamp;
    }
    
    return systemMetrics?.timestamp || applicationMetrics?.timestamp || null;
  }

  // Cleanup
  ngOnDestroy(): void {
    this.stopMonitoring();
  }
}



