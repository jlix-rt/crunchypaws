import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

export interface Integration {
  id: string;
  name: string;
  type: 'payment' | 'shipping' | 'inventory' | 'accounting' | 'marketing' | 'analytics';
  status: 'active' | 'inactive' | 'error';
  config: any;
  lastSync?: string;
  errorMessage?: string;
}

export interface IntegrationLog {
  id: number;
  integrationId: string;
  level: 'info' | 'warning' | 'error';
  message: string;
  data?: any;
  timestamp: string;
}

export interface SyncResult {
  success: boolean;
  recordsProcessed: number;
  recordsUpdated: number;
  recordsCreated: number;
  errors: number;
  duration: number;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class IntegrationService {
  constructor(private http: HttpClient) {}

  private readonly API_URL = `${environment.apiUrl}`;

  // Integration Management
  getIntegrations(): Observable<Integration[]> {
    return this.http.get<Integration[]>(`${this.API_URL}/integrations`);
  }

  getIntegrationById(id: string): Observable<Integration> {
    return this.http.get<Integration>(`${this.API_URL}/integrations/${id}`);
  }

  createIntegration(integration: Partial<Integration>): Observable<Integration> {
    return this.http.post<Integration>(`${this.API_URL}/integrations`, integration);
  }

  updateIntegration(id: string, integration: Partial<Integration>): Observable<Integration> {
    return this.http.put<Integration>(`${this.API_URL}/integrations/${id}`, integration);
  }

  deleteIntegration(id: string): Observable<{message: string}> {
    return this.http.delete<{message: string}>(`${this.API_URL}/integrations/${id}`);
  }

  testIntegration(id: string): Observable<{success: boolean, message: string}> {
    return this.http.post<{success: boolean, message: string}>(`${this.API_URL}/integrations/${id}/test`, {});
  }

  // Payment Integrations
  getPaymentIntegrations(): Observable<Integration[]> {
    return this.http.get<Integration[]>(`${this.API_URL}/integrations/payment`);
  }

  configurePaymentIntegration(provider: string, config: any): Observable<Integration> {
    return this.http.post<Integration>(`${this.API_URL}/integrations/payment/${provider}`, config);
  }

  processPayment(paymentData: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/integrations/payment/process`, paymentData);
  }

  // Shipping Integrations
  getShippingIntegrations(): Observable<Integration[]> {
    return this.http.get<Integration[]>(`${this.API_URL}/integrations/shipping`);
  }

  configureShippingIntegration(provider: string, config: any): Observable<Integration> {
    return this.http.post<Integration>(`${this.API_URL}/integrations/shipping/${provider}`, config);
  }

  calculateShippingRate(shippingData: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/integrations/shipping/calculate`, shippingData);
  }

