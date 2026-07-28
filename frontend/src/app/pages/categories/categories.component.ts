import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DomSanitizer, type SafeHtml } from '@angular/platform-browser';
import { retry, timer } from 'rxjs';
import { CategoryService, type Category } from '../../services/category.service';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';

interface CategoryDisplay extends Category {
  bg: string;
  icon: string;
}

const PALETTE = [
  { bg: 'from-amber-500 to-orange-600', icon: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6l4 2"/></svg>' },
  { bg: 'from-purple-500 to-pink-600', icon: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01"/></svg>' },
  { bg: 'from-sky-500 to-blue-600', icon: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><path stroke-linecap="round" stroke-linejoin="round" d="M3 6h18M16 10a4 4 0 01-8 0"/></svg>' },
  { bg: 'from-emerald-500 to-teal-600', icon: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20 16V7a2 2 0 00-2-2H6a2 2 0 00-2 2v9m16 0H4m16 0l1.28 2.55a1 1 0 01-.9 1.45H3.62a1 1 0 01-.9-1.45L4 16"/></svg>' },
  { bg: 'from-rose-500 to-red-600', icon: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>' },
  { bg: 'from-indigo-500 to-violet-600', icon: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>' },
  { bg: 'from-cyan-500 to-teal-600', icon: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>' },
  { bg: 'from-lime-500 to-green-600', icon: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20 12H4M12 4v16"/></svg>' },
];

@Component({
  selector: 'app-categories-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ScrollRevealDirective],
  template: `
<main class="bg-white min-h-screen">

  <!-- ============ HERO ============ -->
  <section class="pt-32 pb-16 px-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white text-center relative overflow-hidden">
    <div class="absolute -top-40 -left-40 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl"></div>
    <div class="container mx-auto max-w-2xl relative z-10 scroll-reveal">
      <h1 class="text-4xl sm:text-5xl font-bold mb-4">Shop by Category</h1>
      <p class="text-lg text-slate-300 leading-relaxed mb-8">
        {{ totalCategories }} categories, every one of them backed by real, in-stock inventory.
      </p>
      <div class="relative max-w-md mx-auto">
        <svg class="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path stroke-linecap="round" d="M21 21l-4.35-4.35"/></svg>
        <input [(ngModel)]="search" type="search" placeholder="Search categories…"
               class="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-slate-400 focus:bg-white/15 focus:border-sky-400 focus:outline-none transition-all" />
      </div>
    </div>
  </section>

  <!-- ============ GRID ============ -->
  <section class="py-16 px-4 bg-white">
    <div class="container mx-auto">
      <div *ngIf="loading" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        <div *ngFor="let _ of skeletons" class="h-56 rounded-2xl bg-slate-100 animate-pulse"></div>
      </div>

      <div *ngIf="!loading && filteredCategories.length" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        <a *ngFor="let cat of filteredCategories; let i = index" [routerLink]="['/products']" [queryParams]="{ category: cat.id }"
           class="scroll-reveal group relative overflow-hidden rounded-2xl p-6 min-h-[200px] flex flex-col justify-end bg-gradient-to-br transition-all duration-300 hover:scale-105 hover:shadow-2xl no-underline"
           [ngClass]="cat.bg" [style.transition-delay.s]="(i % 8) * 0.05">
          <div class="absolute top-5 left-5 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <span class="w-6 h-6 text-white" [innerHTML]="sanitize(cat.icon)"></span>
          </div>
          <h3 class="text-xl font-bold text-white capitalize relative z-10">{{ cat.name }}</h3>
          <p class="text-white/80 text-sm relative z-10">{{ cat._count?.products || 0 }} {{ cat._count?.products === 1 ? 'Item' : 'Items' }}</p>
          <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </a>
      </div>

      <div *ngIf="!loading && !filteredCategories.length" class="text-center py-20">
        <svg class="w-14 h-14 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path stroke-linecap="round" d="M21 21l-4.35-4.35"/></svg>
        <p class="text-slate-500 font-semibold">No categories match "{{ search }}"</p>
      </div>
    </div>
  </section>
</main>
  `,
})
export class CategoriesPageComponent implements OnInit {
  categories: CategoryDisplay[] = [];
  loading = true;
  search = '';
  skeletons = [1, 2, 3, 4, 5, 6, 7, 8];
  private readonly safeHtmlCache = new Map<string, SafeHtml>();

  constructor(private categoryService: CategoryService, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.categoryService
      .getCategories()
      .pipe(retry({ count: 3, delay: (_error, attempt) => timer(attempt * 800) }))
      .subscribe({
        next: (res) => {
          this.categories = res.data
            .sort((a, b) => (b._count?.products ?? 0) - (a._count?.products ?? 0))
            .map((cat, i) => ({ ...cat, ...PALETTE[i % PALETTE.length] }));
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  get totalCategories(): number {
    return this.categories.length;
  }

  get filteredCategories(): CategoryDisplay[] {
    const q = this.search.trim().toLowerCase();
    if (!q) return this.categories;
    return this.categories.filter((c) => c.name.toLowerCase().includes(q));
  }

  sanitize(svg: string): SafeHtml {
    let cached = this.safeHtmlCache.get(svg);
    if (!cached) {
      cached = this.sanitizer.bypassSecurityTrustHtml(svg);
      this.safeHtmlCache.set(svg, cached);
    }
    return cached;
  }
}
