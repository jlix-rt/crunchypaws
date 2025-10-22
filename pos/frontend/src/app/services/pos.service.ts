import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { 
  PosSession, 
  PosDiscrepancy, 
  Product, 
  PriceList,
  PosOrder,
  CreatePosOrderRequest,
  PosReport
} from '../models/pos.model';

@Injectable({
  providedIn: 'root'
})
export class PosService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/pos`;
  
  // Session Management
  openSession(openingAmount: number): Observable<PosSession> {
    return this.http.post<PosSession>(`${this.API_URL}/sessions/open`, {
      opening_amount: openingAmount
    });
  }
  
  closeSession(closingAmount: number): Observable<PosSession> {
    return this.http.post<PosSession>(`${this.API_URL}/sessions/close`, {
      closing_amount: closingAmount
    });
  }
  
  getCurrentSession(): Observable<PosSession | null> {
    return this.http.get<PosSession | null>(`${this.API_URL}/sessions/current`);
  }
  
  getSessionHistory(page: number = 1, limit: number = 20): Observable<{sessions: PosSession[], pagination: any}> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    
    return this.http.get<{sessions: PosSession[], pagination: any}>(`${this.API_URL}/sessions/history`, { params });
  }
  
  addDiscrepancy(sessionId: number, amount: number, reason: string): Observable<PosDiscrepancy> {
    return this.http.post<PosDiscrepancy>(`${this.API_URL}/sessions/${sessionId}/discrepancy`, {
      amount,
      reason
    });
  }
  
  // Product Management
  searchProduct(query: string): Observable<Product[]> {
    const params = new HttpParams().set('search', query);
    return this.http.get<Product[]>(`${this.API_URL}/products/search`, { params });
  }
  
  getProductByBarcode(barcode: string): Observable<Product> {
    return this.http.get<Product>(`${this.API_URL}/products/barcode/${barcode}`);
  }
  
  getProductPrices(productId: number, priceListId?: number): Observable<any[]> {
    let params = new HttpParams();
    if (priceListId) {
      params = params.set('price_list_id', priceListId.toString());
    }
    
    return this.http.get<any[]>(`${this.API_URL}/products/${productId}/prices`, { params });
  }
  
  getPriceLists(): Observable<PriceList[]> {
    return this.http.get<PriceList[]>(`${this.API_URL}/price-lists`);
  }
  
  // Order Management
  getOrders(page: number = 1, limit: number = 20, date?: string): Observable<{orders: PosOrder[], pagination: any}> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());
    
    if (date) {
      params = params.set('date', date);
    }
    
    return this.http.get<{orders: PosOrder[], pagination: any}>(`${this.API_URL}/orders`, { params });
  }
  
  getOrderById(id: number): Observable<PosOrder> {
    return this.http.get<PosOrder>(`${this.API_URL}/orders/${id}`);
  }
  
  createOrder(orderData: CreatePosOrderRequest): Observable<PosOrder> {
    return this.http.post<PosOrder>(`${this.API_URL}/orders`, orderData);
  }
  
  cancelOrder(id: number): Observable<PosOrder> {
    return this.http.put<PosOrder>(`${this.API_URL}/orders/${id}/cancel`, {});
  }
  
  printTicket(id: number): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/orders/${id}/print`, {});
  }
  
  // Reports
  getDailyReport(date?: string): Observable<PosReport> {
    let params = new HttpParams();
    if (date) {
      params = params.set('date', date);
    }
    
    return this.http.get<PosReport>(`${this.API_URL}/reports/daily`, { params });
  }
  
  getEmployeeReport(startDate?: string, endDate?: string, employeeId?: number): Observable<any> {
    let params = new HttpParams();
    if (startDate) params = params.set('start_date', startDate);
    if (endDate) params = params.set('end_date', endDate);
    if (employeeId) params = params.set('employee_id', employeeId.toString());
    
    return this.http.get<any>(`${this.API_URL}/reports/employee`, { params });
  }
  
  getProductReport(startDate?: string, endDate?: string): Observable<any> {
    let params = new HttpParams();
    if (startDate) params = params.set('start_date', startDate);
    if (endDate) params = params.set('end_date', endDate);
    
    return this.http.get<any>(`${this.API_URL}/reports/products`, { params });
  }
  
  exportReport(format: string = 'json', startDate?: string, endDate?: string): Observable<any> {
    let params = new HttpParams().set('format', format);
    if (startDate) params = params.set('start_date', startDate);
    if (endDate) params = params.set('end_date', endDate);
    
    return this.http.get<any>(`${this.API_URL}/reports/export`, { params });
  }
}



