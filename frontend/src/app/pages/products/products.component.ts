import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, type OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subject, debounceTime, switchMap, takeUntil } from 'rxjs';
import { Category, CategoryService } from '../../services/category.service';
import { Product, ProductService } from '../../services/product.service';

@Component({ selector: 'app-products', standalone: true, imports: [CommonModule, FormsModule, RouterLink, CurrencyPipe], changeDetection: ChangeDetectionStrategy.OnPush, template: `
<main class="min-h-screen bg-slate-50 px-4 pb-16 pt-28"><div class="mx-auto max-w-7xl"><header class="mb-8"><p class="text-sm font-bold uppercase tracking-widest text-sky-600">Browse the collection</p><h1 class="mt-2 text-4xl font-black text-slate-900">Discover products</h1></header><div class="mb-8 grid gap-3 rounded-2xl bg-white p-4 shadow-sm sm:grid-cols-4"><input [(ngModel)]="search" (ngModelChange)="onSearchChange($event)" class="rounded-xl border border-slate-200 px-4 py-2.5 sm:col-span-2" placeholder="Search products" aria-label="Search products"><select [(ngModel)]="category" (ngModelChange)="onFilterChange()" class="rounded-xl border border-slate-200 px-3"><option value="">All categories</option><option *ngFor="let item of categories; trackBy: byId" [value]="item.id">{{ item.name }}</option></select><select [(ngModel)]="sort" (ngModelChange)="onFilterChange()" class="rounded-xl border border-slate-200 px-3"><option value="createdAt-desc">Newest</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="name-asc">Name</option></select></div><div *ngIf="loading" class="py-20 text-center text-slate-500">Loading products…</div><p *ngIf="!loading && !products.length" class="py-20 text-center text-slate-500">No products match your filters.</p><div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"><a *ngFor="let product of products; trackBy: byId" [routerLink]="['/product', product.id]" class="group overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"><img [src]="(product.images.length > 0 ? product.images[0].url : undefined) || 'assets/images/placeholder.jpg'" [alt]="product.name" loading="lazy" class="aspect-square w-full object-cover transition duration-300 group-hover:scale-105"><div class="p-4"><p class="text-xs font-bold uppercase text-sky-600">{{ product.category.name }}</p><h2 class="mt-1 line-clamp-1 font-bold text-slate-900">{{ product.name }}</h2><p class="mt-2 text-lg font-black text-slate-900">{{ product.price | currency }}</p><p class="mt-1 text-xs" [class.text-emerald-600]="product.stock > 0" [class.text-red-600]="product.stock === 0">{{ product.stock > 0 ? product.stock + ' in stock' : 'Out of stock' }}</p></div></a></div></div></main>` })
export class ProductsComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  categories: Category[] = [];
  loading = true;
  search = '';
  category = '';
  sort = 'createdAt-desc';

  private destroy$ = new Subject<void>();
  private loadTrigger$ = new Subject<void>();

  constructor(
    private productsApi: ProductService,
    private categoriesApi: CategoryService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.categoriesApi.getCategories().subscribe((r) => {
      this.categories = r.data;
      this.cdr.markForCheck();
    });

    // Debounce so a burst of keystrokes/filter changes collapses into one request,
    // and switchMap cancels any in-flight request so a slower stale response can
    // never overwrite the result of a more recent search.
    this.loadTrigger$
      .pipe(
        debounceTime(300),
        switchMap(() => {
          this.loading = true;
          this.cdr.markForCheck();
          const [sortBy, sortOrder] = this.sort.split('-');
          return this.productsApi.getProducts({
            limit: 48,
            search: this.search || undefined,
            category: this.category || undefined,
            sortBy,
            sortOrder,
            isActive: true,
          });
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (r) => {
          this.products = r.data.products;
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: () => {
          this.loading = false;
          this.cdr.markForCheck();
        },
      });

    this.route.queryParamMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.search = params.get('search') || '';
      this.category = params.get('category') || '';
      this.loadTrigger$.next();
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSearchChange(value: string) {
    this.search = value;
    this.loadTrigger$.next();
  }

  onFilterChange() {
    this.loadTrigger$.next();
  }

  byId(_: number, value: { id: string }) {
    return value.id;
  }
}
