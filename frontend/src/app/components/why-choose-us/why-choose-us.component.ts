import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ScrollRevealDirective } from '../../directives/scroll-reveal.directive';

@Component({
  selector: "app-why-choose-us",
  standalone: true,
  imports: [CommonModule, ScrollRevealDirective],
  template: `
    <section class="py-20 px-4 bg-white">
      <div class="container mx-auto">
        <div class="text-center mb-16 scroll-reveal">
          <h2 class="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Why Choose Us</h2>
          <p class="text-xl text-slate-600">Your satisfaction is our priority</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div *ngFor="let feature of features; let i = index" 
               class="scroll-reveal text-center group"
               [style.transition-delay.s]="i * 0.1">
            <div class="mb-6 inline-flex items-center justify-center">
              <div class="w-20 h-20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg"
                   [ngClass]="feature.bgClass">
                <svg class="w-9 h-9 text-white" fill="none" stroke="currentColor" stroke-width="2" [attr.viewBox]="feature.viewBox">
                  <path *ngFor="let p of feature.paths" [attr.d]="p" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>
            <h3 class="text-xl font-bold text-slate-900 mb-3">{{ feature.title }}</h3>
            <p class="text-slate-600 leading-relaxed">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class WhyChooseUsComponent {
  features = [
    {
      title: "Fast Delivery",
      description: "Free shipping on orders over $50. Get your products delivered in 2-3 business days.",
      bgClass: "bg-gradient-to-br from-sky-500 to-blue-600",
      viewBox: "0 0 24 24",
      paths: ["M1 3h15v13H1z M16 8h4l3 3v5h-7V8z M5.5 18.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z M18.5 18.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"]
    },
    {
      title: "24/7 Support",
      description: "Our customer support team is always ready to help you with any questions.",
      bgClass: "bg-gradient-to-br from-purple-500 to-pink-600",
      viewBox: "0 0 24 24",
      paths: ["M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"]
    },
    {
      title: "Secure Payment",
      description: "Your payment information is encrypted and secure with our SSL technology.",
      bgClass: "bg-gradient-to-br from-emerald-500 to-teal-600",
      viewBox: "0 0 24 24",
      paths: ["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"]
    },
    {
      title: "Easy Returns",
      description: "Not satisfied? Return your purchase within 30 days for a full refund.",
      bgClass: "bg-gradient-to-br from-amber-500 to-orange-600",
      viewBox: "0 0 24 24",
      paths: ["M1 4v6h6 M3.51 15a9 9 0 102.13-9.36L1 10"]
    },
  ]
}
