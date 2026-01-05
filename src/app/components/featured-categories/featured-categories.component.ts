import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { LucideAngularModule, Watch, Headphones, ShoppingBag, Laptop } from "lucide-angular"

@Component({
  selector: "app-featured-categories",
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <section id="categories" class="py-20 px-4 bg-white">
      <div class="container mx-auto">
        <div class="text-center mb-16 scroll-reveal">
          <h2 class="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Featured Categories</h2>
          <p class="text-xl text-slate-600">Explore our handpicked collections</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div *ngFor="let category of categories; let i = index" 
               class="scroll-reveal group relative overflow-hidden rounded-2xl bg-gradient-to-br p-8 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl"
               [ngClass]="category.bgClass"
               [style.transition-delay.s]="i * 0.1">
            <div class="relative z-10">
              <div class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <lucide-icon [img]="category.icon" [size]="32" class="text-white"></lucide-icon>
              </div>
              <h3 class="text-2xl font-bold text-white mb-2">{{ category.name }}</h3>
              <p class="text-white/80 mb-4">{{ category.count }}</p>
              <div class="inline-flex items-center text-white font-medium group-hover:gap-2 transition-all">
                <span>Shop Now</span>
                <span class="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </div>
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class FeaturedCategoriesComponent {
  readonly Watch = Watch
  readonly Headphones = Headphones
  readonly ShoppingBag = ShoppingBag
  readonly Laptop = Laptop

  categories = [
    { name: "Watches", count: "2,500+ Items", icon: Watch, bgClass: "from-amber-500 to-orange-600" },
    { name: "Audio", count: "1,800+ Items", icon: Headphones, bgClass: "from-purple-500 to-pink-600" },
    { name: "Fashion", count: "5,000+ Items", icon: ShoppingBag, bgClass: "from-sky-500 to-blue-600" },
    { name: "Tech", count: "3,200+ Items", icon: Laptop, bgClass: "from-emerald-500 to-teal-600" },
  ]
}
