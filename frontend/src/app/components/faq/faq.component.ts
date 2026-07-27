import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaqService, Faq } from '../../services/faq.service';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="py-20 bg-slate-50 border-t border-slate-200/60">
      <div class="container mx-auto px-4 max-w-4xl">
        <div class="text-center mb-16">
          <span class="text-sky-600 font-bold text-xs uppercase tracking-widest bg-sky-50 px-3.5 py-1.5 rounded-full border border-sky-200">
            Got Questions?
          </span>
          <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">Frequently Asked Questions</h2>
          <p class="text-slate-600 mt-3 text-base">Find quick answers to common questions about orders, shipping, and returns.</p>
        </div>

        <div *ngIf="loading" class="space-y-4">
          <div *ngFor="let _ of skeletons" class="h-16 bg-white rounded-2xl animate-pulse border border-slate-200"></div>
        </div>

        <div *ngIf="!loading" class="space-y-4">
          <div
            *ngFor="let item of faqs; let i = index"
            class="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm transition-all"
          >
            <button
              (click)="toggle(i)"
              class="w-full p-6 text-left font-bold text-slate-900 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
            >
              <span class="text-base sm:text-lg">{{ item.question }}</span>
              <svg
                class="w-5 h-5 text-sky-600 shrink-0 transition-transform duration-300"
                [class.rotate-180]="openIndex === i"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div *ngIf="openIndex === i" class="px-6 pb-6 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4">
              {{ item.answer }}
            </div>
          </div>
        </div>
        <p *ngIf="!loading && !faqs.length" class="text-center text-slate-600">No FAQs available yet.</p>
      </div>
    </section>
  `,
})
export class FaqComponent implements OnInit {
  openIndex: number | null = 0;
  faqs: Faq[] = [];
  loading = true;
  skeletons = [1, 2, 3, 4];

  constructor(private faqService: FaqService) {}

  ngOnInit() {
    this.faqService.getFaqs().subscribe({
      next: (res) => {
        this.faqs = res.data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  toggle(index: number) {
    this.openIndex = this.openIndex === index ? null : index;
  }
}
