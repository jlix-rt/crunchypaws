import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService, Unit } from '../../services/api.service';

interface UnitFormData {
  name: string;
  symbol: string;
  description?: string;
  category?: string;
  status: 'active' | 'inactive';
}

@Component({
  selector: 'app-units',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="units-container">
      <div class="page-header">
        <h1 class="page-title">Gestión de Unidades</h1>
        <p class="page-subtitle">Administra las unidades de medida</p>
      </div>

      <div class="controls-bar">
        <div class="search-section">
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input type="text" [(ngModel)]="searchQuery" (ngModelChange)="applyFilters()" placeholder="Buscar unidad...">
          </div>
          <select [(ngModel)]="selectedStatus" (ngModelChange)="applyFilters()" class="filter-select">
            <option value="">Todos los Estados</option>
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
          </select>
          <select [(ngModel)]="selectedCategory" (ngModelChange)="applyFilters()" class="filter-select">
            <option value="">Todas las Categorías</option>
            <option value="peso">Peso</option>
            <option value="volumen">Volumen</option>
            <option value="cantidad">Cantidad</option>
            <option value="longitud">Longitud</option>
          </select>
        </div>
        
        <div class="action-buttons">
          <button class="btn btn-secondary" (click)="clearFilters()">
            <i class="fas fa-times"></i>
            Limpiar Filtros
          </button>
          <button class="btn btn-primary" (click)="openAddModal()">
            <i class="fas fa-plus"></i>
            Nueva Unidad
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
              <th>Símbolo</th>
              <th>Categoría</th>
              <th>Descripción</th>
              <th>Estado</th>
              <th>Fecha Creación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let unit of filteredUnits">
              <td class="checkbox-column">
                <input type="checkbox" [(ngModel)]="unit.selected" (change)="onItemSelect()">
              </td>
              <td>{{ unit.id }}</td>
              <td class="name-cell">{{ unit.name }}</td>
              <td class="symbol-cell">{{ unit.symbol }}</td>
              <td class="category-cell">{{ unit.category || '-' }}</td>
              <td class="description-cell">{{ unit.description || '-' }}</td>
              <td>
                <span [class]="getStatusClass(unit.status)">
                  {{ unit.status === 'active' ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td>{{ unit.createdAt | date:'short' }}</td>
              <td class="actions-cell">
                <button class="btn-icon btn-edit" (click)="editUnit(unit)" title="Editar">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon btn-delete" (click)="deleteUnit(unit.id)" title="Eliminar">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
            <tr *ngIf="filteredUnits.length === 0">
              <td colspan="9" class="no-data">
                <i class="fas fa-inbox"></i>
                <p>No se encontraron unidades</p>
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

      <!-- Modal para crear/editar unidad -->
      <div *ngIf="showModal" class="modal-overlay" (click)="closeModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{ isEditing ? 'Editar Unidad' : 'Nueva Unidad' }}</h3>
            <button class="close-btn" (click)="closeModal()">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <form [formGroup]="unitForm" (ngSubmit)="saveUnit()" class="modal-body">
            <div class="form-group">
              <label for="name">Nombre *</label>
              <input 
                type="text" 
                id="name" 
                formControlName="name" 
                class="form-control"
                [class.error]="unitForm.get('name')?.invalid && unitForm.get('name')?.touched"
                placeholder="Nombre de la unidad"
              >
              <div *ngIf="unitForm.get('name')?.invalid && unitForm.get('name')?.touched" class="error-message">
                El nombre es requerido y debe tener al menos 2 caracteres
              </div>
            </div>

            <div class="form-group">
              <label for="symbol">Símbolo *</label>
              <input 
                type="text" 
                id="symbol" 
                formControlName="symbol" 
                class="form-control"
                [class.error]="unitForm.get('symbol')?.invalid && unitForm.get('symbol')?.touched"
                placeholder="Símbolo de la unidad (ej: kg, L, pz)"
              >
              <div *ngIf="unitForm.get('symbol')?.invalid && unitForm.get('symbol')?.touched" class="error-message">
                El símbolo es requerido y debe tener al menos 1 carácter
              </div>
            </div>

            <div class="form-group">
              <label for="description">Descripción</label>
              <textarea 
                id="description" 
                formControlName="description" 
                class="form-control"
                placeholder="Descripción de la unidad"
                rows="3"
              ></textarea>
            </div>

            <div class="form-group">
              <label for="category">Categoría</label>
              <select id="category" formControlName="category" class="form-control">
                <option value="">Sin categoría</option>
                <option value="peso">Peso</option>
                <option value="volumen">Volumen</option>
                <option value="cantidad">Cantidad</option>
                <option value="longitud">Longitud</option>
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
              (click)="saveUnit()"
              [disabled]="unitForm.invalid"
            >
              {{ isEditing ? 'Actualizar' : 'Crear' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .units-container {
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

    .symbol-cell {
      font-family: monospace;
      font-weight: 600;
      color: #3498db;
      background: #f8f9fa;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
    }

    .category-cell {
      color: #6c757d;
      text-transform: capitalize;
    }

    .description-cell {
      color: #6c757d;
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
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
      max-width: 600px;
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
  `]
})
export class UnitsComponent implements OnInit {
  units: Unit[] = [];
  filteredUnits: Unit[] = [];
  searchQuery: string = '';
  selectedStatus: string = '';
  selectedCategory: string = '';
  selectAll: boolean = false;

  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;

  // Modal states
  showModal: boolean = false;
  isEditing: boolean = false;
  editingUnit: Unit | null = null;
  unitForm: FormGroup;

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder
  ) {
    this.unitForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      symbol: ['', [Validators.required, Validators.minLength(1)]],
      description: [''],
      category: [''],
      status: ['active', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUnits();
  }

  loadUnits(): void {
    this.apiService.getUnits().subscribe({
      next: (units) => {
        this.units = units;
        this.applyFilters();
        console.log('Unidades cargadas:', units);
      },
      error: (error) => {
        console.error('Error cargando unidades:', error);
        // Fallback a datos mock si hay error
        this.units = [
          { id: 1, name: 'Kilogramo', symbol: 'kg', description: 'Unidad de masa', category: 'peso', status: 'active', createdAt: '2023-10-01', updatedAt: '2023-10-01' },
          { id: 2, name: 'Gramo', symbol: 'g', description: 'Unidad de masa pequeña', category: 'peso', status: 'active', createdAt: '2023-10-02', updatedAt: '2023-10-02' },
          { id: 3, name: 'Litro', symbol: 'L', description: 'Unidad de volumen', category: 'volumen', status: 'active', createdAt: '2023-10-03', updatedAt: '2023-10-03' },
          { id: 4, name: 'Mililitro', symbol: 'ml', description: 'Unidad de volumen pequeña', category: 'volumen', status: 'active', createdAt: '2023-10-04', updatedAt: '2023-10-04' },
          { id: 5, name: 'Pieza', symbol: 'pz', description: 'Unidad de cantidad', category: 'cantidad', status: 'active', createdAt: '2023-10-05', updatedAt: '2023-10-05' }
        ];
        this.applyFilters();
      }
    });
  }

  applyFilters(): void {
    let temp = this.units;

    if (this.searchQuery) {
      temp = temp.filter(unit =>
        unit.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        unit.symbol.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        (unit.description && unit.description.toLowerCase().includes(this.searchQuery.toLowerCase()))
      );
    }

    if (this.selectedStatus) {
      temp = temp.filter(unit => unit.status === this.selectedStatus);
    }

    if (this.selectedCategory) {
      temp = temp.filter(unit => unit.category === this.selectedCategory);
    }

    this.totalItems = temp.length;
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    this.currentPage = 1;
    this.updatePagedItems(temp);
  }

  updatePagedItems(items: Unit[]): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.filteredUnits = items.slice(start, end);
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedStatus = '';
    this.selectedCategory = '';
    this.applyFilters();
  }

  openAddModal(): void {
    this.isEditing = false;
    this.editingUnit = null;
    this.unitForm.reset({
      name: '',
      symbol: '',
      description: '',
      category: '',
      status: 'active'
    });
    this.showModal = true;
  }

  editUnit(unit: Unit): void {
    this.isEditing = true;
    this.editingUnit = unit;
    this.unitForm.patchValue({
      name: unit.name,
      symbol: unit.symbol,
      description: unit.description || '',
      category: unit.category || '',
      status: unit.status
    });
    this.showModal = true;
  }

  saveUnit(): void {
    if (this.unitForm.valid) {
      const formData = this.unitForm.value as UnitFormData;
      
      if (this.isEditing && this.editingUnit) {
        // Actualizar unidad existente
        this.apiService.updateUnit(this.editingUnit.id, formData).subscribe({
          next: (updatedUnit) => {
            const index = this.units.findIndex(u => u.id === this.editingUnit!.id);
            if (index !== -1) {
              this.units[index] = updatedUnit;
              this.applyFilters();
            }
            this.closeModal();
            console.log('Unidad actualizada:', updatedUnit);
          },
          error: (error) => {
            console.error('Error actualizando unidad:', error);
            alert('Error al actualizar la unidad');
          }
        });
      } else {
        // Crear nueva unidad
        this.apiService.createUnit(formData).subscribe({
          next: (newUnit) => {
            this.units.push(newUnit);
            this.applyFilters();
            this.closeModal();
            console.log('Unidad creada:', newUnit);
          },
          error: (error) => {
            console.error('Error creando unidad:', error);
            alert('Error al crear la unidad');
          }
        });
      }
    }
  }

  deleteUnit(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta unidad?')) {
      this.apiService.deleteUnit(id).subscribe({
        next: () => {
          this.units = this.units.filter(u => u.id !== id);
          this.applyFilters();
          console.log('Unidad eliminada');
        },
        error: (error) => {
          console.error('Error eliminando unidad:', error);
          alert('Error al eliminar la unidad');
        }
      });
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.isEditing = false;
    this.editingUnit = null;
    this.unitForm.reset();
  }

  toggleSelectAll(): void {
    this.filteredUnits.forEach(item => item.selected = this.selectAll);
  }

  onItemSelect(): void {
    this.selectAll = this.filteredUnits.every(item => item.selected);
  }

  hasSelectedItems(): boolean {
    return this.filteredUnits.some(item => item.selected);
  }

  deleteSelected(): void {
    if (confirm('¿Estás seguro de que quieres eliminar las unidades seleccionadas?')) {
      this.units = this.units.filter(unit => !unit.selected);
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
