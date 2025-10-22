import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

export interface AnalyticsData {
  period: string;
  data: any[];
  summary: any;
  trends: any;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string[];
    borderWidth?: number;
  }[];
}

export interface KPI {
  name: string;
  value: number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  format: 'number' | 'currency' | 'percentage';
  icon?: string;
}

export interface AnalyticsFilters {
  dateFrom: string;
  dateTo: string;
  period: 'day' | 'week' | 'month' | 'quarter' | 'year';
  groupBy?: string;
  filters?: any;
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  constructor(private http: HttpClient) {}

  private readonly API_URL = `${environment.apiUrl}`;

  // Dashboard Analytics
  getDashboardAnalytics(filters: AnalyticsFilters): Observable<{
    kpis: KPI[];
    charts: {[key: string]: ChartData};
    summary: any;
  }> {
    let httpParams = new HttpParams();
    Object.keys(filters).forEach(key => {
      if (filters[key as keyof AnalyticsFilters] !== null && filters[key as keyof AnalyticsFilters] !== undefined) {
        httpParams = httpParams.set(key, filters[key as keyof AnalyticsFilters]!.toString());
      }
    });

    return this.http.get<any>(`${this.API_URL}/analytics/dashboard`, { params: httpParams });
  }

  // Sales Analytics
  getSalesAnalytics(filters: AnalyticsFilters): Observable<AnalyticsData> {
    let httpParams = new HttpParams();
    Object.keys(filters).forEach(key => {
      if (filters[key as keyof AnalyticsFilters] !== null && filters[key as keyof AnalyticsFilters] !== undefined) {
        httpParams = httpParams.set(key, filters[key as keyof AnalyticsFilters]!.toString());
      }
    });

    return this.http.get<AnalyticsData>(`${this.API_URL}/analytics/sales`, { params: httpParams });
  }

  getSalesByProduct(filters: AnalyticsFilters): Observable<ChartData> {
    let httpParams = new HttpParams();
    Object.keys(filters).forEach(key => {
      if (filters[key as keyof AnalyticsFilters] !== null && filters[key as keyof AnalyticsFilters] !== undefined) {
        httpParams = httpParams.set(key, filters[key as keyof AnalyticsFilters]!.toString());
      }
    });

    return this.http.get<ChartData>(`${this.API_URL}/analytics/sales/by-product`, { params: httpParams });
  }

  getSalesByCategory(filters: AnalyticsFilters): Observable<ChartData> {
    let httpParams = new HttpParams();
    Object.keys(filters).forEach(key => {
      if (filters[key as keyof AnalyticsFilters] !== null && filters[key as keyof AnalyticsFilters] !== undefined) {
        httpParams = httpParams.set(key, filters[key as keyof AnalyticsFilters]!.toString());
      }
    });

    return this.http.get<ChartData>(`${this.API_URL}/analytics/sales/by-category`, { params: httpParams });
  }

  getSalesByCustomer(filters: AnalyticsFilters): Observable<ChartData> {
    let httpParams = new HttpParams();
    Object.keys(filters).forEach(key => {
      if (filters[key as keyof AnalyticsFilters] !== null && filters[key as keyof AnalyticsFilters] !== undefined) {
        httpParams = httpParams.set(key, filters[key as keyof AnalyticsFilters]!.toString());
      }
    });

    return this.http.get<ChartData>(`${this.API_URL}/analytics/sales/by-customer`, { params: httpParams });
  }

  getSalesTrends(filters: AnalyticsFilters): Observable<ChartData> {
    let httpParams = new HttpParams();
    Object.keys(filters).forEach(key => {
      if (filters[key as keyof AnalyticsFilters] !== null && filters[key as keyof AnalyticsFilters] !== undefined) {
        httpParams = httpParams.set(key, filters[key as keyof AnalyticsFilters]!.toString());
      }
    });

    return this.http.get<ChartData>(`${this.API_URL}/analytics/sales/trends`, { params: httpParams });
  }

  // Order Analytics
  getOrderAnalytics(filters: AnalyticsFilters): Observable<AnalyticsData> {
    let httpParams = new HttpParams();
    Object.keys(filters).forEach(key => {
      if (filters[key as keyof AnalyticsFilters] !== null && filters[key as keyof AnalyticsFilters] !== undefined) {
        httpParams = httpParams.set(key, filters[key as keyof AnalyticsFilters]!.toString());
      }
    });

    return this.http.get<AnalyticsData>(`${this.API_URL}/analytics/orders`, { params: httpParams });
  }

