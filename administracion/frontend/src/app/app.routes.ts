import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Login route (no auth required, no sidebar)
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },

  // Redirect root to dashboard
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },

  // Dashboard
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },

  // Inventory routes
  {
    path: 'inventory',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'supplies',
        pathMatch: 'full'
      },
      {
        path: 'supplies',
        loadComponent: () => import('./pages/supplies/supplies.component').then(m => m.SuppliesComponent)
      },
      {
        path: 'products',
        loadComponent: () => import('./pages/products/products.component').then(m => m.ProductsComponent)
      }
    ]
  },

  // Direct routes for easier navigation
  {
    path: 'supplies',
    loadComponent: () => import('./pages/supplies/supplies.component').then(m => m.SuppliesComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'products',
    loadComponent: () => import('./pages/products/products.component').then(m => m.ProductsComponent),
    canActivate: [AuthGuard]
  },

  // Users management
  {
    path: 'users',
    loadComponent: () => import('./pages/users/users.component').then(m => m.UsersComponent),
    canActivate: [AuthGuard]
  },

  // Categories
  {
    path: 'categories',
    loadComponent: () => import('./pages/categories/categories.component').then(m => m.CategoriesComponent),
    canActivate: [AuthGuard]
  },

  // Promotions
  {
    path: 'promotions',
    loadComponent: () => import('./pages/promotions/promotions.component').then(m => m.PromotionsComponent),
    canActivate: [AuthGuard]
  },

  // Reviews
  {
    path: 'reviews',
    loadComponent: () => import('./pages/reviews/reviews.component').then(m => m.ReviewsComponent),
    canActivate: [AuthGuard]
  },

  // Admin Registration
  {
    path: 'admin-registration',
    loadComponent: () => import('./pages/admin-registration/admin-registration.component').then(m => m.AdminRegistrationComponent),
    canActivate: [AuthGuard]
  },

  // Cost Breakdowns
  {
    path: 'cost-breakdowns',
    loadComponent: () => import('./pages/cost-breakdowns/cost-breakdowns.component').then(m => m.CostBreakdownsComponent),
    canActivate: [AuthGuard]
  },

  // Cost Types
  {
    path: 'cost-types',
    loadComponent: () => import('./pages/cost-types/cost-types.component').then(m => m.CostTypesComponent),
    canActivate: [AuthGuard]
  },

  // Units
  {
    path: 'units',
    loadComponent: () => import('./pages/units/units.component').then(m => m.UnitsComponent),
    canActivate: [AuthGuard]
  },

  // 404 - Page not found
  {
    path: '404',
    loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent)
  },

  // Catch all - redirect to 404
  {
    path: '**',
    redirectTo: '/404'
  }
];