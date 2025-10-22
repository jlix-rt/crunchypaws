import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AppState } from '../../store/app.state';
import { selectCart, selectCartTotal, selectCartItemCount, selectCurrentSession } from '../../store/selectors/app.selector';
import { addToCart, removeFromCart, updateCartItem, clearCart } from '../../store/actions/app.actions';
import { PosService } from '../../services/pos.service';
import { Product, PaymentMethod } from '../../models/pos.model';

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="pos-grid">
      <!-- Main Area - Products -->
      <div class="pos-main">
        <!-- Search Bar -->
        <div class="p-4 border-b">
          <div class="flex space-x-4">
            <input
              type="text"
              [(ngModel)]="searchQuery"
              (keyup.enter)="searchProducts()"
              placeholder="Buscar producto o escanear código..."
              class="flex-1 input-field"
            >
            <button (click)="searchProducts()" class="btn-primary">
              🔍 Buscar
            </button>
          </div>
        </div>
        
        <!-- Product Grid -->
        <div class="product-grid">
          <div 
            *ngFor="let product of products" 
            class="product-card"
            (click)="addProductToCart(product)"
          >
            <img 
              [src]="product.images?.[0]?.url || 'assets/images/placeholder.jpg'" 
              [alt]="product.name"
              class="w-full h-32 object-cover rounded mb-2"
            >
            <h3 class="font-medium text-sm mb-1">{{ product.name }}</h3>
            <p class="text-xs text-gray-500 mb-2">{{ product.sku }}</p>
            <p class="text-lg font-bold text-green-600">Q{{ product.final_price | number:'1.2-2' }}</p>
            <p class="text-xs text-gray-500">Stock: {{ product.stock }}</p>
          </div>
        </div>
      </div>
      
      <!-- Sidebar - Cart & Checkout -->
      <div class="pos-sidebar">
        <!-- Cart Header -->
        <div class="p-4 border-b bg-gray-50">
          <h2 class="text-lg font-semibold">Carrito de Venta</h2>
          <p class="text-sm text-gray-600">{{ cartItemCount$ | async }} productos</p>
        </div>
        
        <!-- Cart Items -->
        <div class="flex-1 overflow-y-auto p-4">
          <div *ngIf="(cart$ | async)?.length === 0" class="text-center py-8 text-gray-500">
            <p>Carrito vacío</p>
            <p class="text-sm">Agrega productos para comenzar</p>
          </div>
          
          <div *ngFor="let item of cart$ | async; let i = index" class="cart-item">
            <div class="flex-1">
              <h4 class="font-medium text-sm">{{ item.product.name }}</h4>
              <p class="text-xs text-gray-500">{{ item.product.sku }}</p>
              <p class="text-sm font-semibold">Q{{ item.unit_price | number:'1.2-2' }}</p>
            </div>
            <div class="flex items-center space-x-2">
              <button 
                (click)="updateQuantity(i, item.quantity - 1)"
                class="w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded flex items-center justify-center"
                [disabled]="item.quantity <= 1"
              >
                -
              </button>
              <span class="w-8 text-center">{{ item.quantity }}</span>
              <button 
                (click)="updateQuantity(i, item.quantity + 1)"
                class="w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded flex items-center justify-center"
              >
                +
              </button>
              <button 
                (click)="removeItem(i)"
                class="text-red-500 hover:text-red-700 ml-2"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>
        
        <!-- Cart Total -->
        <div class="p-4 border-t bg-gray-50">
          <div class="flex justify-between items-center mb-4">
            <span class="text-lg font-semibold">Total:</span>
            <span class="text-2xl font-bold text-green-600">Q{{ cartTotal$ | async | number:'1.2-2' }}</span>
          </div>
          
          <!-- Payment Method -->
          <div class="mb-4">
            <label class="block text-sm font-medium mb-2">Método de Pago:</label>
            <select [(ngModel)]="selectedPaymentMethod" class="w-full input-field">
              <option *ngFor="let method of paymentMethods" [value]="method.id">
                {{ method.name }}
              </option>
            </select>
          </div>
          
          <!-- Customer Info -->
          <div class="mb-4">
            <input
              type="text"
              [(ngModel)]="customerPhone"
              placeholder="Teléfono del cliente (opcional)"
              class="w-full input-field mb-2"
            >
            <input
              type="email"
              [(ngModel)]="customerEmail"
              placeholder="Email del cliente (opcional)"
              class="w-full input-field"
            >
          </div>
          
          <!-- Action Buttons -->
          <div class="space-y-2">
            <button 
              (click)="processSale()"
              class="w-full btn-success"
              [disabled]="(cart$ | async)?.length === 0 || !selectedPaymentMethod"
            >
              💳 Procesar Venta
            </button>
            <button 
              (click)="clearCart()"
              class="w-full btn-outline"
              [disabled]="(cart$ | async)?.length === 0"
            >
              🗑️ Limpiar Carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .pos-grid {
      display: grid;
      grid-template-columns: 1fr 400px;
      gap: 1rem;
      height: calc(100vh - 4rem);
    }
    
    .pos-main {
      background: white;
      border-radius: 0.5rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    
    .pos-sidebar {
      background: white;
      border-radius: 0.5rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    
    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1rem;
      padding: 1rem;
      overflow-y: auto;
      max-height: calc(100vh - 8rem);
    }
    
    .product-card {
      @apply bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer;
    }
    
    .cart-item {
      @apply flex items-center justify-between p-3 border-b border-gray-200;
    }
  `]
})
export class PosComponent implements OnInit {
  private store = inject(Store<AppState>);
  private posService = inject(PosService);
  
  cart$: Observable<any[]> = this.store.select(selectCart);
  cartTotal$: Observable<number> = this.store.select(selectCartTotal);
  cartItemCount$: Observable<number> = this.store.select(selectCartItemCount);
  currentSession$: Observable<any> = this.store.select(selectCurrentSession);
  
  products: Product[] = [];
  paymentMethods: PaymentMethod[] = [];
  searchQuery = '';
  selectedPaymentMethod: number | null = null;
  customerPhone = '';
  customerEmail = '';
  
  ngOnInit(): void {
    this.loadProducts();
    this.loadPaymentMethods();
  }
  
  loadProducts(): void {
    // Load initial products or search
    this.posService.searchProduct('').subscribe(products => {
      this.products = products;
    });
  }
  
  loadPaymentMethods(): void {
    // Mock payment methods - in real app, load from API
    this.paymentMethods = [
      { id: 1, name: 'Efectivo', type: 'CASH', is_active: true, created_at: '', updated_at: '' },
      { id: 2, name: 'Tarjeta', type: 'CARD', is_active: true, created_at: '', updated_at: '' },
      { id: 3, name: 'Transferencia', type: 'TRANSFER', is_active: true, created_at: '', updated_at: '' }
    ];
  }
  
  searchProducts(): void {
    if (this.searchQuery.trim()) {
      this.posService.searchProduct(this.searchQuery).subscribe(products => {
        this.products = products;
      });
    } else {
      this.loadProducts();
    }
  }
  
  addProductToCart(product: Product): void {
    const existingItem = this.cart$.pipe().subscribe(cart => {
      const existing = cart.find(item => item.product.id === product.id);
      if (existing) {
        this.updateQuantity(cart.indexOf(existing), existing.quantity + 1);
      } else {
        this.store.dispatch(addToCart({
          item: {
            product,
            quantity: 1,
            unit_price: product.final_price,
            total: product.final_price
          }
        }));
      }
    });
  }
  
  updateQuantity(index: number, newQuantity: number): void {
    if (newQuantity <= 0) {
      this.removeItem(index);
      return;
    }
    
    this.cart$.pipe().subscribe(cart => {
      const item = cart[index];
      if (item) {
        this.store.dispatch(updateCartItem({
          index,
          item: {
            ...item,
            quantity: newQuantity,
            total: newQuantity * item.unit_price
          }
        }));
      }
    });
  }
  
  removeItem(index: number): void {
    this.store.dispatch(removeFromCart({ index }));
  }
  
  clearCart(): void {
    this.store.dispatch(clearCart());
  }
  
  processSale(): void {
    // Process the sale
    console.log('Processing sale...');
  }
}



