import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

import { environment } from '../../environments/environment';

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  read: boolean;
  createdAt: string;
  data?: any;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
  categories: {
    orders: boolean;
    inventory: boolean;
    users: boolean;
    system: boolean;
  };
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  private unreadCountSubject = new BehaviorSubject<number>(0);

  constructor(private http: HttpClient) {}

  private readonly API_URL = `${environment.apiUrl}`;

  get notifications$(): Observable<Notification[]> {
    return this.notificationsSubject.asObservable();
  }

  get unreadCount$(): Observable<number> {
    return this.unreadCountSubject.asObservable();
  }

  getNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.API_URL}/notifications`);
  }

  markAsRead(notificationId: number): Observable<void> {
    return this.http.put<void>(`${this.API_URL}/notifications/${notificationId}/read`, {});
  }

  markAllAsRead(): Observable<void> {
    return this.http.put<void>(`${this.API_URL}/notifications/read-all`, {});
  }

  deleteNotification(notificationId: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/notifications/${notificationId}`);
  }

  getUnreadCount(): Observable<number> {
    return this.http.get<number>(`${this.API_URL}/notifications/unread-count`);
  }

  getNotificationSettings(): Observable<NotificationSettings> {
    return this.http.get<NotificationSettings>(`${this.API_URL}/notifications/settings`);
  }

  updateNotificationSettings(settings: Partial<NotificationSettings>): Observable<NotificationSettings> {
    return this.http.put<NotificationSettings>(`${this.API_URL}/notifications/settings`, settings);
  }

  sendTestNotification(type: 'email' | 'push' | 'sms'): Observable<{message: string}> {
    return this.http.post<{message: string}>(`${this.API_URL}/notifications/test`, { type });
  }

  // Real-time notifications (WebSocket)
  connectWebSocket(): void {
    // Implementation would depend on your WebSocket setup
    // This is a placeholder for real-time notifications
  }

  disconnectWebSocket(): void {
    // Implementation would depend on your WebSocket setup
  }

  private updateNotifications(notifications: Notification[]): void {
    this.notificationsSubject.next(notifications);
    this.unreadCountSubject.next(notifications.filter(n => !n.read).length);
  }
}



