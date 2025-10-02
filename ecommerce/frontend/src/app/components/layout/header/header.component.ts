import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';

import { AuthService } from '../../../services/auth.service';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    MatMenuModule
  ],
  template: `
    <mat-toolbar class="bg-white shadow-md border-b border-neutral-200">
      <div class="container mx-auto flex items-center justify-between px-4">
        <!-- Logo -->
        <a routerLink="/" class="flex items-center space-x-2">
          <img src="/assets/images/logo.png" alt="CrunchyPaws" class="h-10 w-auto">
          <span class="text-xl font-display font-bold text-primary-600 hidden sm:block">
            CrunchyPaws
          </span>
        </a>

        <!-- Navigation -->
        <nav class="hidden md:flex items-center space-x-6">
          <a routerLink="/catalogo" 
             routerLinkActive="text-primary-600" 
             class="text-neutral-700 hover:text-primary-600 font-medium transition-colors">
            Catálogo
          </a>
          <a routerLink="/informacion" 
             routerLinkActive="text-primary-600"
             class="text-neutral-700 hover:text-primary-600 font-medium transition-colors">
            Información
          </a>
          <a routerLink="/contacto" 
             routerLinkActive="text-primary-600"
             class="text-neutral-700 hover:text-primary-600 font-medium transition-colors">
            Contacto
          </a>
        </nav>

        <!-- Actions -->
        <div class="flex items-center space-x-2">
          <!-- Cart -->
          <button mat-icon-button 
                  routerLink="/carrito"
                  [matBadge]="cartItemCount()"
                  [matBadgeHidden]="cartItemCount() === 0"
                  matBadgeColor="accent"
                  class="relative">
            <mat-icon>shopping_cart</mat-icon>
          </button>

          <!-- User menu -->
          <div *ngIf="authService.isAuthenticated(); else loginButton">
            <button mat-icon-button [matMenuTriggerFor]="userMenu">
              <mat-icon>account_circle</mat-icon>
            </button>
            <mat-menu #userMenu="matMenu">
              <button mat-menu-item routerLink="/perfil">
                <mat-icon>person</mat-icon>
                <span>Mi Perfil</span>
              </button>
              <button mat-menu-item routerLink="/direcciones">
                <mat-icon>location_on</mat-icon>
                <span>Mis Direcciones</span>
              </button>
              <button mat-menu-item routerLink="/ordenes">
                <mat-icon>receipt_long</mat-icon>
                <span>Mis Órdenes</span>
              </button>
              <mat-divider></mat-divider>
              <button mat-menu-item (click)="logout()">
                <mat-icon>logout</mat-icon>
                <span>Cerrar Sesión</span>
              </button>
            </mat-menu>
          </div>

          <ng-template #loginButton>
            <button mat-button routerLink="/auth/login" class="text-primary-600">
              Iniciar Sesión
            </button>
          </ng-template>

          <!-- Mobile menu -->
          <button mat-icon-button 
                  class="md:hidden"
                  [matMenuTriggerFor]="mobileMenu">
            <mat-icon>menu</mat-icon>
          </button>
          <mat-menu #mobileMenu="matMenu">
            <button mat-menu-item routerLink="/catalogo">
              <mat-icon>store</mat-icon>
              <span>Catálogo</span>
            </button>
            <button mat-menu-item routerLink="/informacion">
              <mat-icon>info</mat-icon>
              <span>Información</span>
            </button>
            <button mat-menu-item routerLink="/contacto">
              <mat-icon>contact_mail</mat-icon>
              <span>Contacto</span>
            </button>
          </mat-menu>
        </div>
      </div>
    </mat-toolbar>
  `,
  styles: [`
    :host {
      display: block;
    }

    .container {
      max-width: 1200px;
    }

    mat-toolbar {
      height: 64px;
      padding: 0;
    }

    .router-link-active {
      color: #f2804b !important;
    }
  `]
})
export class HeaderComponent {
  authService = inject(AuthService);
  private cartService = inject(CartService);

  cartItemCount = computed(() => this.cartService.itemCount());

  logout(): void {
    this.authService.logout();
  }
}
