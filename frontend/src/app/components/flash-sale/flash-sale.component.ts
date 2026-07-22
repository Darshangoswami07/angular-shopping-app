import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

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
            <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight">Flash Sale 40% OFF</h2>
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
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            *ngFor="let deal of deals"
            class="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5 hover:border-sky-500/50 transition-all group hover:-translate-y-1 shadow-lg"
          >
            <div class="relative overflow-hidden rounded-xl bg-slate-900 mb-4 h-48 flex items-center justify-center">
              <span class="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md z-10">
                -{{ deal.discount }}%
              </span>
              <img [src]="deal.image" [alt]="deal.title" class="object-cover h-full w-full group-hover:scale-105 transition-transform duration-300" />
            </div>
            <span class="text-xs font-semibold text-sky-400 uppercase tracking-wider">{{ deal.category }}</span>
            <h3 class="text-lg font-bold text-white mt-1 group-hover:text-sky-300 transition-colors line-clamp-1">{{ deal.title }}</h3>
            <div class="flex items-center justify-between mt-3">
              <div>
                <span class="text-xl font-extrabold text-white">\${{ deal.salePrice }}</span>
                <span class="text-sm text-slate-400 line-through ml-2">\${{ deal.originalPrice }}</span>
              </div>
              <a routerLink="/" class="p-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class FlashSaleComponent implements OnInit, OnDestroy {
  hours = 14;
  minutes = 32;
  seconds = 45;
  private timer?: ReturnType<typeof setInterval>;

  deals = [
    {
      title: 'Wireless Noise-Canceling Headphones',
      category: 'Electronics',
      salePrice: 149.99,
      originalPrice: 249.99,
      discount: 40,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60',
    },
    {
      title: 'Smart Fitness Watch Series 7',
      category: 'Wearables',
      salePrice: 199.99,
      originalPrice: 329.99,
      discount: 39,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60',
    },
    {
      title: 'Designer Minimalist Leather Bag',
      category: 'Fashion',
      salePrice: 129.99,
      originalPrice: 199.99,
      discount: 35,
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&auto=format&fit=crop&q=60',
    },
    {
      title: 'Ergonomic Mechanical Keyboard',
      category: 'Accessories',
      salePrice: 89.99,
      originalPrice: 149.99,
      discount: 40,
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=60',
    },
  ];

  ngOnInit() {
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
}
