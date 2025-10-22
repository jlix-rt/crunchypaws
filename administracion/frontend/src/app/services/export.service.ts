import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

export interface ExportOptions {
  format: 'csv' | 'xlsx' | 'pdf';
  filters?: any;
  dateRange?: {
    start: string;
    end: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  constructor(private http: HttpClient) {}

  private readonly API_URL = `${environment.apiUrl}`;

  exportSupplies(options: ExportOptions): Observable<Blob> {
    return this.http.post(`${this.API_URL}/exports/supplies`, options, {
      responseType: 'blob'
    });
  }

  exportProducts(options: ExportOptions): Observable<Blob> {
    return this.http.post(`${this.API_URL}/exports/products`, options, {
      responseType: 'blob'
    });
  }

  exportOrders(options: ExportOptions): Observable<Blob> {
    return this.http.post(`${this.API_URL}/exports/orders`, options, {
      responseType: 'blob'
    });
  }

  exportUsers(options: ExportOptions): Observable<Blob> {
    return this.http.post(`${this.API_URL}/exports/users`, options, {
      responseType: 'blob'
    });
  }

  exportReviews(options: ExportOptions): Observable<Blob> {
    return this.http.post(`${this.API_URL}/exports/reviews`, options, {
      responseType: 'blob'
    });
  }

  exportPromotions(options: ExportOptions): Observable<Blob> {
    return this.http.post(`${this.API_URL}/exports/promotions`, options, {
      responseType: 'blob'
    });
  }

  downloadFile(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
}



