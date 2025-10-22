import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

export interface AuditLog {
  id: number;
  userId: number;
  userEmail: string;
  action: string;
  entityType: string;
  entityId: number;
  oldValues?: any;
  newValues?: any;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
}

export interface AuditFilters {
  userId?: number;
  action?: string;
  entityType?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuditService {
  constructor(private http: HttpClient) {}

  private readonly API_URL = `${environment.apiUrl}`;

  getAuditLogs(filters: AuditFilters = {}): Observable<{logs: AuditLog[], pagination: any}> {
    let httpParams = new HttpParams();
    Object.keys(filters).forEach(key => {
      if (filters[key as keyof AuditFilters] !== null && filters[key as keyof AuditFilters] !== undefined) {
        httpParams = httpParams.set(key, filters[key as keyof AuditFilters]!.toString());
      }
    });

    return this.http.get<{logs: AuditLog[], pagination: any}>(`${this.API_URL}/audit`, { params: httpParams });
  }

  getAuditLogById(id: number): Observable<AuditLog> {
    return this.http.get<AuditLog>(`${this.API_URL}/audit/${id}`);
  }

  getAuditStats(): Observable<{
    totalActions: number;
    actionsByType: {[key: string]: number};
    actionsByUser: {[key: string]: number};
    actionsByEntity: {[key: string]: number};
  }> {
    return this.http.get<any>(`${this.API_URL}/audit/stats`);
  }

  exportAuditLogs(filters: AuditFilters = {}): Observable<Blob> {
    let httpParams = new HttpParams();
    Object.keys(filters).forEach(key => {
      if (filters[key as keyof AuditFilters] !== null && filters[key as keyof AuditFilters] !== undefined) {
        httpParams = httpParams.set(key, filters[key as keyof AuditFilters]!.toString());
      }
    });

    return this.http.get(`${this.API_URL}/audit/export`, { 
      params: httpParams,
      responseType: 'blob'
    });
  }

  getAuditChartData(period: string = 'day'): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/audit/chart`, {
      params: { period }
    });
  }
}



