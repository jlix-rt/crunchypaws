import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

export interface ImportResult {
  success: boolean;
  message: string;
  imported: number;
  errors: number;
  details?: any[];
}

@Injectable({
  providedIn: 'root'
})
export class ImportService {
  constructor(private http: HttpClient) {}

  private readonly API_URL = `${environment.apiUrl}`;

  importSupplies(file: File): Observable<ImportResult> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.http.post<ImportResult>(`${this.API_URL}/imports/supplies`, formData);
  }

  importProducts(file: File): Observable<ImportResult> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.http.post<ImportResult>(`${this.API_URL}/imports/products`, formData);
  }

  importUsers(file: File): Observable<ImportResult> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.http.post<ImportResult>(`${this.API_URL}/imports/users`, formData);
  }

  importCategories(file: File): Observable<ImportResult> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.http.post<ImportResult>(`${this.API_URL}/imports/categories`, formData);
  }

  getImportTemplate(type: 'supplies' | 'products' | 'users' | 'categories'): Observable<Blob> {
    return this.http.get(`${this.API_URL}/imports/template/${type}`, {
      responseType: 'blob'
    });
  }

  downloadTemplate(type: 'supplies' | 'products' | 'users' | 'categories'): void {
    this.getImportTemplate(type).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `template_${type}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    });
  }
}