  getOrderStatusDistribution(filters: AnalyticsFilters): Observable<ChartData> {
    let httpParams = new HttpParams();
    Object.keys(filters).forEach(key => {
      if (filters[key as keyof AnalyticsFilters] !== null && filters[key as keyof AnalyticsFilters] !== undefined) {
        httpParams = httpParams.set(key, filters[key as keyof AnalyticsFilters]!.toString());
      }
    });

    return this.http.get<ChartData>(`${this.API_URL}/analytics/orders/status-distribution`, { params: httpParams });
  }

  getOrderFulfillmentTime(filters: AnalyticsFilters): Observable<ChartData> {
    let httpParams = new HttpParams();
    Object.keys(filters).forEach(key => {
      if (filters[key as keyof AnalyticsFilters] !== null && filters[key as keyof AnalyticsFilters] !== undefined) {
        httpParams = httpParams.set(key, filters[key as keyof AnalyticsFilters]!.toString());
      }
    });

    return this.http.get<ChartData>(`${this.API_URL}/analytics/orders/fulfillment-time`, { params: httpParams });
  }

  // Customer Analytics
  getCustomerAnalytics(filters: AnalyticsFilters): Observable<AnalyticsData> {
    let httpParams = new HttpParams();
    Object.keys(filters).forEach(key => {
      if (filters[key as keyof AnalyticsFilters] !== null && filters[key as keyof AnalyticsFilters] !== undefined) {
        httpParams = httpParams.set(key, filters[key as keyof AnalyticsFilters]!.toString());
      }
    });

    return this.http.get<AnalyticsData>(`${this.API_URL}/analytics/customers`, { params: httpParams });
  }

  getCustomerSegmentation(filters: AnalyticsFilters): Observable<ChartData> {
    let httpParams = new HttpParams();
    Object.keys(filters).forEach(key => {
      if (filters[key as keyof AnalyticsFilters] !== null && filters[key as keyof AnalyticsFilters] !== undefined) {
        httpParams = httpParams.set(key, filters[key as keyof AnalyticsFilters]!.toString());
      }
    });

    return this.http.get<ChartData>(`${this.API_URL}/analytics/customers/segmentation`, { params: httpParams });
  }

  getCustomerLifetimeValue(filters: AnalyticsFilters): Observable<ChartData> {
    let httpParams = new HttpParams();
    Object.keys(filters).forEach(key => {
      if (filters[key as keyof AnalyticsFilters] !== null && filters[key as keyof AnalyticsFilters] !== undefined) {
        httpParams = httpParams.set(key, filters[key as keyof AnalyticsFilters]!.toString());
      }
    });

    return this.http.get<ChartData>(`${this.API_URL}/analytics/customers/lifetime-value`, { params: httpParams });
  }

  getCustomerRetention(filters: AnalyticsFilters): Observable<ChartData> {
    let httpParams = new HttpParams();
    Object.keys(filters).forEach(key => {
      if (filters[key as keyof AnalyticsFilters] !== null && filters[key as keyof AnalyticsFilters] !== undefined) {
        httpParams = httpParams.set(key, filters[key as keyof AnalyticsFilters]!.toString());
      }
    });

    return this.http.get<ChartData>(`${this.API_URL}/analytics/customers/retention`, { params: httpParams });
  }

  // Product Analytics
  getProductAnalytics(filters: AnalyticsFilters): Observable<AnalyticsData> {
    let httpParams = new HttpParams();
    Object.keys(filters).forEach(key => {
      if (filters[key as keyof AnalyticsFilters] !== null && filters[key as keyof AnalyticsFilters] !== undefined) {
        httpParams = httpParams.set(key, filters[key as keyof AnalyticsFilters]!.toString());
      }
    });

    return this.http.get<AnalyticsData>(`${this.API_URL}/analytics/products`, { params: httpParams });
  }

  getProductPerformance(filters: AnalyticsFilters): Observable<ChartData> {
    let httpParams = new HttpParams();
    Object.keys(filters).forEach(key => {
      if (filters[key as keyof AnalyticsFilters] !== null && filters[key as keyof AnalyticsFilters] !== undefined) {
        httpParams = httpParams.set(key, filters[key as keyof AnalyticsFilters]!.toString());
      }
    });

    return this.http.get<ChartData>(`${this.API_URL}/analytics/products/performance`, { params: httpParams });
  }

  getProductInventory(filters: AnalyticsFilters): Observable<ChartData> {
    let httpParams = new HttpParams();
    Object.keys(filters).forEach(key => {
      if (filters[key as keyof AnalyticsFilters] !== null && filters[key as keyof AnalyticsFilters] !== undefined) {
        httpParams = httpParams.set(key, filters[key as keyof AnalyticsFilters]!.toString());
      }
    });

    return this.http.get<ChartData>(`${this.API_URL}/analytics/products/inventory`, { params: httpParams });
  }

