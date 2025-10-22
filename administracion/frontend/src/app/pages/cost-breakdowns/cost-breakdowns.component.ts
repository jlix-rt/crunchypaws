import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ModalComponent } from '../../components/modal/modal.component';

interface DynamicCostBreakdown {
  productId: number;
  productName: string;
  productSku: string;
  baseCost: number;
  profitPercentage: number;
  profitAmount: number;
  subtotal: number;
  costs: CostBreakdownItem[];
  finalPrice: number;
}

interface CostBreakdownItem {
  id: number;
  name: string;
  percentage: number;
  amount: number;
  priority: number;
  isMandatory: boolean;
}

interface CostType {
  id: number;
  name: string;
  percentage: number;
  priority: number;
  isMandatory: boolean;
}

@Component({
  selector: 'app-cost-breakdowns',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  template: `
    <div class="cost-breakdowns-container">
      <!-- Header -->
      <div class="page-header">
        <div class="header-content">
          <div class="title-section">
            <h1><i class="fas fa-calculator"></i> Desglose de Costos</h1>
            <p>Análisis dinámico de costos de productos basado en datos reales</p>
          </div>
          <div class="actions">
            <button class="btn btn-secondary" (click)="refreshData()">
              <i class="fas fa-sync-alt"></i>
              Actualizar
            </button>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="filters-section">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input 
            type="text" 
            [(ngModel)]="searchQuery" 
            (ngModelChange)="applyFilters()" 
            placeholder="Buscar por producto..."
          >
        </div>
        <div class="filter-select">
          <select [(ngModel)]="selectedProduct" (ngModelChange)="applyFilters()">
            <option value="">Todos los productos</option>
            <option *ngFor="let product of allProducts" [value]="product.id">
              {{ product.name }} ({{ product.sku }})
            </option>
          </select>
        </div>
      </div>

      <!-- Dynamic Cost Breakdown Table -->
      <div class="table-container">
        <div class="table-wrapper">
          <table class="cost-breakdown-table">
            <thead>
              <tr>
                <th class="product-column">Producto</th>
                <th class="cost-column">Costo Base</th>
                <th class="cost-column">Ganancia</th>
                <th class="cost-column">Subtotal</th>
                <th *ngFor="let costType of availableCostTypes" class="cost-column">
                  {{ costType.name }}
                  <small>({{ costType.percentage }}%)</small>
                </th>
                <th class="final-price-column">Precio Final</th>
                <th class="actions-column">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let breakdown of filteredBreakdowns">
                <td class="product-cell">
                  <div class="product-info">
                    <strong>{{ breakdown.productName }}</strong>
                    <small>{{ breakdown.productSku }}</small>
                  </div>
                </td>
                <td class="cost-cell">Q{{ breakdown.baseCost.toFixed(2) }}</td>
                <td class="cost-cell">
                  Q{{ breakdown.profitAmount.toFixed(2) }}
                  <small>({{ breakdown.profitPercentage }}%)</small>
                </td>
                <td class="cost-cell">Q{{ breakdown.subtotal.toFixed(2) }}</td>
                <td *ngFor="let costType of availableCostTypes" class="cost-cell">
                  <span *ngIf="getCostAmount(breakdown, costType.id) > 0">
                    Q{{ getCostAmount(breakdown, costType.id).toFixed(2) }}
                  </span>
                  <span *ngIf="getCostAmount(breakdown, costType.id) === 0" class="no-cost">-</span>
                </td>
                <td class="final-price-cell">Q{{ breakdown.finalPrice.toFixed(2) }}</td>
                <td class="actions-cell">
                  <button class="btn-icon btn-view" (click)="viewBreakdown(breakdown)" title="Ver detalles">
                    <i class="fas fa-eye"></i>
                  </button>
                </td>
              </tr>
              <tr *ngIf="filteredBreakdowns.length === 0">
                <td [attr.colspan]="getTableColspan()" class="no-data">
                  <i class="fas fa-inbox"></i>
                  <p>No se encontraron desgloses de costos</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Summary Section -->
      <div class="summary-section" *ngIf="filteredBreakdowns.length > 0">
        <h3>Resumen de Costos</h3>
        <div class="summary-grid">
          <div class="summary-item">
            <span class="label">Total Productos:</span>
            <span class="value">{{ filteredBreakdowns.length }}</span>
          </div>
          <div class="summary-item">
            <span class="label">Costo Base Promedio:</span>
            <span class="value">Q{{ getAverageBaseCost().toFixed(2) }}</span>
          </div>
          <div class="summary-item">
            <span class="label">Precio Final Promedio:</span>
            <span class="value">Q{{ getAverageFinalPrice().toFixed(2) }}</span>
          </div>
          <div class="summary-item">
            <span class="label">Margen Promedio:</span>
            <span class="value">{{ getAverageMargin().toFixed(1) }}%</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cost-breakdowns-container {
      padding: 2rem;
      background: #f8f9fa;
      min-height: 100vh;
    }

    .page-header {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      margin-bottom: 1.5rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .title-section h1 {
      font-size: 2rem;
      font-weight: 700;
      color: #2c3e50;
      margin: 0 0 0.5rem 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .title-section p {
      color: #6c757d;
      margin: 0;
    }

    .filters-section {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
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
      border: 2px solid #e1e5e9;
      border-radius: 8px;
      font-size: 1rem;
    }

    .filter-select {
      min-width: 200px;
    }

    .filter-select select {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 2px solid #e1e5e9;
      border-radius: 8px;
      font-size: 1rem;
    }

    .table-container {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      overflow: hidden;
      margin-bottom: 1.5rem;
    }

    .table-wrapper {
      overflow-x: auto;
    }

    .cost-breakdown-table {
      width: 100%;
      border-collapse: collapse;
      min-width: 800px;
    }

    .cost-breakdown-table th {
      background: #f8f9fa;
      padding: 1rem;
      text-align: center;
      font-weight: 600;
      color: #2c3e50;
      border-bottom: 2px solid #e1e5e9;
      white-space: nowrap;
    }

    .cost-breakdown-table td {
      padding: 1rem;
      text-align: center;
      border-bottom: 1px solid #e1e5e9;
    }

    .product-column {
      text-align: left !important;
      min-width: 200px;
    }

    .cost-column {
      min-width: 120px;
    }

    .final-price-column {
      min-width: 120px;
      background: #e8f5e8;
      font-weight: 600;
    }

    .actions-column {
      min-width: 100px;
    }

    .product-cell {
      text-align: left !important;
    }

    .product-info strong {
      display: block;
      color: #2c3e50;
      font-weight: 600;
    }

    .product-info small {
      color: #6c757d;
      font-size: 0.875rem;
    }

    .cost-cell {
      font-weight: 500;
      color: #2c3e50;
    }

    .cost-cell small {
      display: block;
      color: #6c757d;
      font-size: 0.75rem;
    }

    .final-price-cell {
      font-weight: 700;
      color: #27ae60;
      background: #f0f8f0;
    }

    .no-cost {
      color: #6c757d;
      font-style: italic;
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

    .summary-section {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .summary-section h3 {
      margin: 0 0 1.5rem 0;
      color: #2c3e50;
      font-size: 1.5rem;
    }

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .summary-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .summary-item .label {
      color: #6c757d;
      font-weight: 500;
    }

    .summary-item .value {
      color: #2c3e50;
      font-weight: 600;
      font-size: 1.1rem;
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
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background: #5a6268;
    }

    @media (max-width: 768px) {
      .cost-breakdowns-container {
        padding: 1rem;
      }

      .header-content {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
      }

      .filters-section {
        flex-direction: column;
      }

      .summary-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class CostBreakdownsComponent implements OnInit {
  costBreakdowns: DynamicCostBreakdown[] = [];
  filteredBreakdowns: DynamicCostBreakdown[] = [];
  availableCostTypes: CostType[] = [];
  allProducts: any[] = [];

  searchQuery: string = '';
  selectedProduct: string = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadDynamicCostBreakdowns();
  }

  loadDynamicCostBreakdowns(): void {
    this.apiService.getDynamicCostBreakdowns().subscribe({
      next: (data) => {
        this.costBreakdowns = data.costBreakdowns || [];
        this.availableCostTypes = data.costTypes || [];
        this.allProducts = this.costBreakdowns.map(b => ({
          id: b.productId,
          name: b.productName,
          sku: b.productSku
        }));
        this.applyFilters();
        console.log('Desglose dinámico cargado:', data);
      },
      error: (error) => {
        console.error('Error cargando desglose dinámico:', error);
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.costBreakdowns];

    if (this.searchQuery) {
      filtered = filtered.filter(breakdown =>
        breakdown.productName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        breakdown.productSku.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    if (this.selectedProduct) {
      filtered = filtered.filter(breakdown =>
        breakdown.productId.toString() === this.selectedProduct
      );
    }

    this.filteredBreakdowns = filtered;
  }

  refreshData(): void {
    this.loadDynamicCostBreakdowns();
  }

  getCostAmount(breakdown: DynamicCostBreakdown, costTypeId: number): number {
    const cost = breakdown.costs.find(c => c.id === costTypeId);
    return cost ? cost.amount : 0;
  }

  getTableColspan(): number {
    return 5 + this.availableCostTypes.length; // Producto + Costo Base + Ganancia + Subtotal + Precio Final + Acciones + Costos dinámicos
  }

  getAverageBaseCost(): number {
    if (this.filteredBreakdowns.length === 0) return 0;
    const total = this.filteredBreakdowns.reduce((sum, b) => sum + b.baseCost, 0);
    return total / this.filteredBreakdowns.length;
  }

  getAverageFinalPrice(): number {
    if (this.filteredBreakdowns.length === 0) return 0;
    const total = this.filteredBreakdowns.reduce((sum, b) => sum + b.finalPrice, 0);
    return total / this.filteredBreakdowns.length;
  }

  getAverageMargin(): number {
    if (this.filteredBreakdowns.length === 0) return 0;
    const total = this.filteredBreakdowns.reduce((sum, b) => sum + b.profitPercentage, 0);
    return total / this.filteredBreakdowns.length;
  }

  viewBreakdown(breakdown: DynamicCostBreakdown): void {
    console.log('Ver detalles del desglose:', breakdown);
    // Aquí se puede implementar un modal para mostrar detalles
    alert(`Desglose de ${breakdown.productName}:\n` +
          `Costo Base: Q${breakdown.baseCost.toFixed(2)}\n` +
          `Ganancia: Q${breakdown.profitAmount.toFixed(2)} (${breakdown.profitPercentage}%)\n` +
          `Precio Final: Q${breakdown.finalPrice.toFixed(2)}`);
  }
}