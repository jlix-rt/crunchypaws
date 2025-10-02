import { Injectable, inject, signal, computed } from '@angular/core';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { ApiService } from './api.service';
import { NotificationService } from './notification.service';
import { CartItem, CartCalculation, Product } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiService = inject(ApiService);
  private notificationService = inject(NotificationService);

  private readonly CART_KEY = 'crunchypaws_cart';

  // Cart state
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  public cartItems$ = this.cartItemsSubject.asObservable();
  
  // Signals for reactive state
  public cartItems = signal<CartItem[]>([]);
  public itemCount = computed(() => 
    this.cartItems().reduce((sum, item) => sum + item.quantity, 0)
  );
  public isEmpty = computed(() => this.cartItems().length === 0);

  constructor() {
    this.loadCartFromStorage();
  }

  // Load cart from localStorage
  private loadCartFromStorage(): void {
    const cartData = localStorage.getItem(this.CART_KEY);
    if (cartData) {
      try {
        const items = JSON.parse(cartData);
        this.cartItems.set(items);
        this.cartItemsSubject.next(items);
      } catch (error) {
        console.error('Error loading cart from storage:', error);
        this.clearCart();
      }
    }
  }

  // Save cart to localStorage
  private saveCartToStorage(): void {
    localStorage.setItem(this.CART_KEY, JSON.stringify(this.cartItems()));
  }

  // Add item to cart
  addItem(product: Product, quantity: number = 1): void {
    const currentItems = this.cartItems();
    const existingItemIndex = currentItems.findIndex(item => item.productId === product.id);

    if (existingItemIndex >= 0) {
      // Update existing item
      const updatedItems = [...currentItems];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + quantity,
        product
      };
      this.cartItems.set(updatedItems);
    } else {
      // Add new item
      const newItem: CartItem = {
        productId: product.id,
        quantity,
        product
      };
      this.cartItems.set([...currentItems, newItem]);
    }

    this.cartItemsSubject.next(this.cartItems());
    this.saveCartToStorage();
    this.notificationService.showSuccess(`${product.name} agregado al carrito`);
  }

  // Update item quantity
  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }

    const currentItems = this.cartItems();
    const updatedItems = currentItems.map(item =>
      item.productId === productId ? { ...item, quantity } : item
    );

    this.cartItems.set(updatedItems);
    this.cartItemsSubject.next(updatedItems);
    this.saveCartToStorage();
  }

  // Remove item from cart
  removeItem(productId: number): void {
    const currentItems = this.cartItems();
    const updatedItems = currentItems.filter(item => item.productId !== productId);
    
    this.cartItems.set(updatedItems);
    this.cartItemsSubject.next(updatedItems);
    this.saveCartToStorage();
    this.notificationService.showInfo('Producto eliminado del carrito');
  }

  // Clear entire cart
  clearCart(): void {
    this.cartItems.set([]);
    this.cartItemsSubject.next([]);
    localStorage.removeItem(this.CART_KEY);
  }

  // Get item quantity for a specific product
  getItemQuantity(productId: number): number {
    const item = this.cartItems().find(item => item.productId === productId);
    return item ? item.quantity : 0;
  }

  // Check if product is in cart
  isInCart(productId: number): boolean {
    return this.cartItems().some(item => item.productId === productId);
  }

  // Calculate cart totals
  calculateTotals(couponCode?: string): Observable<CartCalculation> {
    const items = this.cartItems().map(item => ({
      productId: item.productId,
      quantity: item.quantity
    }));

    const payload: any = { items };
    if (couponCode) {
      payload.couponCode = couponCode;
    }

    return this.apiService.post<CartCalculation>('/cart/price', payload);
  }

  // Validate cart items (check stock, prices, etc.)
  validateCart(): Observable<any> {
    const items = this.cartItems().map(item => ({
      productId: item.productId,
      quantity: item.quantity
    }));

    return this.apiService.post('/cart/validate', { items }).pipe(
      tap(response => {
        if (response.success && response.data) {
          // Update cart with validated data
          const validatedItems = response.data.items;
          const currentItems = this.cartItems();
          
          const updatedItems = currentItems.map(cartItem => {
            const validatedItem = validatedItems.find(
              (item: any) => item.productId === cartItem.productId
            );
            
            if (validatedItem && !validatedItem.valid) {
              // Handle invalid items (out of stock, etc.)
              if (validatedItem.availableStock !== undefined) {
                // Update quantity to available stock
                return { ...cartItem, quantity: validatedItem.availableStock };
              } else {
                // Remove invalid item
                return null;
              }
            }
            
            return cartItem;
          }).filter(item => item !== null) as CartItem[];

          if (updatedItems.length !== currentItems.length) {
            this.cartItems.set(updatedItems);
            this.cartItemsSubject.next(updatedItems);
            this.saveCartToStorage();
            this.notificationService.showWarning('Algunos productos fueron actualizados o eliminados del carrito');
          }
        }
      })
    );
  }

  // Get cart summary for display
  getCartSummary() {
    return computed(() => {
      const items = this.cartItems();
      const totalItems = this.itemCount();
      const totalProducts = items.length;
      
      return {
        items,
        totalItems,
        totalProducts,
        isEmpty: this.isEmpty()
      };
    });
  }
}
