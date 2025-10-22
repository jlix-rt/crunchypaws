import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalComponent } from '../../components/modal/modal.component';
import { ApiService } from '../../services/api.service';

interface AdminRegistration {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  selected?: boolean;
}

@Component({
  selector: 'app-admin-registration',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ModalComponent],
  template: `
    <div class="admin-registration-container">
      <div class="page-header">
        <h1 class="page-title">Solicitudes de Administradores</h1>
        <p class="page-subtitle">Revisa y aprueba las solicitudes de nuevos administradores</p>
      </div>

      <div class="controls-bar">
        <div class="search-section">
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input type="text" [(ngModel)]="searchQuery" (ngModelChange)="applyFilters()" placeholder="Buscar solicitud...">
          </div>
          <select [(ngModel)]="selectedStatus" (ngModelChange)="applyFilters()" class="filter-select">
            <option value="">Todos los Estados</option>
            <option value="pending">Pendiente</option>
            <option value="approved">Aprobado</option>
            <option value="rejected">Rechazado</option>
          </select>
        </div>
        
        <div class="action-buttons">
          <button class="btn btn-secondary" (click)="clearFilters()">
            <i class="fas fa-times"></i>
            Limpiar Filtros
          </button>
          <button class="btn btn-success" [disabled]="!hasSelectedItems()" (click)="approveSelected()">
            <i class="fas fa-check"></i>
            Aprobar Seleccionados
          </button>
          <button class="btn btn-danger" [disabled]="!hasSelectedItems()" (click)="rejectSelected()">
            <i class="fas fa-times"></i>
            Rechazar Seleccionados
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
              <th>Empresa</th>
              <th>Estado</th>
              <th>Fecha Solicitud</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let registration of filteredRegistrations">
              <td class="checkbox-column">
                <input type="checkbox" [(ngModel)]="registration.selected" (change)="onItemSelect()">
              </td>
              <td>{{ registration.id }}</td>
              <td class="name-cell">{{ registration.name }}</td>
              <td class="email-cell">{{ registration.email }}</td>
              <td>{{ registration.company }}</td>
              <td>
                <span [class]="getStatusClass(registration.status)">
                  {{ getStatusText(registration.status) }}
                </span>
              </td>
              <td class="date-cell">{{ registration.submittedAt }}</td>
              <td class="actions-cell">
                <button class="btn-icon btn-view" (click)="viewRegistration(registration)" title="Ver Detalles">
                  <i class="fas fa-eye"></i>
                </button>
                <button class="btn-icon btn-approve" (click)="approveRegistration(registration.id)" title="Aprobar" *ngIf="registration.status === 'pending'">
                  <i class="fas fa-check"></i>
                </button>
                <button class="btn-icon btn-reject" (click)="rejectRegistration(registration.id)" title="Rechazar" *ngIf="registration.status === 'pending'">
                  <i class="fas fa-times"></i>
                </button>
              </td>
            </tr>
            <tr *ngIf="filteredRegistrations.length === 0">
              <td colspan="8" class="no-data">
                <i class="fas fa-user-plus"></i>
                <p>No se encontraron solicitudes</p>
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

    <!-- Modal para ver detalles de la solicitud -->
    <app-modal 
      [isOpen]="showModal" 
      [title]="'Detalles de la Solicitud'"
      [confirmText]="'Cerrar'"
      [showFooter]="false"
      (onClose)="closeModal()">
      
      <div class="registration-details" *ngIf="selectedRegistration">
        <div class="detail-section">
          <h4>Información Personal</h4>
          <div class="detail-grid">
            <div class="detail-item">
              <label>Nombre:</label>
              <span>{{ selectedRegistration.name }}</span>
            </div>
            <div class="detail-item">
              <label>Email:</label>
              <span>{{ selectedRegistration.email }}</span>
            </div>
            <div class="detail-item">
              <label>Teléfono:</label>
              <span>{{ selectedRegistration.phone }}</span>
            </div>
            <div class="detail-item">
              <label>Empresa:</label>
              <span>{{ selectedRegistration.company }}</span>
            </div>
          </div>
        </div>

        <div class="detail-section">
          <h4>Motivo de la Solicitud</h4>
          <p class="reason-text">{{ selectedRegistration.reason }}</p>
        </div>

        <div class="detail-section">
          <h4>Estado de la Solicitud</h4>
          <div class="status-info">
            <span [class]="getStatusClass(selectedRegistration.status)">
              {{ getStatusText(selectedRegistration.status) }}
            </span>
            <p class="submission-date">Solicitado el: {{ selectedRegistration.submittedAt }}</p>
            <p *ngIf="selectedRegistration.reviewedBy" class="review-info">
              Revisado por: {{ selectedRegistration.reviewedBy }} el {{ selectedRegistration.reviewedAt }}
            </p>
          </div>
        </div>

        <div class="action-buttons" *ngIf="selectedRegistration.status === 'pending'">
          <button class="btn btn-success" (click)="approveRegistration(selectedRegistration.id)">
            <i class="fas fa-check"></i>
            Aprobar Solicitud
          </button>
          <button class="btn btn-danger" (click)="rejectRegistration(selectedRegistration.id)">
            <i class="fas fa-times"></i>
            Rechazar Solicitud
          </button>
        </div>
      </div>
    </app-modal>
  `,
  styles: [`
    .admin-registration-container {
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

    .btn-success {
      background: #27ae60;
      color: white;
    }

    .btn-success:hover:not(:disabled) {
      background: #229954;
    }

    .btn-danger {
      background: #e74c3c;
      color: white;
    }

    .btn-danger:hover:not(:disabled) {
      background: #c0392b;
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
    }

    .btn-secondary:hover:not(:disabled) {
      background: #5a6268;
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

    .status-pending {
      color: #f39c12;
      font-weight: 600;
    }

    .status-approved {
      color: #27ae60;
      font-weight: 600;
    }

    .status-rejected {
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

    .btn-view {
      background: #3498db;
      color: white;
    }

    .btn-view:hover {
      background: #2980b9;
    }

    .btn-approve {
      background: #27ae60;
      color: white;
    }

    .btn-approve:hover {
      background: #229954;
    }

    .btn-reject {
      background: #e74c3c;
      color: white;
    }

    .btn-reject:hover {
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

    .registration-details {
      padding: 1rem 0;
    }

    .detail-section {
      margin-bottom: 2rem;
    }

    .detail-section h4 {
      color: #2c3e50;
      margin-bottom: 1rem;
      font-size: 1.1rem;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .detail-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .detail-item label {
      font-weight: 600;
      color: #6c757d;
      font-size: 0.9rem;
    }

    .detail-item span {
      color: #2c3e50;
    }

    .reason-text {
      background: #f8f9fa;
      padding: 1rem;
      border-radius: 8px;
      border-left: 4px solid #3498db;
      color: #2c3e50;
      line-height: 1.6;
    }

    .status-info {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .submission-date,
    .review-info {
      color: #6c757d;
      font-size: 0.9rem;
      margin: 0;
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

      .detail-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AdminRegistrationComponent implements OnInit {
  registrations: AdminRegistration[] = [
    {
      id: 1,
      name: 'Juan Pérez',
      email: 'juan.perez@empresa.com',
      phone: '+502 1234-5678',
      company: 'Pet Store Central',
      reason: 'Necesito acceso administrativo para gestionar el inventario de mi tienda de mascotas. Somos una cadena de 5 tiendas y necesitamos un sistema centralizado.',
      status: 'pending',
      submittedAt: '2023-10-26'
    },
    {
      id: 2,
      name: 'María García',
      email: 'maria.garcia@veterinaria.com',
      phone: '+502 8765-4321',
      company: 'Veterinaria San José',
      reason: 'Como veterinaria, necesito acceso para gestionar los productos y servicios que ofrecemos a nuestros clientes.',
      status: 'approved',
      submittedAt: '2023-10-25',
      reviewedBy: 'Admin User',
      reviewedAt: '2023-10-26'
    },
    {
      id: 3,
      name: 'Carlos López',
      email: 'carlos.lopez@distribuidora.com',
      phone: '+502 5555-1234',
      company: 'Distribuidora PetFood',
      reason: 'Somos distribuidores mayoristas y necesitamos acceso para gestionar nuestros productos y precios.',
      status: 'rejected',
      submittedAt: '2023-10-24',
      reviewedBy: 'Admin User',
      reviewedAt: '2023-10-25'
    }
  ];

  filteredRegistrations: AdminRegistration[] = [];
  searchQuery: string = '';
  selectedStatus: string = '';
  selectAll: boolean = false;

  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;

  // Modal properties
  showModal = false;
  selectedRegistration: AdminRegistration | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let temp = this.registrations;

    if (this.searchQuery) {
      temp = temp.filter(reg =>
        reg.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        reg.email.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        reg.company.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    if (this.selectedStatus) {
      temp = temp.filter(reg => reg.status === this.selectedStatus);
    }

    this.totalItems = temp.length;
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    this.currentPage = 1;
    this.updatePagedItems(temp);
  }

  updatePagedItems(items: AdminRegistration[]): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.filteredRegistrations = items.slice(startIndex, endIndex);
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedStatus = '';
    this.applyFilters();
  }

  viewRegistration(registration: AdminRegistration): void {
    this.selectedRegistration = registration;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedRegistration = null;
  }

  approveRegistration(id: number): void {
    if (confirm('¿Estás seguro de que quieres aprobar esta solicitud?')) {
      const registration = this.registrations.find(r => r.id === id);
      if (registration) {
        registration.status = 'approved';
        registration.reviewedBy = 'Admin User'; // En producción sería el usuario actual
        registration.reviewedAt = new Date().toISOString().split('T')[0];
        this.applyFilters();
        this.closeModal();
      }
    }
  }

  rejectRegistration(id: number): void {
    if (confirm('¿Estás seguro de que quieres rechazar esta solicitud?')) {
      const registration = this.registrations.find(r => r.id === id);
      if (registration) {
        registration.status = 'rejected';
        registration.reviewedBy = 'Admin User'; // En producción sería el usuario actual
        registration.reviewedAt = new Date().toISOString().split('T')[0];
        this.applyFilters();
        this.closeModal();
      }
    }
  }

  toggleSelectAll(): void {
    this.filteredRegistrations.forEach(registration => registration.selected = this.selectAll);
  }

  onItemSelect(): void {
    this.selectAll = this.filteredRegistrations.every(registration => registration.selected);
  }

  hasSelectedItems(): boolean {
    return this.filteredRegistrations.some(registration => registration.selected);
  }

  approveSelected(): void {
    if (confirm('¿Estás seguro de que quieres aprobar las solicitudes seleccionadas?')) {
      this.filteredRegistrations.forEach(registration => {
        if (registration.selected) {
          registration.status = 'approved';
          registration.reviewedBy = 'Admin User';
          registration.reviewedAt = new Date().toISOString().split('T')[0];
        }
      });
      this.applyFilters();
    }
  }

  rejectSelected(): void {
    if (confirm('¿Estás seguro de que quieres rechazar las solicitudes seleccionadas?')) {
      this.filteredRegistrations.forEach(registration => {
        if (registration.selected) {
          registration.status = 'rejected';
          registration.reviewedBy = 'Admin User';
          registration.reviewedAt = new Date().toISOString().split('T')[0];
        }
      });
      this.applyFilters();
    }
  }

  getStatusClass(status: 'pending' | 'approved' | 'rejected'): string {
    return `status-${status}`;
  }

  getStatusText(status: 'pending' | 'approved' | 'rejected'): string {
    const statusMap = {
      'pending': 'Pendiente',
      'approved': 'Aprobado',
      'rejected': 'Rechazado'
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


