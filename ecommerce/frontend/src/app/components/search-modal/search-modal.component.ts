import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';

import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-search-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="fixed inset-0 z-50 overflow-hidden" *ngIf="isOpen">
      <div class="absolute inset-0 bg-black bg-opacity-50" (click)="closeModal()"></div>
      
      <div class="absolute top-20 left-1/2 transform -translate-x-1/2 w-full max-w-2xl bg-white rounded-lg shadow-xl">
        <div class="p-4">
          <!-- Search Input -->
          <div class="relative mb-4">
            <input
              type="text"
              [(ngModel)]="searchQuery"
              (input)="onSearch()"
              placeholder="Buscar productos..."
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              autofocus
            >
            <button (click)="closeModal()" class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              ✕
            </button>
          </div>
          
          <!-- Search Results -->
          <div *ngIf="searchResults$ | async as results" class="max-h-96 overflow-y-auto">
            <div *ngIf="results.length === 0 && searchQuery" class="text-center py-8 text-gray-500">
              No se encontraron productos
            </div>
            
            <div *ngFor="let product of results" class="flex items-center space-x-4 py-3 border-b hover:bg-gray-50 cursor-pointer"
                 (click)="selectProduct(product)">
              <img 
                [src]="product.images?.[0]?.url || 'assets/images/placeholder.jpg'" 
                [alt]="product.name"
                class="w-12 h-12 object-cover rounded"
              >
              <div class="flex-1">
                <h3 class="font-medium">{{ product.name }}</h3>
                <p class="text-sm text-gray-500">{{ product.sku }}</p>
                <p class="font-semibold text-primary-600">Q{{ product.final_price | number:'1.2-2' }}</p>
              </div>
            </div>
          </div>
          
          <!-- Popular Searches -->
          <div *ngIf="!searchQuery" class="py-4">
            <h3 class="font-semibold mb-2">Búsquedas Populares</h3>
            <div class="flex flex-wrap gap-2">
              <button 
                *ngFor="let term of popularSearches"
                (click)="searchQuery = term; onSearch()"
                class="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm"
              >
                {{ term }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .max-h-96 {
      max-height: 24rem;
    }
  `]
})
export class SearchModalComponent {
  private productService = inject(ProductService);
  
  isOpen = false;
  searchQuery = '';
  searchResults$: Observable<Product[]> = new Observable();
  private searchSubject = new Subject<string>();
  
  popularSearches = [
    'Alimento para perros',
    'Juguetes para gatos',
    'Accesorios',
    'Shampoo',
    'Collares'
  ];
  
  ngOnInit(): void {
    this.searchResults$ = this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => 
        query ? this.productService.searchProducts(query, { limit: 10 }) : new Observable(observer => observer.next([]))
      )
    );
  }
  
  onSearch(): void {
    this.searchSubject.next(this.searchQuery);
  }
  
  selectProduct(product: Product): void {
    // Navigate to product detail
    this.closeModal();
  }
  
  closeModal(): void {
    this.isOpen = false;
    this.searchQuery = '';
  }
}



