import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { LucideAngularModule, Truck, Headphones, Shield, RotateCcw } from "lucide-angular"

@Component({
  selector: "app-why-choose-us",
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
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
              <div class="w-20 h-20 bg-gradient-to-br rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg"
                   [ngClass]="feature.bgClass">
                <lucide-icon [img]="feature.icon" [size]="36" class="text-white"></lucide-icon>
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
  readonly Truck = Truck
  readonly Headphones = Headphones
  readonly Shield = Shield
  readonly RotateCcw = RotateCcw

  features = [
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Free shipping on orders over $50. Get your products delivered in 2-3 business days.",
      bgClass: "from-sky-500 to-blue-600",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      description: "Our customer support team is always ready to help you with any questions.",
      bgClass: "from-purple-500 to-pink-600",
    },
    {
      icon: Shield,
      title: "Secure Payment",
      description: "Your payment information is encrypted and secure with our SSL technology.",
      bgClass: "from-emerald-500 to-teal-600",
    },
    {
      icon: RotateCcw,
      title: "Easy Returns",
      description: "Not satisfied? Return your purchase within 30 days for a full refund.",
      bgClass: "from-amber-500 to-orange-600",
    },
  ]
}
