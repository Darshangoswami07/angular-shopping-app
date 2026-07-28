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
  { path: 'shop', loadComponent: () => import('./pages/products/products.component').then((m) => m.ProductsComponent) },
  { path: 'product/:id', loadComponent: () => import('./pages/product-detail/product-detail.component').then((m) => m.ProductDetailComponent) },
  { path: 'categories', loadComponent: () => import('./pages/categories/categories.component').then((m) => m.CategoriesPageComponent) },
  { path: 'about', loadComponent: () => import('./pages/about/about.component').then((m) => m.AboutPageComponent) },
  { path: 'blog', loadComponent: () => import('./pages/blog/blog.component').then((m) => m.BlogPageComponent) },
  { path: 'blog/:slug', loadComponent: () => import('./pages/blog-post/blog-post.component').then((m) => m.BlogPostPageComponent) },
  { path: 'contact', loadComponent: () => import('./pages/contact/contact.component').then((m) => m.ContactPageComponent) },
  { path: 'shipping', loadComponent: () => import('./pages/shipping/shipping.component').then((m) => m.ShippingPageComponent) },
  { path: 'returns', loadComponent: () => import('./pages/returns/returns.component').then((m) => m.ReturnsPageComponent) },
  { path: 'faq', loadComponent: () => import('./pages/faq/faq-page.component').then((m) => m.FaqPageComponent) },
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
