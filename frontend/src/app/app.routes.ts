import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./pages/signup/signup.component').then((m) => m.SignupComponent),
  },
  {
    path: 'cart',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/cart-page/cart-page.component').then(
        (m) => m.CartPageComponent
      ),
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/profile/profile.component').then(
        (m) => m.ProfileComponent
      ),
  },
  { path: 'products', loadComponent: () => import('./pages/products/products.component').then((m) => m.ProductsComponent) },
  { path: 'product/:id', loadComponent: () => import('./pages/product-detail/product-detail.component').then((m) => m.ProductDetailComponent) },
  {
    path: 'checkout',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/checkout/checkout.component').then((m) => m.CheckoutComponent),
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
];
