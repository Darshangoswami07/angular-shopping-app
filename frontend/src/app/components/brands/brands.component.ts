import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="py-12 bg-white border-y border-slate-100">
      <div class="container mx-auto px-4">
        <p class="text-center text-xs font-bold uppercase tracking-widest text-slate-400 mb-8">Trusted by Global Industry Leaders</p>
        <div class="flex flex-wrap items-center justify-center gap-8 sm:gap-16 opacity-70">
          <div *ngFor="let brand of brands" class="font-extrabold text-2xl text-slate-400 tracking-wider hover:text-sky-600 transition-colors cursor-pointer select-none">
            {{ brand }}
          </div>
        </div>
      </div>
    </section>
  `,
})
export class BrandsComponent {
  brands = ['NEXUS', 'AURA', 'VORTEX', 'LUMINA', 'ZENITH', 'ELEVATE'];
}
