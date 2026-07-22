import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-customer-reviews',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="py-20 bg-slate-50 border-t border-slate-200/60">
      <div class="container mx-auto px-4">
        <!-- Section Header -->
        <div class="text-center max-w-2xl mx-auto mb-16">
          <span class="text-sky-600 font-bold text-xs uppercase tracking-widest bg-sky-50 px-3.5 py-1.5 rounded-full border border-sky-200">
            Testimonials
          </span>
          <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">Loved by 50,000+ Customers</h2>
          <p class="text-slate-600 mt-3 text-base">Read genuine feedback from shoppers around the globe.</p>
        </div>

        <!-- Review Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            *ngFor="let review of reviews"
            class="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 relative hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <!-- Stars -->
              <div class="flex items-center gap-1 text-amber-400 mb-4">
                <svg *ngFor="let star of [1,2,3,4,5]" class="w-5 h-5 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              </div>

              <!-- Quote -->
              <p class="text-slate-700 italic leading-relaxed mb-6">"{{ review.quote }}"</p>
            </div>

            <!-- Author info -->
            <div class="flex items-center gap-4 pt-4 border-t border-slate-100">
              <img [src]="review.avatar" [alt]="review.name" class="w-12 h-12 rounded-full object-cover shadow-md" />
              <div>
                <h4 class="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  {{ review.name }}
                  <span class="inline-flex items-center text-emerald-600" title="Verified Buyer">
                    <svg class="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                  </span>
                </h4>
                <span class="text-xs text-slate-500 font-medium">{{ review.role }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class CustomerReviewsComponent {
  reviews = [
    {
      name: 'Sophia Reynolds',
      role: 'Verified Buyer from California',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=60',
      quote: 'The ordering experience was flawless and shipping took only two days. The build quality of my headphones exceeded all expectations!',
    },
    {
      name: 'Marcus Vance',
      role: 'Verified Buyer from Texas',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=60',
      quote: 'Top-tier customer support and crisp UI design. Returning items is hassle-free. Shopping Website is now my primary online store.',
    },
    {
      name: 'Elena Rostova',
      role: 'Verified Buyer from London',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=60',
      quote: 'I love the curated collections and flash sale discounts. Every product arrives packaged safely with luxury standards.',
    },
  ];
}
