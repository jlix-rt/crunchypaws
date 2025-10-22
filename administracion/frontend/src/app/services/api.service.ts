import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Supply {
  id: number;
  name: string;
  category: string;
  stock: number;
  unit: string;
  unitPrice: number;
  status: 'available' | 'low_stock' | 'out_of_stock';
  lastUpdated: string;
  selected?: boolean;
}

export interface Product {
  id: number;
  name: string;
  category: string; // Mantener para compatibilidad
  categories: number[]; // Nuevo: array de IDs de categorías
  price: number;
  stock: number;
  status: 'active' | 'inactive';
  sku: string;
  description: string;
  lastUpdated: string;
  supplies: ProductSupply[];
  selectedCostTypes: SelectedCostType[];
  isAlsoSupply?: boolean;
  selected?: boolean;
}

export interface SelectedCostType {
  id: number;
  name: string;
  percentage: number;
  priority: number;
  isMandatory: boolean;
  isSelected: boolean;
}

export interface ProductSupply {
  id: number;
  productId: number;
  supplyId: number;
  quantity: number;
  supply: Supply;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'EMPLOYEE' | 'CLIENT';
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  createdAt: string;
  selected?: boolean;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  parentId?: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
  selected?: boolean;
}

export interface Unit {
  id: number;
  name: string;
  symbol: string;
  description?: string;
  category?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
  selected?: boolean;
}

export interface Promotion {
  id: number;
  name: string;
  description: string;
  discount: number;
  type: 'percentage' | 'fixed';
  status: 'active' | 'inactive' | 'expired';
  startDate: string;
  endDate: string;
  usageCount: number;
  selected?: boolean;
}

export interface Review {
  id: number;
  productName: string;
  customerName: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  selected?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl || 'http://localhost:3001/api';

  constructor(private http: HttpClient) {}

