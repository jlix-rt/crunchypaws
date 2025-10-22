import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AppState } from '../../store/app.state';
import { selectIsAuthenticated, selectUser, selectCurrentSession } from '../../store/selectors/app.selector';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="pos-header">
      <div class="flex items-center space-x-4">
        <div class="flex items-center space-x-2">
          <span class="text-2xl">🛒</span>
          <h1 class="text-xl font-bold">CrunchyPaws POS</h1>
        </div>
        
        <div class="flex items-center space-x-4 text-sm">
          <span *ngIf="currentSession$ | async as session" class="bg-green-100 text-green-800 px-2 py-1 rounded">
            Sesión: {{ session.id }} - Q{{ session.opening_amount | number:'1.2-2' }}
          </span>
          <span *ngIf="!(currentSession$ | async)" class="bg-red-100 text-red-800 px-2 py-1 rounded">
            Sin Sesión
          </span>
        </div>
      </div>
      
      <div class="flex items-center space-x-4">
        <div class="text-sm">
          <span *ngIf="user$ | async as user">{{ user.full_name }}</span>
        </div>
        
        <div class="flex items-center space-x-2">
          <button 
            routerLink="/reports" 
            class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
          >
            📊 Reportes
          </button>
          <button 
            routerLink="/settings" 
            class="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm"
          >
            ⚙️ Configuración
          </button>
          <button 
            (click)="logout()"
            class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
          >
            🚪 Salir
          </button>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .pos-header {
      @apply bg-blue-600 text-white p-4 flex items-center justify-between;
    }
  `]
})
export class HeaderComponent implements OnInit {
  private store = inject(Store<AppState>);
  private router = inject(Router);
  private authService = inject(AuthService);
  
  isAuthenticated$: Observable<boolean> = this.store.select(selectIsAuthenticated);
  user$: Observable<any> = this.store.select(selectUser);
  currentSession$: Observable<any> = this.store.select(selectCurrentSession);
  
  ngOnInit(): void {
    // Check authentication
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
    }
  }
  
  logout(): void {
    this.authService.logout();
  }
}



