import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DomSanitizer, type SafeHtml } from '@angular/platform-browser';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';
import { CONTACT_CONFIG } from '../../config/contact.config';

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [CommonModule, RouterLink, ScrollRevealDirective],
  template: `
<main class="bg-white">

  <!-- ============ HERO ============ -->
  <section class="pt-32 pb-24 px-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden relative">
    <div class="absolute -top-40 -left-40 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl"></div>
    <div class="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
    <div class="container mx-auto max-w-4xl text-center relative z-10 scroll-reveal">
      <div class="inline-block px-4 py-2 bg-sky-500/20 backdrop-blur-sm rounded-full border border-sky-400/30 mb-6">
        <span class="text-sky-300 text-sm font-medium">✨ Built for modern online shopping</span>
      </div>
      <h1 class="text-4xl sm:text-6xl font-bold leading-tight mb-6">
        About <span class="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500">{{ contact.brandName }}</span>
      </h1>
      <p class="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto">
        A full-stack e-commerce platform engineered from the ground up — real authentication,
        a real database, and a real checkout flow, built to demonstrate what production-grade
        online shopping software actually looks like under the hood.
      </p>
    </div>
  </section>

  <!-- ============ STATS ============ -->
  <section class="py-14 px-4 bg-slate-900 text-white border-b border-slate-800">
    <div class="container mx-auto">
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
        <div *ngFor="let stat of stats" class="scroll-reveal p-4">
          <div class="w-10 h-10 mx-auto mb-2 text-sky-400" [innerHTML]="sanitize(stat.icon)"></div>
          <div class="text-2xl sm:text-3xl font-black text-sky-400 font-mono">{{ stat.value }}</div>
          <div class="text-[11px] sm:text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">{{ stat.label }}</div>
        </div>
      </div>
    </div>
  </section>

  <!-- ============ COMPANY STORY ============ -->
  <section class="py-24 px-4 bg-white">
    <div class="container mx-auto max-w-5xl grid md:grid-cols-2 gap-12 items-center">
      <div class="scroll-reveal">
        <p class="text-sky-600 font-bold text-xs uppercase tracking-widest mb-3">Our Story</p>
        <h2 class="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">Everything you need, engineered properly.</h2>
        <div class="space-y-4 text-slate-600 leading-relaxed">
          <p>
            {{ contact.brandName }} began as a straightforward question: what does it actually take to build
            an online store that works the way shoppers expect — fast search, real inventory, a cart that
            survives a refresh, and checkout that doesn't fall over? Instead of mocking those pieces, we built them.
          </p>
          <p>
            Every product on this site lives in a real PostgreSQL database. Every account is protected by real
            JWT-based authentication. Every order decrements real stock inside a database transaction. Nothing
            here is a static prototype — it's a working system spanning fashion, electronics, beauty, groceries,
            home essentials, and more, organized across 24 categories.
          </p>
          <p>
            The goal was never to be the biggest marketplace — it was to be a correct one: an e-commerce
            experience built the way a senior engineering team would actually ship it.
          </p>
        </div>
      </div>
      <div class="scroll-reveal grid grid-cols-2 gap-4" style="transition-delay: 0.1s">
        <div class="rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 p-6 text-white h-40 flex flex-col justify-end shadow-lg">
          <span class="text-3xl font-black">24</span>
          <span class="text-xs font-semibold uppercase tracking-wider opacity-90">Live Categories</span>
        </div>
        <div class="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-6 text-white h-40 flex flex-col justify-end shadow-lg mt-8">
          <span class="text-3xl font-black">194+</span>
          <span class="text-xs font-semibold uppercase tracking-wider opacity-90">Real Products</span>
        </div>
        <div class="rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 p-6 text-white h-40 flex flex-col justify-end shadow-lg -mt-8">
          <span class="text-3xl font-black">JWT</span>
          <span class="text-xs font-semibold uppercase tracking-wider opacity-90">Secured Auth</span>
        </div>
        <div class="rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 p-6 text-white h-40 flex flex-col justify-end shadow-lg">
          <span class="text-3xl font-black">100%</span>
          <span class="text-xs font-semibold uppercase tracking-wider opacity-90">Real Database</span>
        </div>
      </div>
    </div>
  </section>

  <!-- ============ MISSION & VISION ============ -->
  <section class="py-24 px-4 bg-slate-50">
    <div class="container mx-auto max-w-5xl grid md:grid-cols-2 gap-8">
      <div class="scroll-reveal bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-100">
        <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center mb-6 shadow-lg shadow-sky-600/20">
          <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
        </div>
        <h3 class="text-2xl font-bold text-slate-900 mb-3">Our Mission</h3>
        <p class="text-slate-600 leading-relaxed">
          To make quality products accessible in one place — from everyday essentials to premium
          watches and electronics — backed by an experience that's fast, transparent, and trustworthy
          at every step, from browsing to delivery.
        </p>
      </div>
      <div class="scroll-reveal bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-100" style="transition-delay: 0.1s">
        <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-6 shadow-lg shadow-purple-600/20">
          <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
        </div>
        <h3 class="text-2xl font-bold text-slate-900 mb-3">Our Vision</h3>
        <p class="text-slate-600 leading-relaxed">
          To prove that a small, focused engineering effort can deliver a shopping platform that feels
          as polished as the marketplaces run by teams a hundred times the size — clean architecture,
          real data, and an interface people actually enjoy using.
        </p>
      </div>
    </div>
  </section>

  <!-- ============ WHY CHOOSE US ============ -->
  <section class="py-24 px-4 bg-white">
    <div class="container mx-auto">
      <div class="text-center max-w-2xl mx-auto mb-16 scroll-reveal">
        <p class="text-sky-600 font-bold text-xs uppercase tracking-widest mb-3">Why Choose Us</p>
        <h2 class="text-3xl sm:text-4xl font-bold text-slate-900">Built around what actually matters</h2>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let item of whyChooseUs; let i = index" class="scroll-reveal group p-7 rounded-2xl border border-slate-100 hover:border-sky-200 hover:shadow-xl transition-all duration-300" [style.transition-delay.s]="i * 0.05">
          <div class="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110" [ngClass]="item.bg">
            <span class="w-6 h-6 text-white" [innerHTML]="sanitize(item.icon)"></span>
          </div>
          <h3 class="font-bold text-slate-900 mb-2">{{ item.title }}</h3>
          <p class="text-sm text-slate-600 leading-relaxed">{{ item.desc }}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ============ OUR VALUES ============ -->
  <section class="py-24 px-4 bg-slate-900 text-white relative overflow-hidden">
    <div class="absolute -top-40 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl"></div>
    <div class="container mx-auto relative z-10">
      <div class="text-center max-w-2xl mx-auto mb-16 scroll-reveal">
        <p class="text-sky-400 font-bold text-xs uppercase tracking-widest mb-3">Our Values</p>
        <h2 class="text-3xl sm:text-4xl font-bold">The principles behind every decision</h2>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let value of values; let i = index" class="scroll-reveal bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-7 hover:bg-white/10 transition-colors" [style.transition-delay.s]="i * 0.05">
          <h3 class="font-bold text-lg mb-2 text-sky-300">{{ value.title }}</h3>
          <p class="text-sm text-slate-300 leading-relaxed">{{ value.desc }}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ============ WHAT WE SELL ============ -->
  <section class="py-24 px-4 bg-slate-50">
    <div class="container mx-auto">
      <div class="text-center max-w-2xl mx-auto mb-14 scroll-reveal">
        <p class="text-sky-600 font-bold text-xs uppercase tracking-widest mb-3">What We Sell</p>
        <h2 class="text-3xl sm:text-4xl font-bold text-slate-900">One store, every category that matters</h2>
        <p class="text-slate-600 mt-3">From luxury timepieces to weekly groceries — 24 categories, one checkout.</p>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div *ngFor="let cat of whatWeSell" class="scroll-reveal rounded-2xl p-5 text-center border border-slate-200 bg-white hover:shadow-lg hover:-translate-y-1 transition-all">
          <div class="text-3xl mb-2">{{ cat.emoji }}</div>
          <div class="text-sm font-bold text-slate-800">{{ cat.label }}</div>
        </div>
      </div>
      <div class="text-center mt-10 scroll-reveal">
        <a routerLink="/categories" class="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors no-underline">
          Browse All Categories
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
        </a>
      </div>
    </div>
  </section>

  <!-- ============ COMMITMENTS: customer-first / secure / delivery / returns / quality ============ -->
  <section class="py-24 px-4 bg-white">
    <div class="container mx-auto">
      <div class="text-center max-w-2xl mx-auto mb-16 scroll-reveal">
        <p class="text-sky-600 font-bold text-xs uppercase tracking-widest mb-3">Our Commitments</p>
        <h2 class="text-3xl sm:text-4xl font-bold text-slate-900">What you can count on, every order</h2>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div *ngFor="let c of commitments; let i = index" class="scroll-reveal flex gap-5 p-7 rounded-2xl bg-gradient-to-br" [ngClass]="c.bg" [style.transition-delay.s]="i * 0.05">
          <div class="w-12 h-12 shrink-0 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <span class="w-6 h-6 text-white" [innerHTML]="sanitize(c.icon)"></span>
          </div>
          <div>
            <h3 class="font-bold text-lg text-white mb-1.5">{{ c.title }}</h3>
            <p class="text-sm text-white/85 leading-relaxed">{{ c.desc }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ============ TECH STACK ============ -->
  <section class="py-24 px-4 bg-slate-50">
    <div class="container mx-auto">
      <div class="text-center max-w-2xl mx-auto mb-14 scroll-reveal">
        <p class="text-sky-600 font-bold text-xs uppercase tracking-widest mb-3">Modern Technology Stack</p>
        <h2 class="text-3xl sm:text-4xl font-bold text-slate-900">Built with tools engineers actually trust</h2>
        <p class="text-slate-600 mt-3">No shortcuts — a real full-stack architecture from database to browser.</p>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div *ngFor="let tech of techStack" class="scroll-reveal group rounded-2xl p-5 text-center bg-white border border-slate-200 hover:border-sky-300 hover:shadow-lg transition-all">
          <div class="w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-3 font-black text-white text-lg shadow-md group-hover:scale-110 transition-transform" [ngClass]="tech.bg">
            {{ tech.letter }}
          </div>
          <div class="text-sm font-bold text-slate-800">{{ tech.name }}</div>
          <div class="text-[11px] text-slate-500 mt-0.5">{{ tech.role }}</div>
        </div>
      </div>
    </div>
  </section>

  <!-- ============ PERFORMANCE & SECURITY ============ -->
  <section class="py-24 px-4 bg-white">
    <div class="container mx-auto max-w-5xl grid md:grid-cols-2 gap-8">
      <div class="scroll-reveal bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-3xl p-8 sm:p-10">
        <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-6 shadow-lg">
          <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
        </div>
        <h3 class="text-2xl font-bold text-slate-900 mb-4">Performance</h3>
        <ul class="space-y-3 text-sm text-slate-700">
          <li class="flex gap-2"><span class="text-emerald-600 font-bold">✓</span> Lazy-loaded routes so you only download the page you're on</li>
          <li class="flex gap-2"><span class="text-emerald-600 font-bold">✓</span> Server-side pagination and filtering on every product query</li>
          <li class="flex gap-2"><span class="text-emerald-600 font-bold">✓</span> Automatic retry with backoff on transient network hiccups</li>
          <li class="flex gap-2"><span class="text-emerald-600 font-bold">✓</span> Gzip compression and connection pooling on the API</li>
        </ul>
      </div>
      <div class="scroll-reveal bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-100 rounded-3xl p-8 sm:p-10" style="transition-delay: 0.1s">
        <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center mb-6 shadow-lg">
          <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </div>
        <h3 class="text-2xl font-bold text-slate-900 mb-4">Security</h3>
        <ul class="space-y-3 text-sm text-slate-700">
          <li class="flex gap-2"><span class="text-sky-600 font-bold">✓</span> Passwords hashed with bcrypt — never stored in plain text</li>
          <li class="flex gap-2"><span class="text-sky-600 font-bold">✓</span> JWT access &amp; refresh tokens in HTTP-only cookies</li>
          <li class="flex gap-2"><span class="text-sky-600 font-bold">✓</span> Helmet-hardened HTTP headers and strict CORS policy</li>
          <li class="flex gap-2"><span class="text-sky-600 font-bold">✓</span> Rate limiting on every API route to stop abuse</li>
        </ul>
      </div>
    </div>
  </section>

  <!-- ============ SUPPORT ============ -->
  <section class="py-20 px-4 bg-gradient-to-r from-sky-600 to-blue-700 text-white">
    <div class="container mx-auto max-w-3xl text-center scroll-reveal">
      <h2 class="text-3xl sm:text-4xl font-bold mb-4">Customer support that actually responds</h2>
      <p class="text-sky-100 mb-8 leading-relaxed">
        Questions about an order, a return, or just how something works? Our team is reachable every day,
        and every message goes to a real inbox — not a black hole.
      </p>
      <div class="flex flex-wrap items-center justify-center gap-4">
        <a routerLink="/contact" class="px-6 py-3 bg-white text-sky-700 font-bold rounded-xl hover:bg-sky-50 transition-colors no-underline shadow-lg">Contact Support</a>
        <a routerLink="/faq" class="px-6 py-3 bg-white/10 border border-white/30 text-white font-bold rounded-xl hover:bg-white/20 transition-colors no-underline">Visit FAQ</a>
      </div>
    </div>
  </section>

  <!-- ============ ROADMAP ============ -->
  <section class="py-24 px-4 bg-white">
    <div class="container mx-auto max-w-3xl">
      <div class="text-center mb-14 scroll-reveal">
        <p class="text-sky-600 font-bold text-xs uppercase tracking-widest mb-3">What's Next</p>
        <h2 class="text-3xl sm:text-4xl font-bold text-slate-900">Future Roadmap</h2>
      </div>
      <div class="space-y-6">
        <div *ngFor="let item of roadmap; let i = index" class="scroll-reveal flex gap-5" [style.transition-delay.s]="i * 0.05">
          <div class="flex flex-col items-center">
            <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0" [ngClass]="item.done ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400'">
              <svg *ngIf="item.done" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
              <span *ngIf="!item.done">{{ i + 1 }}</span>
            </div>
            <div *ngIf="i < roadmap.length - 1" class="w-0.5 flex-1 bg-slate-200 my-1"></div>
          </div>
          <div class="pb-6">
            <span class="text-[10px] font-black uppercase tracking-wider" [ngClass]="item.done ? 'text-emerald-600' : 'text-sky-600'">{{ item.done ? 'Shipped' : 'Planned' }}</span>
            <h3 class="font-bold text-slate-900 mt-1">{{ item.title }}</h3>
            <p class="text-sm text-slate-600 mt-1">{{ item.desc }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ============ MEET THE DEVELOPER ============ -->
  <section class="py-24 px-4 bg-slate-900 text-white relative overflow-hidden">
    <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl"></div>
    <div class="container mx-auto max-w-5xl relative z-10">
      <div class="text-center max-w-2xl mx-auto mb-14 scroll-reveal">
        <p class="text-sky-400 font-bold text-xs uppercase tracking-widest mb-3">The Person Behind This Build</p>
        <h2 class="text-3xl sm:text-4xl font-bold">Meet the Developer</h2>
      </div>

      <div class="scroll-reveal grid md:grid-cols-[220px_1fr] gap-10 items-start bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 sm:p-10">
        <div class="flex flex-col items-center text-center md:sticky md:top-24">
          <div class="w-36 h-36 rounded-3xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-5xl font-black shadow-2xl shadow-sky-600/30 mb-4">
            DG
          </div>
          <h3 class="text-xl font-bold">{{ developer.name }}</h3>
          <p class="text-sky-400 text-sm font-semibold mt-1">{{ developer.role }}</p>
          <div class="flex gap-3 mt-5">
            <a [href]="contact.github" target="_blank" rel="noopener" class="w-11 h-11 bg-white/10 hover:bg-sky-500 rounded-xl flex items-center justify-center transition-all hover:scale-110" aria-label="GitHub">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a10 10 0 00-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.18-3.37-1.18-.45-1.15-1.11-1.46-1.11-1.46-.91-.62.07-.61.07-.61 1 .07 1.54 1.04 1.54 1.04.9 1.54 2.35 1.09 2.92.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.1.39-2 1.03-2.71-.1-.25-.45-1.28.1-2.67 0 0 .84-.27 2.75 1.03A9.57 9.57 0 0112 6.8c.85 0 1.7.11 2.5.34 1.91-1.3 2.75-1.03 2.75-1.03.55 1.39.2 2.42.1 2.67.64.71 1.03 1.61 1.03 2.71 0 3.85-2.34 4.69-4.57 4.94.36.31.68.91.68 1.84v2.73c0 .27.18.58.69.48A10 10 0 0012 2z"/></svg>
            </a>
            <a [href]="contact.linkedin" target="_blank" rel="noopener" class="w-11 h-11 bg-white/10 hover:bg-sky-500 rounded-xl flex items-center justify-center transition-all hover:scale-110" aria-label="LinkedIn">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/><path d="M2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
            </a>
          </div>
        </div>

        <div>
          <p class="text-slate-300 leading-relaxed mb-4">
            {{ developer.bio1 }}
          </p>
          <p class="text-slate-300 leading-relaxed mb-6">
            {{ developer.bio2 }}
          </p>

          <div class="grid sm:grid-cols-2 gap-4 mb-6">
            <div *ngFor="let focus of developer.focusAreas" class="flex gap-3">
              <span class="text-sky-400 shrink-0 mt-0.5" [innerHTML]="sanitize(focus.icon)"></span>
              <div>
                <h4 class="font-bold text-sm text-white">{{ focus.title }}</h4>
                <p class="text-xs text-slate-400 mt-0.5">{{ focus.desc }}</p>
              </div>
            </div>
          </div>

          <h4 class="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">Core Technologies</h4>
          <div class="flex flex-wrap gap-2">
            <span *ngFor="let skill of developer.skills" class="px-3 py-1.5 bg-white/10 border border-white/10 rounded-full text-xs font-semibold text-sky-200">{{ skill }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ============ OWNERSHIP & VISION ============ -->
  <section class="py-20 px-4 bg-slate-50">
    <div class="container mx-auto max-w-3xl scroll-reveal">
      <div class="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-sm">
        <p class="text-sky-600 font-bold text-xs uppercase tracking-widest mb-3">Ownership &amp; Vision</p>
        <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 mb-5">Who owns {{ contact.brandName }}</h2>
        <p class="text-slate-600 leading-relaxed mb-4">
          {{ contact.brandName }} is an independent, self-built demo e-commerce platform designed and developed
          by {{ developer.name }} to showcase enterprise-level software engineering practices — scalable
          architecture, secure backend development, thoughtful UI/UX, and real-world online shopping
          functionality, end to end.
        </p>
        <p class="text-slate-600 leading-relaxed">
          It is <strong>not</strong> a registered company, and it does not process real payments or ship
          physical goods. Every product, order, and account you see runs on a genuine backend and database —
          the commerce here is real software, presented as a portfolio-grade case study rather than a
          commercial business.
        </p>
      </div>
    </div>
  </section>

</main>
  `,
})
export class AboutPageComponent {
  readonly contact = CONTACT_CONFIG;
  private readonly safeHtmlCache = new Map<string, SafeHtml>();

