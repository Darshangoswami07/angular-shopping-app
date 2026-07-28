import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DomSanitizer, type SafeHtml } from '@angular/platform-browser';
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';
import { BLOG_POSTS, getPostBySlug, type BlogPost } from '../../data/blog-posts.data';

@Component({
  selector: 'app-blog-post-page',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe, ScrollRevealDirective],
  template: `
<main class="bg-white min-h-screen pt-28 pb-20" *ngIf="post">

  <div class="container mx-auto max-w-3xl px-4">
    <a routerLink="/blog" class="inline-flex items-center gap-2 text-sm font-semibold text-sky-600 hover:text-sky-700 no-underline mb-8">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
      Back to Blog
    </a>

    <div class="scroll-reveal">
      <span class="text-xs font-bold text-sky-600 uppercase tracking-wider">{{ post.category }}</span>
      <h1 class="text-3xl sm:text-5xl font-bold text-slate-900 mt-3 mb-6 leading-tight">{{ post.title }}</h1>

      <div class="flex items-center gap-4 pb-8 border-b border-slate-100">
        <span class="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 font-black text-white text-sm shrink-0">
          {{ authorInitials }}
        </span>
        <div>
          <p class="font-bold text-slate-900 text-sm">{{ post.author }}</p>
          <p class="text-xs text-slate-500">{{ post.authorRole }}</p>
        </div>
        <span class="ml-auto text-xs text-slate-500 font-medium text-right">
          {{ post.date | date:'MMMM d, y' }}<br>{{ post.readingTime }} min read
        </span>
      </div>
    </div>

    <div class="scroll-reveal bg-gradient-to-br rounded-3xl h-56 sm:h-72 flex items-center justify-center my-10" [ngClass]="post.gradient">
      <span class="w-20 h-20 text-white/90" [innerHTML]="sanitize(post.icon)"></span>
    </div>

    <article class="scroll-reveal max-w-none">
      <p *ngFor="let paragraph of post.content" class="text-slate-700 leading-8 text-[17px] mb-6">{{ paragraph }}</p>
    </article>

    <div class="scroll-reveal mt-12 pt-8 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
      <a routerLink="/blog" class="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-sm transition-colors no-underline">
        ← All Articles
      </a>
      <a routerLink="/contact" class="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-sm transition-colors no-underline">
        Have a question? Contact us
      </a>
    </div>
  </div>

  <!-- ============ RELATED POSTS ============ -->
  <section class="mt-20 py-16 px-4 bg-slate-50 border-t border-slate-100" *ngIf="relatedPosts.length">
    <div class="container mx-auto max-w-5xl">
      <p class="text-sky-600 font-bold text-xs uppercase tracking-widest mb-8 scroll-reveal">Keep Reading</p>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <a *ngFor="let related of relatedPosts" [routerLink]="['/blog', related.slug]"
           class="scroll-reveal group rounded-2xl overflow-hidden border border-slate-200 bg-white hover:shadow-lg transition-all no-underline">
          <div class="bg-gradient-to-br h-28 flex items-center justify-center" [ngClass]="related.gradient">
            <span class="w-8 h-8 text-white/90" [innerHTML]="sanitize(related.icon)"></span>
          </div>
          <div class="p-5">
            <span class="text-[10px] font-bold text-sky-600 uppercase tracking-wider">{{ related.category }}</span>
            <h4 class="font-bold text-slate-900 text-sm mt-1 line-clamp-2 group-hover:text-sky-700 transition-colors">{{ related.title }}</h4>
          </div>
        </a>
      </div>
    </div>
  </section>
</main>

<main class="bg-white min-h-screen pt-32 pb-20 text-center" *ngIf="!post">
  <svg class="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
  <h1 class="text-2xl font-bold text-slate-900 mb-2">Article not found</h1>
  <p class="text-slate-500 mb-6">This post may have been moved or doesn't exist.</p>
  <a routerLink="/blog" class="inline-block px-6 py-3 bg-sky-600 text-white font-bold rounded-xl no-underline">Back to Blog</a>
</main>
  `,
})
export class BlogPostPageComponent implements OnInit {
  post: BlogPost | undefined;
  relatedPosts: BlogPost[] = [];
  private readonly safeHtmlCache = new Map<string, SafeHtml>();

  constructor(private route: ActivatedRoute, private router: Router, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug') ?? '';
      this.post = getPostBySlug(slug);
      this.relatedPosts = this.post
        ? BLOG_POSTS.filter((p) => p.category === this.post!.category && p.slug !== this.post!.slug).slice(0, 3)
        : [];
      if (typeof window !== 'undefined') window.scrollTo({ top: 0 });
    });
  }

  get authorInitials(): string {
    if (!this.post) return '';
    return this.post.author.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
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
