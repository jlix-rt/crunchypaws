import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

import { ToastService, Toast } from '../../services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      <div
        *ngFor="let toast of toasts"
        class="toast"
        [class]="getToastClass(toast)"
        [@slideInOut]
      >
        <div class="toast-content">
          <div class="toast-icon">
            <svg *ngIf="toast.type === 'success'" class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            <svg *ngIf="toast.type === 'error'" class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
            </svg>
            <svg *ngIf="toast.type === 'warning'" class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
            </svg>
            <svg *ngIf="toast.type === 'info'" class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
            </svg>
          </div>
          <div class="toast-body">
            <h4 class="toast-title">{{ toast.title }}</h4>
            <p class="toast-message">{{ toast.message }}</p>
          </div>
          <button
            (click)="removeToast(toast.id)"
            class="toast-close"
            type="button"
          >
            <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
            </svg>
          </button>
        </div>
        <div *ngIf="toast.duration && toast.duration > 0" class="toast-progress">
          <div class="toast-progress-bar" [style.animation-duration]="toast.duration + 'ms'"></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 1rem;
      right: 1rem;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      max-width: 400px;
    }

    .toast {
      background: white;
      border-radius: 0.5rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      border-left: 4px solid;
      overflow: hidden;
      animation: slideIn 0.3s ease-out;
    }

    .toast-success {
      border-left-color: #10b981;
    }

    .toast-error {
      border-left-color: #ef4444;
    }

    .toast-warning {
      border-left-color: #f59e0b;
    }

    .toast-info {
      border-left-color: #3b82f6;
    }

    .toast-content {
      display: flex;
      align-items: flex-start;
      padding: 1rem;
    }

    .toast-icon {
      flex-shrink: 0;
      margin-right: 0.75rem;
      margin-top: 0.125rem;
    }

    .toast-success .toast-icon {
      color: #10b981;
    }

    .toast-error .toast-icon {
      color: #ef4444;
    }

    .toast-warning .toast-icon {
      color: #f59e0b;
    }

    .toast-info .toast-icon {
      color: #3b82f6;
    }

    .toast-body {
      flex: 1;
      min-width: 0;
    }

    .toast-title {
      font-size: 0.875rem;
      font-weight: 600;
      color: #111827;
      margin: 0 0 0.25rem 0;
    }

    .toast-message {
      font-size: 0.875rem;
      color: #6b7280;
      margin: 0;
      line-height: 1.4;
    }

    .toast-close {
      flex-shrink: 0;
      margin-left: 0.75rem;
      padding: 0.25rem;
      color: #9ca3af;
      background: none;
      border: none;
      cursor: pointer;
      border-radius: 0.25rem;
      transition: color 0.2s ease;
    }

    .toast-close:hover {
      color: #6b7280;
    }

    .toast-progress {
      height: 3px;
      background-color: #e5e7eb;
      overflow: hidden;
    }

    .toast-progress-bar {
      height: 100%;
      background-color: #3b82f6;
      animation: progressBar linear;
    }

    .toast-success .toast-progress-bar {
      background-color: #10b981;
    }

    .toast-error .toast-progress-bar {
      background-color: #ef4444;
    }

    .toast-warning .toast-progress-bar {
      background-color: #f59e0b;
    }

    .toast-info .toast-progress-bar {
      background-color: #3b82f6;
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @keyframes progressBar {
      from {
        width: 100%;
      }
      to {
        width: 0%;
      }
    }

    @media (max-width: 640px) {
      .toast-container {
        left: 1rem;
        right: 1rem;
        max-width: none;
      }
    }
  `],
  animations: [
    // Import slideInOut animation from animations.ts
  ]
})
export class ToastContainerComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  toasts: Toast[] = [];

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.toastService.toasts$
      .pipe(takeUntil(this.destroy$))
      .subscribe(toasts => {
        this.toasts = toasts;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  removeToast(id: string): void {
    this.toastService.removeToast(id);
  }

  getToastClass(toast: Toast): string {
    return `toast-${toast.type}`;
  }
}



