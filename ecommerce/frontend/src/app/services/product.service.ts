import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { 
  Product, 
  Category, 
  ProductSearchParams, 
  ProductSearchResponse 
} from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/catalog`;
  
  getProducts(params: ProductSearchParams = {}): Observable<ProductSearchResponse> {
    let httpParams = new HttpParams();
    
    if (params.page) httpParams = httpParams.set('page', params.page.toString());
    if (params.limit) httpParams = httpParams.set('limit', params.limit.toString());
    if (params.search) httpParams = httpParams.set('search', params.search);
    if (params.category_id) httpParams = httpParams.set('category_id', params.category_id.toString());
    if (params.min_price) httpParams = httpParams.set('min_price', params.min_price.toString());
    if (params.max_price) httpParams = httpParams.set('max_price', params.max_price.toString());
    if (params.sort_by) httpParams = httpParams.set('sort_by', params.sort_by);
    if (params.sort_order) httpParams = httpParams.set('sort_order', params.sort_order);
    if (params.is_active !== undefined) httpParams = httpParams.set('is_active', params.is_active.toString());
    
    return this.http.get<ProductSearchResponse>(`${this.API_URL}/products`, { params: httpParams });
  }
  
  getProductBySlug(slug: string): Observable<Product> {
    return this.http.get<Product>(`${this.API_URL}/products/slug/${slug}`);
  }
  
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.API_URL}/products/${id}`);
  }
  
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.API_URL}/categories`);
  }
  
  getCategoryBySlug(slug: string): Observable<Category> {
    return this.http.get<Category>(`${this.API_URL}/categories/slug/${slug}`);
  }
  
  getCategoryProducts(categoryId: number, params: ProductSearchParams = {}): Observable<ProductSearchResponse> {
    let httpParams = new HttpParams();
    
    if (params.page) httpParams = httpParams.set('page', params.page.toString());
    if (params.limit) httpParams = httpParams.set('limit', params.limit.toString());
    if (params.search) httpParams = httpParams.set('search', params.search);
    if (params.min_price) httpParams = httpParams.set('min_price', params.min_price.toString());
    if (params.max_price) httpParams = httpParams.set('max_price', params.max_price.toString());
    if (params.sort_by) httpParams = httpParams.set('sort_by', params.sort_by);
    if (params.sort_order) httpParams = httpParams.set('sort_order', params.sort_order);
    
    return this.http.get<ProductSearchResponse>(`${this.API_URL}/categories/${categoryId}/products`, { params: httpParams });
  }
  
  searchProducts(query: string, params: ProductSearchParams = {}): Observable<ProductSearchResponse> {
    let httpParams = new HttpParams().set('search', query);
    
    if (params.page) httpParams = httpParams.set('page', params.page.toString());
    if (params.limit) httpParams = httpParams.set('limit', params.limit.toString());
    if (params.category_id) httpParams = httpParams.set('category_id', params.category_id.toString());
    if (params.min_price) httpParams = httpParams.set('min_price', params.min_price.toString());
    if (params.max_price) httpParams = httpParams.set('max_price', params.max_price.toString());
    if (params.sort_by) httpParams = httpParams.set('sort_by', params.sort_by);
    if (params.sort_order) httpParams = httpParams.set('sort_order', params.sort_order);
    
    return this.http.get<ProductSearchResponse>(`${this.API_URL}/search`, { params: httpParams });
  }
  
  getAutocompleteSuggestions(query: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.API_URL}/autocomplete`, {
      params: { q: query }
    });
  }
  
  getRelatedProducts(productId: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.API_URL}/products/${productId}/related`);
  }
  
  getFeaturedProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.API_URL}/products/featured`);
  }
  
  getNewProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.API_URL}/products/new`);
  }
  
  getBestSellers(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.API_URL}/products/bestsellers`);
  }
  
  getOnSaleProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.API_URL}/products/onsale`);
  }
}



