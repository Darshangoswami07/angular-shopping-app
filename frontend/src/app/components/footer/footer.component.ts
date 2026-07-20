import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import { LucideAngularModule, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-angular"

@Component({
  selector: "app-footer",
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <footer class="bg-slate-900 text-slate-300 py-16 px-4">
      <div class="container mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <!-- Company Info -->
          <div class="scroll-reveal">
            <div class="flex items-center gap-2 mb-4">
              <div class="w-10 h-10 bg-gradient-to-br from-sky-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                <span class="text-white font-bold text-xl">L</span>
              </div>
              <span class="text-2xl font-bold text-white">LuxeStore</span>
            </div>
            <p class="text-slate-400 mb-6 leading-relaxed">
              Your premier destination for quality products and exceptional service. Elevate your lifestyle with LuxeStore.
            </p>
            <div class="flex gap-4">
              <a *ngFor="let social of socialLinks" 
                 [href]="social.url" 
                 class="w-10 h-10 bg-slate-800 hover:bg-sky-500 rounded-lg flex items-center justify-center transition-all hover:scale-110">
                <lucide-icon [img]="social.icon" [size]="20"></lucide-icon>
              </a>
            </div>
          </div>

          <!-- Quick Links -->
          <div class="scroll-reveal" style="transition-delay: 0.1s">
            <h3 class="text-white font-bold text-lg mb-4">Quick Links</h3>
            <ul class="space-y-3">
              <li *ngFor="let link of quickLinks">
                <a [href]="link.url" class="hover:text-sky-400 transition-colors">{{ link.label }}</a>
              </li>
            </ul>
          </div>

          <!-- Customer Service -->
          <div class="scroll-reveal" style="transition-delay: 0.2s">
            <h3 class="text-white font-bold text-lg mb-4">Customer Service</h3>
            <ul class="space-y-3">
              <li *ngFor="let link of customerLinks">
                <a [href]="link.url" class="hover:text-sky-400 transition-colors">{{ link.label }}</a>
              </li>
            </ul>
          </div>

          <!-- Contact Info -->
          <div class="scroll-reveal" style="transition-delay: 0.3s">
            <h3 class="text-white font-bold text-lg mb-4">Contact Us</h3>
            <ul class="space-y-4">
              <li class="flex items-start gap-3">
                <lucide-icon [img]="MapPin" [size]="20" class="text-sky-400 mt-1"></lucide-icon>
                <span>123 Commerce Street<br />New York, NY 10013</span>
              </li>
              <li class="flex items-center gap-3">
                <lucide-icon [img]="Phone" [size]="20" class="text-sky-400"></lucide-icon>
                <span>+1 (555) 123-4567</span>
              </li>
              <li class="flex items-center gap-3">
                <lucide-icon [img]="Mail" [size]="20" class="text-sky-400"></lucide-icon>
                <span>support&#64;luxestore.com</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Bottom Bar -->
        <div class="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p class="text-slate-400 text-sm">
            &copy; 2025 LuxeStore. All rights reserved.
          </p>
          <div class="flex gap-6 text-sm">
            <a href="#privacy" class="hover:text-sky-400 transition-colors">Privacy Policy</a>
            <a href="#terms" class="hover:text-sky-400 transition-colors">Terms of Service</a>
            <a href="#cookies" class="hover:text-sky-400 transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  readonly Facebook = Facebook
  readonly Twitter = Twitter
  readonly Instagram = Instagram
  readonly Linkedin = Linkedin
  readonly Mail = Mail
  readonly Phone = Phone
  readonly MapPin = MapPin

  socialLinks = [
    { icon: Facebook, url: "#facebook" },
    { icon: Twitter, url: "#twitter" },
    { icon: Instagram, url: "#instagram" },
    { icon: Linkedin, url: "#linkedin" },
  ]

  quickLinks = [
    { label: "About Us", url: "#about" },
    { label: "Shop", url: "#shop" },
    { label: "Categories", url: "#categories" },
    { label: "Blog", url: "#blog" },
    { label: "Contact", url: "#contact" },
  ]

  customerLinks = [
    { label: "My Account", url: "#account" },
    { label: "Order Tracking", url: "#tracking" },
    { label: "Shipping Info", url: "#shipping" },
    { label: "Returns", url: "#returns" },
    { label: "FAQ", url: "#faq" },
  ]
}
