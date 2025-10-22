import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ModalComponent } from '../../components/modal/modal.component';

interface CostType {
  id?: number;
  name: string;
  description: string;
  percentage: number;
  isActive: boolean;
  isMandatory: boolean;
  priority: number;
  createdAt?: string;
  updatedAt?: string;
}

@Component({
  selector: 'app-cost-types',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule, ModalComponent],
  template: `
    <div class="cost-types-container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-content">
          <div class="title-section">
            <h1><i class="fas fa-tags"></i> Tipos de Costos</h1>
            <p>Gestiona los tipos de costos adicionales para productos</p>
          </div>
          <div class="actions">
            <button class="btn btn-primary" (click)="openAddModal()">
              <i class="fas fa-plus"></i>
              Nuevo Tipo de Costo
            </button>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="filters-section">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input type="text" placeholder="Buscar por nombre..." 
                 [(ngModel)]="searchQuery" (ngModelChange)="applyFilters()">
        </div>
        <div class="filter-controls">
          <select [(ngModel)]="statusFilter" (ngModelChange)="applyFilters()">
            <option value="">Todos los estados</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </select>
        </div>
      </div>

      <!-- Table -->
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Porcentaje</th>
              <th>Prioridad</th>
              <th>Estado</th>
              <th>Obligatorio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let costType of filteredCostTypes">
              <td class="name-cell">
                <div class="name-info">
                  <strong>{{ costType.name }}</strong>
                </div>
              </td>
              <td class="description-cell">{{ costType.description || 'Sin descripción' }}</td>
              <td class="percentage-cell">{{ costType.percentage }}%</td>
              <td class="priority-cell">
                <span class="priority-badge">{{ costType.priority }}</span>
              </td>
              <td class="status-cell">
                <span class="status-badge" [class.active]="costType.isActive" [class.inactive]="!costType.isActive">
                  {{ costType.isActive ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td class="mandatory-cell">
                <span class="mandatory-badge" [class.mandatory]="costType.isMandatory" [class.optional]="!costType.isMandatory">
                  {{ costType.isMandatory ? 'Sí' : 'No' }}
                </span>
              </td>
              <td class="actions-cell">
                <button class="btn-icon btn-edit" (click)="editCostType(costType)" title="Editar">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon btn-delete" (click)="deleteCostType(costType.id!)" title="Eliminar">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
            <tr *ngIf="filteredCostTypes.length === 0">
              <td colspan="7" class="no-data">
                <i class="fas fa-tags"></i>
                <p>No se encontraron tipos de costos</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal -->
    <app-modal 
      [isOpen]="showModal" 
      [title]="modalTitle"
      [confirmText]="isEditing ? 'Actualizar' : 'Crear'"
      [cancelText]="'Cancelar'"
      (onClose)="closeModal()"
      (onConfirm)="saveCostType()">
      
      <form [formGroup]="costTypeForm" class="cost-type-form">
        <div class="form-row">
          <div class="form-group">
            <label for="name">Nombre *</label>
            <input type="text" id="name" formControlName="name" class="form-control" 
                   placeholder="Ej: IVA, ISR, Costo de Producción"
                   [class.is-invalid]="costTypeForm.get('name')?.invalid && costTypeForm.get('name')?.touched">
            <div *ngIf="costTypeForm.get('name')?.invalid && costTypeForm.get('name')?.touched" class="invalid-feedback">
              <div *ngIf="costTypeForm.get('name')?.errors?.['required']">El nombre es requerido</div>
              <div *ngIf="costTypeForm.get('name')?.errors?.['minlength']">El nombre debe tener al menos 2 caracteres</div>
            </div>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="description">Descripción</label>
            <textarea id="description" formControlName="description" class="form-control" 
                      rows="3" placeholder="Descripción del tipo de costo"></textarea>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="percentage">Porcentaje (%) *</label>
            <input type="number" id="percentage" formControlName="percentage" class="form-control" 
                   min="0" max="100" step="0.01" placeholder="0.00"
                   [class.is-invalid]="costTypeForm.get('percentage')?.invalid && costTypeForm.get('percentage')?.touched">
            <div *ngIf="costTypeForm.get('percentage')?.invalid && costTypeForm.get('percentage')?.touched" class="invalid-feedback">
              <div *ngIf="costTypeForm.get('percentage')?.errors?.['required']">El porcentaje es requerido</div>
              <div *ngIf="costTypeForm.get('percentage')?.errors?.['min']">El porcentaje debe ser mayor o igual a 0</div>
              <div *ngIf="costTypeForm.get('percentage')?.errors?.['max']">El porcentaje debe ser menor o igual a 100</div>
            </div>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="priority">Prioridad *</label>
            <input type="number" id="priority" formControlName="priority" class="form-control" 
                   min="1" step="1" placeholder="1"
                   [class.is-invalid]="costTypeForm.get('priority')?.invalid && costTypeForm.get('priority')?.touched">
            <div *ngIf="costTypeForm.get('priority')?.invalid && costTypeForm.get('priority')?.touched" class="invalid-feedback">
              <div *ngIf="costTypeForm.get('priority')?.errors?.['required']">La prioridad es requerida</div>
              <div *ngIf="costTypeForm.get('priority')?.errors?.['min']">La prioridad debe ser mayor o igual a 1</div>
              <div *ngIf="costTypeForm.get('priority')?.errors?.['priorityExists']">Esta prioridad ya está en uso</div>
            </div>
            <small class="form-text text-muted">Los costos se aplicarán en orden de prioridad (1 = primero)</small>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group checkbox-group">
            <label class="checkbox-label">
              <input type="checkbox" formControlName="isActive" class="checkbox-input">
              <span class="checkbox-text">Activo</span>
            </label>
          </div>
          
          <div class="form-group checkbox-group">
            <label class="checkbox-label">
              <input type="checkbox" formControlName="isMandatory" class="checkbox-input">
              <span class="checkbox-text">Obligatorio</span>
            </label>
          </div>
        </div>
      </form>
    </app-modal>
  `,
  styles: [`
    .cost-types-container {
      padding: 2rem;
      background: #f8f9fa;
      min-height: 100vh;
    }

    .page-header {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      margin-bottom: 2rem;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .title-section h1 {
      color: #2c3e50;
      margin: 0 0 0.5rem 0;
      font-size: 2rem;
      font-weight: 600;
    }

    .title-section p {
      color: #6c757d;
      margin: 0;
      font-size: 1.1rem;
    }

    .filters-section {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 2rem;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .search-box {
      position: relative;
      flex: 1;
    }

    .search-box i {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: #6c757d;
    }

    .search-box input {
      width: 100%;
      padding: 0.75rem 1rem 0.75rem 2.5rem;
      border: 2px solid #e9ecef;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.3s;
    }

    .search-box input:focus {
      outline: none;
      border-color: #007bff;
    }

    .filter-controls select {
      padding: 0.75rem;
      border: 2px solid #e9ecef;
      border-radius: 8px;
      font-size: 1rem;
      min-width: 200px;
    }

    .table-container {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
    }

    .data-table th {
      background: #f8f9fa;
      color: #495057;
      font-weight: 600;
      padding: 1rem;
      text-align: left;
      border-bottom: 2px solid #dee2e6;
    }

    .data-table td {
      padding: 1rem;
      border-bottom: 1px solid #dee2e6;
      vertical-align: middle;
    }

    .name-cell {
      min-width: 150px;
    }

    .name-info strong {
      color: #2c3e50;
      font-size: 1rem;
    }

    .description-cell {
      max-width: 200px;
      color: #6c757d;
    }

    .percentage-cell {
      text-align: center;
      font-family: 'Courier New', monospace;
      font-weight: 600;
      color: #007bff;
    }

    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .status-badge.active {
      background: #d4edda;
      color: #155724;
    }

    .status-badge.inactive {
      background: #f8d7da;
      color: #721c24;
    }

    .priority-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      background: #007bff;
      color: white;
      border-radius: 50%;
      font-size: 0.875rem;
      font-weight: 600;
    }

    .mandatory-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .mandatory-badge.mandatory {
      background: #fff3cd;
      color: #856404;
    }

    .mandatory-badge.optional {
      background: #d1ecf1;
      color: #0c5460;
    }

    .actions-cell {
      text-align: center;
      white-space: nowrap;
    }

    .btn-icon {
      background: none;
      border: none;
      padding: 0.5rem;
      margin: 0 0.25rem;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.3s;
      font-size: 1rem;
    }

    .btn-edit {
      color: #007bff;
    }

    .btn-edit:hover {
      background: #e3f2fd;
      color: #0056b3;
    }

    .btn-delete {
      color: #dc3545;
    }

    .btn-delete:hover {
      background: #f8d7da;
      color: #c82333;
    }

    .no-data {
      text-align: center;
      padding: 3rem;
      color: #6c757d;
    }

    .no-data i {
      font-size: 3rem;
      margin-bottom: 1rem;
      opacity: 0.5;
    }

    .cost-type-form {
      max-width: 100%;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-group label {
      font-weight: 600;
      color: #495057;
      margin-bottom: 0.5rem;
    }

    .form-control {
      padding: 0.75rem;
      border: 2px solid #e9ecef;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.3s;
    }

    .form-control:focus {
      outline: none;
      border-color: #007bff;
    }

    .form-control.is-invalid {
      border-color: #dc3545;
    }

    .invalid-feedback {
      color: #dc3545;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }

    .checkbox-group {
      flex-direction: row !important;
      align-items: center;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      cursor: pointer;
      margin-right: 1rem;
    }

    .checkbox-input {
      margin-right: 0.5rem;
    }

    .checkbox-text {
      font-weight: 500;
      color: #495057;
    }

    @media (max-width: 768px) {
      .cost-types-container {
        padding: 1rem;
      }

      .header-content {
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
      }

      .filters-section {
        flex-direction: column;
      }

      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class CostTypesComponent implements OnInit {
  costTypes: CostType[] = [];
  filteredCostTypes: CostType[] = [];
  searchQuery: string = '';
  statusFilter: string = '';
  showModal: boolean = false;
  isEditing: boolean = false;
  editingCostType: CostType | null = null;
  modalTitle: string = '';

  costTypeForm: FormGroup;

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    this.costTypeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      percentage: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      priority: [1, [Validators.required, Validators.min(1)]],
      isActive: [true],
      isMandatory: [false]
    });

    // Agregar validación personalizada para prioridad
    this.costTypeForm.get('priority')?.valueChanges.subscribe(priority => {
      this.validatePriority(priority);
    });
  }

  ngOnInit(): void {
    this.loadCostTypes();
  }

  loadCostTypes(): void {
    this.apiService.getCostTypes().subscribe({
      next: (costTypes) => {
        this.costTypes = costTypes;
        this.applyFilters();
      },
      error: (error) => {
        console.error('Error loading cost types:', error);
        // Mock data para desarrollo
        this.costTypes = [
          {
            id: 1,
            name: 'IVA',
            description: 'Impuesto al Valor Agregado',
            percentage: 12,
            priority: 1,
            isActive: true,
            isMandatory: true
          },
          {
            id: 2,
            name: 'ISR',
            description: 'Impuesto Sobre la Renta',
            percentage: 5,
            priority: 2,
            isActive: true,
            isMandatory: true
          }
        ];
        this.applyFilters();
      }
    });
  }

  applyFilters(): void {
    let temp = [...this.costTypes];

    if (this.searchQuery) {
      temp = temp.filter(costType =>
        costType.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        (costType.description && costType.description.toLowerCase().includes(this.searchQuery.toLowerCase()))
      );
    }

    if (this.statusFilter) {
      if (this.statusFilter === 'active') {
        temp = temp.filter(costType => costType.isActive);
      } else if (this.statusFilter === 'inactive') {
        temp = temp.filter(costType => !costType.isActive);
      }
    }

    this.filteredCostTypes = temp;
  }

  openAddModal(): void {
    this.isEditing = false;
    this.editingCostType = null;
    this.modalTitle = 'Nuevo Tipo de Costo';
    this.costTypeForm.reset();
    this.costTypeForm.patchValue({
      isActive: true,
      isMandatory: false,
      priority: 1
    });
    this.showModal = true;
  }

  editCostType(costType: CostType): void {
    this.isEditing = true;
    this.editingCostType = costType;
    this.modalTitle = 'Editar Tipo de Costo';
    this.costTypeForm.patchValue({
      name: costType.name,
      description: costType.description,
      percentage: costType.percentage,
      priority: costType.priority,
      isActive: costType.isActive,
      isMandatory: costType.isMandatory
    });
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.costTypeForm.reset();
    this.editingCostType = null;
  }

  validatePriority(priority: number): void {
    if (!priority) return;
    
    const priorityControl = this.costTypeForm.get('priority');
    if (!priorityControl) return;

    // Verificar si la prioridad ya existe en otros cost types
    const existingCostType = this.costTypes.find(ct => 
      ct.priority === priority && 
      (!this.isEditing || ct.id !== this.editingCostType?.id)
    );

    if (existingCostType) {
      priorityControl.setErrors({ priorityExists: true });
    } else {
      const errors = priorityControl.errors;
      if (errors) {
        delete errors['priorityExists'];
        priorityControl.setErrors(Object.keys(errors).length > 0 ? errors : null);
      }
    }
  }

  saveCostType(): void {
    if (this.costTypeForm.valid) {
      const formData = this.costTypeForm.value;
      
      if (this.isEditing && this.editingCostType) {
        this.apiService.updateCostType(this.editingCostType.id!, formData).subscribe({
          next: (updatedCostType) => {
            const index = this.costTypes.findIndex(ct => ct.id === this.editingCostType!.id);
            if (index !== -1) {
              this.costTypes[index] = updatedCostType;
            }
            this.applyFilters();
            this.closeModal();
          },
          error: (error) => {
            console.error('Error updating cost type:', error);
            alert('Error al actualizar el tipo de costo');
          }
        });
      } else {
        this.apiService.createCostType(formData).subscribe({
          next: (newCostType) => {
            this.costTypes.push(newCostType);
            this.applyFilters();
            this.closeModal();
          },
          error: (error) => {
            console.error('Error creating cost type:', error);
            alert('Error al crear el tipo de costo');
          }
        });
      }
    } else {
      this.costTypeForm.markAllAsTouched();
    }
  }

  deleteCostType(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este tipo de costo?')) {
      this.apiService.deleteCostType(id).subscribe({
        next: () => {
          this.costTypes = this.costTypes.filter(ct => ct.id !== id);
          this.applyFilters();
        },
        error: (error) => {
          console.error('Error deleting cost type:', error);
          alert('Error al eliminar el tipo de costo');
        }
      });
    }
  }
}
