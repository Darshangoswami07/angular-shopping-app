import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { LucideAngularModule, ShoppingBag, TrendingUp } from "lucide-angular"

@Component({
  selector: "app-hero",
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <section class="pt-32 pb-20 px-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      <div class="container mx-auto">
        <div class="grid md:grid-cols-2 gap-12 items-center">
          <!-- Left Content -->
          <div class="space-y-8 scroll-reveal">
            <div class="inline-block px-4 py-2 bg-sky-500/20 backdrop-blur-sm rounded-full border border-sky-400/30">
              <span class="text-sky-300 text-sm font-medium">✨ New Collection 2024</span>
            </div>
            
            <h1 class="text-5xl md:text-7xl font-bold leading-tight">
              Discover Your
              <span class="block text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600">Perfect Style</span>
            </h1>
            
            <p class="text-xl text-slate-300 leading-relaxed">
              Explore our curated collection of premium products designed to elevate your lifestyle. 
              Quality meets affordability in every purchase.
            </p>

            <div class="flex flex-wrap gap-4">
              <button class="px-8 py-4 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-semibold transition-all transform hover:scale-105 flex items-center gap-2 shadow-xl shadow-sky-500/30">
                <lucide-icon [img]="ShoppingBag" [size]="20"></lucide-icon>
                Shop Now
              </button>
              <button class="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-lg font-semibold transition-all border border-white/20 flex items-center gap-2">
                <lucide-icon [img]="TrendingUp" [size]="20"></lucide-icon>
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
              <div class="absolute inset-0 bg-gradient-to-br from-sky-500/30 to-purple-500/30 rounded-2xl blur-3xl"></div>
              <img 
                src="/premium-fashion-products-hero-image.jpg" 
                alt="Hero Product" 
                class="relative rounded-2xl shadow-2xl w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class HeroComponent {
  readonly ShoppingBag = ShoppingBag
  readonly TrendingUp = TrendingUp
}
