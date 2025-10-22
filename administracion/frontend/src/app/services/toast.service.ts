import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  private toasts: Toast[] = [];

  get toasts$(): Observable<Toast[]> {
    return this.toastsSubject.asObservable();
  }

  success(title: string, message: string, duration: number = 5000): void {
    this.addToast('success', title, message, duration);
  }

  error(title: string, message: string, duration: number = 7000): void {
    this.addToast('error', title, message, duration);
  }

  warning(title: string, message: string, duration: number = 5000): void {
    this.addToast('warning', title, message, duration);
  }

  info(title: string, message: string, duration: number = 4000): void {
    this.addToast('info', title, message, duration);
  }

  private addToast(type: Toast['type'], title: string, message: string, duration: number): void {
    const toast: Toast = {
      id: this.generateId(),
      type,
      title,
      message,
      duration,
      timestamp: new Date()
    };

    this.toasts.push(toast);
    this.toastsSubject.next([...this.toasts]);

    if (duration > 0) {
      setTimeout(() => {
        this.removeToast(toast.id);
      }, duration);
    }
  }

  removeToast(id: string): void {
    this.toasts = this.toasts.filter(toast => toast.id !== id);
    this.toastsSubject.next([...this.toasts]);
  }

  clearAll(): void {
    this.toasts = [];
    this.toastsSubject.next([]);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}



