import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, type OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subject, forkJoin, of } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
import { CartService } from '../../services/cart.service';
import { Product, ProductService } from '../../services/product.service';
import { ToastService } from '../../services/toast.service';
import { WishlistService } from '../../services/wishlist.service';
import { AuthService } from '../../services/auth.service';
import { RecentlyViewedService } from '../../services/recently-viewed.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
<main class="min-h-screen bg-slate-50 px-4 pb-16 pt-28">
  <div *ngIf="product as item" class="mx-auto max-w-6xl">
    <a routerLink="/products" class="text-sm font-semibold text-sky-700">← All products</a>

    <div class="mt-6 grid gap-10 rounded-3xl bg-white p-5 shadow-sm sm:p-8 lg:grid-cols-2">
      <section>
        <div class="overflow-hidden rounded-2xl bg-slate-100">
          <img [src]="activeImage" [alt]="item.name" class="aspect-square w-full object-cover transition hover:scale-125">
        </div>
        <div class="mt-3 flex gap-3 overflow-auto">
          <button *ngFor="let image of item.images" (click)="activeImage = image.url"
                  class="h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2" [class.border-sky-500]="image.url === activeImage">
            <img [src]="image.url" [alt]="image.alt || item.name" class="h-full w-full object-cover">
          </button>
        </div>
      </section>

      <section>
        <p class="text-sm font-bold uppercase tracking-widest text-sky-600">{{ item.category.name }}</p>
        <h1 class="mt-2 text-4xl font-black text-slate-900">{{ item.name }}</h1>
        <p class="mt-4 text-3xl font-black text-slate-900">{{ item.price | currency }}</p>
        <p class="mt-5 leading-7 text-slate-600">{{ item.description || 'Product details are available from the catalogue.' }}</p>
        <p class="mt-4 font-semibold" [class.text-emerald-600]="item.stock > 0" [class.text-red-600]="item.stock === 0">
          {{ item.stock > 0 ? item.stock + ' available' : 'Out of stock' }}
        </p>
        <div class="mt-7 flex gap-3">
          <button (click)="add(item)" [disabled]="item.stock === 0" class="flex-1 rounded-xl bg-slate-900 px-5 py-3 font-bold text-white disabled:opacity-50">Add to cart</button>
          <button (click)="wish(item.id)" class="rounded-xl border border-slate-300 px-5 font-bold text-slate-700" aria-label="Add to wishlist">♡</button>
        </div>
      </section>
    </div>

    <section class="mt-10">
      <h2 class="text-2xl font-black text-slate-900">Customer reviews</h2>
      <p *ngIf="!item.reviews?.length" class="mt-3 text-slate-500">No reviews yet.</p>
      <article *ngFor="let review of item.reviews" class="mt-4 rounded-2xl bg-white p-5 shadow-sm">
        <p class="font-bold">{{ review.rating }} / 5</p>
        <p class="mt-2 text-slate-600">{{ review.comment }}</p>
      </article>
    </section>

    <section *ngIf="relatedProducts.length" class="mt-14">
      <h2 class="text-2xl font-black text-slate-900 mb-5">You may also like</h2>
      <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <a *ngFor="let p of relatedProducts" [routerLink]="['/product', p.id]"
           class="group overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
          <img [src]="thumb(p)" [alt]="p.name" loading="lazy" class="aspect-square w-full object-cover transition duration-300 group-hover:scale-105">
          <div class="p-4">
            <p class="text-xs font-bold uppercase text-sky-600">{{ p.category.name }}</p>
            <h3 class="mt-1 line-clamp-1 font-bold text-slate-900">{{ p.name }}</h3>
            <p class="mt-2 text-lg font-black text-slate-900">{{ p.price | currency }}</p>
          </div>
        </a>
      </div>
    </section>

    <section *ngIf="recentlyViewed.length" class="mt-14">
      <h2 class="text-2xl font-black text-slate-900 mb-5">Recently viewed</h2>
      <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <a *ngFor="let p of recentlyViewed" [routerLink]="['/product', p.id]"
           class="group overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
          <img [src]="thumb(p)" [alt]="p.name" loading="lazy" class="aspect-square w-full object-cover transition duration-300 group-hover:scale-105">
          <div class="p-4">
            <p class="text-xs font-bold uppercase text-sky-600">{{ p.category.name }}</p>
            <h3 class="mt-1 line-clamp-1 font-bold text-slate-900">{{ p.name }}</h3>
            <p class="mt-2 text-lg font-black text-slate-900">{{ p.price | currency }}</p>
          </div>
        </a>
      </div>
    </section>
  </div>
  <p *ngIf="!product" class="py-32 text-center text-slate-500">Loading product…</p>
