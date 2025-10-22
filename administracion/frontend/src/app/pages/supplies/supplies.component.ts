import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalComponent } from '../../components/modal/modal.component';
import { ApiService, Supply, Category, Unit } from '../../services/api.service';

@Component({
  selector: 'app-supplies',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ModalComponent],
  template: `
    <div class="supplies-container">
      <div class="page-header">
        <h1 class="page-title">Gestión de Insumos</h1>
        <p class="page-subtitle">Administra el inventario de insumos</p>
      </div>

      <div class="controls-bar">
        <div class="search-section">
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input type="text" [(ngModel)]="searchQuery" (ngModelChange)="applyFilters()" placeholder="Buscar insumo...">
          </div>
          <select [(ngModel)]="selectedCategory" (ngModelChange)="applyFilters()" class="filter-select">
            <option value="">Todas las Categorías</option>
            <option *ngFor="let category of availableCategories" [value]="category.name">{{ category.name }}</option>
          </select>
          <select [(ngModel)]="selectedStatus" (ngModelChange)="applyFilters()" class="filter-select">
            <option value="">Todos los Estados</option>
            <option value="available">Disponible</option>
            <option value="low_stock">Poco Stock</option>
            <option value="out_of_stock">Agotado</option>
          </select>
        </div>
        
        <div class="action-buttons">
          <button class="btn btn-secondary" (click)="clearFilters()">
            <i class="fas fa-times"></i>
            Limpiar Filtros
          </button>
          <button class="btn btn-primary" (click)="openAddModal()">
            <i class="fas fa-plus"></i>
            Nuevo Insumo
          </button>
          <button class="btn btn-danger" [disabled]="!hasSelectedSupplies()" (click)="deleteSelectedSupplies()">
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
              <th>Categoría</th>
              <th>Stock</th>
              <th>Unidad</th>
              <th>Precio Unitario</th>
              <th>Estado</th>
              <th>Última Actualización</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let supply of filteredSupplies">
              <td class="checkbox-column">
                <input type="checkbox" [(ngModel)]="supply.selected" (change)="onSupplySelect()">
              </td>
              <td>{{ supply.id }}</td>
              <td class="name-cell">{{ supply.name }}</td>
              <td>{{ supply.category }}</td>
              <td class="stock-cell">{{ supply.stock }}</td>
              <td>{{ supply.unit }}</td>
              <td class="price-cell">Q{{ supply.unitPrice | number:'1.2-2' }}</td>
              <td>
                <span [class]="getStatusClass(supply.status)">
                  {{ getStatusText(supply.status) }}
                </span>
              </td>
              <td class="date-cell">{{ supply.lastUpdated }}</td>
              <td class="actions-cell">
                <button class="btn-icon btn-edit" (click)="editSupply(supply)" title="Editar">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon btn-delete" (click)="deleteSupply(supply.id)" title="Eliminar">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
            <tr *ngIf="filteredSupplies.length === 0">
              <td colspan="10" class="no-data">
                <i class="fas fa-boxes"></i>
                <p>No se encontraron insumos</p>
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
    </div>

    <!-- Modal para agregar/editar insumo -->
    <app-modal 
      [isOpen]="showModal" 
      [title]="modalTitle"
      [confirmText]="isEditing ? 'Actualizar' : 'Crear'"
      [disableConfirm]="supplyForm.invalid"
      (onClose)="closeModal()"
      (onConfirm)="saveSupply()">
      
      <form [formGroup]="supplyForm" class="supply-form">
        <div class="form-row">
          <div class="form-group">
            <label for="name">Nombre del Insumo *</label>
            <input type="text" id="name" formControlName="name" class="form-control"
                   [class.is-invalid]="supplyForm.get('name')?.invalid && supplyForm.get('name')?.touched">
            <div *ngIf="supplyForm.get('name')?.invalid && supplyForm.get('name')?.touched" class="invalid-feedback">
              <div *ngIf="supplyForm.get('name')?.errors?.['required']">El nombre es requerido</div>
            </div>
          </div>
          
          <div class="form-group">
            <label for="category">Categoría *</label>
            <select id="category" formControlName="category" class="form-control">
              <option value="">Seleccionar categoría</option>
              <option *ngFor="let category of availableCategories" [value]="category.name">{{ category.name }}</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="stock">Stock *</label>
            <input type="number" id="stock" formControlName="stock" class="form-control" min="0"
                   [class.is-invalid]="supplyForm.get('stock')?.invalid && supplyForm.get('stock')?.touched">
            <div *ngIf="supplyForm.get('stock')?.invalid && supplyForm.get('stock')?.touched" class="invalid-feedback">
              <div *ngIf="supplyForm.get('stock')?.errors?.['required']">El stock es requerido</div>
              <div *ngIf="supplyForm.get('stock')?.errors?.['min']">El stock debe ser mayor o igual a 0</div>
            </div>
          </div>
          
          <div class="form-group">
            <label for="unit">Unidad *</label>
            <select id="unit" formControlName="unit" class="form-control">
              <option value="">Seleccionar unidad</option>
              <option *ngFor="let unit of availableUnits" [value]="unit.symbol">{{ unit.name }} ({{ unit.symbol }})</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label for="unitPrice">Precio Unitario (Q) *</label>
          <input type="number" id="unitPrice" formControlName="unitPrice" class="form-control" min="0" step="0.01"
                 [class.is-invalid]="supplyForm.get('unitPrice')?.invalid && supplyForm.get('unitPrice')?.touched">
          <div *ngIf="supplyForm.get('unitPrice')?.invalid && supplyForm.get('unitPrice')?.touched" class="invalid-feedback">
            <div *ngIf="supplyForm.get('unitPrice')?.errors?.['required']">El precio es requerido</div>
            <div *ngIf="supplyForm.get('unitPrice')?.errors?.['min']">El precio debe ser mayor o igual a 0</div>
          </div>
        </div>
      </form>
    </app-modal>
  `,
  styles: [`
    .supplies-container {
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

    .stock-cell {
      text-align: center;
      font-weight: 600;
    }

    .price-cell {
      text-align: right;
      font-weight: 600;
      color: #27ae60;
    }

    .status-available {
      color: #27ae60;
      font-weight: 600;
    }

    .status-low_stock {
      color: #f39c12;
      font-weight: 600;
    }

    .status-out_of_stock {
      color: #e74c3c;
      font-weight: 600;
    }

    .date-cell {
      font-size: 0.9rem;
      color: #6c757d;
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

    .supply-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-group label {
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #2c3e50;
    }

    .form-control {
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

    .form-control.is-invalid {
      border-color: #e74c3c;
    }

    .invalid-feedback {
      color: #e74c3c;
      font-size: 0.875rem;
      margin-top: 0.25rem;
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

      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class SuppliesComponent implements OnInit {
  supplies: Supply[] = [];
  availableCategories: Category[] = [];
  availableUnits: Unit[] = [];

  filteredSupplies: Supply[] = [];
  searchQuery: string = '';
  selectedCategory: string = '';
  selectedStatus: string = '';
  selectAll: boolean = false;

  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;

  // Modal properties
  showModal = false;
  isEditing = false;
  editingSupply: Supply | null = null;
  modalTitle = '';

  // Form
  supplyForm: FormGroup;

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    this.supplyForm = this.fb.group({
      name: ['', [Validators.required]],
      category: ['', [Validators.required]],
      stock: [0, [Validators.required, Validators.min(0)]],
      unit: ['', [Validators.required]],
      unitPrice: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.loadSupplies();
    this.loadCategories();
    this.loadUnits();
  }

  loadCategories(): void {
    this.apiService.getCategories().subscribe({
      next: (categories) => {
        this.availableCategories = categories;
        console.log('Categorías cargadas para insumos:', categories.length, categories);
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        // Fallback a datos mock si hay error
        this.availableCategories = [
          { id: 1, name: 'Granos', slug: 'granos', status: 'active', createdAt: '2023-10-01', updatedAt: '2023-10-01' },
          { id: 2, name: 'Carnes', slug: 'carnes', status: 'active', createdAt: '2023-10-02', updatedAt: '2023-10-02' },
          { id: 3, name: 'Vegetales', slug: 'vegetales', status: 'active', createdAt: '2023-10-03', updatedAt: '2023-10-03' },
          { id: 4, name: 'Especias', slug: 'especias', status: 'active', createdAt: '2023-10-04', updatedAt: '2023-10-04' }
        ];
        console.log('Usando datos mock de categorías:', this.availableCategories);
      }
    });
  }

  loadUnits(): void {
    this.apiService.getActiveUnits().subscribe({
      next: (units) => {
        this.availableUnits = units;
        console.log('Unidades cargadas para insumos:', units.length, units);
      },
      error: (error) => {
        console.error('Error loading units:', error);
        // Fallback a datos mock si hay error
        this.availableUnits = [
          { id: 1, name: 'Kilogramo', symbol: 'kg', description: 'Unidad de masa', category: 'peso', status: 'active', createdAt: '2023-10-01', updatedAt: '2023-10-01' },
          { id: 2, name: 'Gramo', symbol: 'g', description: 'Unidad de masa pequeña', category: 'peso', status: 'active', createdAt: '2023-10-02', updatedAt: '2023-10-02' },
          { id: 3, name: 'Litro', symbol: 'L', description: 'Unidad de volumen', category: 'volumen', status: 'active', createdAt: '2023-10-03', updatedAt: '2023-10-03' },
          { id: 4, name: 'Mililitro', symbol: 'ml', description: 'Unidad de volumen pequeña', category: 'volumen', status: 'active', createdAt: '2023-10-04', updatedAt: '2023-10-04' },
          { id: 5, name: 'Pieza', symbol: 'pz', description: 'Unidad de cantidad', category: 'cantidad', status: 'active', createdAt: '2023-10-05', updatedAt: '2023-10-05' }
        ];
        console.log('Usando datos mock de unidades:', this.availableUnits);
      }
    });
  }

  loadSupplies(): void {
    this.apiService.getSupplies().subscribe({
      next: (supplies) => {
        this.supplies = supplies;
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error loading supplies:', error);
        // Fallback to mock data
        this.supplies = [
          { id: 1, name: 'Harina de Trigo', category: 'Granos', stock: 150, unit: 'kg', unitPrice: 2.50, status: 'available', lastUpdated: '2023-10-26' },
          { id: 2, name: 'Pechuga de Pollo', category: 'Carnes', stock: 30, unit: 'kg', unitPrice: 8.00, status: 'low_stock', lastUpdated: '2023-10-25' },
          { id: 3, name: 'Tomates', category: 'Vegetales', stock: 0, unit: 'kg', unitPrice: 3.00, status: 'out_of_stock', lastUpdated: '2023-10-26' },
          { id: 4, name: 'Arroz', category: 'Granos', stock: 200, unit: 'kg', unitPrice: 1.80, status: 'available', lastUpdated: '2023-10-24' },
          { id: 5, name: 'Carne de Res', category: 'Carnes', stock: 50, unit: 'kg', unitPrice: 12.00, status: 'available', lastUpdated: '2023-10-25' },
        ];
        this.applyFilters();
      }
    });
  }

  applyFilters(): void {
    let temp = this.supplies;

    if (this.searchQuery) {
      temp = temp.filter(supply =>
        supply.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        supply.category.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    if (this.selectedCategory) {
      temp = temp.filter(supply => supply.category === this.selectedCategory);
    }

    if (this.selectedStatus) {
      temp = temp.filter(supply => supply.status === this.selectedStatus);
    }

    this.totalItems = temp.length;
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    this.currentPage = 1;
    this.updatePagedSupplies(temp);
  }

  updatePagedSupplies(suppliesToPaginate: Supply[]): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.filteredSupplies = suppliesToPaginate.slice(startIndex, endIndex);
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedCategory = '';
    this.selectedStatus = '';
    this.applyFilters();
  }

  openAddModal(): void {
    this.isEditing = false;
    this.editingSupply = null;
    this.modalTitle = 'Nuevo Insumo';
    this.supplyForm.reset();
    this.showModal = true;
  }

  editSupply(supply: Supply): void {
    this.isEditing = true;
    this.editingSupply = supply;
    this.modalTitle = 'Editar Insumo';
    this.supplyForm.patchValue({
      name: supply.name,
      category: supply.category,
      stock: supply.stock,
      unit: supply.unit,
      unitPrice: supply.unitPrice
    });
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.supplyForm.reset();
    this.editingSupply = null;
  }

  saveSupply(): void {
    if (this.supplyForm.valid) {
      const formData = this.supplyForm.value;
      
      if (this.isEditing && this.editingSupply) {
        // Actualizar insumo existente
        this.apiService.updateSupply(this.editingSupply.id, formData).subscribe({
          next: (updatedSupply) => {
            const index = this.supplies.findIndex(s => s.id === this.editingSupply!.id);
            if (index !== -1) {
              this.supplies[index] = updatedSupply;
            }
            this.applyFilters();
            this.closeModal();
          },
          error: (error) => {
            console.error('Error updating supply:', error);
            alert('Error al actualizar el insumo');
          }
        });
      } else {
        // Crear nuevo insumo
        this.apiService.createSupply(formData).subscribe({
          next: (newSupply) => {
            this.supplies.push(newSupply);
            this.applyFilters();
            this.closeModal();
          },
          error: (error) => {
            console.error('Error creating supply:', error);
            alert('Error al crear el insumo');
          }
        });
      }
    } else {
      this.supplyForm.markAllAsTouched();
    }
  }

  calculateStatus(stock: number): 'available' | 'low_stock' | 'out_of_stock' {
    if (stock === 0) return 'out_of_stock';
    if (stock < 20) return 'low_stock';
    return 'available';
  }

  deleteSupply(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este insumo?')) {
      this.apiService.deleteSupply(id).subscribe({
        next: () => {
          this.supplies = this.supplies.filter(s => s.id !== id);
          this.applyFilters();
        },
        error: (error) => {
          console.error('Error deleting supply:', error);
          alert('Error al eliminar el insumo');
        }
      });
    }
  }

  toggleSelectAll(): void {
    this.filteredSupplies.forEach(supply => supply.selected = this.selectAll);
  }

  onSupplySelect(): void {
    this.selectAll = this.filteredSupplies.every(supply => supply.selected);
  }

  hasSelectedSupplies(): boolean {
    return this.filteredSupplies.some(supply => supply.selected);
  }

  deleteSelectedSupplies(): void {
    if (confirm('¿Estás seguro de que quieres eliminar los insumos seleccionados?')) {
      this.supplies = this.supplies.filter(supply => !supply.selected);
      this.applyFilters();
      this.selectAll = false;
    }
  }

  getStatusClass(status: 'available' | 'low_stock' | 'out_of_stock'): string {
    return `status-${status}`;
  }

  getStatusText(status: 'available' | 'low_stock' | 'out_of_stock'): string {
    const statusMap = {
      'available': 'Disponible',
      'low_stock': 'Poco Stock',
      'out_of_stock': 'Agotado'
    };
    return statusMap[status];
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