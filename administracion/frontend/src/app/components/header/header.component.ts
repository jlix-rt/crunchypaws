import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NotificationsComponent } from '../notifications/notifications.component';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, NotificationsComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  pageTitle = 'Dashboard';
  showNotifications = false;
  unreadNotifications = 3;
  currentUser: User | null = null;

  notifications = [
    {
      id: 1,
      title: 'Stock Bajo',
      message: 'Pechuga de Pollo tiene stock bajo (30 kg)',
      type: 'warning' as const,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      read: false
    },
    {
      id: 2,
      title: 'Nueva Orden',
      message: 'Se ha recibido una nueva orden #12345',
      type: 'info' as const,
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      read: false
    },
    {
      id: 3,
      title: 'Producto Agotado',
      message: 'Tomates están agotados',
      type: 'error' as const,
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      read: false
    }
  ];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  toggleSidebar(): void {
    // Emitir evento para toggle del sidebar
    // Por ahora solo log
    console.log('Toggle sidebar');
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
  }

  markAsRead(notificationId: number): void {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification && !notification.read) {
      notification.read = true;
      this.unreadNotifications--;
    }
  }

  openSettings(): void {
    alert('Abrir configuración del sistema');
  }

  openHelp(): void {
    alert('Abrir ayuda y documentación');
  }

  toggleUserMenu(): void {
    // Aquí podrías implementar un dropdown de usuario
    console.log('Toggle user menu');
  }

  getRoleText(role?: string): string {
    const roleMap: { [key: string]: string } = {
      'ADMIN': 'Administrador',
      'EMPLOYEE': 'Empleado',
      'CLIENT': 'Cliente'
    };
    return roleMap[role || ''] || 'Usuario';
  }

  logout(): void {
    this.authService.logout();
  }
}