import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  totalSupplies: number;
  totalCategories: number;
  totalClients: number;
  recentOrders: any[];
  lowStockProducts: any[];
  recentClients: any[];
  categoriesList: any[];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <h1>Dashboard</h1>
      <p>Bienvenido al panel de administración de CrunchyPaws</p>
      
      <div class="stats-grid">
        <div class="stat-card revenue">
          <div class="stat-icon">💰</div>
          <h3>Ingresos Totales</h3>
          <p class="stat-value">Q{{ stats.totalRevenue | number:'1.2-2' }}</p>
        </div>
        <div class="stat-card orders">
          <div class="stat-icon">📦</div>
          <h3>Órdenes</h3>
          <p class="stat-value">{{ stats.totalOrders }}</p>
        </div>
        <div class="stat-card products">
          <div class="stat-icon">🛍️</div>
          <h3>Productos</h3>
          <p class="stat-value">{{ stats.totalProducts }}</p>
        </div>
        <div class="stat-card users">
          <div class="stat-icon">👥</div>
          <h3>Usuarios</h3>
          <p class="stat-value">{{ stats.totalUsers }}</p>
        </div>
        <div class="stat-card supplies">
          <div class="stat-icon">📦</div>
          <h3>Insumos</h3>
          <p class="stat-value">{{ stats.totalSupplies }}</p>
        </div>
        <div class="stat-card categories">
          <div class="stat-icon">🏷️</div>
          <h3>Categorías</h3>
          <p class="stat-value">{{ stats.totalCategories }}</p>
        </div>
        <div class="stat-card clients">
          <div class="stat-icon">👥</div>
          <h3>Clientes</h3>
          <p class="stat-value">{{ stats.totalClients }}</p>
        </div>
      </div>

      <div class="dashboard-content">
        <div class="recent-orders">
          <h3>Órdenes Recientes</h3>
          <div class="orders-list">
            <div *ngFor="let order of stats.recentOrders" class="order-item">
              <span class="order-id">#{{ order.id }}</span>
              <span class="order-amount">Q{{ order.total | number:'1.2-2' }}</span>
              <span class="order-status" [class]="'status-' + order.status.toLowerCase()">
                {{ order.status }}
              </span>
            </div>
            <div *ngIf="stats.recentOrders.length === 0" class="no-data">
              No hay órdenes recientes
            </div>
          </div>
        </div>

        <div class="low-stock">
          <h3>Productos con Stock Bajo</h3>
          <div class="stock-list">
            <div *ngFor="let product of stats.lowStockProducts" class="stock-item">
              <span class="product-name">{{ product.name }}</span>
              <span class="stock-amount" [class]="product.stock < 5 ? 'critical' : 'low'">
                {{ product.stock }} unidades
              </span>
            </div>
            <div *ngIf="stats.lowStockProducts.length === 0" class="no-data">
              Todos los productos tienen stock suficiente
            </div>
          </div>
        </div>
      </div>

      <div class="dashboard-content">
        <div class="recent-clients">
          <h3>Clientes Recientes</h3>
          <div class="clients-list">
            <div *ngFor="let client of stats.recentClients" class="client-item">
              <span class="client-name">{{ client.full_name || client.name }}</span>
              <span class="client-email">{{ client.email }}</span>
              <span class="client-date">{{ client.createdAt | date:'short' }}</span>
            </div>
            <div *ngIf="stats.recentClients.length === 0" class="no-data">
              No hay clientes registrados
            </div>
          </div>
        </div>

        <div class="categories-overview">
          <h3>Categorías de Productos</h3>
          <div class="categories-list">
            <div *ngFor="let category of stats.categoriesList" class="category-item">
              <span class="category-name">{{ category.name }}</span>
              <span class="category-count">{{ category.productCount || 0 }} productos</span>
              <span class="category-status" [class]="'status-' + (category.is_active ? 'active' : 'inactive')">
                {{ category.is_active ? 'Activa' : 'Inactiva' }}
              </span>
            </div>
            <div *ngIf="stats.categoriesList.length === 0" class="no-data">
              No hay categorías registradas
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      padding: 2rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-top: 2rem;
    }

    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      text-align: center;
      position: relative;
      overflow: hidden;
    }

    .stat-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: var(--card-color, #007bff);
    }

    .stat-card.revenue::before { background: #28a745; }
    .stat-card.orders::before { background: #007bff; }
    .stat-card.products::before { background: #ffc107; }
    .stat-card.users::before { background: #6f42c1; }
    .stat-card.supplies::before { background: #fd7e14; }
    .stat-card.categories::before { background: #20c997; }
    .stat-card.clients::before { background: #17a2b8; }

    .stat-icon {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }

    .stat-card h3 {
      margin: 0 0 0.5rem 0;
      color: #666;
      font-size: 0.9rem;
    }

    .stat-value {
      margin: 0;
      font-size: 2rem;
      font-weight: bold;
      color: #333;
    }

    .dashboard-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      margin-top: 2rem;
    }

    .recent-orders, .low-stock, .recent-clients, .categories-overview {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .recent-orders h3, .low-stock h3, .recent-clients h3, .categories-overview h3 {
      margin: 0 0 1rem 0;
      color: #333;
    }

    .orders-list, .stock-list, .clients-list, .categories-list {
      max-height: 300px;
      overflow-y: auto;
    }

    .order-item, .stock-item, .client-item, .category-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 0;
      border-bottom: 1px solid #eee;
    }

    .order-item:last-child, .stock-item:last-child, .client-item:last-child, .category-item:last-child {
      border-bottom: none;
    }

    .client-item {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.25rem;
    }

    .client-name {
      font-weight: 600;
      color: #333;
    }

    .client-email {
      font-size: 0.9rem;
      color: #666;
    }

    .client-date {
      font-size: 0.8rem;
      color: #999;
    }

    .category-item {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.25rem;
    }

    .category-name {
      font-weight: 600;
      color: #333;
    }

    .category-count {
      font-size: 0.9rem;
      color: #666;
    }

    .category-status {
      font-size: 0.8rem;
      padding: 0.2rem 0.4rem;
      border-radius: 3px;
      font-weight: bold;
    }

    .order-status {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.8rem;
      font-weight: bold;
    }

    .status-created { background: #e3f2fd; color: #1976d2; }
    .status-paid { background: #e8f5e8; color: #2e7d32; }
    .status-preparing { background: #fff3e0; color: #f57c00; }
    .status-shipped { background: #f3e5f5; color: #7b1fa2; }
    .status-delivered { background: #e8f5e8; color: #2e7d32; }
    .status-cancelled { background: #ffebee; color: #c62828; }

    .stock-amount.critical {
      color: #c62828;
      font-weight: bold;
    }

    .stock-amount.low {
      color: #f57c00;
      font-weight: bold;
    }

    .no-data {
      text-align: center;
      color: #666;
      font-style: italic;
      padding: 2rem;
    }

    @media (max-width: 768px) {
      .dashboard-content {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats = {
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    totalSupplies: 0,
    totalCategories: 0,
    totalClients: 0,
    recentOrders: [],
    lowStockProducts: [],
    recentClients: [],
    categoriesList: []
  };

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // Cargar datos de productos
    this.apiService.getProducts().subscribe({
      next: (response: any) => {
        // Verificar si la respuesta es un array o un objeto con data
        const products = Array.isArray(response) ? response : (response.data || []);
        this.stats.totalProducts = products.length;
        this.stats.lowStockProducts = products.filter((p: any) => p.stock < 10);
        console.log('Productos cargados:', products.length);
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.stats.totalProducts = 0;
        this.stats.lowStockProducts = [];
      }
    });

    // Cargar datos de insumos
    this.apiService.getSupplies().subscribe({
      next: (response: any) => {
        // Verificar si la respuesta es un array o un objeto con data
        const supplies = Array.isArray(response) ? response : (response.data || []);
        this.stats.totalSupplies = supplies.length;
        console.log('Insumos cargados:', supplies.length);
      },
      error: (error) => {
        console.error('Error loading supplies:', error);
        this.stats.totalSupplies = 0;
      }
    });

    // Cargar datos de usuarios (incluyendo clientes)
    this.apiService.getUsers().subscribe({
      next: (response: any) => {
        // Verificar si la respuesta es un array o un objeto con data
        const users = Array.isArray(response) ? response : (response.data || []);
        this.stats.totalUsers = users.length;
        // Filtrar clientes (usuarios con rol CLIENT)
        const clients = users.filter((user: any) => user.role === 'CLIENT');
        this.stats.totalClients = clients.length;
        // Obtener los 5 clientes más recientes
        this.stats.recentClients = clients
          .sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
          .slice(0, 5);
        console.log('Usuarios cargados:', users.length, 'Clientes:', clients.length);
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.stats.totalUsers = 0;
        this.stats.totalClients = 0;
        this.stats.recentClients = [];
      }
    });

    // Cargar datos de categorías
    this.apiService.getCategories().subscribe({
      next: (response: any) => {
        // Verificar si la respuesta es un array o un objeto con data
        const categories = Array.isArray(response) ? response : (response.data || []);
        this.stats.totalCategories = categories.length;
        this.stats.categoriesList = categories.slice(0, 10); // Mostrar las primeras 10 categorías
        console.log('Categorías cargadas:', categories.length);
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.stats.totalCategories = 0;
        this.stats.categoriesList = [];
      }
    });

    // Datos mock para órdenes (hasta que tengamos el endpoint de órdenes)
    this.stats.totalOrders = 0; // Se actualizará cuando tengamos el endpoint
    this.stats.totalRevenue = 0; // Se actualizará cuando tengamos el endpoint
    this.stats.recentOrders = []; // Se actualizará cuando tengamos el endpoint
    
    console.log('Dashboard data loaded successfully');
  }
}
