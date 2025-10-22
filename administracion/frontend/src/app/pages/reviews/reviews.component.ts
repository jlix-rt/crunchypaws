import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Review {
  id: number;
  productName: string;
  customerName: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  selected?: boolean;
}

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="reviews-container">
      <div class="page-header">
        <h1 class="page-title">Gestión de Reseñas</h1>
        <p class="page-subtitle">Modera las reseñas de productos</p>
      </div>

      <div class="controls-bar">
        <div class="search-section">
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input type="text" [(ngModel)]="searchQuery" (ngModelChange)="applyFilters()" placeholder="Buscar reseña...">
          </div>
          <select [(ngModel)]="selectedStatus" (ngModelChange)="applyFilters()" class="filter-select">
            <option value="">Todos los Estados</option>
            <option value="pending">Pendiente</option>
            <option value="approved">Aprobado</option>
            <option value="rejected">Rechazado</option>
          </select>
          <select [(ngModel)]="selectedRating" (ngModelChange)="applyFilters()" class="filter-select">
            <option value="">Todas las Calificaciones</option>
            <option value="5">5 Estrellas</option>
            <option value="4">4 Estrellas</option>
            <option value="3">3 Estrellas</option>
            <option value="2">2 Estrellas</option>
            <option value="1">1 Estrella</option>
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
          <button class="btn btn-warning" [disabled]="!hasSelectedItems()" (click)="rejectSelected()">
            <i class="fas fa-times"></i>
            Rechazar Seleccionados
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
              <th>Producto</th>
              <th>Cliente</th>
              <th>Calificación</th>
              <th>Comentario</th>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let review of filteredReviews">
              <td class="checkbox-column">
                <input type="checkbox" [(ngModel)]="review.selected" (change)="onItemSelect()">
              </td>
              <td>{{ review.id }}</td>
              <td class="product-cell">{{ review.productName }}</td>
              <td class="customer-cell">{{ review.customerName }}</td>
              <td class="rating-cell">
                <div class="stars">
                  <i *ngFor="let star of getStars(review.rating)" [class]="star"></i>
                </div>
                <span class="rating-number">{{ review.rating }}/5</span>
              </td>
              <td class="comment-cell">
                <div class="comment-text">{{ review.comment }}</div>
              </td>
              <td>
                <span [class]="getStatusClass(review.status)">
                  {{ getStatusText(review.status) }}
                </span>
              </td>
              <td class="date-cell">{{ review.createdAt }}</td>
              <td class="actions-cell">
                <button class="btn-icon btn-approve" (click)="approveReview(review.id)" title="Aprobar" *ngIf="review.status === 'pending'">
                  <i class="fas fa-check"></i>
                </button>
                <button class="btn-icon btn-reject" (click)="rejectReview(review.id)" title="Rechazar" *ngIf="review.status === 'pending'">
                  <i class="fas fa-times"></i>
                </button>
                <button class="btn-icon btn-delete" (click)="deleteReview(review.id)" title="Eliminar">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
            <tr *ngIf="filteredReviews.length === 0">
              <td colspan="9" class="no-data">
                <i class="fas fa-star"></i>
                <p>No se encontraron reseñas</p>
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
    .reviews-container {
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

    .btn-success {
      background: #27ae60;
      color: white;
    }

    .btn-warning {
      background: #f39c12;
      color: white;
    }

    .btn-danger {
      background: #e74c3c;
      color: white;
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
    }

    .btn:hover:not(:disabled) {
      transform: translateY(-2px);
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

    .product-cell {
      font-weight: 600;
      color: #2c3e50;
    }

    .customer-cell {
      color: #6c757d;
    }

    .rating-cell {
      text-align: center;
    }

    .stars {
      display: flex;
      justify-content: center;
      gap: 2px;
      margin-bottom: 0.25rem;
    }

    .stars i {
      font-size: 0.9rem;
    }

    .fa-star {
      color: #f39c12;
    }

    .fa-star-o {
      color: #ddd;
    }

    .rating-number {
      font-size: 0.8rem;
      color: #6c757d;
    }

    .comment-cell {
      max-width: 200px;
    }

    .comment-text {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #555;
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

    .btn-delete {
      background: #6c757d;
      color: white;
    }

    .btn-delete:hover {
      background: #5a6268;
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
        flex-wrap: wrap;
      }
    }
  `]
})
export class ReviewsComponent {
  reviews: Review[] = [
    { id: 1, productName: 'Croquetas Premium', customerName: 'Juan Pérez', rating: 5, comment: 'Excelente producto, mi perro lo ama', status: 'approved', createdAt: '2023-10-15' },
    { id: 2, productName: 'Juguete Interactivo', customerName: 'María García', rating: 4, comment: 'Muy bueno, pero un poco caro', status: 'pending', createdAt: '2023-10-16' },
    { id: 3, productName: 'Collar de Cuero', customerName: 'Carlos López', rating: 2, comment: 'Se rompió muy rápido', status: 'rejected', createdAt: '2023-10-17' },
    { id: 4, productName: 'Snacks de Pollo', customerName: 'Ana Martínez', rating: 5, comment: 'Perfecto para entrenar', status: 'approved', createdAt: '2023-10-18' }
  ];

  filteredReviews: Review[] = [];
  searchQuery: string = '';
  selectedStatus: string = '';
  selectedRating: string = '';
  selectAll: boolean = false;

  currentPage: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;
  totalPages: number = 0;

  constructor() {
    this.applyFilters();
  }

  applyFilters(): void {
    let temp = this.reviews;

    if (this.searchQuery) {
      temp = temp.filter(review =>
        review.productName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        review.customerName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        review.comment.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    if (this.selectedStatus) {
      temp = temp.filter(review => review.status === this.selectedStatus);
    }

    if (this.selectedRating) {
      temp = temp.filter(review => review.rating === parseInt(this.selectedRating));
    }

    this.totalItems = temp.length;
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    this.currentPage = 1;
    this.updatePagedItems(temp);
  }

  updatePagedItems(items: Review[]): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.filteredReviews = items.slice(start, end);
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedStatus = '';
    this.selectedRating = '';
    this.applyFilters();
  }

  approveSelected(): void {
    if (confirm('¿Estás seguro de que quieres aprobar las reseñas seleccionadas?')) {
      this.filteredReviews.forEach(review => {
        if (review.selected) {
          review.status = 'approved';
        }
      });
      this.applyFilters();
    }
  }

  rejectSelected(): void {
    if (confirm('¿Estás seguro de que quieres rechazar las reseñas seleccionadas?')) {
      this.filteredReviews.forEach(review => {
        if (review.selected) {
          review.status = 'rejected';
        }
      });
      this.applyFilters();
    }
  }

  deleteSelected(): void {
    if (confirm('¿Estás seguro de que quieres eliminar las reseñas seleccionadas?')) {
      this.reviews = this.reviews.filter(review => !review.selected);
      this.applyFilters();
      this.selectAll = false;
    }
  }

  approveReview(id: number): void {
    const review = this.reviews.find(r => r.id === id);
    if (review) {
      review.status = 'approved';
      this.applyFilters();
    }
  }

  rejectReview(id: number): void {
    const review = this.reviews.find(r => r.id === id);
    if (review) {
      review.status = 'rejected';
      this.applyFilters();
    }
  }

  deleteReview(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta reseña?')) {
      this.reviews = this.reviews.filter(r => r.id !== id);
      this.applyFilters();
    }
  }

  toggleSelectAll(): void {
    this.filteredReviews.forEach(item => item.selected = this.selectAll);
  }

  onItemSelect(): void {
    this.selectAll = this.filteredReviews.every(item => item.selected);
  }

  hasSelectedItems(): boolean {
    return this.filteredReviews.some(item => item.selected);
  }

  getStars(rating: number): string[] {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= rating ? 'fas fa-star' : 'far fa-star');
    }
    return stars;
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

