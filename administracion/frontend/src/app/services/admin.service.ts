import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { 
  Supply, 
  Product, 
  Category, 
  Promotion, 
  User, 
  Review,
  DashboardStats,
  ChartData
} from '../models/admin.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}`;
  
  // Dashboard
  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.API_URL}/dashboard/stats`);
  }
  
  getRevenueChartData(period: string = 'month'): Observable<ChartData> {
    return this.http.get<ChartData>(`${this.API_URL}/dashboard/revenue`, {
      params: { period }
    });
  }
  
  getOrdersChartData(period: string = 'month'): Observable<ChartData> {
    return this.http.get<ChartData>(`${this.API_URL}/dashboard/orders`, {
      params: { period }
    });
  }
  
  getProductsChartData(period: string = 'month'): Observable<ChartData> {
    return this.http.get<ChartData>(`${this.API_URL}/dashboard/products`, {
      params: { period }
    });
  }
  
  getUsersChartData(period: string = 'month'): Observable<ChartData> {
    return this.http.get<ChartData>(`${this.API_URL}/dashboard/users`, {
      params: { period }
    });
  }
  
  // Supplies
  getSupplies(params: any = {}): Observable<{supplies: Supply[], pagination: any}> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        httpParams = httpParams.set(key, params[key].toString());
      }
    });
    
    return this.http.get<{supplies: Supply[], pagination: any}>(`${this.API_URL}/supplies`, { params: httpParams });
  }
  
  getSupplyById(id: number): Observable<Supply> {
    return this.http.get<Supply>(`${this.API_URL}/supplies/${id}`);
  }
  
  createSupply(supply: Partial<Supply>): Observable<Supply> {
    return this.http.post<Supply>(`${this.API_URL}/supplies`, supply);
  }
  
  updateSupply(id: number, supply: Partial<Supply>): Observable<Supply> {
    return this.http.put<Supply>(`${this.API_URL}/supplies/${id}`, supply);
  }
  
  deleteSupply(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/supplies/${id}`);
  }
  
  // Products
  getProducts(params: any = {}): Observable<{products: Product[], pagination: any}> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        httpParams = httpParams.set(key, params[key].toString());
      }
    });
    
    return this.http.get<{products: Product[], pagination: any}>(`${this.API_URL}/products`, { params: httpParams });
  }
  
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.API_URL}/products/${id}`);
  }
  
  createProduct(product: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(`${this.API_URL}/products`, product);
  }
  
  updateProduct(id: number, product: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.API_URL}/products/${id}`, product);
  }
  
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/products/${id}`);
  }
  
  updateProductRecipe(id: number, recipe: any): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/products/${id}/recipe`, recipe);
  }
  
  getProductRecipe(id: number): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/products/${id}/recipe`);
  }
  
  calculateProductPrice(id: number): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/products/${id}/calculate-price`, {});
  }
  
  // Categories
  getCategories(params: any = {}): Observable<{categories: Category[], pagination: any}> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        httpParams = httpParams.set(key, params[key].toString());
      }
    });
    
    return this.http.get<{categories: Category[], pagination: any}>(`${this.API_URL}/categories`, { params: httpParams });
  }
  
  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.API_URL}/categories/${id}`);
  }
  
  createCategory(category: Partial<Category>): Observable<Category> {
    return this.http.post<Category>(`${this.API_URL}/categories`, category);
  }
  
  updateCategory(id: number, category: Partial<Category>): Observable<Category> {
    return this.http.put<Category>(`${this.API_URL}/categories/${id}`, category);
  }
  
  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/categories/${id}`);
  }
  
  // Promotions
  getPromotions(params: any = {}): Observable<{promotions: Promotion[], pagination: any}> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        httpParams = httpParams.set(key, params[key].toString());
      }
    });
    
    return this.http.get<{promotions: Promotion[], pagination: any}>(`${this.API_URL}/promotions`, { params: httpParams });
  }
  
  getPromotionById(id: number): Observable<Promotion> {
    return this.http.get<Promotion>(`${this.API_URL}/promotions/${id}`);
  }
  
  createPromotion(promotion: Partial<Promotion>): Observable<Promotion> {
    return this.http.post<Promotion>(`${this.API_URL}/promotions`, promotion);
  }
  
  updatePromotion(id: number, promotion: Partial<Promotion>): Observable<Promotion> {
    return this.http.put<Promotion>(`${this.API_URL}/promotions/${id}`, promotion);
  }
  
  deletePromotion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/promotions/${id}`);
  }
  
  activatePromotion(id: number): Observable<Promotion> {
    return this.http.put<Promotion>(`${this.API_URL}/promotions/${id}/activate`, {});
  }
  
  pausePromotion(id: number): Observable<Promotion> {
    return this.http.put<Promotion>(`${this.API_URL}/promotions/${id}/pause`, {});
  }
  
  // Users
  getUsers(params: any = {}): Observable<{users: User[], pagination: any}> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        httpParams = httpParams.set(key, params[key].toString());
      }
    });
    
    return this.http.get<{users: User[], pagination: any}>(`${this.API_URL}/users`, { params: httpParams });
  }
  
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/users/${id}`);
  }
  
  createUser(user: Partial<User>): Observable<User> {
    return this.http.post<User>(`${this.API_URL}/users`, user);
  }
  
  updateUser(id: number, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.API_URL}/users/${id}`, user);
  }
  
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/users/${id}`);
  }
  
  activateUser(id: number): Observable<User> {
    return this.http.put<User>(`${this.API_URL}/users/${id}/activate`, {});
  }
  
  deactivateUser(id: number): Observable<User> {
    return this.http.put<User>(`${this.API_URL}/users/${id}/deactivate`, {});
  }
  
  // Reviews
  getReviews(params: any = {}): Observable<{reviews: Review[], pagination: any}> {
    let httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        httpParams = httpParams.set(key, params[key].toString());
      }
    });
    
    return this.http.get<{reviews: Review[], pagination: any}>(`${this.API_URL}/reviews`, { params: httpParams });
  }
  
  getReviewById(id: number): Observable<Review> {
    return this.http.get<Review>(`${this.API_URL}/reviews/${id}`);
  }
  
  approveReview(id: number): Observable<Review> {
    return this.http.put<Review>(`${this.API_URL}/reviews/${id}/approve`, {});
  }
  
  rejectReview(id: number): Observable<Review> {
    return this.http.put<Review>(`${this.API_URL}/reviews/${id}/reject`, {});
  }
  
  deleteReview(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/reviews/${id}`);
  }
}



