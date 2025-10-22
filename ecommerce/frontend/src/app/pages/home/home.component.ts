import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';

import { ProductService } from '../../services/product.service';
import { SeoService } from '../../services/seo.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen">
      <!-- Hero Section -->
      <section class="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-20">
        <div class="container mx-auto px-4 text-center">
          <h1 class="text-4xl md:text-6xl font-bold mb-6">
            Todo para tu Mascota
          </h1>
          <p class="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Encuentra los mejores productos para perros y gatos en Guatemala. 
            Alimentos, accesorios, juguetes y más con envío a todo el país.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button routerLink="/catalogo" class="btn-white">
              Ver Catálogo
            </button>
            <button routerLink="/ofertas" class="btn-outline-white">
              Ver Ofertas
            </button>
          </div>
        </div>
      </section>
      
      <!-- Featured Categories -->
      <section class="py-16 bg-gray-50">
        <div class="container mx-auto px-4">
          <h2 class="text-3xl font-bold text-center mb-12">Categorías Destacadas</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="card text-center p-8 hover:shadow-lg transition-shadow">
              <div class="text-6xl mb-4">🐕</div>
              <h3 class="text-xl font-semibold mb-4">Perros</h3>
              <p class="text-gray-600 mb-6">Alimentos, juguetes, accesorios y cuidados para tu mejor amigo</p>
              <button routerLink="/catalogo/perros" class="btn-primary">
                Ver Productos
              </button>
            </div>
            
            <div class="card text-center p-8 hover:shadow-lg transition-shadow">
              <div class="text-6xl mb-4">🐱</div>
              <h3 class="text-xl font-semibold mb-4">Gatos</h3>
              <p class="text-gray-600 mb-6">Todo lo que tu gato necesita para estar feliz y saludable</p>
              <button routerLink="/catalogo/gatos" class="btn-primary">
                Ver Productos
              </button>
            </div>
            
            <div class="card text-center p-8 hover:shadow-lg transition-shadow">
              <div class="text-6xl mb-4">🎾</div>
              <h3 class="text-xl font-semibold mb-4">Accesorios</h3>
              <p class="text-gray-600 mb-6">Collares, correas, juguetes y más accesorios divertidos</p>
              <button routerLink="/catalogo/accesorios" class="btn-primary">
                Ver Productos
              </button>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Featured Products -->
      <section class="py-16">
        <div class="container mx-auto px-4">
          <h2 class="text-3xl font-bold text-center mb-12">Productos Destacados</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" *ngIf="featuredProducts$ | async as products">
            <div *ngFor="let product of products" class="card p-4 hover:shadow-lg transition-shadow">
              <img 
                [src]="product.images?.[0]?.url || 'assets/images/placeholder.jpg'" 
                [alt]="product.name"
                class="w-full h-48 object-cover rounded mb-4"
              >
              <h3 class="font-semibold mb-2">{{ product.name }}</h3>
              <p class="text-gray-600 text-sm mb-2">{{ product.sku }}</p>
              <p class="text-primary-600 font-bold text-lg mb-4">Q{{ product.final_price | number:'1.2-2' }}</p>
              <button 
                routerLink="/producto/{{ product.slug }}"
                class="w-full btn-primary"
              >
                Ver Producto
              </button>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Why Choose Us -->
      <section class="py-16 bg-gray-50">
        <div class="container mx-auto px-4">
          <h2 class="text-3xl font-bold text-center mb-12">¿Por qué elegir CrunchyPaws?</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div class="text-center">
              <div class="text-4xl mb-4">🚚</div>
              <h3 class="text-lg font-semibold mb-2">Envío Gratis</h3>
              <p class="text-gray-600">Envío gratuito en compras mayores a Q200</p>
            </div>
            
            <div class="text-center">
              <div class="text-4xl mb-4">💳</div>
              <h3 class="text-lg font-semibold mb-2">Pago Seguro</h3>
              <p class="text-gray-600">Múltiples métodos de pago seguros</p>
            </div>
            
            <div class="text-center">
              <div class="text-4xl mb-4">🔄</div>
              <h3 class="text-lg font-semibold mb-2">Devoluciones</h3>
              <p class="text-gray-600">30 días para devoluciones sin problemas</p>
            </div>
            
            <div class="text-center">
              <div class="text-4xl mb-4">📞</div>
              <h3 class="text-lg font-semibold mb-2">Soporte 24/7</h3>
              <p class="text-gray-600">Atención al cliente cuando la necesites</p>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Newsletter -->
      <section class="py-16 bg-primary-600 text-white">
        <div class="container mx-auto px-4 text-center">
          <h2 class="text-3xl font-bold mb-4">Mantente al día</h2>
          <p class="text-xl mb-8">Recibe ofertas exclusivas y novedades sobre productos para mascotas</p>
          <div class="max-w-md mx-auto flex">
            <input 
              type="email" 
              placeholder="Tu email"
              class="flex-1 px-4 py-2 rounded-l-lg text-gray-900"
            >
            <button class="bg-secondary-600 hover:bg-secondary-700 px-6 py-2 rounded-r-lg font-medium">
              Suscribirse
            </button>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
    }
    
    .btn-primary {
      @apply bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200;
    }
    
    .btn-white {
      @apply bg-white hover:bg-gray-100 text-primary-600 font-medium py-3 px-6 rounded-lg transition-colors duration-200;
    }
    
    .btn-outline-white {
      @apply border-2 border-white text-white hover:bg-white hover:text-primary-600 font-medium py-3 px-6 rounded-lg transition-colors duration-200;
    }
    
    .card {
      @apply bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200;
    }
  `]
})
export class HomeComponent implements OnInit {
  private productService = inject(ProductService);
  private seoService = inject(SeoService);
  
  featuredProducts$: Observable<Product[]>;
  
  ngOnInit(): void {
    // Set SEO
    this.seoService.setPageTitle('Inicio');
    this.seoService.setPageDescription('CrunchyPaws - La mejor tienda de mascotas en Guatemala. Alimentos, accesorios, juguetes y más para perros y gatos.');
    
    // Load featured products
    this.featuredProducts$ = this.productService.getFeaturedProducts();
  }
}



