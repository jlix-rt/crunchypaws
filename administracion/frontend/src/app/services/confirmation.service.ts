import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ConfirmationDialog {
  id: string;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'warning' | 'danger' | 'info';
  onConfirm?: () => void;
  onCancel?: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {
  private dialogSubject = new BehaviorSubject<ConfirmationDialog | null>(null);

  get dialog$(): Observable<ConfirmationDialog | null> {
    return this.dialogSubject.asObservable();
  }

  confirm(
    title: string,
    message: string,
    options: {
      confirmText?: string;
      cancelText?: string;
      type?: 'warning' | 'danger' | 'info';
    } = {}
  ): Promise<boolean> {
    return new Promise((resolve) => {
      const dialog: ConfirmationDialog = {
        id: this.generateId(),
        title,
        message,
        confirmText: options.confirmText || 'Confirmar',
        cancelText: options.cancelText || 'Cancelar',
        type: options.type || 'warning',
        onConfirm: () => {
          this.closeDialog();
          resolve(true);
        },
        onCancel: () => {
          this.closeDialog();
          resolve(false);
        }
      };

      this.dialogSubject.next(dialog);
    });
  }

  closeDialog(): void {
    this.dialogSubject.next(null);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}



