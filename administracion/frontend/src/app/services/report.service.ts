import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

export interface Report {
  id: string;
  name: string;
  type: 'sales' | 'inventory' | 'users' | 'products' | 'custom';
  description: string;
  parameters: any;
  schedule?: string;
  lastRun?: string;
  nextRun?: string;
  status: 'active' | 'inactive' | 'error';
}

export interface ReportData {
  columns: string[];
  rows: any[][];
  summary: any;
  metadata: {
    totalRows: number;
    generatedAt: string;
    parameters: any;
  };
}

export interface ReportTemplate {
  id: string;
  name: string;
  type: string;
  description: string;
  parameters: any;
  query: string;
  isPublic: boolean;
  createdBy: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  constructor(private http: HttpClient) {}

  private readonly API_URL = `${environment.apiUrl}`;

  // Report Management
  getReports(): Observable<Report[]> {
    return this.http.get<Report[]>(`${this.API_URL}/reports`);
  }

  getReportById(id: string): Observable<Report> {
    return this.http.get<Report>(`${this.API_URL}/reports/${id}`);
  }

  createReport(report: Partial<Report>): Observable<Report> {
    return this.http.post<Report>(`${this.API_URL}/reports`, report);
  }

  updateReport(id: string, report: Partial<Report>): Observable<Report> {
    return this.http.put<Report>(`${this.API_URL}/reports/${id}`, report);
  }

  deleteReport(id: string): Observable<{message: string}> {
    return this.http.delete<{message: string}>(`${this.API_URL}/reports/${id}`);
  }

  // Report Execution
  executeReport(id: string, parameters: any = {}): Observable<ReportData> {
    return this.http.post<ReportData>(`${this.API_URL}/reports/${id}/execute`, parameters);
  }

  executeReportNow(id: string, parameters: any = {}): Observable<Blob> {
    return this.http.post(`${this.API_URL}/reports/${id}/execute-now`, parameters, {
      responseType: 'blob'
    });
  }

  // Report Templates
  getReportTemplates(): Observable<ReportTemplate[]> {
    return this.http.get<ReportTemplate[]>(`${this.API_URL}/reports/templates`);
  }

  getReportTemplateById(id: string): Observable<ReportTemplate> {
    return this.http.get<ReportTemplate>(`${this.API_URL}/reports/templates/${id}`);
  }

  createReportTemplate(template: Partial<ReportTemplate>): Observable<ReportTemplate> {
    return this.http.post<ReportTemplate>(`${this.API_URL}/reports/templates`, template);
  }

  updateReportTemplate(id: string, template: Partial<ReportTemplate>): Observable<ReportTemplate> {
    return this.http.put<ReportTemplate>(`${this.API_URL}/reports/templates/${id}`, template);
  }

  deleteReportTemplate(id: string): Observable<{message: string}> {
    return this.http.delete<{message: string}>(`${this.API_URL}/reports/templates/${id}`);
  }

