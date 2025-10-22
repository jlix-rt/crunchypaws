import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalComponent } from '../../components/modal/modal.component';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'EMPLOYEE' | 'CLIENT';
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  createdAt: string;
  selected?: boolean;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ModalComponent],
  template: `
    <div class="users-container">
      <div class="page-header">
        <h1 class="page-title">Gestión de Usuarios</h1>
        <p class="page-subtitle">Administra los usuarios del sistema</p>
      </div>

      <div class="controls-bar">
        <div class="search-section">
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input type="text" [(ngModel)]="searchQuery" (ngModelChange)="applyFilters()" placeholder="Buscar usuario...">
          </div>
          <select [(ngModel)]="selectedRole" (ngModelChange)="applyFilters()" class="filter-select">
            <option value="">Todos los Roles</option>
            <option value="ADMIN">Administrador</option>
            <option value="EMPLOYEE">Empleado</option>
            <option value="CLIENT">Cliente</option>
          </select>
          <select [(ngModel)]="selectedStatus" (ngModelChange)="applyFilters()" class="filter-select">
            <option value="">Todos los Estados</option>
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
            <option value="suspended">Suspendido</option>
          </select>
        </div>
        
        <div class="action-buttons">
          <button class="btn btn-secondary" (click)="clearFilters()">
            <i class="fas fa-times"></i>
            Limpiar Filtros
          </button>
          <button class="btn btn-primary" (click)="openAddModal()">
            <i class="fas fa-plus"></i>
            Nuevo Usuario
          </button>
          <button class="btn btn-danger" [disabled]="!hasSelectedUsers()" (click)="deleteSelectedUsers()">
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
              <th>Email</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Último Login</th>
              <th>Fecha Creación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let user of filteredUsers">
              <td class="checkbox-column">
                <input type="checkbox" [(ngModel)]="user.selected" (change)="onUserSelect()">
              </td>
              <td>{{ user.id }}</td>
              <td class="name-cell">{{ user.name }}</td>
              <td class="email-cell">{{ user.email }}</td>
              <td>
                <span [class]="getRoleClass(user.role)">
                  {{ getRoleText(user.role) }}
                </span>
              </td>
              <td>
                <span [class]="getStatusClass(user.status)">
                  {{ getStatusText(user.status) }}
                </span>
              </td>
              <td class="date-cell">{{ user.lastLogin }}</td>
              <td class="date-cell">{{ user.createdAt }}</td>
              <td class="actions-cell">
                <button class="btn-icon btn-edit" (click)="editUser(user)" title="Editar">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon btn-suspend" (click)="toggleUserStatus(user)" [title]="user.status === 'active' ? 'Suspender' : 'Activar'">
                  <i [class]="user.status === 'active' ? 'fas fa-ban' : 'fas fa-check'"></i>
                </button>
                <button class="btn-icon btn-delete" (click)="deleteUser(user.id)" title="Eliminar">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
            <tr *ngIf="filteredUsers.length === 0">
              <td colspan="9" class="no-data">
                <i class="fas fa-users"></i>
                <p>No se encontraron usuarios</p>
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

    <!-- Modal para agregar/editar usuario -->
    <app-modal 
      [isOpen]="showModal" 
      [title]="modalTitle"
      [confirmText]="isEditing ? 'Actualizar' : 'Crear'"
      [disableConfirm]="userForm.invalid"
      (onClose)="closeModal()"
      (onConfirm)="saveUser()">
      
      <form [formGroup]="userForm" class="user-form">
        <div class="form-row">
          <div class="form-group">
            <label for="name">Nombre Completo *</label>
            <input type="text" id="name" formControlName="name" class="form-control"
                   [class.is-invalid]="userForm.get('name')?.invalid && userForm.get('name')?.touched">
            <div *ngIf="userForm.get('name')?.invalid && userForm.get('name')?.touched" class="invalid-feedback">
              <div *ngIf="userForm.get('name')?.errors?.['required']">El nombre es requerido</div>
            </div>
          </div>
          
          <div class="form-group">
            <label for="email">Email *</label>
            <input type="email" id="email" formControlName="email" class="form-control"
                   [class.is-invalid]="userForm.get('email')?.invalid && userForm.get('email')?.touched">
            <div *ngIf="userForm.get('email')?.invalid && userForm.get('email')?.touched" class="invalid-feedback">
              <div *ngIf="userForm.get('email')?.errors?.['required']">El email es requerido</div>
              <div *ngIf="userForm.get('email')?.errors?.['email']">Formato de email inválido</div>
            </div>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="role">Rol *</label>
            <select id="role" formControlName="role" class="form-control">
              <option value="">Seleccionar rol</option>
              <option value="ADMIN">Administrador</option>
              <option value="EMPLOYEE">Empleado</option>
              <option value="CLIENT">Cliente</option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="status">Estado *</label>
            <select id="status" formControlName="status" class="form-control">
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
              <option value="suspended">Suspendido</option>
            </select>
          </div>
        </div>

        <div class="form-group" *ngIf="!isEditing">
          <label for="password">Contraseña *</label>
          <input type="password" id="password" formControlName="password" class="form-control"
                 [class.is-invalid]="userForm.get('password')?.invalid && userForm.get('password')?.touched">
          <div *ngIf="userForm.get('password')?.invalid && userForm.get('password')?.touched" class="invalid-feedback">
            <div *ngIf="userForm.get('password')?.errors?.['required']">La contraseña es requerida</div>
            <div *ngIf="userForm.get('password')?.errors?.['minlength']">La contraseña debe tener al menos 6 caracteres</div>
          </div>
        </div>
      </form>
    </app-modal>
  `,
  styles: [`
    .users-container {
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

    .email-cell {
      color: #3498db;
    }

    .role-admin {
      background: #e74c3c;
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .role-employee {
      background: #f39c12;
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .role-client {
      background: #3498db;
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .status-active {
      color: #27ae60;
      font-weight: 600;
    }

    .status-inactive {
      color: #f39c12;
      font-weight: 600;
    }

    .status-suspended {
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

    .btn-suspend {
      background: #e67e22;
      color: white;
    }

    .btn-suspend:hover {
      background: #d35400;
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

    .user-form {
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
export class UsersComponent {
  users: User[] = [
    { id: 1, name: 'Admin User', email: 'admin@crunchypaws.com', role: 'ADMIN', status: 'active', lastLogin: '2023-10-26', createdAt: '2023-01-01' },
    { id: 2, name: 'Employee One', email: 'employee1@crunchypaws.com', role: 'EMPLOYEE', status: 'active', lastLogin: '2023-10-26', createdAt: '2023-02-15' },
    { id: 3, name: 'Client User', email: 'client@crunchypaws.com', role: 'CLIENT', status: 'active', lastLogin: '2023-10-25', createdAt: '2023-03-20' },
    { id: 4, name: 'Inactive User', email: 'inactive@crunchypaws.com', role: 'CLIENT', status: 'inactive', lastLogin: '2023-10-20', createdAt: '2023-04-10' },
    { id: 5, name: 'Suspended Employee', email: 'suspended@crunchypaws.com', role: 'EMPLOYEE', status: 'suspended', lastLogin: '2023-10-15', createdAt: '2023-05-05' },
  ];

  filteredUsers: User[] = [];
  searchQuery: string = '';
  selectedRole: string = '';
  selectedStatus: string = '';
  selectAll: boolean = false;

  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;

  // Modal properties
  showModal = false;
  isEditing = false;
  editingUser: User | null = null;
  modalTitle = '';

  // Form
  userForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      role: ['', [Validators.required]],
      status: ['active', [Validators.required]],
      password: ['', [Validators.minLength(6)]]
    });
    
    this.applyFilters();
  }

  applyFilters(): void {
    let temp = this.users;

    if (this.searchQuery) {
      temp = temp.filter(user =>
        user.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    if (this.selectedRole) {
      temp = temp.filter(user => user.role === this.selectedRole);
    }

    if (this.selectedStatus) {
      temp = temp.filter(user => user.status === this.selectedStatus);
    }

    this.totalItems = temp.length;
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    this.currentPage = 1;
    this.updatePagedUsers(temp);
  }

  updatePagedUsers(usersToPaginate: User[]): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.filteredUsers = usersToPaginate.slice(startIndex, endIndex);
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedRole = '';
    this.selectedStatus = '';
    this.applyFilters();
  }

  openAddModal(): void {
    this.isEditing = false;
    this.editingUser = null;
    this.modalTitle = 'Nuevo Usuario';
    this.userForm.reset();
    this.userForm.patchValue({ status: 'active' });
    this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.userForm.get('password')?.updateValueAndValidity();
    this.showModal = true;
  }

  editUser(user: User): void {
    this.isEditing = true;
    this.editingUser = user;
    this.modalTitle = 'Editar Usuario';
    this.userForm.patchValue({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    });
    this.userForm.get('password')?.clearValidators();
    this.userForm.get('password')?.updateValueAndValidity();
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.userForm.reset();
    this.editingUser = null;
  }

  saveUser(): void {
    if (this.userForm.valid) {
      const formData = this.userForm.value;
      
      if (this.isEditing && this.editingUser) {
        // Actualizar usuario existente
        const index = this.users.findIndex(u => u.id === this.editingUser!.id);
        if (index !== -1) {
          this.users[index] = {
            ...this.users[index],
            ...formData
          };
        }
      } else {
        // Crear nuevo usuario
        const newUser: User = {
          id: Math.max(...this.users.map(u => u.id)) + 1,
          ...formData,
          lastLogin: 'Nunca',
          createdAt: new Date().toISOString().split('T')[0]
        };
        this.users.push(newUser);
      }
      
      this.applyFilters();
      this.closeModal();
    } else {
      this.userForm.markAllAsTouched();
    }
  }

  toggleUserStatus(user: User): void {
    const newStatus = user.status === 'active' ? 'suspended' : 'active';
    const action = newStatus === 'active' ? 'activar' : 'suspender';
    
    if (confirm(`¿Estás seguro de que quieres ${action} a ${user.name}?`)) {
      user.status = newStatus;
      this.applyFilters();
    }
  }

  deleteUser(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      this.users = this.users.filter(u => u.id !== id);
      this.applyFilters();
    }
  }

  toggleSelectAll(): void {
    this.filteredUsers.forEach(user => user.selected = this.selectAll);
  }

  onUserSelect(): void {
    this.selectAll = this.filteredUsers.every(user => user.selected);
  }

  hasSelectedUsers(): boolean {
    return this.filteredUsers.some(user => user.selected);
  }

  deleteSelectedUsers(): void {
    if (confirm('¿Estás seguro de que quieres eliminar los usuarios seleccionados?')) {
      this.users = this.users.filter(user => !user.selected);
      this.applyFilters();
      this.selectAll = false;
    }
  }

  getRoleClass(role: 'ADMIN' | 'EMPLOYEE' | 'CLIENT'): string {
    return `role-${role.toLowerCase()}`;
  }

  getRoleText(role: 'ADMIN' | 'EMPLOYEE' | 'CLIENT'): string {
    const roleMap = {
      'ADMIN': 'Admin',
      'EMPLOYEE': 'Empleado',
      'CLIENT': 'Cliente'
    };
    return roleMap[role];
  }

  getStatusClass(status: 'active' | 'inactive' | 'suspended'): string {
    return `status-${status}`;
  }

  getStatusText(status: 'active' | 'inactive' | 'suspended'): string {
    const statusMap = {
      'active': 'Activo',
      'inactive': 'Inactivo',
      'suspended': 'Suspendido'
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