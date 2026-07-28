import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroComponent } from '../../components/hero/hero.component';
import { FeaturedCategoriesComponent } from '../../components/featured-categories/featured-categories.component';
import { TrendingProductsComponent } from '../../components/trending-products/trending-products.component';
import { WhyChooseUsComponent } from '../../components/why-choose-us/why-choose-us.component';
import { AboutComponent } from '../../components/about/about.component';
import { NewsletterComponent } from '../../components/newsletter/newsletter.component';
import { FlashSaleComponent } from '../../components/flash-sale/flash-sale.component';
import { BrandsComponent } from '../../components/brands/brands.component';
import { DeliveryInfoComponent } from '../../components/delivery-info/delivery-info.component';
import { StatisticsComponent } from '../../components/statistics/statistics.component';
import { CustomerReviewsComponent } from '../../components/customer-reviews/customer-reviews.component';
import { FaqComponent } from '../../components/faq/faq.component';
import { CategoryRailComponent } from '../../components/category-rail/category-rail.component';

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
    FlashSaleComponent,
    BrandsComponent,
    DeliveryInfoComponent,
    StatisticsComponent,
    CustomerReviewsComponent,
    FaqComponent,
    CategoryRailComponent,
  ],
  template: `
    <app-hero></app-hero>
    <app-featured-categories></app-featured-categories>
    <app-flash-sale></app-flash-sale>
    <app-trending-products></app-trending-products>
    <app-category-rail categorySlug="mens-watches" heading="Watches for Him" eyebrow="Men's Collection" tone="white"></app-category-rail>
    <app-category-rail categorySlug="womens-watches" heading="Watches for Her" eyebrow="Women's Collection" tone="muted"></app-category-rail>
    <app-category-rail categorySlug="smartphones" heading="Latest Smartphones" eyebrow="Tech & Gadgets" tone="white"></app-category-rail>
    <app-category-rail categorySlug="sports-accessories" heading="Gear Up for Sports" eyebrow="Sports & Outdoors" tone="muted"></app-category-rail>
    <app-brands></app-brands>
    <app-delivery-info></app-delivery-info>
    <app-why-choose-us></app-why-choose-us>
    <app-statistics></app-statistics>
    <app-customer-reviews></app-customer-reviews>
    <app-faq></app-faq>
    <app-about></app-about>
    <app-newsletter></app-newsletter>
  `,
})
export class HomeComponent {}