  createShipment(shipmentData: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/integrations/shipping/create`, shipmentData);
  }

  trackShipment(trackingNumber: string): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/integrations/shipping/track/${trackingNumber}`);
  }

  // Inventory Integrations
  getInventoryIntegrations(): Observable<Integration[]> {
    return this.http.get<Integration[]>(`${this.API_URL}/integrations/inventory`);
  }

  configureInventoryIntegration(provider: string, config: any): Observable<Integration> {
    return this.http.post<Integration>(`${this.API_URL}/integrations/inventory/${provider}`, config);
  }

  syncInventory(): Observable<SyncResult> {
    return this.http.post<SyncResult>(`${this.API_URL}/integrations/inventory/sync`, {});
  }

  updateInventoryLevels(updates: any[]): Observable<SyncResult> {
    return this.http.post<SyncResult>(`${this.API_URL}/integrations/inventory/update-levels`, { updates });
  }

  // Accounting Integrations
  getAccountingIntegrations(): Observable<Integration[]> {
    return this.http.get<Integration[]>(`${this.API_URL}/integrations/accounting`);
  }

  configureAccountingIntegration(provider: string, config: any): Observable<Integration> {
    return this.http.post<Integration>(`${this.API_URL}/integrations/accounting/${provider}`, config);
  }

  syncAccountingData(): Observable<SyncResult> {
    return this.http.post<SyncResult>(`${this.API_URL}/integrations/accounting/sync`, {});
  }

  exportAccountingData(format: 'csv' | 'xlsx' | 'xml'): Observable<Blob> {
    return this.http.get(`${this.API_URL}/integrations/accounting/export`, {
      params: { format },
      responseType: 'blob'
    });
  }

  // Marketing Integrations
  getMarketingIntegrations(): Observable<Integration[]> {
    return this.http.get<Integration[]>(`${this.API_URL}/integrations/marketing`);
  }

  configureMarketingIntegration(provider: string, config: any): Observable<Integration> {
    return this.http.post<Integration>(`${this.API_URL}/integrations/marketing/${provider}`, config);
  }

  syncMarketingData(): Observable<SyncResult> {
    return this.http.post<SyncResult>(`${this.API_URL}/integrations/marketing/sync`, {});
  }

  sendMarketingCampaign(campaignData: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/integrations/marketing/campaign`, campaignData);
  }

  // Analytics Integrations
  getAnalyticsIntegrations(): Observable<Integration[]> {
    return this.http.get<Integration[]>(`${this.API_URL}/integrations/analytics`);
  }

  configureAnalyticsIntegration(provider: string, config: any): Observable<Integration> {
    return this.http.post<Integration>(`${this.API_URL}/integrations/analytics/${provider}`, config);
  }

  syncAnalyticsData(): Observable<SyncResult> {
    return this.http.post<SyncResult>(`${this.API_URL}/integrations/analytics/sync`, {});
  }

  getAnalyticsReport(reportType: string, params: any = {}): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/integrations/analytics/reports/${reportType}`, { params });
  }

  // Integration Logs
  getIntegrationLogs(integrationId?: string, params: any = {}): Observable<{logs: IntegrationLog[], pagination: any}> {
    let url = `${this.API_URL}/integrations/logs`;
    if (integrationId) {
      url += `/${integrationId}`;
    }
    return this.http.get<{logs: IntegrationLog[], pagination: any}>(url, { params });
  }

  getIntegrationLogById(logId: number): Observable<IntegrationLog> {
    return this.http.get<IntegrationLog>(`${this.API_URL}/integrations/logs/${logId}`);
  }

  clearIntegrationLogs(integrationId: string): Observable<{message: string}> {
    return this.http.delete<{message: string}>(`${this.API_URL}/integrations/logs/${integrationId}`);
  }

  // Webhook Management
  getWebhooks(integrationId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/integrations/${integrationId}/webhooks`);
  }

  createWebhook(integrationId: string, webhookData: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/integrations/${integrationId}/webhooks`, webhookData);
  }

  updateWebhook(integrationId: string, webhookId: string, webhookData: any): Observable<any> {
    return this.http.put<any>(`${this.API_URL}/integrations/${integrationId}/webhooks/${webhookId}`, webhookData);
  }

  deleteWebhook(integrationId: string, webhookId: string): Observable<{message: string}> {
    return this.http.delete<{message: string}>(`${this.API_URL}/integrations/${integrationId}/webhooks/${webhookId}`);
  }

  testWebhook(integrationId: string, webhookId: string): Observable<{success: boolean, message: string}> {
    return this.http.post<{success: boolean, message: string}>(`${this.API_URL}/integrations/${integrationId}/webhooks/${webhookId}/test`, {});
  }

  // Integration Health
  getIntegrationHealth(): Observable<{
    overall: 'healthy' | 'warning' | 'critical';
    integrations: {[key: string]: 'healthy' | 'warning' | 'critical'};
    lastCheck: string;
  }> {
    return this.http.get<any>(`${this.API_URL}/integrations/health`);
  }

  // Real-time Integration Monitoring
  connectIntegrationWebSocket(): void {
    // Implementation would depend on your WebSocket setup
    // This is a placeholder for real-time integration monitoring
  }

  disconnectIntegrationWebSocket(): void {
    // Implementation would depend on your WebSocket setup
  }
}



