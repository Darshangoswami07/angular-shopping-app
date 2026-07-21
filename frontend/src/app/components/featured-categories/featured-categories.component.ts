import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-featured-categories",
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="categories" class="py-20 px-4 bg-white">
      <div class="container mx-auto">
        <div class="text-center mb-16 scroll-reveal">
          <h2 class="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Featured Categories</h2>
          <p class="text-xl text-slate-600">Explore our handpicked collections</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div *ngFor="let category of categories; let i = index" 
               class="scroll-reveal group relative overflow-hidden rounded-2xl p-8 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl"
               [ngClass]="category.bgClass"
               [style.transition-delay.s]="i * 0.1">
            <div class="relative z-10">
              <div class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" stroke-width="2" [attr.viewBox]="category.viewBox">
                  <path *ngFor="let p of category.paths" [attr.d]="p" [attr.stroke-linecap]="category.strokeLinecap || null" [attr.stroke-linejoin]="category.strokeLinejoin || null"/>
                </svg>
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
  categories = [
    {
      name: "Watches", count: "2,500+ Items", bgClass: "bg-gradient-to-br from-amber-500 to-orange-600",
      viewBox: "0 0 24 24",
      paths: [
        "M12 2a10 10 0 1010 10A10 10 0 0012 2zm0 18a8 8 0 118-8 8 8 0 01-8 8z",
        "M12 6v6l4 2"
      ],
      strokeLinecap: "round", strokeLinejoin: "round"
    },
    {
      name: "Audio", count: "1,800+ Items", bgClass: "bg-gradient-to-br from-purple-500 to-pink-600",
      viewBox: "0 0 24 24",
      paths: [
        "M3 5v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2z",
        "M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"
      ]
    },
    {
      name: "Fashion", count: "5,000+ Items", bgClass: "bg-gradient-to-br from-sky-500 to-blue-600",
      viewBox: "0 0 24 24",
      paths: [
        "M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z",
        "M3 6h18",
        "M16 10a4 4 0 01-8 0"
      ],
      strokeLinecap: "round", strokeLinejoin: "round"
    },
    {
      name: "Tech", count: "3,200+ Items", bgClass: "bg-gradient-to-br from-emerald-500 to-teal-600",
      viewBox: "0 0 24 24",
      paths: [
        "M20 16V7a2 2 0 00-2-2H6a2 2 0 00-2 2v9m16 0H4m16 0l1.28 2.55a1 1 0 01-.9 1.45H3.62a1 1 0 01-.9-1.45L4 16"
      ],
      strokeLinecap: "round", strokeLinejoin: "round"
    },
  ]
}