  constructor(private sanitizer: DomSanitizer) {}

  // Static SVG strings authored in this file, not user input — Angular's
  // default [innerHTML] sanitizer strips <svg>/<path> tags, so this bypasses
  // that for these trusted, hardcoded icons only. Cached so repeated calls in
  // *ngFor don't re-sanitize on every change-detection pass.
  sanitize(svg: string): SafeHtml {
    let cached = this.safeHtmlCache.get(svg);
    if (!cached) {
      cached = this.sanitizer.bypassSecurityTrustHtml(svg);
      this.safeHtmlCache.set(svg, cached);
    }
    return cached;
  }

  readonly stats = [
    { value: '10,000+', label: 'Products', icon: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>' },
    { value: '50,000+', label: 'Customers', icon: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1.13a4 4 0 100-8 4 4 0 000 8zm6 0a4 4 0 10-8 0"/></svg>' },
    { value: '99%', label: 'Satisfaction', icon: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>' },
    { value: '24', label: 'Categories', icon: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2h-4a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h4a2 2 0 012 2v4a2 2 0 01-2 2h-4a2 2 0 01-2-2v-4z"/></svg>' },
    { value: '100%', label: 'Secure Payments', icon: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>' },
    { value: '2-4 Days', label: 'Fast Delivery', icon: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1m-2-1a1 1 0 011-1m5 1a1 1 0 102 0 1 1 0 00-2 0zM7 17a1 1 0 102 0 1 1 0 00-2 0z"/></svg>' },
  ];

  readonly whyChooseUs = [
    { title: 'Secure Shopping', desc: 'JWT auth, bcrypt-hashed passwords, and HTTP-only cookies protect every account.', bg: 'bg-gradient-to-br from-sky-500 to-blue-600', icon: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>' },
    { title: 'Fast Delivery', desc: 'Free express shipping on orders over $100, with live status tracking on every order.', bg: 'bg-gradient-to-br from-emerald-500 to-teal-600', icon: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>' },
    { title: 'Easy Returns', desc: 'Cancel eligible orders in one tap, or return within the item\'s stated window — no phone calls.', bg: 'bg-gradient-to-br from-purple-500 to-pink-600', icon: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"/></svg>' },
    { title: 'Quality Assurance', desc: 'Every listing carries real ratings, verified reviews, and accurate stock levels.', bg: 'bg-gradient-to-br from-amber-500 to-orange-600', icon: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>' },
    { title: '24/7 Support', desc: 'A real contact channel and FAQ system, reachable any day of the week.', bg: 'bg-gradient-to-br from-rose-500 to-red-600', icon: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M5.636 5.636l3.536 3.536m0 5.656l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>' },
    { title: 'Modern Technology', desc: 'Angular, Node.js, Prisma, and PostgreSQL — an architecture that scales.', bg: 'bg-gradient-to-br from-indigo-500 to-violet-600', icon: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>' },
  ];

  readonly values = [
    { title: 'Customer-First', desc: 'Every feature is judged by one question: does this make shopping easier?' },
    { title: 'Integrity', desc: 'Real stock counts, real prices, real reviews — no dark patterns, ever.' },
    { title: 'Innovation', desc: 'We ship features like live order tracking and category rails, not just static pages.' },
    { title: 'Sustainability', desc: 'Efficient, lazy-loaded code means less data transferred, less energy used.' },
    { title: 'Excellence', desc: 'Clean code and thorough testing on every feature before it ships.' },
    { title: 'Transparency', desc: 'Clear pricing, clear policies, and a support team you can actually reach.' },
  ];

  readonly whatWeSell = [
    { emoji: '⌚', label: 'Watches' },
    { emoji: '📱', label: 'Electronics' },
    { emoji: '💄', label: 'Beauty' },
    { emoji: '🛋️', label: 'Furniture' },
    { emoji: '🥗', label: 'Groceries' },
    { emoji: '👗', label: 'Fashion' },
  ];

  readonly commitments = [
    {
      title: 'Customer-First Philosophy',
      desc: 'Every decision — from checkout flow to return policy — starts with what makes the shopper\'s life easier, not what\'s easiest for us to build.',
      bg: 'from-sky-500 to-blue-600',
      icon: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>',
    },
    {
      title: 'Secure Shopping',
      desc: 'Accounts are protected with bcrypt password hashing, JWT sessions, rate limiting, and hardened HTTP headers on every request.',
      bg: 'from-indigo-500 to-purple-600',
      icon: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>',
    },
    {
      title: 'Fast Delivery',
      desc: 'Free express shipping over $100, a 2–4 business day average delivery window, and a live 4-stage tracker on every order.',
      bg: 'from-emerald-500 to-teal-600',
      icon: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1"/></svg>',
    },
    {
      title: 'Easy Returns',
      desc: 'Pending or processing orders can be cancelled in one click, with stock automatically restored — no waiting on hold.',
      bg: 'from-amber-500 to-orange-600',
      icon: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"/></svg>',
    },
  ];

  readonly techStack = [
    { name: 'Angular', role: 'Frontend Framework', letter: 'A', bg: 'bg-gradient-to-br from-red-500 to-rose-600' },
    { name: 'TypeScript', role: 'Type Safety', letter: 'TS', bg: 'bg-gradient-to-br from-blue-500 to-sky-600' },
    { name: 'Node.js', role: 'Runtime', letter: 'N', bg: 'bg-gradient-to-br from-emerald-500 to-green-600' },
    { name: 'Express', role: 'API Server', letter: 'E', bg: 'bg-gradient-to-br from-slate-600 to-slate-800' },
    { name: 'Prisma', role: 'ORM', letter: 'P', bg: 'bg-gradient-to-br from-indigo-500 to-blue-700' },
    { name: 'PostgreSQL', role: 'Database', letter: 'PG', bg: 'bg-gradient-to-br from-sky-600 to-blue-800' },
    { name: 'Supabase', role: 'DB Hosting', letter: 'S', bg: 'bg-gradient-to-br from-emerald-600 to-teal-700' },
    { name: 'Tailwind CSS', role: 'Styling', letter: 'TW', bg: 'bg-gradient-to-br from-cyan-500 to-teal-600' },
    { name: 'JWT', role: 'Authentication', letter: 'J', bg: 'bg-gradient-to-br from-purple-500 to-violet-700' },
    { name: 'REST API', role: 'Data Layer', letter: 'API', bg: 'bg-gradient-to-br from-amber-500 to-orange-600' },
  ];

  readonly roadmap = [
    { title: 'Live order tracking', desc: 'A real 4-stage delivery tracker with tracking numbers and estimated dates.', done: true },
    { title: 'Category rails & dynamic navigation', desc: 'A live categories mega-menu and homepage rails driven entirely by the database.', done: true },
    { title: 'Admin dashboard', desc: 'A dedicated console for managing products, categories, and orders without touching the database directly.', done: false },
    { title: 'Product recommendations', desc: '"You may also like" suggestions based on category and purchase history.', done: false },
    { title: 'Order email notifications', desc: 'Transactional emails for order confirmation, shipping, and delivery.', done: false },
    { title: 'Time-boxed flash sales', desc: 'Scheduled discount windows with countdown-driven visibility.', done: false },
  ];

  readonly developer = {
    name: 'Darshan Giri Goswami',
    role: 'Full Stack Software Developer',
    bio1: `I'm a full stack developer who builds modern web applications end to end — from the database schema
      up through the API to the last pixel of the interface. My toolkit centers on Angular, React, Node.js,
      Express.js, Prisma, PostgreSQL, MongoDB, and Tailwind CSS, paired with cloud infrastructure to get real
      products in front of real users.`,
    bio2: `This platform is a direct expression of that approach: a fully working shopping experience with
      authenticated accounts, a live product catalog, cart and wishlist persistence, order tracking, and an
      admin-ready data model — built to demonstrate the kind of scalable, secure, and genuinely usable software
      I care about shipping.`,
    skills: ['Angular', 'React', 'TypeScript', 'Node.js', 'Express.js', 'Prisma', 'PostgreSQL', 'MongoDB', 'Tailwind CSS', 'REST APIs', 'JWT Auth', 'Git & CI/CD'],
    focusAreas: [
      { title: 'Problem Solving', desc: 'Breaking ambiguous requirements into shippable, testable increments.', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>' },
      { title: 'UI/UX Focus', desc: 'Interfaces designed to feel obvious, not just functional.', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>' },
      { title: 'Clean Code', desc: 'Readable, maintainable code that the next engineer can pick up fast.', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 8l-4 4 4 4"/></svg>' },
      { title: 'Performance', desc: 'Lazy loading, query optimization, and retry logic baked in from day one.', icon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>' },
    ],
  };
}
