import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DomSanitizer, type SafeHtml } from '@angular/platform-browser';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';
import { BLOG_POSTS, BLOG_CATEGORIES, getFeaturedPost, getOtherPosts, type BlogPost } from '../../data/blog-posts.data';

@Component({
  selector: 'app-blog-page',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe, ScrollRevealDirective],
  template: `
<main class="bg-white min-h-screen">

  <!-- ============ HERO ============ -->
  <section class="pt-32 pb-20 px-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white text-center relative overflow-hidden">
    <div class="absolute -top-40 -right-40 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl"></div>
    <div class="container mx-auto max-w-3xl relative z-10 scroll-reveal">
      <div class="inline-block px-4 py-2 bg-sky-500/20 backdrop-blur-sm rounded-full border border-sky-400/30 mb-6">
        <span class="text-sky-300 text-sm font-medium">📝 The Meridian Market Journal</span>
      </div>
      <h1 class="text-4xl sm:text-5xl font-bold mb-5">Ideas on commerce, code, and craft</h1>
      <p class="text-lg text-slate-300 leading-relaxed">
        Engineering write-ups, shopping guides, and security notes from the team building this platform.
      </p>
    </div>
  </section>

  <!-- ============ CATEGORY FILTER ============ -->
  <section class="py-8 px-4 bg-white border-b border-slate-100 sticky top-[68px] z-30 backdrop-blur-md bg-white/90">
    <div class="container mx-auto flex flex-wrap items-center gap-2">
      <button (click)="activeCategory = null" class="px-4 py-1.5 rounded-full text-xs font-bold transition-colors" [ngClass]="!activeCategory ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'">
        All Posts
      </button>
      <button *ngFor="let cat of categories" (click)="activeCategory = cat" class="px-4 py-1.5 rounded-full text-xs font-bold transition-colors" [ngClass]="activeCategory === cat ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'">
        {{ cat }}
      </button>
    </div>
  </section>

  <!-- ============ FEATURED ARTICLE ============ -->
  <section *ngIf="!activeCategory" class="py-16 px-4 bg-slate-50">
    <div class="container mx-auto">
      <p class="text-sky-600 font-bold text-xs uppercase tracking-widest mb-6 scroll-reveal">Featured Article</p>
      <a [routerLink]="['/blog', featured.slug]" class="scroll-reveal group grid md:grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-xl border border-slate-200 bg-white no-underline hover:shadow-2xl transition-shadow">
        <div class="bg-gradient-to-br p-10 sm:p-14 flex items-center justify-center min-h-[280px]" [ngClass]="featured.gradient">
          <span class="w-24 h-24 text-white/90" [innerHTML]="sanitize(featured.icon)"></span>
        </div>
        <div class="p-8 sm:p-10 flex flex-col justify-center">
          <span class="text-xs font-bold text-sky-600 uppercase tracking-wider">{{ featured.category }}</span>
          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 mt-2 mb-3 group-hover:text-sky-700 transition-colors">{{ featured.title }}</h2>
          <p class="text-slate-600 leading-relaxed mb-5">{{ featured.excerpt }}</p>
          <div class="flex items-center gap-3 text-xs text-slate-500 font-medium">
            <span>{{ featured.author }}</span>
            <span>·</span>
            <span>{{ featured.date | date:'mediumDate' }}</span>
            <span>·</span>
            <span>{{ featured.readingTime }} min read</span>
          </div>
        </div>
      </a>
    </div>
  </section>

  <!-- ============ ARTICLE GRID ============ -->
  <section class="py-16 px-4 bg-white">
    <div class="container mx-auto">
      <p class="text-sky-600 font-bold text-xs uppercase tracking-widest mb-8 scroll-reveal">{{ activeCategory || 'Latest Articles' }}</p>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <a *ngFor="let post of filteredPosts; let i = index" [routerLink]="['/blog', post.slug]"
           class="scroll-reveal group rounded-2xl overflow-hidden border border-slate-200 bg-white hover:shadow-xl hover:-translate-y-1 transition-all no-underline flex flex-col"
           [style.transition-delay.s]="i * 0.04">
          <div class="bg-gradient-to-br h-40 flex items-center justify-center" [ngClass]="post.gradient">
            <span class="w-12 h-12 text-white/90" [innerHTML]="sanitize(post.icon)"></span>
          </div>
          <div class="p-6 flex-1 flex flex-col">
            <span class="text-[11px] font-bold text-sky-600 uppercase tracking-wider">{{ post.category }}</span>
            <h3 class="font-bold text-slate-900 mt-2 mb-2 line-clamp-2 group-hover:text-sky-700 transition-colors">{{ post.title }}</h3>
            <p class="text-sm text-slate-600 leading-relaxed line-clamp-3 flex-1">{{ post.excerpt }}</p>
            <div class="flex items-center justify-between mt-5 pt-4 border-t border-slate-100">
              <div class="text-[11px] text-slate-500 font-medium">
                {{ post.date | date:'mediumDate' }} · {{ post.readingTime }} min read
              </div>
              <span class="text-sky-600 font-bold text-xs inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                Read More
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
              </span>
            </div>
          </div>
        </a>
      </div>
      <p *ngIf="!filteredPosts.length" class="text-center text-slate-500 py-16">No articles in this category yet.</p>
    </div>
  </section>

</main>
  `,
})
export class BlogPageComponent {
  readonly categories = BLOG_CATEGORIES;
  readonly featured = getFeaturedPost();
  readonly otherPosts = getOtherPosts();
  activeCategory: string | null = null;

  private readonly safeHtmlCache = new Map<string, SafeHtml>();

  constructor(private sanitizer: DomSanitizer) {}

  get filteredPosts(): BlogPost[] {
    const source = this.activeCategory ? BLOG_POSTS : this.otherPosts;
    return this.activeCategory ? source.filter((p) => p.category === this.activeCategory) : source;
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