  // Auth endpoints
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, { email, password });
  }

  // Supply endpoints
  getSupplies(): Observable<Supply[]> {
    return this.http.get<any>(`${this.baseUrl}/supplies`).pipe(
      map(response => {
        if (response.success && response.data && response.data.supplies) {
          return response.data.supplies;
        }
        return [];
      })
    );
  }

  getSupply(id: number): Observable<Supply> {
    return this.http.get<Supply>(`${this.baseUrl}/supplies/${id}`);
  }

  createSupply(supply: Partial<Supply>): Observable<Supply> {
    return this.http.post<any>(`${this.baseUrl}/supplies`, supply).pipe(
      map(response => {
        if (response.success && response.data && response.data.supply) {
          return response.data.supply;
        }
        throw new Error('Error creating supply');
      })
    );
  }

  updateSupply(id: number, supply: Partial<Supply>): Observable<Supply> {
    return this.http.put<any>(`${this.baseUrl}/supplies/${id}`, supply).pipe(
      map(response => {
        if (response.success && response.data && response.data.supply) {
          return response.data.supply;
        }
        throw new Error('Error updating supply');
      })
    );
  }

  deleteSupply(id: number): Observable<void> {
    return this.http.delete<any>(`${this.baseUrl}/supplies/${id}`).pipe(
      map(response => {
        if (response.success) {
          return;
        }
        throw new Error('Error deleting supply');
      })
    );
  }

  // Product endpoints
  getProducts(): Observable<Product[]> {
    return this.http.get<any>(`${this.baseUrl}/products`).pipe(
      map(response => {
        if (response.success && response.data && response.data.products) {
          return response.data.products;
        }
        return [];
      })
    );
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/products/${id}`);
  }

  createProduct(product: Partial<Product>): Observable<Product> {
    return this.http.post<any>(`${this.baseUrl}/products`, product).pipe(
      map(response => {
        if (response.success && response.data && response.data.product) {
          return response.data.product;
        }
        throw new Error('Error creating product');
      })
    );
  }

  updateProduct(id: number, product: Partial<Product>): Observable<Product> {
    return this.http.put<any>(`${this.baseUrl}/products/${id}`, product).pipe(
      map(response => {
        if (response.success && response.data && response.data.product) {
          return response.data.product;
        }
        throw new Error('Error updating product');
      })
    );
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<any>(`${this.baseUrl}/products/${id}`).pipe(
      map(response => {
        if (response.success) {
          return;
        }
        throw new Error('Error deleting product');
      })
    );
  }

  calculateProductPrice(supplies: ProductSupply[]): Observable<number> {
    return this.http.post<number>(`${this.baseUrl}/products/calculate-price`, { supplies });
  }

  // User endpoints
  getUsers(): Observable<User[]> {
    return this.http.get<any>(`${this.baseUrl}/users`).pipe(
      map(response => {
        if (response.success && response.data && response.data.users) {
          return response.data.users;
        }
        return [];
      })
    );
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/users/${id}`);
  }

  createUser(user: Partial<User>): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/users`, user);
  }

  updateUser(id: number, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/users/${id}`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/users/${id}`);
  }

  // Category endpoints
  getCategories(): Observable<Category[]> {
    return this.http.get<any>(`${this.baseUrl}/categories`).pipe(
      map(response => {
        if (response.success && response.data && response.data.categories) {
          return response.data.categories;
        }
        return [];
      })
    );
  }

  getCategory(id: number): Observable<Category> {
    return this.http.get<any>(`${this.baseUrl}/categories/${id}`).pipe(
      map(response => {
        if (response.success && response.data && response.data.category) {
          return response.data.category;
        }
        throw new Error('Categoría no encontrada');
      })
    );
  }

  createCategory(category: Partial<Category>): Observable<Category> {
    return this.http.post<any>(`${this.baseUrl}/categories`, category).pipe(
      map(response => {
        if (response.success && response.data && response.data.category) {
          return response.data.category;
        }
        throw new Error('Error creando categoría');
      })
    );
  }

  updateCategory(id: number, category: Partial<Category>): Observable<Category> {
    return this.http.put<any>(`${this.baseUrl}/categories/${id}`, category).pipe(
      map(response => {
        if (response.success && response.data && response.data.category) {
          return response.data.category;
        }
        throw new Error('Error actualizando categoría');
      })
    );
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<any>(`${this.baseUrl}/categories/${id}`).pipe(
      map(response => {
        if (response.success) {
          return;
        }
        throw new Error('Error eliminando categoría');
      })
    );
  }

  // Unit endpoints
  getUnits(): Observable<Unit[]> {
    return this.http.get<any>(`${this.baseUrl}/units`).pipe(
      map(response => {
        if (response.success && response.data && response.data.units) {
          return response.data.units;
        }
        return [];
      })
    );
  }

  getActiveUnits(): Observable<Unit[]> {
    return this.http.get<any>(`${this.baseUrl}/units/active`).pipe(
      map(response => {
        if (response.success && response.data && response.data.units) {
          return response.data.units;
        }
        return [];
      })
    );
  }

  getUnit(id: number): Observable<Unit> {
    return this.http.get<any>(`${this.baseUrl}/units/${id}`).pipe(
      map(response => {
        if (response.success && response.data && response.data.unit) {
          return response.data.unit;
        }
        throw new Error('Unidad no encontrada');
      })
    );
  }

  createUnit(unit: Partial<Unit>): Observable<Unit> {
    return this.http.post<any>(`${this.baseUrl}/units`, unit).pipe(
      map(response => {
        if (response.success && response.data && response.data.unit) {
          return response.data.unit;
        }
        throw new Error('Error creando unidad');
      })
    );
  }

  updateUnit(id: number, unit: Partial<Unit>): Observable<Unit> {
    return this.http.put<any>(`${this.baseUrl}/units/${id}`, unit).pipe(
      map(response => {
        if (response.success && response.data && response.data.unit) {
          return response.data.unit;
        }
        throw new Error('Error actualizando unidad');
      })
    );
  }

  deleteUnit(id: number): Observable<void> {
    return this.http.delete<any>(`${this.baseUrl}/units/${id}`).pipe(
      map(response => {
        if (response.success) {
          return;
        }
        throw new Error('Error eliminando unidad');
      })
    );
  }

  // Promotion endpoints
  getPromotions(): Observable<Promotion[]> {
    return this.http.get<Promotion[]>(`${this.baseUrl}/promotions`);
  }

  getPromotion(id: number): Observable<Promotion> {
    return this.http.get<Promotion>(`${this.baseUrl}/promotions/${id}`);
  }

  createPromotion(promotion: Partial<Promotion>): Observable<Promotion> {
    return this.http.post<Promotion>(`${this.baseUrl}/promotions`, promotion);
  }

  updatePromotion(id: number, promotion: Partial<Promotion>): Observable<Promotion> {
    return this.http.put<Promotion>(`${this.baseUrl}/promotions/${id}`, promotion);
  }

  deletePromotion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/promotions/${id}`);
  }

  // Review endpoints
  getReviews(): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.baseUrl}/reviews`);
  }

  getReview(id: number): Observable<Review> {
    return this.http.get<Review>(`${this.baseUrl}/reviews/${id}`);
  }

  updateReview(id: number, review: Partial<Review>): Observable<Review> {
    return this.http.put<Review>(`${this.baseUrl}/reviews/${id}`, review);
  }

  deleteReview(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/reviews/${id}`);
  }

  // Cost Breakdowns
  getCostBreakdowns(): Observable<any[]> {
    return this.http.get<any>(`${this.baseUrl}/cost-breakdowns`).pipe(
      map(response => {
        if (response.success && response.data && response.data.costBreakdowns) {
          return response.data.costBreakdowns;
        }
        return [];
      })
    );
  }

  getCostBreakdownById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/cost-breakdowns/${id}`).pipe(
      map(response => {
        if (response.success && response.data && response.data.costBreakdown) {
          return response.data.costBreakdown;
        }
        throw new Error('Error getting cost breakdown');
      })
    );
  }

  createCostBreakdown(costBreakdown: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/cost-breakdowns`, costBreakdown).pipe(
      map(response => {
        if (response.success && response.data && response.data.costBreakdown) {
          return response.data.costBreakdown;
        }
        throw new Error('Error creating cost breakdown');
      })
    );
  }

  updateCostBreakdown(id: number, costBreakdown: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/cost-breakdowns/${id}`, costBreakdown).pipe(
      map(response => {
        if (response.success && response.data && response.data.costBreakdown) {
          return response.data.costBreakdown;
        }
        throw new Error('Error updating cost breakdown');
      })
    );
  }

  deleteCostBreakdown(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/cost-breakdowns/${id}`).pipe(
      map(response => {
        if (response.success) {
          return;
        }
        throw new Error('Error deleting cost breakdown');
      })
    );
  }

  getCostBreakdownsByProduct(productId: number): Observable<any[]> {
    return this.http.get<any>(`${this.baseUrl}/cost-breakdowns/product/${productId}`).pipe(
      map(response => {
        if (response.success && response.data && response.data.costBreakdowns) {
          return response.data.costBreakdowns;
        }
        return [];
      })
    );
  }

  // Obtener desglose dinámico de todos los productos
  getDynamicCostBreakdowns(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/cost-breakdowns/dynamic/all`).pipe(
      map(response => {
        if (response.success && response.data) {
          return response.data;
        }
        return { costBreakdowns: [], costTypes: [] };
      })
    );
  }

  // Cost Types
  getCostTypes(): Observable<any[]> {
    return this.http.get<any>(`${this.baseUrl}/cost-types`).pipe(
      map(response => {
        if (response.success && response.data && response.data.costTypes) {
          return response.data.costTypes;
        }
        return [];
      })
    );
  }

  getActiveCostTypes(): Observable<any[]> {
    return this.http.get<any>(`${this.baseUrl}/cost-types/active`).pipe(
      map(response => {
        if (response.success && response.data && response.data.costTypes) {
          return response.data.costTypes;
        }
        return [];
      })
    );
  }

  getCostTypeById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/cost-types/${id}`).pipe(
      map(response => {
        if (response.success && response.data && response.data.costType) {
          return response.data.costType;
        }
        throw new Error('Error getting cost type');
      })
    );
  }

  createCostType(costType: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/cost-types`, costType).pipe(
      map(response => {
        if (response.success && response.data && response.data.costType) {
          return response.data.costType;
        }
        throw new Error('Error creating cost type');
      })
    );
  }

  updateCostType(id: number, costType: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/cost-types/${id}`, costType).pipe(
      map(response => {
        if (response.success && response.data && response.data.costType) {
          return response.data.costType;
        }
        throw new Error('Error updating cost type');
      })
    );
  }

  deleteCostType(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/cost-types/${id}`).pipe(
      map(response => {
        if (response.success) {
          return;
        }
        throw new Error('Error deleting cost type');
      })
    );
  }
}
