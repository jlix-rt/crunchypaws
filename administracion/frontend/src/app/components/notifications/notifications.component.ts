import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: string;
  read: boolean;
}

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent {
  @Input() notifications: Notification[] = [];
  @Output() markAsRead = new EventEmitter<number>();
  @Output() close = new EventEmitter<void>();

  onMarkAsRead(id: number): void {
    this.markAsRead.emit(id);
  }

  onClose(): void {
    this.close.emit();
  }

  getIconClass(type: string): string {
    const iconMap: { [key: string]: string } = {
      'info': 'fa-info-circle',
      'warning': 'fa-exclamation-triangle',
      'error': 'fa-times-circle',
      'success': 'fa-check-circle'
    };
    return iconMap[type] || 'fa-bell';
  }

  getTimeAgo(timestamp: string): string {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - notificationTime.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'Hace un momento';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `Hace ${days} día${days > 1 ? 's' : ''}`;
    }
  }
}