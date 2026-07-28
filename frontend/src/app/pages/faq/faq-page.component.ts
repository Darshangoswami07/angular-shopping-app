import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { retry, timer } from 'rxjs';
import { FaqService, type Faq } from '../../services/faq.service';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';

@Component({
  selector: 'app-faq-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ScrollRevealDirective],
  template: `
<main class="bg-white min-h-screen">

  <section class="pt-32 pb-16 px-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white text-center relative overflow-hidden">
    <div class="absolute -top-40 -left-40 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl"></div>
    <div class="container mx-auto max-w-2xl relative z-10 scroll-reveal">
      <h1 class="text-4xl sm:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
      <p class="text-lg text-slate-300 leading-relaxed mb-8">Answers to the questions we hear most, pulled straight from our support team.</p>
      <div class="relative max-w-md mx-auto">
        <svg class="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path stroke-linecap="round" d="M21 21l-4.35-4.35"/></svg>
        <input [(ngModel)]="search" type="search" placeholder="Search questions…"
               class="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-slate-400 focus:bg-white/15 focus:border-sky-400 focus:outline-none transition-all" />
      </div>
    </div>
  </section>

  <section class="py-16 px-4 bg-white">
    <div class="container mx-auto max-w-3xl">

      <div *ngIf="loading" class="space-y-4">
        <div *ngFor="let _ of skeletons" class="h-16 rounded-2xl bg-slate-100 animate-pulse"></div>
      </div>

      <div *ngIf="!loading && categories.length">
        <div *ngFor="let cat of categories" class="mb-10">
          <h2 class="text-xs font-black uppercase tracking-widest text-sky-600 mb-4">{{ cat }}</h2>
          <div class="space-y-3">
            <div *ngFor="let item of grouped[cat]" class="rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <button type="button" (click)="toggle(item.id)"
                      class="w-full p-5 text-left font-bold text-slate-900 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                <span class="text-base">{{ item.question }}</span>
                <svg class="w-5 h-5 text-sky-600 shrink-0 transition-transform duration-300" [class.rotate-180]="openId === item.id"
                     fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>
              </button>
              <div *ngIf="openId === item.id" class="px-5 pb-5 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4">
                {{ item.answer }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <p *ngIf="!loading && !categories.length" class="text-center text-slate-500 py-16">No questions match "{{ search }}".</p>

      <div class="scroll-reveal mt-14 bg-gradient-to-br from-sky-600 to-blue-700 rounded-3xl p-8 sm:p-10 text-white text-center">
        <h3 class="text-xl font-bold mb-2">Still can't find your answer?</h3>
        <p class="text-sky-100 text-sm mb-6">Send us a message — a real person reads every one.</p>
        <a routerLink="/contact" class="inline-flex items-center gap-2 px-6 py-3 bg-white text-sky-700 font-bold rounded-xl no-underline hover:bg-sky-50 transition-colors">Contact Support</a>
      </div>
    </div>
  </section>
</main>
  `,
})
export class FaqPageComponent implements OnInit {
  faqs: Faq[] = [];
  loading = true;
  search = '';
  openId: string | null = null;
  skeletons = [1, 2, 3, 4];

  constructor(private faqService: FaqService) {}

  ngOnInit() {
    this.faqService
      .getFaqs()
      .pipe(retry({ count: 3, delay: (_error, attempt) => timer(attempt * 800) }))
      .subscribe({
        next: (res) => {
          this.faqs = res.data;
          this.loading = false;
          if (this.faqs.length) this.openId = this.faqs[0].id;
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  get filtered(): Faq[] {
    const q = this.search.trim().toLowerCase();
    if (!q) return this.faqs;
    return this.faqs.filter((f) => f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q));
  }

  get categories(): string[] {
    return [...new Set(this.filtered.map((f) => f.category || 'General'))];
  }

  get grouped(): Record<string, Faq[]> {
    const map: Record<string, Faq[]> = {};
    for (const f of this.filtered) {
      const key = f.category || 'General';
      (map[key] ??= []).push(f);
    }
    return map;
  }

  toggle(id: string) {
    this.openId = this.openId === id ? null : id;
  }
}
