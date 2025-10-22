import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'catalogo',
    loadChildren: () => import('./pages/catalog/catalog.routes').then(m => m.catalogRoutes)
  },
  {
    path: 'producto/:slug',
    loadComponent: () => import('./pages/product-detail/product-detail.component').then(m => m.ProductDetailComponent)
  },
  {
    path: 'carrito',
    loadComponent: () => import('./pages/cart/cart.component').then(m => m.CartComponent)
  },
  {
    path: 'checkout',
    loadComponent: () => import('./pages/checkout/checkout.component').then(m => m.CheckoutComponent)
  },
  {
    path: 'cuenta',
    loadChildren: () => import('./pages/account/account.routes').then(m => m.accountRoutes)
  },
  {
    path: 'ofertas',
    loadComponent: () => import('./pages/offers/offers.component').then(m => m.OffersComponent)
  },
  {
    path: 'nosotros',
    loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent)
  },
  {
    path: 'contacto',
    loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactComponent)
  },
  {
    path: 'ayuda',
    loadComponent: () => import('./pages/help/help.component').then(m => m.HelpComponent)
  },
  {
    path: 'buscar',
    loadComponent: () => import('./pages/search/search.component').then(m => m.SearchComponent)
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];



