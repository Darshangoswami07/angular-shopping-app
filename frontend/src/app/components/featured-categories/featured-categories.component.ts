import { Component, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterLink } from "@angular/router"
import { retry, timer } from "rxjs"
import { CategoryService, Category } from "../../services/category.service"
import { ScrollRevealDirective } from "../../directives/scroll-reveal.directive"

interface CategoryDisplay extends Category {
  bgClass: string;
  viewBox: string;
  paths: string[];
  strokeLinecap?: string;
  strokeLinejoin?: string;
}

const ICONS = [
  {
    bgClass: "bg-gradient-to-br from-amber-500 to-orange-600",
    viewBox: "0 0 24 24",
    paths: ["M12 2a10 10 0 1010 10A10 10 0 0012 2zm0 18a8 8 0 118-8 8 8 0 01-8 8z", "M12 6v6l4 2"],
    strokeLinecap: "round", strokeLinejoin: "round",
  },
  {
    bgClass: "bg-gradient-to-br from-purple-500 to-pink-600",
    viewBox: "0 0 24 24",
    paths: [
      "M3 5v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2z",
      "M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01",
    ],
  },
  {
    bgClass: "bg-gradient-to-br from-sky-500 to-blue-600",
    viewBox: "0 0 24 24",
    paths: ["M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z", "M3 6h18", "M16 10a4 4 0 01-8 0"],
    strokeLinecap: "round", strokeLinejoin: "round",
  },
  {
    bgClass: "bg-gradient-to-br from-emerald-500 to-teal-600",
    viewBox: "0 0 24 24",
    paths: ["M20 16V7a2 2 0 00-2-2H6a2 2 0 00-2 2v9m16 0H4m16 0l1.28 2.55a1 1 0 01-.9 1.45H3.62a1 1 0 01-.9-1.45L4 16"],
    strokeLinecap: "round", strokeLinejoin: "round",
  },
];

@Component({
  selector: "app-featured-categories",
  standalone: true,
  imports: [CommonModule, RouterLink, ScrollRevealDirective],
  template: `
    <section id="categories" class="py-20 px-4 bg-white">
      <div class="container mx-auto">
        <div class="text-center mb-16 scroll-reveal">
          <h2 class="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Featured Categories</h2>
          <p class="text-xl text-slate-600">Explore our handpicked collections</p>
        </div>

        <div *ngIf="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div *ngFor="let _ of skeletons" class="h-48 rounded-2xl bg-slate-200 animate-pulse"></div>
        </div>

        <div *ngIf="!loading && categories.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <a [routerLink]="['/products']" [queryParams]="{ category: category.id }"
               *ngFor="let category of categories; let i = index"
               class="scroll-reveal group relative overflow-hidden rounded-2xl p-8 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl"
               [ngClass]="category.bgClass"
               [style.transition-delay.s]="i * 0.1">
            <div class="relative z-10">
              <div class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" stroke-width="2" [attr.viewBox]="category.viewBox">
                  <path *ngFor="let p of category.paths" [attr.d]="p" [attr.stroke-linecap]="category.strokeLinecap || null" [attr.stroke-linejoin]="category.strokeLinejoin || null"/>
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-white mb-2 capitalize">{{ category.name }}</h3>
              <p class="text-white/80 mb-4">{{ category._count?.products || 0 }} Items</p>
              <div class="inline-flex items-center text-white font-medium group-hover:gap-2 transition-all">
                <span>Shop Now</span>
                <span class="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
              </div>
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </a>
        </div>

        <div *ngIf="!loading && !categories.length" class="text-center">
          <p class="text-slate-600">{{ loadFailed ? "Categories are taking longer than usual to load." : "No categories are available yet." }}</p>
          <button *ngIf="loadFailed" (click)="load()" class="mt-3 text-sm font-semibold text-sky-600 hover:text-sky-700 underline">Try again</button>
        </div>
      </div>
    </section>
  `,
})
export class FeaturedCategoriesComponent implements OnInit {
  categories: CategoryDisplay[] = [];
  loading = true;
  loadFailed = false;
  skeletons = [1, 2, 3, 4];

  constructor(private categoryService: CategoryService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    this.loadFailed = false;
    this.categoryService
      .getCategories()
      .pipe(retry({ count: 3, delay: (_error, attempt) => timer(attempt * 800) }))
      .subscribe({
        next: (res) => {
          this.categories = res.data
            .sort((a, b) => (b._count?.products ?? 0) - (a._count?.products ?? 0))
            .slice(0, 8)
            .map((category, i) => ({ ...category, ...ICONS[i % ICONS.length] }));
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.loadFailed = true;
        },
      });
  }
}
