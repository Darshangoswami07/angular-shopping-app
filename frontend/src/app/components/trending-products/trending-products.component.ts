import { Component, type OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { Product, ProductService } from '../../services/product.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-trending-products', standalone: true, imports: [CommonModule, RouterLink],
  template: `
    <section id="shop" class="py-20 px-4 bg-slate-50"><div class="container mx-auto">
      <div class="text-center mb-16 scroll-reveal"><h2 class="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Trending Products</h2><p class="text-xl text-slate-600">Our most popular items this month</p></div>
      <div *ngIf="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"><div *ngFor="let _ of skeletons" class="h-96 animate-pulse rounded-2xl bg-slate-200"></div></div>
      <div *ngIf="!loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div *ngFor="let product of products; let i = index; trackBy: trackById" class="scroll-reveal group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2" [style.transition-delay.s]="i * 0.05">
          <a [routerLink]="['/product', product.id]" class="relative block overflow-hidden bg-slate-100 aspect-square"><img [src]="image(product)" [alt]="product.name" loading="lazy" (error)="onImgError($event)" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"/><div *ngIf="product.comparePrice && product.comparePrice > product.price" class="absolute top-4 left-4 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">SALE</div></a>
          <div class="p-6"><a [routerLink]="['/product', product.id]" class="text-lg font-bold text-slate-900 mb-2 block group-hover:text-sky-600 transition-colors">{{ product.name }}</a><div class="flex items-center gap-2 mb-3"><div class="flex"><svg *ngFor="let star of stars" class="w-4 h-4" [class.text-amber-400]="star <= rating(product)" [class.text-slate-300]="star > rating(product)" [style.fill]="star <= rating(product) ? 'currentColor' : 'none'" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg></div><span class="text-sm text-slate-600">({{ product.reviews?.length || 0 }})</span></div><div class="flex items-center gap-2 mb-4"><span class="text-2xl font-bold text-slate-900">\${{ product.price }}</span><span *ngIf="product.comparePrice" class="text-sm text-slate-400 line-through">\${{ product.comparePrice }}</span></div><button (click)="addToCart(product)" [disabled]="product.stock === 0" class="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2 group-hover:shadow-lg disabled:opacity-50"><svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>{{ product.stock ? 'Add to Cart' : 'Out of Stock' }}</button></div>
        </div>
      </div><p *ngIf="!loading && !products.length" class="text-center text-slate-600">No products are available yet.</p>
    </div></section>`,
})
export class TrendingProductsComponent implements OnInit {
  products: Product[] = []; loading = true; stars = [1, 2, 3, 4, 5]; skeletons = [1, 2, 3, 4];
  constructor(private productService: ProductService, private cartService: CartService, private toast: ToastService) {}
  ngOnInit() { this.productService.getFeaturedProducts(8).subscribe({ next: r => { this.products = r.data; this.loading = false; }, error: () => { this.loading = false; this.toast.error('Products unavailable', 'Please try again shortly.'); } }); }
  image(product: Product) { return product.images[0]?.url || 'assets/images/placeholder.jpg'; }
  rating(product: Product) { const reviews = product.reviews || []; return reviews.length ? Math.round(reviews.reduce((total, review) => total + review.rating, 0) / reviews.length) : 0; }
  trackById(_: number, product: Product) { return product.id; }
  onImgError(event: Event) { const image = event.target as HTMLImageElement; image.src = 'assets/images/placeholder.jpg'; image.classList.add('opacity-70'); }
  addToCart(product: Product) { this.cartService.addToCart(product.id).subscribe({ next: () => { this.cartService.openCart(); this.toast.success('Added to Cart', product.name); }, error: err => this.toast.error('Unable to add to cart', err.error?.message || 'Please sign in and try again.') }); }
}
