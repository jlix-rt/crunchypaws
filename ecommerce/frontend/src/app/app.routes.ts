import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    title: 'CrunchyPaws - Inicio'
  },
  {
    path: 'catalogo',
    loadComponent: () => import('./pages/catalog/catalog.component').then(m => m.CatalogComponent),
    title: 'Catálogo - CrunchyPaws'
  },
  {
    path: 'producto/:slug',
    loadComponent: () => import('./pages/product-detail/product-detail.component').then(m => m.ProductDetailComponent),
    title: 'Producto - CrunchyPaws'
  },
  {
    path: 'carrito',
    loadComponent: () => import('./pages/cart/cart.component').then(m => m.CartComponent),
    title: 'Carrito - CrunchyPaws'
  },
  {
    path: 'checkout',
    loadComponent: () => import('./pages/checkout/checkout.component').then(m => m.CheckoutComponent),
    title: 'Finalizar Compra - CrunchyPaws'
  },
  {
    path: 'informacion',
    loadComponent: () => import('./pages/info/info.component').then(m => m.InfoComponent),
    title: 'Información - CrunchyPaws'
  },
  {
    path: 'contacto',
    loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent),
    title: 'Contacto - CrunchyPaws'
  },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent),
        title: 'Iniciar Sesión - CrunchyPaws'
      },
      {
        path: 'register',
        loadComponent: () => import('./pages/auth/register/register.component').then(m => m.RegisterComponent),
        title: 'Registrarse - CrunchyPaws'
      }
    ]
  },
  {
    path: 'perfil',
    loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent),
    canActivate: [AuthGuard],
    title: 'Mi Perfil - CrunchyPaws'
  },
  {
    path: 'direcciones',
    loadComponent: () => import('./pages/addresses/addresses.component').then(m => m.AddressesComponent),
    canActivate: [AuthGuard],
    title: 'Mis Direcciones - CrunchyPaws'
  },
  {
    path: 'ordenes',
    loadComponent: () => import('./pages/orders/orders.component').then(m => m.OrdersComponent),
    canActivate: [AuthGuard],
    title: 'Mis Órdenes - CrunchyPaws'
  },
  {
    path: 'orden/:id',
    loadComponent: () => import('./pages/order-detail/order-detail.component').then(m => m.OrderDetailComponent),
    title: 'Detalle de Orden - CrunchyPaws'
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent),
    title: 'Página no encontrada - CrunchyPaws'
  }
];