  // Marketing Analytics
  getMarketingAnalytics(filters: AnalyticsFilters): Observable<AnalyticsData> {
    let httpParams = new HttpParams();
    Object.keys(filters).forEach(key => {
      if (filters[key as keyof AnalyticsFilters] !== null && filters[key as keyof AnalyticsFilters] !== undefined) {
        httpParams = httpParams.set(key, filters[key as keyof AnalyticsFilters]!.toString());
      }
    });

    return this.http.get<AnalyticsData>(`${this.API_URL}/analytics/marketing`, { params: httpParams });
  }

  getPromotionPerformance(filters: AnalyticsFilters): Observable<ChartData> {
    let httpParams = new HttpParams();
    Object.keys(filters).forEach(key => {
      if (filters[key as keyof AnalyticsFilters] !== null && filters[key as keyof AnalyticsFilters] !== undefined) {
        httpParams = httpParams.set(key, filters[key as keyof AnalyticsFilters]!.toString());
      }
    });

    return this.http.get<ChartData>(`${this.API_URL}/analytics/marketing/promotions`, { params: httpParams });
  }

  getReferralAnalytics(filters: AnalyticsFilters): Observable<ChartData> {
    let httpParams = new HttpParams();
    Object.keys(filters).forEach(key => {
      if (filters[key as keyof AnalyticsFilters] !== null && filters[key as keyof AnalyticsFilters] !== undefined) {
        httpParams = httpParams.set(key, filters[key as keyof AnalyticsFilters]!.toString());
      }
    });

    return this.http.get<ChartData>(`${this.API_URL}/analytics/marketing/referrals`, { params: httpParams });
  }

  // Financial Analytics
  getFinancialAnalytics(filters: AnalyticsFilters): Observable<AnalyticsData> {
    let httpParams = new HttpParams();
    Object.keys(filters).forEach(key => {
      if (filters[key as keyof AnalyticsFilters] !== null && filters[key as keyof AnalyticsFilters] !== undefined) {
        httpParams = httpParams.set(key, filters[key as keyof AnalyticsFilters]!.toString());
      }
    });

    return this.http.get<AnalyticsData>(`${this.API_URL}/analytics/financial`, { params: httpParams });
  }

  getRevenueAnalytics(filters: AnalyticsFilters): Observable<ChartData> {
    let httpParams = new HttpParams();
    Object.keys(filters).forEach(key => {
      if (filters[key as keyof AnalyticsFilters] !== null && filters[key as keyof AnalyticsFilters] !== undefined) {
        httpParams = httpParams.set(key, filters[key as keyof AnalyticsFilters]!.toString());
      }
    });

    return this.http.get<ChartData>(`${this.API_URL}/analytics/financial/revenue`, { params: httpParams });
  }

  getProfitMargin(filters: AnalyticsFilters): Observable<ChartData> {
    let httpParams = new HttpParams();
    Object.keys(filters).forEach(key => {
      if (filters[key as keyof AnalyticsFilters] !== null && filters[key as keyof AnalyticsFilters] !== undefined) {
        httpParams = httpParams.set(key, filters[key as keyof AnalyticsFilters]!.toString());
      }
    });

    return this.http.get<ChartData>(`${this.API_URL}/analytics/financial/profit-margin`, { params: httpParams });
  }

  // Real-time Analytics
  getRealTimeAnalytics(): Observable<{
    activeUsers: number;
    currentOrders: number;
    revenue: number;
    topProducts: any[];
    recentActivity: any[];
  }> {
    return this.http.get<any>(`${this.API_URL}/analytics/real-time`);
  }

  // Analytics Export
  exportAnalytics(type: string, filters: AnalyticsFilters, format: 'csv' | 'xlsx' | 'pdf'): Observable<Blob> {
    let httpParams = new HttpParams();
    Object.keys(filters).forEach(key => {
      if (filters[key as keyof AnalyticsFilters] !== null && filters[key as keyof AnalyticsFilters] !== undefined) {
        httpParams = httpParams.set(key, filters[key as keyof AnalyticsFilters]!.toString());
      }
    });

    return this.http.get(`${this.API_URL}/analytics/export/${type}`, {
      params: httpParams.append('format', format),
      responseType: 'blob'
    });
  }

  // Analytics Settings
  getAnalyticsSettings(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/analytics/settings`);
  }

  updateAnalyticsSettings(settings: any): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/analytics/settings`, settings);
  }

  // Custom Analytics
  createCustomAnalytics(query: string, parameters: any = {}): Observable<ChartData> {
    return this.http.post<ChartData>(`${this.API_URL}/analytics/custom`, { query, parameters });
  }

  validateAnalyticsQuery(query: string): Observable<{valid: boolean, message?: string}> {
    return this.http.post<{valid: boolean, message?: string}>(`${this.API_URL}/analytics/custom/validate`, { query });
  }
}



