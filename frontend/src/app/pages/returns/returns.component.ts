import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';

@Component({
  selector: 'app-returns-page',
  standalone: true,
  imports: [CommonModule, RouterLink, ScrollRevealDirective],
  template: `
<main class="bg-white min-h-screen">

  <section class="pt-32 pb-16 px-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white text-center relative overflow-hidden">
    <div class="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
    <div class="container mx-auto max-w-2xl relative z-10 scroll-reveal">
      <div class="w-16 h-16 mx-auto rounded-2xl bg-purple-500/20 backdrop-blur-sm border border-purple-400/30 flex items-center justify-center mb-6">
        <svg class="w-8 h-8 text-purple-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"/></svg>
      </div>
      <h1 class="text-4xl sm:text-5xl font-bold mb-4">Returns &amp; Cancellations</h1>
      <p class="text-lg text-slate-300 leading-relaxed">Straightforward policies, and a one-click cancel for orders that haven't shipped yet.</p>
    </div>
  </section>

  <!-- ============ ONE-CLICK CANCEL ============ -->
  <section class="py-20 px-4 bg-white">
    <div class="container mx-auto max-w-4xl">
      <div class="scroll-reveal grid md:grid-cols-2 gap-6 mb-16">
        <div class="rounded-2xl p-8 bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-xl">
          <svg class="w-8 h-8 mb-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          <h3 class="text-xl font-bold mb-2">Cancel Before It Ships</h3>
          <p class="text-sky-50 text-sm leading-relaxed">
            While your order is <strong>Pending</strong> or <strong>Processing</strong>, cancel it instantly from
            My Orders — stock is restored automatically and no payment was ever collected.
          </p>
        </div>
        <div class="rounded-2xl p-8 bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-xl">
          <svg class="w-8 h-8 mb-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
          <h3 class="text-xl font-bold mb-2">Return After Delivery</h3>
          <p class="text-pink-50 text-sm leading-relaxed">
            Once an order is marked <strong>Delivered</strong>, you're covered by the return window listed
            on that specific product's page — most items ship with a 7 to 30 day window.
          </p>
        </div>
      </div>

      <!-- Steps -->
      <div class="text-center mb-14 scroll-reveal">
        <p class="text-sky-600 font-bold text-xs uppercase tracking-widest mb-3">How Cancelling Works</p>
        <h2 class="text-3xl font-bold text-slate-900">Three steps, no phone call required</h2>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-20">
        <div *ngFor="let step of cancelSteps; let i = index" class="scroll-reveal text-center" [style.transition-delay.s]="i * 0.05">
          <div class="w-14 h-14 mx-auto rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-lg mb-4">{{ i + 1 }}</div>
          <h4 class="font-bold text-slate-900 mb-1">{{ step.title }}</h4>
          <p class="text-xs text-slate-500 leading-relaxed">{{ step.desc }}</p>
        </div>
      </div>

      <!-- Eligibility table -->
      <div class="scroll-reveal bg-slate-50 rounded-3xl border border-slate-200 p-8 sm:p-10 mb-12">
        <h3 class="text-xl font-bold text-slate-900 mb-6">What's eligible for return</h3>
        <div class="space-y-4">
          <div *ngFor="let row of eligibility" class="flex items-start gap-3">
            <span class="mt-0.5 shrink-0" [ngClass]="row.eligible ? 'text-emerald-600' : 'text-red-500'">
              <svg *ngIf="row.eligible" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
              <svg *ngIf="!row.eligible" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
            </span>
            <p class="text-sm text-slate-700"><strong>{{ row.label }}:</strong> {{ row.detail }}</p>
          </div>
        </div>
      </div>

      <div class="scroll-reveal grid sm:grid-cols-2 gap-4">
        <div *ngFor="let faq of quickFaqs" class="p-5 rounded-xl border border-slate-200">
          <h4 class="font-bold text-slate-900 text-sm mb-1.5">{{ faq.q }}</h4>
          <p class="text-sm text-slate-600 leading-relaxed">{{ faq.a }}</p>
        </div>
      </div>

      <div class="text-center mt-12 scroll-reveal">
        <a routerLink="/profile" [queryParams]="{ tab: 'orders' }" class="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors no-underline mr-3">Go to My Orders</a>
        <a routerLink="/contact" class="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition-colors no-underline">Contact Support</a>
      </div>
    </div>
  </section>
</main>
  `,
})
export class ReturnsPageComponent {
  readonly cancelSteps = [
    { title: 'Open My Orders', desc: 'Go to your profile and select the Orders tab.' },
    { title: 'Expand the Order', desc: 'Tap the order to see its live tracking and details.' },
    { title: 'Tap Cancel Order', desc: 'Available instantly while status is Pending or Processing.' },
  ];

  readonly eligibility = [
    { eligible: true, label: 'Unopened, unshipped orders', detail: 'Fully cancellable at any point before the order status changes to Shipped.' },
    { eligible: true, label: 'Items with a listed return window', detail: 'Check the product page — most items ship with 7 to 30 days from delivery.' },
    { eligible: false, label: 'Orders already marked Shipped or Delivered', detail: 'These can no longer be self-cancelled — contact support for a return instead.' },
    { eligible: false, label: 'Orders already Cancelled or Refunded', detail: 'These are final and cannot be reopened or modified.' },
  ];

  readonly quickFaqs = [
    { q: 'Do I get charged if I cancel?', a: 'No. Payment is only collected on delivery, so a cancelled order was never charged in the first place.' },
    { q: 'Does cancelling affect my stock reservation?', a: 'No — cancelling instantly returns the reserved quantity to inventory for other shoppers.' },
    { q: 'Can I cancel just one item from a multi-item order?', a: 'Currently cancellation applies to the full order. Partial-item cancellation is on our roadmap.' },
    { q: 'How long do refunds take?', a: 'Since Cash on Delivery orders aren\'t charged upfront, most "refunds" simply mean the cancelled order is never billed.' },
  ];
}
