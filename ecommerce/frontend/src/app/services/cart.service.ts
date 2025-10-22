import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, of } from 'rxjs';

import { environment } from '../../environments/environment';
import { 
  Cart, 
  CartItem, 
  AddToCartRequest, 
  UpdateCartItemRequest,
  ApplyCouponRequest,
  ApplyCouponResponse,
  Coupon
} from '../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/cart`;
  
  private cartSubject = new BehaviorSubject<Cart>({
    items: [],
    subtotal: 0,
    discount_total: 0,
    shipping_price: 0,
    total: 0,
    item_count: 0
  });
  
  public cart$ = this.cartSubject.asObservable();
  
  constructor() {
    this.loadCart();
  }
  
  private loadCart(): void {
    this.getCart().subscribe();
  }
  
  getCart(): Observable<Cart> {
    return this.http.get<Cart>(this.API_URL)
      .pipe(
        tap(cart => this.cartSubject.next(cart)),
        catchError(error => {
          console.error('Error loading cart:', error);
          return of(this.cartSubject.value);
        })
      );
  }
  
  addToCart(request: AddToCartRequest): Observable<Cart> {
    return this.http.post<Cart>(this.API_URL, request)
      .pipe(
        tap(cart => this.cartSubject.next(cart))
      );
  }
  
  updateCartItem(itemId: string, request: UpdateCartItemRequest): Observable<Cart> {
    return this.http.put<Cart>(`${this.API_URL}/items/${itemId}`, request)
      .pipe(
        tap(cart => this.cartSubject.next(cart))
      );
  }
  
  removeFromCart(itemId: string): Observable<Cart> {
    return this.http.delete<Cart>(`${this.API_URL}/items/${itemId}`)
      .pipe(
        tap(cart => this.cartSubject.next(cart))
      );
  }
  
  clearCart(): Observable<Cart> {
    return this.http.delete<Cart>(this.API_URL)
      .pipe(
        tap(cart => this.cartSubject.next(cart))
      );
  }
  
  applyCoupon(request: ApplyCouponRequest): Observable<ApplyCouponResponse> {
    return this.http.post<ApplyCouponResponse>(`${this.API_URL}/coupon`, request)
      .pipe(
        tap(response => {
          if (response.success) {
            this.getCart().subscribe();
          }
        })
      );
  }
  
  removeCoupon(): Observable<Cart> {
    return this.http.delete<Cart>(`${this.API_URL}/coupon`)
      .pipe(
        tap(cart => this.cartSubject.next(cart))
      );
  }
  
  getCartItemCount(): number {
    return this.cartSubject.value.item_count;
  }
  
  getCartTotal(): number {
    return this.cartSubject.value.total;
  }
  
  getCartSubtotal(): number {
    return this.cartSubject.value.subtotal;
  }
  
  getCartDiscount(): number {
    return this.cartSubject.value.discount_total;
  }
  
  getCartShipping(): number {
    return this.cartSubject.value.shipping_price;
  }
  
  isCartEmpty(): boolean {
    return this.cartSubject.value.items.length === 0;
  }
  
  getCartItems(): CartItem[] {
    return this.cartSubject.value.items;
  }
  
  // Local cart methods for offline support
  addToLocalCart(product: any, quantity: number, variant?: any): void {
    const items = [...this.cartSubject.value.items];
    const existingItemIndex = items.findIndex(
      item => item.product_id === product.id && item.variant_id === variant?.id
    );
    
    if (existingItemIndex > -1) {
      items[existingItemIndex].quantity += quantity;
      items[existingItemIndex].total_price = items[existingItemIndex].quantity * items[existingItemIndex].unit_price;
    } else {
      const newItem: CartItem = {
        id: `${product.id}_${variant?.id || 'default'}_${Date.now()}`,
        product_id: product.id,
        product: product,
        quantity: quantity,
        variant_id: variant?.id,
        variant: variant,
        unit_price: variant ? product.base_price + variant.extra_price : product.final_price,
        total_price: quantity * (variant ? product.base_price + variant.extra_price : product.final_price),
        added_at: new Date().toISOString()
      };
      items.push(newItem);
    }
    
    this.updateLocalCart(items);
  }
  
  private updateLocalCart(items: CartItem[]): void {
    const subtotal = items.reduce((sum, item) => sum + item.total_price, 0);
    const item_count = items.reduce((sum, item) => sum + item.quantity, 0);
    
    const cart: Cart = {
      items,
      subtotal,
      discount_total: 0,
      shipping_price: 0,
      total: subtotal,
      item_count
    };
    
    this.cartSubject.next(cart);
  }
}



