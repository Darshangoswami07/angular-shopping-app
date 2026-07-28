import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delivery-info',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <div class="bg-gradient-to-br from-sky-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          <div class="max-w-xl">
            <span class="inline-block px-3.5 py-1 bg-sky-500/20 text-sky-300 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 border border-sky-400/30">
              🚀 Fast Worldwide Express
            </span>
            <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight">Free Express Shipping On Orders Over $100</h2>
            <p class="text-slate-300 mt-3 text-sm sm:text-base leading-relaxed">
              We partner with global courier leaders to ensure your luxury items arrive safely, insured, and right on schedule.
            </p>
            <div class="flex flex-wrap gap-4 mt-6">
              <div class="flex items-center gap-2 text-xs font-semibold bg-white/10 px-3.5 py-2 rounded-xl backdrop-blur-sm">
                <span>✓ Real-Time Tracking</span>
              </div>
              <div class="flex items-center gap-2 text-xs font-semibold bg-white/10 px-3.5 py-2 rounded-xl backdrop-blur-sm">
                <span>✓ 30-Day Hassle-Free Returns</span>
              </div>
              <div class="flex items-center gap-2 text-xs font-semibold bg-white/10 px-3.5 py-2 rounded-xl backdrop-blur-sm">
                <span>✓ Eco-Friendly Packaging</span>
              </div>
            </div>
          </div>

          <div class="shrink-0 flex items-center gap-4 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/15">
            <div class="w-14 h-14 bg-sky-500 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <span class="text-xs text-sky-200 font-medium block">Average Delivery Time</span>
              <span class="text-2xl font-black text-white">2 - 4 Business Days</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class DeliveryInfoComponent {}
