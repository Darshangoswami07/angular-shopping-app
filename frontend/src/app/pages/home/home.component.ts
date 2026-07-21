import { Component, type OnInit, type OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroComponent } from '../../components/hero/hero.component';
import { FeaturedCategoriesComponent } from '../../components/featured-categories/featured-categories.component';
import { TrendingProductsComponent } from '../../components/trending-products/trending-products.component';
import { WhyChooseUsComponent } from '../../components/why-choose-us/why-choose-us.component';
import { AboutComponent } from '../../components/about/about.component';
import { NewsletterComponent } from '../../components/newsletter/newsletter.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeroComponent,
    FeaturedCategoriesComponent,
    TrendingProductsComponent,
    WhyChooseUsComponent,
    AboutComponent,
    NewsletterComponent,
  ],
  template: `
    <app-hero></app-hero>
    <app-featured-categories></app-featured-categories>
    <app-trending-products></app-trending-products>
    <app-why-choose-us></app-why-choose-us>
    <app-about></app-about>
    <app-newsletter></app-newsletter>
  `,
})
export class HomeComponent implements OnInit, OnDestroy {
  private observer: IntersectionObserver | null = null;

  ngOnInit() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.1 }
    );

    setTimeout(() => {
      const elements = document.querySelectorAll('.scroll-reveal');
      elements.forEach((el) => this.observer?.observe(el));
    }, 100);
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
