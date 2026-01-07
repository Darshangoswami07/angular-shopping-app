import { Component, type OnInit, type OnDestroy } from "@angular/core"
import { CommonModule } from "@angular/common"
import { NavbarComponent } from "./components/navbar/navbar.component"
import { HeroComponent } from "./components/hero/hero.component"
import { FeaturedCategoriesComponent } from "./components/featured-categories/featured-categories.component"
import { TrendingProductsComponent } from "./components/trending-products/trending-products.component"
import { CartComponent } from "./components/cart/cart.component"
import { CartSidebarComponent } from "./components/cart-sidebar/cart-sidebar.component"
import { WhyChooseUsComponent } from "./components/why-choose-us/why-choose-us.component"
import { AboutComponent } from "./components/about/about.component"
import { NewsletterComponent } from "./components/newsletter/newsletter.component"
import { FooterComponent } from "./components/footer/footer.component"

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    HeroComponent,
    FeaturedCategoriesComponent,
    TrendingProductsComponent,
    CartComponent,
    CartSidebarComponent,
    WhyChooseUsComponent,
    AboutComponent,
    NewsletterComponent,
    FooterComponent,
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <app-navbar></app-navbar>
      <app-cart-sidebar></app-cart-sidebar>
      <app-hero></app-hero>
      <app-featured-categories></app-featured-categories>
      <app-trending-products></app-trending-products>
      <app-cart></app-cart>
      <app-why-choose-us></app-why-choose-us>
      <app-about></app-about>
      <app-newsletter></app-newsletter>
      <app-footer></app-footer>
    </div>
  `,
})
export class AppComponent implements OnInit, OnDestroy {
  private observer: IntersectionObserver | null = null

  ngOnInit() {
    // Scroll reveal animation
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed")
          }
        })
      },
      { threshold: 0.1 },
    )

    setTimeout(() => {
      const elements = document.querySelectorAll(".scroll-reveal")
      elements.forEach((el) => this.observer?.observe(el))
    }, 100)
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect()
    }
  }
}
