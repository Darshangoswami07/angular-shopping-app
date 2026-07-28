import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { Category, CategoryService } from '../../services/category.service';
import { Product } from '../../services/product.service';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-category-rail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="py-16 px-4" [class.bg-slate-50]="tone === 'muted'" [class.bg-white]="tone === 'white'" *ngIf="loading || products.length">
      <div class="container mx-auto">
        <div class="flex items-end justify-between mb-10">
          <div>
            <p class="text-xs font-bold uppercase tracking-widest text-sky-600 mb-2">{{ eyebrow }}</p>
            <h2 class="text-3xl md:text-4xl font-bold text-slate-900">{{ heading }}</h2>
          </div>
          <a [routerLink]="['/products']" [queryParams]="{ category: categoryId }" class="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-sky-600 hover:text-sky-700">
            View all <span aria-hidden="true">→</span>
          </a>
        </div>

        <div *ngIf="loading" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          <div *ngFor="let _ of skeletons" class="h-80 rounded-2xl bg-slate-200 animate-pulse"></div>
        </div>

        <div *ngIf="!loading" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          <a *ngFor="let product of products; trackBy: byId" [routerLink]="['/product', product.id]"
             class="group bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div class="relative bg-slate-100 aspect-square overflow-hidden">
              <img [src]="image(product)" [alt]="product.name" loading="lazy" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div *ngIf="product.comparePrice && product.comparePrice > product.price" class="absolute top-3 left-3 px-2.5 py-1 bg-red-500 text-white text-xs font-bold rounded-full">SALE</div>
            </div>
            <div class="p-4">
              <h3 class="font-bold text-slate-900 line-clamp-1 group-hover:text-sky-600 transition-colors">{{ product.name }}</h3>
              <div class="flex items-center gap-2 mt-2">
                <span class="text-lg font-extrabold text-slate-900">\${{ product.price }}</span>
                <span *ngIf="product.comparePrice" class="text-xs text-slate-400 line-through">\${{ product.comparePrice }}</span>
              </div>
              <button (click)="addToCart($event, product)" [disabled]="product.stock === 0"
                      class="mt-3 w-full py-2 bg-slate-900 hover:bg-sky-600 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50">
                {{ product.stock ? 'Add to Cart' : 'Out of Stock' }}
              </button>
            </div>
          </a>
        </div>
      </div>
    </section>
  `,
})
export class CategoryRailComponent implements OnChanges {
  @Input({ required: true }) categorySlug!: string;
  @Input({ required: true }) heading!: string;
  @Input() eyebrow = 'Shop the Collection';
  @Input() limit = 4;
  @Input() tone: 'white' | 'muted' = 'white';

  products: Product[] = [];
  categoryId = '';
  loading = true;
  skeletons = [1, 2, 3, 4];

  constructor(
    private categoryService: CategoryService,
    private cartService: CartService,
    private toast: ToastService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnChanges() {
    this.loading = true;
    this.categoryService.getCategoryBySlug(this.categorySlug).subscribe({
      next: (res) => {
        const category = res.data as Category & { products: Product[] };
        this.categoryId = category.id;
        this.products = (category.products || []).slice(0, this.limit);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  image(product: Product) {
    return product.thumbnail || product.images[0]?.url || 'assets/images/placeholder.jpg';
  }

  byId(_: number, product: Product) {
    return product.id;
  }

  addToCart(event: Event, product: Product) {
    event.preventDefault();
    event.stopPropagation();
    if (!this.authService.isAuthenticated()) { this.toast.openAuthPrompt('cart', this.router.url); return; }
    this.cartService.addToCart(product.id).subscribe({
      next: () => {
        this.cartService.openCart();
        this.toast.success('Added to Cart', product.name);
      },
      error: (err) => this.toast.error('Unable to add to cart', err.error?.message || 'Please sign in and try again.'),
    });
  }
}
