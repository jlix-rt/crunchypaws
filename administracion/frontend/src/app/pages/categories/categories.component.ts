import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService, Category } from '../../services/api.service';

interface CategoryFormData {
  name: string;
  parentId?: number;
  status: 'active' | 'inactive';
}

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="categories-container">
      <div class="page-header">
        <h1 class="page-title">Gestión de Categorías</h1>
        <p class="page-subtitle">Administra las categorías de productos</p>
      </div>

      <div class="controls-bar">
        <div class="search-section">
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input type="text" [(ngModel)]="searchQuery" (ngModelChange)="applyFilters()" placeholder="Buscar categoría...">
          </div>
          <select [(ngModel)]="selectedStatus" (ngModelChange)="applyFilters()" class="filter-select">
            <option value="">Todos los Estados</option>
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
          </select>
        </div>
        
        <div class="action-buttons">
          <button class="btn btn-secondary" (click)="clearFilters()">
            <i class="fas fa-times"></i>
            Limpiar Filtros
          </button>
          <button class="btn btn-primary" (click)="openAddModal()">
            <i class="fas fa-plus"></i>
            Nueva Categoría
          </button>
          <button class="btn btn-danger" [disabled]="!hasSelectedItems()" (click)="deleteSelected()">
            <i class="fas fa-trash"></i>
            Eliminar Seleccionados
          </button>
        </div>
      </div>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th class="checkbox-column">
                <input type="checkbox" [(ngModel)]="selectAll" (change)="toggleSelectAll()">
              </th>
              <th>ID</th>
              <th>Nombre</th>
              <th>Slug</th>
              <th>Estado</th>
              <th>Fecha Creación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let category of filteredCategories">
              <td class="checkbox-column">
                <input type="checkbox" [(ngModel)]="category.selected" (change)="onItemSelect()">
              </td>
              <td>{{ category.id }}</td>
              <td class="name-cell">{{ category.name }}</td>
              <td class="slug-cell">{{ category.slug }}</td>
              <td>
                <span [class]="getStatusClass(category.status)">
                  {{ category.status === 'active' ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td>{{ category.createdAt | date:'short' }}</td>
              <td class="actions-cell">
                <button class="btn-icon btn-edit" (click)="editCategory(category)" title="Editar">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon btn-delete" (click)="deleteCategory(category.id)" title="Eliminar">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
            <tr *ngIf="filteredCategories.length === 0">
              <td colspan="7" class="no-data">
                <i class="fas fa-inbox"></i>
                <p>No se encontraron categorías</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="pagination">
        <button class="btn btn-secondary" [disabled]="currentPage === 1" (click)="prevPage()">
          <i class="fas fa-chevron-left"></i>
          Anterior
        </button>
        <span class="page-info">Página {{ currentPage }} de {{ totalPages }}</span>
        <button class="btn btn-secondary" [disabled]="currentPage === totalPages" (click)="nextPage()">
          Siguiente
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>

      <!-- Modal para crear/editar categoría -->
      <div *ngIf="showModal" class="modal-overlay" (click)="closeModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{ isEditing ? 'Editar Categoría' : 'Nueva Categoría' }}</h3>
            <button class="close-btn" (click)="closeModal()">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <form [formGroup]="categoryForm" (ngSubmit)="saveCategory()" class="modal-body">
            <div class="form-group">
              <label for="name">Nombre *</label>
              <input 
                type="text" 
                id="name" 
                formControlName="name" 
                class="form-control"
                [class.error]="categoryForm.get('name')?.invalid && categoryForm.get('name')?.touched"
                placeholder="Nombre de la categoría"
              >
              <div *ngIf="categoryForm.get('name')?.invalid && categoryForm.get('name')?.touched" class="error-message">
                El nombre es requerido y debe tener al menos 2 caracteres
              </div>
            </div>

            <div class="form-group">
              <label for="parentId">Categoría Padre</label>
              <select id="parentId" formControlName="parentId" class="form-control">
                <option value="">Sin categoría padre</option>
                <option *ngFor="let cat of categories" [value]="cat.id">{{ cat.name }}</option>
              </select>
            </div>

            <div class="form-group">
              <label for="status">Estado *</label>
              <select id="status" formControlName="status" class="form-control">
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
              </select>
            </div>
          </form>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="closeModal()">
              Cancelar
            </button>
            <button 
              type="button" 
              class="btn btn-primary" 
              (click)="saveCategory()"
              [disabled]="categoryForm.invalid"
            >
              {{ isEditing ? 'Actualizar' : 'Crear' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .categories-container {
      padding: 2rem;
      background: #f8f9fa;
      min-height: 100vh;
    }

    .page-header {
      margin-bottom: 2rem;
    }

    .page-title {
      font-size: 2rem;
      font-weight: 700;
      color: #2c3e50;
      margin: 0 0 0.5rem 0;
    }

    .page-subtitle {
      color: #6c757d;
      margin: 0;
    }

    .controls-bar {
      background: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .search-section {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .search-box {
      position: relative;
      display: flex;
      align-items: center;
    }

    .search-box i {
      position: absolute;
      left: 1rem;
      color: #6c757d;
      z-index: 2;
    }

    .search-box input {
      padding: 0.75rem 1rem 0.75rem 2.5rem;
      border: 2px solid #e1e5e9;
      border-radius: 8px;
      width: 300px;
      font-size: 1rem;
      transition: border-color 0.3s ease;
    }

    .search-box input:focus {
      outline: none;
      border-color: #3498db;
    }

    .filter-select {
      padding: 0.75rem 1rem;
      border: 2px solid #e1e5e9;
      border-radius: 8px;
      background: white;
      font-size: 1rem;
      min-width: 150px;
    }

    .action-buttons {
      display: flex;
      gap: 0.75rem;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn-primary {
      background: #3498db;
      color: white;
    }

    .btn-primary:hover {
      background: #2980b9;
      transform: translateY(-2px);
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
    }

    .btn-secondary:hover:not(:disabled) {
      background: #5a6268;
    }

    .btn-danger {
      background: #e74c3c;
      color: white;
    }

    .btn-danger:hover:not(:disabled) {
      background: #c0392b;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .table-container {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
    }

    .data-table th {
      background: #f8f9fa;
      padding: 1rem;
      text-align: left;
      font-weight: 600;
      color: #2c3e50;
      border-bottom: 2px solid #e1e5e9;
    }

    .data-table td {
      padding: 1rem;
      border-bottom: 1px solid #e1e5e9;
    }

    .checkbox-column {
      width: 50px;
      text-align: center;
    }

    .name-cell {
      font-weight: 600;
      color: #2c3e50;
    }

    .slug-cell {
      color: #6c757d;
      font-family: monospace;
      font-size: 0.9rem;
    }

    .count-cell {
      text-align: center;
      font-weight: 600;
      color: #3498db;
    }

    .status-active {
      color: #27ae60;
      font-weight: 600;
    }

    .status-inactive {
      color: #e74c3c;
      font-weight: 600;
    }

    .actions-cell {
      text-align: center;
    }

    .btn-icon {
      padding: 0.5rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      margin: 0 0.25rem;
      transition: all 0.3s ease;
    }

    .btn-edit {
      background: #f39c12;
      color: white;
    }

    .btn-edit:hover {
      background: #e67e22;
    }

    .btn-delete {
      background: #e74c3c;
      color: white;
    }

    .btn-delete:hover {
      background: #c0392b;
    }

    .no-data {
      text-align: center;
      padding: 3rem;
      color: #6c757d;
    }

    .no-data i {
      font-size: 3rem;
      margin-bottom: 1rem;
      display: block;
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      margin-top: 2rem;
    }

    .page-info {
      color: #6c757d;
      font-weight: 500;
    }

    @media (max-width: 768px) {
      .controls-bar {
        flex-direction: column;
        align-items: stretch;
      }

      .search-section {
        flex-direction: column;
      }

      .search-box input {
        width: 100%;
      }

      .action-buttons {
        justify-content: center;
      }
    }

    /* Modal Styles */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      border-radius: 12px;
      width: 90%;
      max-width: 500px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }

    .modal-header {
      padding: 1.5rem;
      border-bottom: 1px solid #e1e5e9;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .modal-header h3 {
      margin: 0;
      color: #2c3e50;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      color: #6c757d;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 50%;
      transition: all 0.3s ease;
    }

    .close-btn:hover {
      background: #f8f9fa;
      color: #2c3e50;
    }

    .modal-body {
      padding: 1.5rem;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #2c3e50;
    }

    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 2px solid #e1e5e9;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.3s ease;
    }

    .form-control:focus {
      outline: none;
      border-color: #3498db;
    }

    .form-control.error {
      border-color: #e74c3c;
    }

    .error-message {
      color: #e74c3c;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .modal-footer {
      padding: 1.5rem;
      border-top: 1px solid #e1e5e9;
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
    }
  `]
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  searchQuery: string = '';
  selectedStatus: string = '';
  selectAll: boolean = false;

  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;

  // Modal states
  showModal: boolean = false;
  isEditing: boolean = false;
  editingCategory: Category | null = null;
  categoryForm: FormGroup;

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder
  ) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      parentId: [null],
      status: ['active', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.apiService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.applyFilters();
        console.log('Categorías cargadas:', categories);
      },
      error: (error) => {
        console.error('Error cargando categorías:', error);
        // Fallback a datos mock si hay error
        this.categories = [
          { id: 1, name: 'Alimentos', slug: 'alimentos', status: 'active', createdAt: '2023-10-01', updatedAt: '2023-10-01' },
          { id: 2, name: 'Juguetes', slug: 'juguetes', status: 'active', createdAt: '2023-10-02', updatedAt: '2023-10-02' },
          { id: 3, name: 'Accesorios', slug: 'accesorios', status: 'active', createdAt: '2023-10-03', updatedAt: '2023-10-03' },
          { id: 4, name: 'Cuidado', slug: 'cuidado', status: 'inactive', createdAt: '2023-10-04', updatedAt: '2023-10-04' }
        ];
        this.applyFilters();
      }
    });
  }

  applyFilters(): void {
    let temp = this.categories;

    if (this.searchQuery) {
      temp = temp.filter(cat =>
        cat.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        cat.slug.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    if (this.selectedStatus) {
      temp = temp.filter(cat => cat.status === this.selectedStatus);
    }

    this.totalItems = temp.length;
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    this.currentPage = 1;
    this.updatePagedItems(temp);
  }

  updatePagedItems(items: Category[]): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.filteredCategories = items.slice(start, end);
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedStatus = '';
    this.applyFilters();
  }

  openAddModal(): void {
    this.isEditing = false;
    this.editingCategory = null;
    this.categoryForm.reset({
      name: '',
      parentId: null,
      status: 'active'
    });
    this.showModal = true;
  }

  editCategory(category: Category): void {
    this.isEditing = true;
    this.editingCategory = category;
    this.categoryForm.patchValue({
      name: category.name,
      parentId: category.parentId || null,
      status: category.status
    });
    this.showModal = true;
  }

  saveCategory(): void {
    if (this.categoryForm.valid) {
      const formData = this.categoryForm.value as CategoryFormData;
      
      if (this.isEditing && this.editingCategory) {
        // Actualizar categoría existente
        this.apiService.updateCategory(this.editingCategory.id, formData).subscribe({
          next: (updatedCategory) => {
            const index = this.categories.findIndex(c => c.id === this.editingCategory!.id);
            if (index !== -1) {
              this.categories[index] = updatedCategory;
              this.applyFilters();
            }
            this.closeModal();
            console.log('Categoría actualizada:', updatedCategory);
          },
          error: (error) => {
            console.error('Error actualizando categoría:', error);
            alert('Error al actualizar la categoría');
          }
        });
      } else {
        // Crear nueva categoría
        this.apiService.createCategory(formData).subscribe({
          next: (newCategory) => {
            this.categories.push(newCategory);
            this.applyFilters();
            this.closeModal();
            console.log('Categoría creada:', newCategory);
          },
          error: (error) => {
            console.error('Error creando categoría:', error);
            alert('Error al crear la categoría');
          }
        });
      }
    }
  }

  deleteCategory(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
      this.apiService.deleteCategory(id).subscribe({
        next: () => {
          this.categories = this.categories.filter(c => c.id !== id);
          this.applyFilters();
          console.log('Categoría eliminada');
        },
        error: (error) => {
          console.error('Error eliminando categoría:', error);
          alert('Error al eliminar la categoría');
        }
      });
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.isEditing = false;
    this.editingCategory = null;
    this.categoryForm.reset();
  }

  toggleSelectAll(): void {
    this.filteredCategories.forEach(item => item.selected = this.selectAll);
  }

  onItemSelect(): void {
    this.selectAll = this.filteredCategories.every(item => item.selected);
  }

  hasSelectedItems(): boolean {
    return this.filteredCategories.some(item => item.selected);
  }

  deleteSelected(): void {
    if (confirm('¿Estás seguro de que quieres eliminar las categorías seleccionadas?')) {
      this.categories = this.categories.filter(cat => !cat.selected);
      this.applyFilters();
      this.selectAll = false;
    }
  }

  getStatusClass(status: 'active' | 'inactive'): string {
    return status === 'active' ? 'status-active' : 'status-inactive';
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.applyFilters();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.applyFilters();
    }
  }
}

