import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="not-found-container">
      <div class="not-found-content">
        <h1 class="error-code">404</h1>
        <h2 class="error-title">Página no encontrada</h2>
        <p class="error-message">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
        <div class="error-actions">
          <a routerLink="/dashboard" class="btn btn-primary">
            Ir al Dashboard
          </a>
          <button (click)="goBack()" class="btn btn-secondary">
            Volver Atrás
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .not-found-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #f8f9fa;
    }

    .not-found-content {
      text-align: center;
      max-width: 500px;
      padding: 2rem;
    }

    .error-code {
      font-size: 8rem;
      font-weight: bold;
      color: #dc3545;
      margin: 0;
      line-height: 1;
    }

    .error-title {
      font-size: 2rem;
      color: #343a40;
      margin: 1rem 0;
    }

    .error-message {
      font-size: 1.1rem;
      color: #6c757d;
      margin-bottom: 2rem;
    }

    .error-actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 0.375rem;
      text-decoration: none;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-primary {
      background-color: #007bff;
      color: white;
    }

    .btn-primary:hover {
      background-color: #0056b3;
    }

    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background-color: #545b62;
    }
  `]
})
export class NotFoundComponent {
  goBack(): void {
    window.history.back();
  }
}