</main>`,
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  product?: Product;
  activeImage = 'assets/images/placeholder.jpg';
  relatedProducts: Product[] = [];
  recentlyViewed: Product[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ProductService,
    private cart: CartService,
    private wishlist: WishlistService,
    private toast: ToastService,
    private auth: AuthService,
    private recentlyViewedService: RecentlyViewedService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // Angular's default route reuse strategy keeps this component instance
    // alive when navigating from one /product/:id to another (same route
    // config, different param) — it does NOT recreate the component or
    // re-run ngOnInit. Subscribing to paramMap (rather than reading
    // route.snapshot once) is what makes clicking a related/recently-viewed
    // product actually load the new product instead of leaving the old one
    // on screen under the new URL.
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const id = params.get('id');
      if (id) this.loadProduct(id);
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadProduct(id: string) {
    this.product = undefined;
    this.relatedProducts = [];
    this.recentlyViewed = [];
    this.activeImage = 'assets/images/placeholder.jpg';
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    this.cdr.markForCheck();

    // Recently viewed must be captured BEFORE we record this product, otherwise
    // the current product would show up in its own "recently viewed" rail.
    const priorIds = this.recentlyViewedService.getIds(id).slice(0, 6);
    if (priorIds.length) {
      forkJoin(priorIds.map((pid) => this.api.getProductById(pid).pipe(catchError(() => of(null)))))
        .pipe(takeUntil(this.destroy$))
        .subscribe((results) => {
          this.recentlyViewed = results.filter((r): r is { status: string; data: Product } => !!r).map((r) => r.data);
          this.cdr.markForCheck();
        });
    }

    this.api
      .getProductById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (r) => {
          this.product = r.data;
          this.activeImage = r.data.images[0]?.url || this.activeImage;
          this.recentlyViewedService.record(id);
          this.cdr.markForCheck();

          this.api
            .getRelatedProducts(id, 8)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (rel) => {
                this.relatedProducts = rel.data;
                this.cdr.markForCheck();
              },
            });
        },
        error: () => {
          this.toast.error('Product unavailable', 'This product could not be found.');
          this.cdr.markForCheck();
        },
      });
  }

  thumb(product: Product) {
    return product.thumbnail || product.images[0]?.url || 'assets/images/placeholder.jpg';
  }

  add(product: Product) {
    if (!this.auth.isAuthenticated()) {
      this.toast.openAuthPrompt('cart', this.router.url);
      return;
    }
    this.cart.addToCart(product.id).subscribe({
      next: () => {
        this.cart.openCart();
        this.toast.success('Added to cart', product.name);
      },
      error: (e) => this.toast.error('Unable to add to cart', e.error?.message || 'Please sign in and try again.'),
    });
  }

  wish(id: string) {
    if (!this.auth.isAuthenticated()) {
      this.toast.openAuthPrompt('wishlist', this.router.url);
      return;
    }
    this.wishlist.addToWishlist(id).subscribe({
      next: () => this.toast.success('Saved to wishlist', 'Product added to your wishlist.'),
      error: (e) => this.toast.error('Unable to save', e.error?.message || 'Please sign in and try again.'),
    });
  }
}
