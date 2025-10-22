import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Promotion {
  id: number;
  name: string;
  description: string;
  discount: number;
  type: 'percentage' | 'fixed';
  status: 'active' | 'inactive' | 'expired';
  startDate: string;
  endDate: string;
  usageCount: number;
  selected?: boolean;
}

@Component({
  selector: 'app-promotions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="promotions-container">
      <div class="page-header">
        <h1 class="page-title">Gestión de Promociones</h1>
        <p class="page-subtitle">Administra las promociones y descuentos</p>
      </div>

      <div class="controls-bar">
        <div class="search-section">
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input type="text" [(ngModel)]="searchQuery" (ngModelChange)="applyFilters()" placeholder="Buscar promoción...">
          </div>
          <select [(ngModel)]="selectedStatus" (ngModelChange)="applyFilters()" class="filter-select">
            <option value="">Todos los Estados</option>
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
            <option value="expired">Expirado</option>
          </select>
        </div>
        
        <div class="action-buttons">
          <button class="btn btn-secondary" (click)="clearFilters()">
            <i class="fas fa-times"></i>
            Limpiar Filtros
          </button>
          <button class="btn btn-primary" (click)="openAddModal()">
            <i class="fas fa-plus"></i>
            Nueva Promoción
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
              <th>Descuento</th>
              <th>Estado</th>
              <th>Vigencia</th>
              <th>Usos</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let promotion of filteredPromotions">
              <td class="checkbox-column">
                <input type="checkbox" [(ngModel)]="promotion.selected" (change)="onItemSelect()">
              </td>
              <td>{{ promotion.id }}</td>
              <td class="name-cell">{{ promotion.name }}</td>
              <td class="discount-cell">
                <span class="discount-value">
                  {{ promotion.type === 'percentage' ? promotion.discount + '%' : 'Q' + promotion.discount }}
                </span>
              </td>
              <td>
                <span [class]="getStatusClass(promotion.status)">
                  {{ getStatusText(promotion.status) }}
                </span>
              </td>
              <td class="date-cell">
                <div class="date-range">
                  <small>{{ promotion.startDate }}</small>
                  <br>
                  <small>{{ promotion.endDate }}</small>
                </div>
              </td>
              <td class="count-cell">{{ promotion.usageCount }}</td>
              <td class="actions-cell">
                <button class="btn-icon btn-edit" (click)="editPromotion(promotion)" title="Editar">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon btn-delete" (click)="deletePromotion(promotion.id)" title="Eliminar">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
            <tr *ngIf="filteredPromotions.length === 0">
              <td colspan="8" class="no-data">
                <i class="fas fa-percentage"></i>
                <p>No se encontraron promociones</p>
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
  `,
  styles: [`
    .promotions-container {
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

    .discount-cell {
      text-align: center;
    }

    .discount-value {
      background: #e8f5e8;
      color: #27ae60;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-weight: 600;
      font-size: 0.9rem;
    }

    .status-active {
      color: #27ae60;
      font-weight: 600;
    }

    .status-inactive {
      color: #f39c12;
      font-weight: 600;
    }

    .status-expired {
      color: #e74c3c;
      font-weight: 600;
    }

    .date-cell {
      font-size: 0.9rem;
      color: #6c757d;
    }

    .date-range {
      line-height: 1.4;
    }

    .count-cell {
      text-align: center;
      font-weight: 600;
      color: #3498db;
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
  `]
})
export class PromotionsComponent {
  promotions: Promotion[] = [
    { id: 1, name: 'Descuento 20%', description: 'Descuento en todos los productos', discount: 20, type: 'percentage', status: 'active', startDate: '2023-10-01', endDate: '2023-12-31', usageCount: 45 },
    { id: 2, name: 'Envío Gratis', description: 'Envío gratis en compras mayores a Q100', discount: 15, type: 'fixed', status: 'active', startDate: '2023-10-15', endDate: '2023-11-15', usageCount: 23 },
    { id: 3, name: 'Black Friday', description: 'Descuento especial Black Friday', discount: 50, type: 'percentage', status: 'inactive', startDate: '2023-11-24', endDate: '2023-11-26', usageCount: 0 },
    { id: 4, name: 'Promo Verano', description: 'Promoción de verano', discount: 15, type: 'percentage', status: 'expired', startDate: '2023-06-01', endDate: '2023-08-31', usageCount: 78 }
  ];

  filteredPromotions: Promotion[] = [];
  searchQuery: string = '';
  selectedStatus: string = '';
  selectAll: boolean = false;

  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;

  constructor() {
    this.applyFilters();
  }

  applyFilters(): void {
    let temp = this.promotions;

    if (this.searchQuery) {
      temp = temp.filter(promo =>
        promo.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        promo.description.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    if (this.selectedStatus) {
      temp = temp.filter(promo => promo.status === this.selectedStatus);
    }

    this.totalItems = temp.length;
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    this.currentPage = 1;
    this.updatePagedItems(temp);
  }

  updatePagedItems(items: Promotion[]): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.filteredPromotions = items.slice(start, end);
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedStatus = '';
    this.applyFilters();
  }

  openAddModal(): void {
    alert('Abrir modal para nueva promoción');
  }

  editPromotion(promotion: Promotion): void {
    alert(`Editar promoción: ${promotion.name}`);
  }

  deletePromotion(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta promoción?')) {
      this.promotions = this.promotions.filter(p => p.id !== id);
      this.applyFilters();
    }
  }

  toggleSelectAll(): void {
    this.filteredPromotions.forEach(item => item.selected = this.selectAll);
  }

  onItemSelect(): void {
    this.selectAll = this.filteredPromotions.every(item => item.selected);
  }

  hasSelectedItems(): boolean {
    return this.filteredPromotions.some(item => item.selected);
  }

  deleteSelected(): void {
    if (confirm('¿Estás seguro de que quieres eliminar las promociones seleccionadas?')) {
      this.promotions = this.promotions.filter(promo => !promo.selected);
      this.applyFilters();
      this.selectAll = false;
    }
  }

  getStatusClass(status: 'active' | 'inactive' | 'expired'): string {
    return `status-${status}`;
  }

  getStatusText(status: 'active' | 'inactive' | 'expired'): string {
    const statusMap = {
      'active': 'Activo',
      'inactive': 'Inactivo',
      'expired': 'Expirado'
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

