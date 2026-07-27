import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product, ProductService } from '../../services/product.service';

@Component({
  selector: 'app-flash-sale',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="py-16 bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white relative overflow-hidden">
      <!-- Glow decoration -->
      <div class="absolute -top-40 -left-40 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>

      <div class="container mx-auto px-4 relative z-10">
        <div class="flex flex-col lg:flex-row items-center justify-between gap-8 mb-12">
          <div>
            <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 font-semibold text-xs uppercase tracking-wider mb-4 animate-pulse">
              ⚡ Limited Time Offer
            </div>
            <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight">Flash Sale</h2>
            <p class="text-slate-300 mt-2 max-w-xl">Grab premium items at unbeatable prices before the countdown hits zero!</p>
          </div>

          <!-- Countdown Timer -->
          <div class="flex items-center gap-3 sm:gap-4 bg-slate-800/80 backdrop-blur-md p-4 sm:p-6 rounded-2xl border border-slate-700/60 shadow-2xl">
            <div class="text-center">
              <span class="block text-2xl sm:text-4xl font-black text-sky-400 font-mono">{{ hours | number:'2.0-0' }}</span>
              <span class="text-[10px] sm:text-xs text-slate-400 uppercase font-semibold">Hours</span>
            </div>
            <span class="text-2xl sm:text-3xl font-bold text-slate-500">:</span>
            <div class="text-center">
              <span class="block text-2xl sm:text-4xl font-black text-sky-400 font-mono">{{ minutes | number:'2.0-0' }}</span>
              <span class="text-[10px] sm:text-xs text-slate-400 uppercase font-semibold">Mins</span>
            </div>
            <span class="text-2xl sm:text-3xl font-bold text-slate-500">:</span>
            <div class="text-center">
              <span class="block text-2xl sm:text-4xl font-black text-sky-400 font-mono">{{ seconds | number:'2.0-0' }}</span>
              <span class="text-[10px] sm:text-xs text-slate-400 uppercase font-semibold">Secs</span>
            </div>
          </div>
        </div>

        <!-- Deal Cards -->
        <div *ngIf="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div *ngFor="let _ of skeletons" class="h-72 bg-slate-800/60 rounded-2xl animate-pulse"></div>
        </div>
        <div *ngIf="!loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            *ngFor="let deal of deals"
            class="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5 hover:border-sky-500/50 transition-all group hover:-translate-y-1 shadow-lg"
          >
            <a [routerLink]="['/product', deal.id]" class="relative overflow-hidden rounded-xl bg-slate-900 mb-4 h-48 flex items-center justify-center">
              <span class="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md z-10">
                -{{ discountPercent(deal) }}%
              </span>
              <img [src]="image(deal)" [alt]="deal.name" class="object-cover h-full w-full group-hover:scale-105 transition-transform duration-300" />
            </a>
            <span class="text-xs font-semibold text-sky-400 uppercase tracking-wider">{{ deal.category.name }}</span>
            <h3 class="text-lg font-bold text-white mt-1 group-hover:text-sky-300 transition-colors line-clamp-1">{{ deal.name }}</h3>
            <div class="flex items-center justify-between mt-3">
              <div>
                <span class="text-xl font-extrabold text-white">\${{ deal.price }}</span>
                <span class="text-sm text-slate-400 line-through ml-2">\${{ deal.comparePrice }}</span>
              </div>
              <a [routerLink]="['/product', deal.id]" class="p-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <p *ngIf="!loading && !deals.length" class="text-center text-slate-300">No active deals right now — check back soon.</p>
      </div>
    </section>
  `,
})
export class FlashSaleComponent implements OnInit, OnDestroy {
  hours = 14;
  minutes = 32;
  seconds = 45;
  private timer?: ReturnType<typeof setInterval>;

  deals: Product[] = [];
  loading = true;
  skeletons = [1, 2, 3, 4];

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.productService.getDealProducts(4).subscribe({
      next: (res) => {
        this.deals = res.data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });

    this.timer = setInterval(() => {
      if (this.seconds > 0) {
        this.seconds--;
      } else {
        this.seconds = 59;
        if (this.minutes > 0) {
          this.minutes--;
        } else {
          this.minutes = 59;
          if (this.hours > 0) {
            this.hours--;
          }
        }
      }
    }, 1000);
  }

  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  image(product: Product) {
    return product.thumbnail || product.images[0]?.url || 'assets/images/placeholder.jpg';
  }

  discountPercent(product: Product) {
    if (!product.comparePrice || product.comparePrice <= product.price) return 0;
    return Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100);
  }
}
