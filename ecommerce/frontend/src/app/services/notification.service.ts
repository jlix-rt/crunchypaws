import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private snackBar = inject(MatSnackBar);

  private defaultConfig: MatSnackBarConfig = {
    duration: 4000,
    horizontalPosition: 'end',
    verticalPosition: 'top',
  };

  // Success notification
  showSuccess(message: string, action?: string, config?: MatSnackBarConfig): void {
    const snackBarConfig = {
      ...this.defaultConfig,
      ...config,
      panelClass: ['success-snackbar']
    };

    this.snackBar.open(message, action || 'Cerrar', snackBarConfig);
  }

  // Error notification
  showError(message: string, action?: string, config?: MatSnackBarConfig): void {
    const snackBarConfig = {
      ...this.defaultConfig,
      duration: 6000, // Longer duration for errors
      ...config,
      panelClass: ['error-snackbar']
    };

    this.snackBar.open(message, action || 'Cerrar', snackBarConfig);
  }

  // Warning notification
  showWarning(message: string, action?: string, config?: MatSnackBarConfig): void {
    const snackBarConfig = {
      ...this.defaultConfig,
      duration: 5000,
      ...config,
      panelClass: ['warning-snackbar']
    };

    this.snackBar.open(message, action || 'Cerrar', snackBarConfig);
  }

  // Info notification
  showInfo(message: string, action?: string, config?: MatSnackBarConfig): void {
    const snackBarConfig = {
      ...this.defaultConfig,
      ...config,
      panelClass: ['info-snackbar']
    };

    this.snackBar.open(message, action || 'Cerrar', snackBarConfig);
  }

  // Custom notification
  show(message: string, action?: string, config?: MatSnackBarConfig): void {
    const snackBarConfig = {
      ...this.defaultConfig,
      ...config
    };

    this.snackBar.open(message, action || 'Cerrar', snackBarConfig);
  }

  // Dismiss all notifications
  dismiss(): void {
    this.snackBar.dismiss();
  }
}
