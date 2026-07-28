import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';

@Component({
  selector: 'app-shipping-page',
  standalone: true,
  imports: [CommonModule, RouterLink, ScrollRevealDirective],
  template: `
<main class="bg-white min-h-screen">

  <section class="pt-32 pb-16 px-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white text-center relative overflow-hidden">
    <div class="absolute -top-40 -left-40 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl"></div>
    <div class="container mx-auto max-w-2xl relative z-10 scroll-reveal">
      <div class="w-16 h-16 mx-auto rounded-2xl bg-sky-500/20 backdrop-blur-sm border border-sky-400/30 flex items-center justify-center mb-6">
        <svg class="w-8 h-8 text-sky-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1"/></svg>
      </div>
      <h1 class="text-4xl sm:text-5xl font-bold mb-4">Shipping Information</h1>
      <p class="text-lg text-slate-300 leading-relaxed">Everything you need to know about how your order gets to your door.</p>
    </div>
  </section>

  <!-- ============ RATES ============ -->
  <section class="py-20 px-4 bg-white">
    <div class="container mx-auto max-w-4xl">
      <div class="grid sm:grid-cols-2 gap-6 mb-16">
        <div class="scroll-reveal rounded-2xl p-8 bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xl">
          <svg class="w-8 h-8 mb-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
          <h3 class="text-xl font-bold mb-2">Free Shipping</h3>
          <p class="text-emerald-50 text-sm leading-relaxed">On every order with a subtotal over <strong>$100</strong> — automatically applied at checkout, no code needed.</p>
        </div>
        <div class="scroll-reveal rounded-2xl p-8 bg-gradient-to-br from-sky-500 to-blue-600 text-white shadow-xl" style="transition-delay: 0.05s">
          <svg class="w-8 h-8 mb-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/></svg>
          <h3 class="text-xl font-bold mb-2">Standard Shipping</h3>
          <p class="text-sky-50 text-sm leading-relaxed">A flat <strong>$10</strong> fee on orders under $100 — the same rate no matter where in your shipping zone you are.</p>
        </div>
      </div>

      <div class="text-center mb-14 scroll-reveal">
        <p class="text-sky-600 font-bold text-xs uppercase tracking-widest mb-3">Delivery Timeline</p>
        <h2 class="text-3xl font-bold text-slate-900">From checkout to your door</h2>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-20">
        <div *ngFor="let step of timeline; let i = index" class="scroll-reveal text-center" [style.transition-delay.s]="i * 0.05">
          <div class="w-14 h-14 mx-auto rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-lg mb-4">{{ i + 1 }}</div>
          <h4 class="font-bold text-slate-900 mb-1">{{ step.title }}</h4>
          <p class="text-xs text-slate-500 leading-relaxed">{{ step.desc }}</p>
        </div>
      </div>

      <div class="scroll-reveal bg-slate-50 rounded-3xl border border-slate-200 p-8 sm:p-10 mb-8">
        <h3 class="text-xl font-bold text-slate-900 mb-5">Payment on Delivery</h3>
        <p class="text-slate-600 leading-relaxed mb-4">
          Every order ships with <strong>Cash on Delivery</strong> as the default payment method — you inspect
          the item and pay the courier when it arrives. A 10% tax is calculated on the order subtotal and shown
          clearly before you confirm checkout, alongside the exact shipping fee.
        </p>
        <p class="text-slate-600 leading-relaxed">
          Once placed, every order gets a real tracking number and moves through four honest stages —
          <strong>Order Placed → Processing → Shipped → Delivered</strong> — visible any time from
          <a routerLink="/profile" [queryParams]="{ tab: 'orders' }" class="text-sky-600 font-semibold hover:underline">My Orders</a>.
        </p>
      </div>

      <div class="scroll-reveal grid sm:grid-cols-2 gap-4">
        <div *ngFor="let faq of quickFaqs" class="p-5 rounded-xl border border-slate-200">
          <h4 class="font-bold text-slate-900 text-sm mb-1.5">{{ faq.q }}</h4>
          <p class="text-sm text-slate-600 leading-relaxed">{{ faq.a }}</p>
        </div>
      </div>

      <div class="text-center mt-12 scroll-reveal">
        <a routerLink="/returns" class="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition-colors no-underline mr-3">Return Policy</a>
        <a routerLink="/contact" class="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl transition-colors no-underline">Still have questions?</a>
      </div>
    </div>
  </section>
</main>
  `,
})
export class ShippingPageComponent {
  readonly timeline = [
    { title: 'Order Placed', desc: 'Confirmed instantly, stock reserved in real time.' },
    { title: 'Processing', desc: 'Your order is picked, packed, and handed to the courier.' },
    { title: 'Shipped', desc: 'On its way — average 2–4 business days in transit.' },
    { title: 'Delivered', desc: 'Pay on arrival, then leave a review if you\'d like.' },
  ];

  readonly quickFaqs = [
    { q: 'Do you ship internationally?', a: 'Shipping is currently available within the country your account is registered in. International rates are on our roadmap.' },
    { q: 'Can I change my shipping address after ordering?', a: 'If your order is still Pending or Processing, cancel it from My Orders and place a new one with the updated address.' },
    { q: 'What if I\'m not home for delivery?', a: 'Our courier partners will attempt redelivery or leave instructions for a pickup point, depending on your area.' },
    { q: 'How do I track a shipment?', a: 'Every order includes a tracking number and a live 4-stage status, visible under My Orders in your account.' },
  ];
}