  // Sales Reports
  getSalesReport(params: any = {}): Observable<ReportData> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        httpParams = httpParams.set(key, params[key].toString());
      }
    });

    return this.http.get<ReportData>(`${this.API_URL}/reports/sales`, { params: httpParams });
  }

  getSalesByProduct(params: any = {}): Observable<ReportData> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        httpParams = httpParams.set(key, params[key].toString());
      }
    });

    return this.http.get<ReportData>(`${this.API_URL}/reports/sales/by-product`, { params: httpParams });
  }

  getSalesByCategory(params: any = {}): Observable<ReportData> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        httpParams = httpParams.set(key, params[key].toString());
      }
    });

    return this.http.get<ReportData>(`${this.API_URL}/reports/sales/by-category`, { params: httpParams });
  }

  getSalesByCustomer(params: any = {}): Observable<ReportData> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        httpParams = httpParams.set(key, params[key].toString());
      }
    });

    return this.http.get<ReportData>(`${this.API_URL}/reports/sales/by-customer`, { params: httpParams });
  }

  // Inventory Reports
  getInventoryReport(params: any = {}): Observable<ReportData> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        httpParams = httpParams.set(key, params[key].toString());
      }
    });

    return this.http.get<ReportData>(`${this.API_URL}/reports/inventory`, { params: httpParams });
  }

  getLowStockReport(params: any = {}): Observable<ReportData> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        httpParams = httpParams.set(key, params[key].toString());
      }
    });

    return this.http.get<ReportData>(`${this.API_URL}/reports/inventory/low-stock`, { params: httpParams });
  }

  getStockMovementReport(params: any = {}): Observable<ReportData> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        httpParams = httpParams.set(key, params[key].toString());
      }
    });

    return this.http.get<ReportData>(`${this.API_URL}/reports/inventory/movement`, { params: httpParams });
  }

  // User Reports
  getUserReport(params: any = {}): Observable<ReportData> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        httpParams = httpParams.set(key, params[key].toString());
      }
    });

    return this.http.get<ReportData>(`${this.API_URL}/reports/users`, { params: httpParams });
  }

  getUserActivityReport(params: any = {}): Observable<ReportData> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        httpParams = httpParams.set(key, params[key].toString());
      }
    });

    return this.http.get<ReportData>(`${this.API_URL}/reports/users/activity`, { params: httpParams });
  }

  // Product Reports
  getProductReport(params: any = {}): Observable<ReportData> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        httpParams = httpParams.set(key, params[key].toString());
      }
    });

    return this.http.get<ReportData>(`${this.API_URL}/reports/products`, { params: httpParams });
  }

  getProductPerformanceReport(params: any = {}): Observable<ReportData> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        httpParams = httpParams.set(key, params[key].toString());
      }
    });

    return this.http.get<ReportData>(`${this.API_URL}/reports/products/performance`, { params: httpParams });
  }

  // Custom Reports
  createCustomReport(query: string, parameters: any = {}): Observable<ReportData> {
    return this.http.post<ReportData>(`${this.API_URL}/reports/custom`, { query, parameters });
  }

  validateCustomQuery(query: string): Observable<{valid: boolean, message?: string}> {
    return this.http.post<{valid: boolean, message?: string}>(`${this.API_URL}/reports/custom/validate`, { query });
  }

  // Report Scheduling
  scheduleReport(id: string, schedule: string): Observable<{message: string}> {
    return this.http.post<{message: string}>(`${this.API_URL}/reports/${id}/schedule`, { schedule });
  }

  unscheduleReport(id: string): Observable<{message: string}> {
    return this.http.delete<{message: string}>(`${this.API_URL}/reports/${id}/schedule`);
  }

  getScheduledReports(): Observable<Report[]> {
    return this.http.get<Report[]>(`${this.API_URL}/reports/scheduled`);
  }

  // Report Export
  exportReport(id: string, format: 'csv' | 'xlsx' | 'pdf', parameters: any = {}): Observable<Blob> {
    return this.http.post(`${this.API_URL}/reports/${id}/export`, parameters, {
      params: { format },
      responseType: 'blob'
    });
  }

  exportReportData(data: ReportData, format: 'csv' | 'xlsx' | 'pdf', filename: string): Observable<Blob> {
    return this.http.post(`${this.API_URL}/reports/export-data`, { data, format, filename }, {
      responseType: 'blob'
    });
  }

  // Report History
  getReportHistory(id: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/reports/${id}/history`);
  }

  getReportHistoryById(historyId: string): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/reports/history/${historyId}`);
  }

  downloadReportHistory(historyId: string): Observable<Blob> {
    return this.http.get(`${this.API_URL}/reports/history/${historyId}/download`, {
      responseType: 'blob'
    });
  }

  // Report Analytics
  getReportAnalytics(): Observable<{
    totalReports: number;
    reportsByType: {[key: string]: number};
    mostUsedReports: any[];
    reportPerformance: any[];
  }> {
    return this.http.get<any>(`${this.API_URL}/reports/analytics`);
  }
}



