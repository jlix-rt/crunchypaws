import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AppState } from '../../store/app.state';
import { selectCart, selectCartItems } from '../../store/selectors/app.selector';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="fixed inset-0 z-50 overflow-hidden" *ngIf="isOpen">
      <div class="absolute inset-0 bg-black bg-opacity-50" (click)="closeCart()"></div>
      
      <div class="absolute right-0 top-0 h-full w-96 bg-white shadow-xl">
        <div class="flex flex-col h-full">
          <!-- Header -->
          <div class="flex items-center justify-between p-4 border-b">
            <h2 class="text-lg font-semibold">Carrito de Compras</h2>
            <button (click)="closeCart()" class="text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>
          
          <!-- Cart Items -->
          <div class="flex-1 overflow-y-auto p-4" *ngIf="cart$ | async as cart">
            <div *ngIf="cart.items.length === 0" class="text-center py-8">
              <p class="text-gray-500">Tu carrito está vacío</p>
              <button 
                routerLink="/catalogo" 
                (click)="closeCart()"
                class="btn-primary mt-4"
              >
                Ir a Comprar
              </button>
            </div>
            
            <div *ngFor="let item of cart.items" class="flex items-center space-x-4 py-4 border-b">
              <img 
                [src]="item.product.images?.[0]?.url || 'assets/images/placeholder.jpg'" 
                [alt]="item.product.name"
                class="w-16 h-16 object-cover rounded"
              >
              <div class="flex-1">
                <h3 class="font-medium">{{ item.product.name }}</h3>
                <p class="text-sm text-gray-500">{{ item.product.sku }}</p>
                <p class="text-sm text-gray-500">Cantidad: {{ item.quantity }}</p>
                <p class="font-semibold text-primary-600">Q{{ item.total_price | number:'1.2-2' }}</p>
              </div>
              <button 
                (click)="removeItem(item.id)"
                class="text-red-500 hover:text-red-700"
              >
                🗑️
              </button>
            </div>
          </div>
          
          <!-- Footer -->
          <div class="border-t p-4" *ngIf="cart$ | async as cart">
            <div class="flex justify-between items-center mb-4">
              <span class="font-semibold">Total:</span>
              <span class="text-xl font-bold text-primary-600">Q{{ cart.total | number:'1.2-2' }}</span>
            </div>
            <div class="space-y-2">
              <button 
                routerLink="/carrito" 
                (click)="closeCart()"
                class="w-full btn-outline"
              >
                Ver Carrito
              </button>
              <button 
                routerLink="/checkout" 
                (click)="closeCart()"
                class="w-full btn-primary"
                [disabled]="cart.items.length === 0"
              >
                Proceder al Pago
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .btn-primary {
      @apply bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200;
    }
    
    .btn-outline {
      @apply border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200;
    }
  `]
})
export class CartSidebarComponent {
  private store = inject(Store<AppState>);
  private cartService = inject(CartService);
  
  cart$: Observable<any> = this.store.select(selectCart);
  isOpen = false;
  
  closeCart(): void {
    this.isOpen = false;
  }
  
  removeItem(itemId: string): void {
    this.cartService.removeFromCart(itemId).subscribe();
  }
}



