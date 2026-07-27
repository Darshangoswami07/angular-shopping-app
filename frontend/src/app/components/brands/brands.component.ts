import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrandService, Brand } from '../../services/brand.service';

@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="py-12 bg-white border-y border-slate-100">
      <div class="container mx-auto px-4">
        <p class="text-center text-xs font-bold uppercase tracking-widest text-slate-400 mb-8">Trusted by Global Industry Leaders</p>
        <div *ngIf="!loading && brands.length" class="flex flex-wrap items-center justify-center gap-8 sm:gap-16 opacity-70">
          <div *ngFor="let brand of brands" class="font-extrabold text-2xl text-slate-400 tracking-wider hover:text-sky-600 transition-colors cursor-pointer select-none">
            {{ brand.name }}
          </div>
        </div>
        <div *ngIf="loading" class="flex flex-wrap items-center justify-center gap-8 sm:gap-16">
          <div *ngFor="let _ of skeletons" class="h-8 w-24 bg-slate-200 rounded animate-pulse"></div>
        </div>
      </div>
    </section>
  `,
})
export class BrandsComponent implements OnInit {
  brands: Brand[] = [];
  loading = true;
  skeletons = [1, 2, 3, 4, 5, 6];

  constructor(private brandService: BrandService) {}

  ngOnInit() {
    this.brandService.getBrands().subscribe({
      next: (res) => {
        this.brands = res.data
          .sort((a, b) => (b._count?.products ?? 0) - (a._count?.products ?? 0))
          .slice(0, 8);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}
