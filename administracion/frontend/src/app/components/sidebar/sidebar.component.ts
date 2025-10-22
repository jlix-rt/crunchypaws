import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  exact?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  isCollapsed = false;

  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'fas fa-tachometer-alt',
      route: '/dashboard',
      exact: true
    },
    {
      label: 'Insumos',
      icon: 'fas fa-boxes',
      route: '/supplies'
    },
    {
      label: 'Productos',
      icon: 'fas fa-tags',
      route: '/products'
    },
    {
      label: 'Usuarios',
      icon: 'fas fa-users',
      route: '/users'
    },
    {
      label: 'Categorías',
      icon: 'fas fa-folder',
      route: '/categories'
    },
    {
      label: 'Promociones',
      icon: 'fas fa-percentage',
      route: '/promotions'
    },
    {
      label: 'Reseñas',
      icon: 'fas fa-star',
      route: '/reviews'
    },
    {
      label: 'Solicitudes Admin',
      icon: 'fas fa-user-plus',
      route: '/admin-registration'
    },
    {
      label: 'Desglose de Costos',
      icon: 'fas fa-calculator',
      route: '/cost-breakdowns'
    },
    {
      label: 'Tipos de Costos',
      icon: 'fas fa-tags',
      route: '/cost-types'
    },
    {
      label: 'Unidades',
      icon: 'fas fa-ruler',
      route: '/units'
    }
  ];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  logout(): void {
    this.authService.logout();
  }
}