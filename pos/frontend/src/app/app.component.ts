import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { HeaderComponent } from './components/header/header.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { ToastContainerComponent } from './components/toast-container/toast-container.component';

import { AppState } from './store/app.state';
import { selectLoading } from './store/selectors/app.selector';
import { loadInitialData } from './store/actions/app.actions';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    LoadingSpinnerComponent,
    ToastContainerComponent
  ],
  template: `
    <div class="min-h-screen bg-gray-100">
      <!-- Header -->
      <app-header></app-header>
      
      <!-- Main Content -->
      <main class="flex-1">
        <router-outlet></router-outlet>
      </main>
      
      <!-- Global Components -->
      <app-loading-spinner *ngIf="loading$ | async"></app-loading-spinner>
      <app-toast-container></app-toast-container>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }
  `]
})
export class AppComponent implements OnInit {
  private store = inject(Store<AppState>);
  
  loading$: Observable<boolean> = this.store.select(selectLoading);
  
  ngOnInit(): void {
    // Load initial application data
    this.store.dispatch(loadInitialData());
  }
}



