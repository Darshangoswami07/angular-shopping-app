import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-hero",
  standalone: true,
  imports: [CommonModule],
  template: `
    <section
      class="pt-32 pb-20 px-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden"
    >
      <div class="container mx-auto">
        <div class="grid md:grid-cols-2 gap-12 items-center">
          <!-- Left Content -->
          <div class="space-y-8 scroll-reveal">
            <div
              class="inline-block px-4 py-2 bg-sky-500/20 backdrop-blur-sm rounded-full border border-sky-400/30"
            >
              <span class="text-sky-300 text-sm font-medium"
                >✨ New Collection 2026</span
              >
            </div>

            <h1 class="text-5xl md:text-7xl font-bold leading-tight">
              Everything You Need,
              <span
                class="block text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600"
                >All in One Place</span
              >
            </h1>

            <p class="text-xl text-slate-300 leading-relaxed">
              From watches and tech to beauty, groceries, and home essentials —
              shop thousands of products across every category, all backed by
              quality you can trust.
            </p>

            <div class="flex flex-wrap gap-4">
              <button
                type="button"
                (click)="scrollToShop()"
                class="px-8 py-4 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-semibold transition-all transform hover:scale-105 flex items-center gap-2 shadow-xl shadow-sky-500/30"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <circle cx="9" cy="21" r="1"/>
                  <circle cx="20" cy="21" r="1"/>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
                Shop Now
              </button>
              <button
                type="button"
                (click)="scrollToTrending()"
                class="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-lg font-semibold transition-all border border-white/20 flex items-center gap-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <polyline points="23,6 13.5,15.5 8.5,10.5 1,18"/>
                  <polyline points="17,6 23,6 23,12"/>
                </svg>
                View Trending
              </button>
            </div>

            <!-- Stats -->
            <div class="grid grid-cols-3 gap-6 pt-8 border-t border-slate-700">
              <div>
                <div class="text-3xl font-bold text-sky-400">10K+</div>
                <div class="text-slate-400 text-sm">Products</div>
              </div>
              <div>
                <div class="text-3xl font-bold text-sky-400">50K+</div>
                <div class="text-slate-400 text-sm">Customers</div>
              </div>
              <div>
                <div class="text-3xl font-bold text-sky-400">99%</div>
                <div class="text-slate-400 text-sm">Satisfaction</div>
              </div>
            </div>
          </div>

          <!-- Right Image -->
          <div class="scroll-reveal" style="transition-delay: 0.2s">
            <div class="relative">
              <div
                class="absolute inset-0 bg-gradient-to-br from-sky-500/30 to-purple-500/30 rounded-2xl blur-3xl"
              ></div>
              <img
                src="assets/images/premium-fashion-products-hero-image.jpg"
                alt="Hero Product"
                loading="lazy"
                width="1200"
                height="420"
                class="relative rounded-2xl shadow-2xl w-full h-[420px] object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class HeroComponent {
  scrollToShop(): void {
    if (typeof document === 'undefined') return
    const el = document.getElementById('shop')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  scrollToTrending(): void {
    this.scrollToShop()
  }
}
