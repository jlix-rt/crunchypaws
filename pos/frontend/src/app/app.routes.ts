import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/pos',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'pos',
    loadComponent: () => import('./pages/pos/pos.component').then(m => m.PosComponent),
    canActivate: [() => true] // Add auth guard here
  },
  {
    path: 'reports',
    loadComponent: () => import('./pages/reports/reports.component').then(m => m.ReportsComponent),
    canActivate: [() => true] // Add auth guard here
  },
  {
    path: 'settings',
    loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent),
    canActivate: [() => true] // Add auth guard here
  },
  {
    path: '**',
    redirectTo: '/pos'
  }
];



