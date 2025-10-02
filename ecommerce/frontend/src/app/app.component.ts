import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { HeaderComponent } from './components/layout/header/header.component';
import { FooterComponent } from './components/layout/footer/footer.component';
import { LoadingService } from './services/loading.service';
import { SeoService } from './services/seo.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatProgressBarModule,
    HeaderComponent,
    FooterComponent
  ],
  template: `
    <div class="min-h-screen flex flex-col">
      <!-- Loading bar -->
      <mat-progress-bar 
        *ngIf="loadingService.loading()" 
        mode="indeterminate"
        class="fixed top-0 left-0 right-0 z-50">
      </mat-progress-bar>
      
      <!-- Header -->
      <app-header></app-header>
      
      <!-- Main content -->
      <main class="flex-1">
        <router-outlet></router-outlet>
      </main>
      
      <!-- Footer -->
      <app-footer></app-footer>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    
    mat-progress-bar {
      height: 3px;
    }
  `]
})
export class AppComponent implements OnInit {
  loadingService = inject(LoadingService);
  private seoService = inject(SeoService);

  ngOnInit(): void {
    // Configurar SEO básico
    this.seoService.updateTitle('CrunchyPaws - Productos Deshidratados para Mascotas');
    this.seoService.updateDescription('Los mejores productos deshidratados para perros y gatos. 100% naturales, sin conservantes. Snacks saludables que tu mascota adorará.');
  }
}
