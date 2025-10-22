import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AppState } from '../../store/app.state';
import { selectIsAuthenticated, selectUser, selectCartItemCount } from '../../store/selectors/app.selector';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { SearchModalComponent } from '../search-modal/search-modal.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    SearchModalComponent
  ],
  template: `
    <header class="bg-white shadow-md sticky top-0 z-50">
      <!-- Top Bar -->
      <div class="bg-primary-600 text-white py-2">
        <div class="container mx-auto px-4">
          <div class="flex justify-between items-center text-sm">
            <div class="flex items-center space-x-4">
              <span>📞 +502-1234-5678</span>
              <span>✉️ info@crunchypaws.com</span>
            </div>
            <div class="flex items-center space-x-4">
              <a href="#" class="hover:text-primary-200">📱 WhatsApp</a>
              <a href="#" class="hover:text-primary-200">📘 Facebook</a>
              <a href="#" class="hover:text-primary-200">📷 Instagram</a>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Main Header -->
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <!-- Logo -->
          <div class="flex items-center">
            <a routerLink="/" class="flex items-center space-x-2">
              <img src="assets/images/logo.png" alt="CrunchyPaws" class="h-10 w-auto">
              <span class="text-2xl font-bold text-primary-600">CrunchyPaws</span>
            </a>
          </div>
          
          <!-- Search Bar -->
          <div class="flex-1 max-w-2xl mx-8">
            <div class="relative">
              <input
                type="text"
                placeholder="Buscar productos..."
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                (click)="openSearchModal()"
                readonly
              >
              <button class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </button>
            </div>
          </div>
          
          <!-- User Actions -->
          <div class="flex items-center space-x-4">
            <!-- Wishlist -->
            <button class="relative p-2 text-gray-600 hover:text-primary-600">
              ❤️
              <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">0</span>
            </button>
            
            <!-- Cart -->
            <button 
              class="relative p-2 text-gray-600 hover:text-primary-600"
              (click)="toggleCart()"
            >
              🛒
              <span 
                *ngIf="cartItemCount$ | async as count"
                class="absolute -top-1 -right-1 bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
              >
                {{ count }}
              </span>
            </button>
            
            <!-- User Menu -->
            <div class="relative" *ngIf="isAuthenticated$ | async; else loginButton">
              <button class="flex items-center space-x-2 text-gray-600 hover:text-primary-600">
                <span>👤</span>
                <span>{{ (user$ | async)?.full_name }}</span>
                <span>▼</span>
              </button>
              <!-- Dropdown menu would go here -->
            </div>
            
            <ng-template #loginButton>
              <button 
                class="btn-primary"
                (click)="goToLogin()"
              >
                Iniciar Sesión
              </button>
            </ng-template>
          </div>
        </div>
      </div>
      
      <!-- Navigation -->
      <nav class="bg-gray-50 border-t">
        <div class="container mx-auto px-4">
          <div class="flex items-center space-x-8 py-3">
            <a routerLink="/catalogo" class="text-gray-700 hover:text-primary-600 font-medium">
              🐕 Perros
            </a>
            <a routerLink="/catalogo/gatos" class="text-gray-700 hover:text-primary-600 font-medium">
              🐱 Gatos
            </a>
            <a routerLink="/catalogo/accesorios" class="text-gray-700 hover:text-primary-600 font-medium">
              🎾 Accesorios
            </a>
            <a routerLink="/ofertas" class="text-gray-700 hover:text-primary-600 font-medium">
              🏷️ Ofertas
            </a>
            <a routerLink="/nosotros" class="text-gray-700 hover:text-primary-600 font-medium">
              ℹ️ Nosotros
            </a>
            <a routerLink="/contacto" class="text-gray-700 hover:text-primary-600 font-medium">
              📞 Contacto
            </a>
          </div>
        </div>
      </nav>
    </header>
    
    <!-- Search Modal -->
    <app-search-modal></app-search-modal>
  `,
  styles: [`
    .container {
      max-width: 1200px;
    }
  `]
})
export class HeaderComponent implements OnInit {
  private store = inject(Store<AppState>);
  private router = inject(Router);
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  
  isAuthenticated$: Observable<boolean> = this.store.select(selectIsAuthenticated);
  user$: Observable<any> = this.store.select(selectUser);
  cartItemCount$: Observable<number> = this.store.select(selectCartItemCount);
  
  ngOnInit(): void {
    // Initialize cart
    this.cartService.getCart().subscribe();
  }
  
  openSearchModal(): void {
    // Open search modal logic
  }
  
  toggleCart(): void {
    // Toggle cart sidebar logic
  }
  
  goToLogin(): void {
    this.router.navigate(['/cuenta/login']);
  }
}



