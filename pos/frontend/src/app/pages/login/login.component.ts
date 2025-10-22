import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <div class="max-w-md w-full space-y-8">
        <div class="text-center">
          <div class="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center">
            <span class="text-2xl text-white">🛒</span>
          </div>
          <h2 class="mt-6 text-3xl font-bold text-gray-900">
            CrunchyPaws POS
          </h2>
          <p class="mt-2 text-sm text-gray-600">
            Sistema de Punto de Venta
          </p>
        </div>
        
        <form class="mt-8 space-y-6" (ngSubmit)="onSubmit()" #loginForm="ngForm">
          <div class="space-y-4">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                [(ngModel)]="credentials.email"
                required
                class="mt-1 input-field"
                placeholder="tu@email.com"
              >
            </div>
            
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                [(ngModel)]="credentials.password"
                required
                class="mt-1 input-field"
                placeholder="Tu contraseña"
              >
            </div>
          </div>
          
          <div *ngIf="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {{ error }}
          </div>
          
          <div>
            <button
              type="submit"
              [disabled]="isLoading || !loginForm.form.valid"
              class="w-full btn-primary"
            >
              <span *ngIf="isLoading" class="animate-spin mr-2">⏳</span>
              {{ isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
            </button>
          </div>
        </form>
        
        <div class="text-center">
          <p class="text-sm text-gray-600">
            Solo empleados autorizados pueden acceder
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .input-field {
      @apply w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent;
    }
    
    .btn-primary {
      @apply bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed;
    }
    
    .animate-spin {
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `]
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  credentials = {
    email: '',
    password: ''
  };
  
  isLoading = false;
  error = '';
  
  onSubmit(): void {
    if (this.isLoading) return;
    
    this.isLoading = true;
    this.error = '';
    
    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.router.navigate(['/pos']);
      },
      error: (error) => {
        this.isLoading = false;
        this.error = error.error?.message || 'Error al iniciar sesión';
      }
    });
  }
}



