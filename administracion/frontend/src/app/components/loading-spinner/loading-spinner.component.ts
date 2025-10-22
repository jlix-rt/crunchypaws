import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="show" class="loading-spinner" [class]="sizeClass">
      <div class="spinner" [class]="typeClass">
        <div class="spinner-inner"></div>
      </div>
      <p *ngIf="message" class="loading-message">{{ message }}</p>
    </div>
  `,
  styles: [`
    .loading-spinner {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }

    .spinner {
      border: 3px solid #f3f3f3;
      border-top: 3px solid #3498db;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    .spinner-small {
      width: 20px;
      height: 20px;
      border-width: 2px;
    }

    .spinner-medium {
      width: 40px;
      height: 40px;
      border-width: 3px;
    }

    .spinner-large {
      width: 60px;
      height: 60px;
      border-width: 4px;
    }

    .spinner-dots {
      display: flex;
      gap: 4px;
    }

    .spinner-dots .spinner-inner {
      width: 8px;
      height: 8px;
      background-color: #3498db;
      border-radius: 50%;
      animation: bounce 1.4s ease-in-out infinite both;
    }

    .spinner-dots .spinner-inner:nth-child(1) {
      animation-delay: -0.32s;
    }

    .spinner-dots .spinner-inner:nth-child(2) {
      animation-delay: -0.16s;
    }

    .spinner-pulse {
      width: 40px;
      height: 40px;
      background-color: #3498db;
      border-radius: 50%;
      animation: pulse 1.5s ease-in-out infinite;
    }

    .spinner-wave {
      display: flex;
      gap: 2px;
    }

    .spinner-wave .spinner-inner {
      width: 4px;
      height: 20px;
      background-color: #3498db;
      animation: wave 1.2s ease-in-out infinite;
    }

    .spinner-wave .spinner-inner:nth-child(1) {
      animation-delay: -1.1s;
    }

    .spinner-wave .spinner-inner:nth-child(2) {
      animation-delay: -1.0s;
    }

    .spinner-wave .spinner-inner:nth-child(3) {
      animation-delay: -0.9s;
    }

    .spinner-wave .spinner-inner:nth-child(4) {
      animation-delay: -0.8s;
    }

    .spinner-wave .spinner-inner:nth-child(5) {
      animation-delay: -0.7s;
    }

    .loading-message {
      margin-top: 1rem;
      color: #666;
      font-size: 0.875rem;
      text-align: center;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @keyframes bounce {
      0%, 80%, 100% {
        transform: scale(0);
      }
      40% {
        transform: scale(1);
      }
    }

    @keyframes pulse {
      0% {
        transform: scale(0.95);
        box-shadow: 0 0 0 0 rgba(52, 152, 219, 0.7);
      }
      70% {
        transform: scale(1);
        box-shadow: 0 0 0 10px rgba(52, 152, 219, 0);
      }
      100% {
        transform: scale(0.95);
        box-shadow: 0 0 0 0 rgba(52, 152, 219, 0);
      }
    }

    @keyframes wave {
      0%, 40%, 100% {
        transform: scaleY(0.4);
      }
      20% {
        transform: scaleY(1);
      }
    }

    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(255, 255, 255, 0.8);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .overlay .loading-spinner {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      padding: 2rem;
    }
  `]
})
export class LoadingSpinnerComponent {
  @Input() show: boolean = false;
  @Input() message: string = '';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() type: 'spinner' | 'dots' | 'pulse' | 'wave' = 'spinner';
  @Input() overlay: boolean = false;

  get sizeClass(): string {
    return `spinner-${this.size}`;
  }

  get typeClass(): string {
    return `spinner-${this.type}`;
  }

  get overlayClass(): string {
    return this.overlay ? 'overlay' : '';
  }
}



