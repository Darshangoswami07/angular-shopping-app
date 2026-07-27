import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatsService, StatsOverview } from '../../services/stats.service';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="py-16 bg-slate-900 text-white relative">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
          <div class="p-4">
            <span class="block text-4xl sm:text-5xl font-black text-sky-400 font-mono">{{ format(stats?.customerCount) }}</span>
            <span class="text-xs sm:text-sm text-slate-400 font-semibold uppercase tracking-wider mt-2 block">Happy Customers</span>
          </div>
          <div class="p-4">
            <span class="block text-4xl sm:text-5xl font-black text-sky-400 font-mono">{{ format(stats?.productCount) }}</span>
            <span class="text-xs sm:text-sm text-slate-400 font-semibold uppercase tracking-wider mt-2 block">Premium Products</span>
          </div>
          <div class="p-4">
            <span class="block text-4xl sm:text-5xl font-black text-sky-400 font-mono">{{ format(stats?.categoryCount) }}</span>
            <span class="text-xs sm:text-sm text-slate-400 font-semibold uppercase tracking-wider mt-2 block">Categories</span>
          </div>
          <div class="p-4">
            <span class="block text-4xl sm:text-5xl font-black text-sky-400 font-mono">{{ stats?.averageRating ?? '—' }}★</span>
            <span class="text-xs sm:text-sm text-slate-400 font-semibold uppercase tracking-wider mt-2 block">Average Rating</span>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class StatisticsComponent implements OnInit {
  stats: StatsOverview | null = null;

  constructor(private statsService: StatsService) {}

  ngOnInit() {
    this.statsService.getOverview().subscribe({
      next: (res) => {
        this.stats = res.data;
      },
    });
  }

  format(value?: number) {
    if (value === undefined || value === null) return '—';
    return value >= 1000 ? `${(value / 1000).toFixed(1)}K+` : `${value}+`;
  }
}
