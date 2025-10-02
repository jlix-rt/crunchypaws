import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import { SeoService } from '../../services/seo.service';
import { ApiService } from '../../services/api.service';
import { Product, Category } from '../../models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  template: `
    <div class="min-h-screen">
      <!-- Hero Section -->
      <section class="bg-gradient-to-br from-primary-50 to-accent-50 py-20">
        <div class="container mx-auto px-4">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div class="text-center lg:text-left">
              <h1 class="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-neutral-900 mb-6">
                Snacks <span class="text-gradient">100% Naturales</span> 
                para tu Mascota
              </h1>
              <p class="text-lg text-neutral-600 mb-8 max-w-lg">
                Productos deshidratados sin conservantes, ricos en nutrientes y 
                deliciosos. Tu perro o gato los adorará.
              </p>
              <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button mat-raised-button 
                        color="primary" 
                        routerLink="/catalogo"
                        class="btn-primary text-lg px-8 py-3">
                  Ver Catálogo
                </button>
                <button mat-stroked-button 
                        routerLink="/informacion"
                        class="btn-outline text-lg px-8 py-3">
                  Conoce Más
                </button>
              </div>
            </div>
            <div class="relative">
              <img src="/assets/images/hero-pets.jpg" 
                   alt="Mascotas felices con productos CrunchyPaws"
                   class="w-full h-auto rounded-2xl shadow-2xl">
              <div class="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg">
                <div class="flex items-center space-x-3">
                  <mat-icon class="text-accent-500">pets</mat-icon>
                  <div>
                    <p class="font-semibold text-neutral-900">100% Natural</p>
                    <p class="text-sm text-neutral-600">Sin conservantes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="py-16 bg-white">
        <div class="container mx-auto px-4">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-display font-bold text-neutral-900 mb-4">
              ¿Por qué elegir CrunchyPaws?
            </h2>
            <p class="text-lg text-neutral-600 max-w-2xl mx-auto">
              Nos especializamos en productos deshidratados de la más alta calidad 
              para el bienestar de tu mascota.
            </p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="text-center p-6">
              <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <mat-icon class="text-primary-600 text-3xl">eco</mat-icon>
              </div>
              <h3 class="text-xl font-semibold text-neutral-900 mb-3">100% Natural</h3>
              <p class="text-neutral-600">
                Sin conservantes artificiales, colorantes ni químicos. 
                Solo ingredientes naturales de la mejor calidad.
              </p>
            </div>
            
            <div class="text-center p-6">
              <div class="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <mat-icon class="text-accent-600 text-3xl">favorite</mat-icon>
              </div>
              <h3 class="text-xl font-semibold text-neutral-900 mb-3">Saludable</h3>
              <p class="text-neutral-600">
                Rico en proteínas y nutrientes esenciales. 
                Perfecto para mantener a tu mascota sana y activa.
              </p>
            </div>
            
            <div class="text-center p-6">
              <div class="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <mat-icon class="text-secondary-600 text-3xl">thumb_up</mat-icon>
              </div>
              <h3 class="text-xl font-semibold text-neutral-900 mb-3">Delicioso</h3>
              <p class="text-neutral-600">
                Sabores irresistibles que tu mascota adorará. 
                Perfecto como premio o snack diario.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Featured Products -->
      <section class="py-16 bg-neutral-50" *ngIf="featuredProducts.length > 0">
        <div class="container mx-auto px-4">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-display font-bold text-neutral-900 mb-4">
              Productos Destacados
            </h2>
            <p class="text-lg text-neutral-600">
              Los favoritos de nuestros clientes peludos
            </p>
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <mat-card *ngFor="let product of featuredProducts" 
                      class="card-hover cursor-pointer"
                      (click)="goToProduct(product.slug)">
              <img [src]="product.imageUrl || '/assets/images/product-placeholder.jpg'" 
                   [alt]="product.name"
                   class="w-full h-48 object-cover">
              <mat-card-content class="p-4">
                <h3 class="font-semibold text-neutral-900 mb-2 line-clamp-2">
                  {{ product.name }}
                </h3>
                <p class="text-sm text-neutral-600 mb-3 line-clamp-2">
                  {{ product.description }}
                </p>
                <div class="flex items-center justify-between">
                  <span class="text-lg font-bold text-primary-600">
                    Q{{ product.price }}
                  </span>
                  <span class="text-xs text-neutral-500" 
                        [class.text-red-500]="product.stock < 5">
                    {{ product.stock > 0 ? 'Disponible' : 'Agotado' }}
                  </span>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
          
          <div class="text-center mt-8">
            <button mat-raised-button 
                    color="primary" 
                    routerLink="/catalogo"
                    class="btn-primary">
              Ver Todos los Productos
            </button>
          </div>
        </div>
      </section>

      <!-- Categories -->
      <section class="py-16 bg-white" *ngIf="categories.length > 0">
        <div class="container mx-auto px-4">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-display font-bold text-neutral-900 mb-4">
              Explora por Categorías
            </h2>
            <p class="text-lg text-neutral-600">
              Encuentra el producto perfecto para tu mascota
            </p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div *ngFor="let category of categories" 
                 class="relative overflow-hidden rounded-2xl shadow-lg cursor-pointer group"
                 (click)="goToCategory(category.slug)">
              <img [src]="getCategoryImage(category.slug)" 
                   [alt]="category.name"
                   class="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300">
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div class="absolute bottom-6 left-6 text-white">
                <h3 class="text-2xl font-bold mb-2">{{ category.name }}</h3>
                <p class="text-sm opacity-90">
                  {{ category.children.length }} subcategorías disponibles
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="py-16 bg-primary-600 text-white">
        <div class="container mx-auto px-4 text-center">
          <h2 class="text-3xl font-display font-bold mb-4">
            ¿Listo para consentir a tu mascota?
          </h2>
          <p class="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Únete a miles de dueños que ya confían en CrunchyPaws 
            para la alimentación saludable de sus mascotas.
          </p>
          <button mat-raised-button 
                  routerLink="/catalogo"
                  class="bg-white text-primary-600 hover:bg-neutral-100 font-semibold px-8 py-3">
            Comprar Ahora
          </button>
        </div>
      </section>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .container {
      max-width: 1200px;
    }

    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    mat-card {
      transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    }

    mat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }
  `]
})
export class HomeComponent implements OnInit {
  private seoService = inject(SeoService);
  private apiService = inject(ApiService);

  featuredProducts: Product[] = [];
  categories: Category[] = [];

  ngOnInit(): void {
    this.updateSeo();
    this.loadFeaturedProducts();
    this.loadCategories();
  }

  private updateSeo(): void {
    this.seoService.updateSeo({
      title: 'CrunchyPaws - Productos Deshidratados para Mascotas',
      description: 'Los mejores productos deshidratados para perros y gatos. 100% naturales, sin conservantes. Snacks saludables que tu mascota adorará.',
      keywords: 'productos deshidratados, mascotas, perros, gatos, snacks naturales, Guatemala',
      url: window.location.href,
      type: 'website'
    });
  }

  private loadFeaturedProducts(): void {
    this.apiService.get<Product[]>('/products/featured', { limit: 4 })
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.featuredProducts = response.data;
          }
        },
        error: (error) => {
          console.error('Error loading featured products:', error);
        }
      });
  }

  private loadCategories(): void {
    this.apiService.get<Category[]>('/categories')
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.categories = response.data.filter(cat => !cat.parentId);
          }
        },
        error: (error) => {
          console.error('Error loading categories:', error);
        }
      });
  }

  goToProduct(slug: string): void {
    window.location.href = `/producto/${slug}`;
  }

  goToCategory(slug: string): void {
    window.location.href = `/catalogo?category=${slug}`;
  }

  getCategoryImage(slug: string): string {
    const images: Record<string, string> = {
      'perro': '/assets/images/categories/perro.jpg',
      'gato': '/assets/images/categories/gato.jpg'
    };
    return images[slug] || '/assets/images/categories/default.jpg';
  }
}
